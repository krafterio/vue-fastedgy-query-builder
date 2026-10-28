import { markRaw } from 'vue';

import { defaultFilterInputs } from '../inputs.js';

/**
 * @typedef {Object} FilterInputMatch
 * @property {Array<string>} [types] - Metadata types (`date`, `many2one`)
 * @property {Array<string>} [kinds] - Kinds of the catalog (`number`, `single`)
 * @property {Array<string>} [operators] - Operators (`between`, `in`)
 * @property {Array<string>} [options] - Options of the operator menu (`on`, `in the last`)
 * @property {string} [arity] - `one`, `two`, `list`
 */

const inputs = [];

let defaults = null;

// Read on first use: the inputs import the value sources, which import this
// module, so the components are not defined yet while it loads.
const packageInputs = () =>
    (defaults ??= defaultFilterInputs.map(([match, component]) => ({
        match,
        component: markRaw(/** @type {object} */ (component)),
    })));

/**
 * Register the input of a value, for the rules it matches.
 *
 * For a rule, the entry kept is the one matching the most of what it declares;
 * on a tie, the last registered. The package's own inputs come first, so an
 * application's complete or replace any of them without touching the package.
 *
 * @param {FilterInputMatch} match
 * @param {unknown} component
 */
export function registerFilterInput(match, component) {
    inputs.push({ match, component: markRaw(/** @type {object} */ (component)) });
}

const criteria = ['types', 'kinds', 'operators', 'options'];

const RULE_KEYS = { types: 'type', kinds: 'kind', operators: 'operator', options: 'option' };

function score(match, rule) {
    let count = 0;

    for (const key of criteria) {
        if (match[key] === undefined) {
            continue;
        }

        const value = rule[RULE_KEYS[key]];

        if (!match[key].includes(value)) {
            return -1;
        }

        count += 1;
    }

    if (match.arity !== undefined) {
        if (match.arity !== rule.arity) {
            return -1;
        }

        count += 1;
    }

    return count;
}

/**
 * The input of a rule, from the registry and from what a list adds for itself.
 *
 * @param {{ type?: string, kind?: string|null, operator: string, option?: string, arity: string }} rule
 * @param {Array<[FilterInputMatch, unknown]>} [local] - Entries of one list, winning over the registry
 * @returns {unknown}
 */
export function resolveFilterInput(rule, local = []) {
    const entries = [...packageInputs(), ...inputs, ...local.map(([match, component]) => ({ match, component }))];
    let best = null;
    let bestScore = -1;

    for (const entry of entries) {
        const value = score(entry.match, rule);

        if (value >= 0 && value >= bestScore) {
            best = entry;
            bestScore = value;
        }
    }

    return best?.component ?? null;
}

const sources = new Map();

/**
 * @typedef {Object} ValueSource
 * @property {{ list: Function, get?: Function }} reader - What lists the records, an api model or alike
 * @property {Array<string>} [fields] - What a record is read with
 * @property {(item: any) => string} [label]
 * @property {(item: any) => string|null} [subtitle]
 * @property {(item: any) => string|null} [image]
 * @property {(text: string) => any} [searchFilter]
 */

/**
 * Say where the records of a model are listed and read again, when it is not
 * its own API, or not the way the default reads it.
 *
 * @param {string} target - The metadata name of the model
 * @param {ValueSource|((context: { prefix: string }) => ValueSource)} source
 */
export function registerValueSource(target, source) {
    sources.set(target, source);
}

/**
 * @param {string} target
 * @param {Record<string, any>} [local] - The sources of one list
 * @returns {ValueSource|((context: { prefix: string }) => ValueSource)|null}
 */
export function registeredValueSource(target, local = {}) {
    return local[target] ?? sources.get(target) ?? null;
}

const aliases = new Map();

/**
 * Offer a pseudo field on a model: an alias the field picker lists with the
 * fields, written as the expression it stands for, and read back as itself.
 * An alias of the same name on the model replaces it.
 *
 * @param {string} model - The metadata name of the model
 * @param {import('../aliases.js').FilterAlias} alias
 *
 * @example
 * registerFilterAlias('contact', {
 *     name: 'opened',
 *     label: 'Opened an email',
 *     options: [
 *         {
 *             id: 'in the last',
 *             label: 'in the last',
 *             expression: ['emails', 'any', [['opened_at', '>=', QUERY_VALUE]]],
 *             value: { type: 'datetime', operator: '>=', option: 'in the last' },
 *         },
 *         { id: 'never', label: 'never', expression: ['emails', 'not any', [['opened_at', 'is not empty']]] },
 *     ],
 * });
 */
export function registerFilterAlias(model, alias) {
    aliases.set(model, [...filterAliasesOf(model).filter((one) => one.name !== alias.name), markRaw(alias)]);
}

/**
 * @param {string} model
 * @returns {Array<import('../aliases.js').FilterAlias>}
 */
export function filterAliasesOf(model) {
    return aliases.get(model) ?? [];
}
