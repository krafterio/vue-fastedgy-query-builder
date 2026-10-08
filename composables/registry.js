import { markRaw } from 'vue';

/**
 * @typedef {Object} FilterInputMatch
 * @property {Array<string>} [types] - Metadata types (`date`, `many2one`)
 * @property {Array<string>} [kinds] - Kinds of the catalog (`number`, `single`)
 * @property {Array<string>} [operators] - Operators (`between`, `in`)
 * @property {string} [arity] - `one`, `two`, `list`
 */

const inputs = [];

/**
 * Register the input of a value, for the rules it matches.
 *
 * For a rule, the entry kept is the one matching the most of what it declares;
 * on a tie, the last registered. The package registers its own inputs at import
 * and an application registers its own afterwards: it completes or replaces
 * any of them without touching the package.
 *
 * @param {FilterInputMatch} match
 * @param {unknown} component
 */
export function registerFilterInput(match, component) {
    inputs.push({ match, component: markRaw(/** @type {object} */ (component)), order: inputs.length });
}

const criteria = ['types', 'kinds', 'operators'];

function score(match, rule) {
    let count = 0;

    for (const key of criteria) {
        if (match[key] === undefined) {
            continue;
        }

        const value = key === 'types' ? rule.type : key === 'kinds' ? rule.kind : rule.operator;

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
 * @param {{ type?: string, kind?: string|null, operator: string, arity: string }} rule
 * @param {Array<[FilterInputMatch, unknown]>} [local] - Entries of one list, winning over the registry
 * @returns {unknown}
 */
export function resolveFilterInput(rule, local = []) {
    const entries = [
        ...inputs,
        ...local.map(([match, component], index) => ({ match, component, order: 1e6 + index })),
    ];
    let best = null;
    let bestScore = -1;

    for (const entry of entries) {
        const value = score(entry.match, rule);

        if (value > bestScore || (value === bestScore && value >= 0 && entry.order > best.order)) {
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
