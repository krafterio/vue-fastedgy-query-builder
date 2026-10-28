import { arityOf, createRule, serializeExpression } from 'vue-fastedgy';

import { say } from './labels.js';

/**
 * Pseudo fields: a condition a person reads as one field, « Opened an email
 * in the last 30 days », and the server as the expression it stands for, a
 * block on the emails received and another on their events.
 *
 * An alias is declared on a model with its options, each one a template of
 * the expression where `QUERY_VALUE` stands for the value typed, and the way
 * the value is typed: the input a rule on such a field gets. The expression
 * written is always the real one; a tree read again finds the template it
 * matches and shows the alias, with the value back in its input.
 *
 * @typedef {Object} AliasOption
 * @property {string} id - What the menu selects, unique in the alias
 * @property {string|(() => string)} label - Said in the menu
 * @property {any} expression - The template, `QUERY_VALUE` where the value goes
 * @property {{ type: string, operator?: string, option?: string, target?: string, choices?: Record<string, string> }} [value]
 *     How the value is typed, as a rule on a field of this type with this operator; none without a value
 *
 * @typedef {Object} FilterAlias
 * @property {string} name - Unique on its model
 * @property {string|(() => string)} label - Said in the field picker
 * @property {Array<AliasOption>} options
 */

export const QUERY_VALUE = Object.freeze({ queryValue: true });

/**
 * A label of an alias in the language shown: a text, translated as the
 * package's own, or a function the application translates with.
 *
 * @param {string|(() => string)} text
 * @returns {string}
 */
export const sayAlias = (text) => say(typeof text === 'function' ? text() : text);

const JOINTS = ['&', '|'];

const isRule = (item) =>
    Array.isArray(item) &&
    (item.length === 2 || item.length === 3) &&
    typeof item[0] === 'string' &&
    !JOINTS.includes(item[0]);

const isBlank = (value) =>
    value === undefined || value === null || value === '' || (Array.isArray(value) && value.length === 0);

/**
 * An expression in the one form the conditions write it: a group of one is
 * that one, a list is a group of all of them, a sub-filter too. The values,
 * `QUERY_VALUE` included, are left as they are.
 *
 * @param {any} item
 * @returns {any}
 */
export function canonicalExpression(item) {
    if (!Array.isArray(item) || item.length === 0) {
        return null;
    }

    if (isRule(item)) {
        return arityOf(item[1]) === 'sub' ? [item[0], item[1], canonicalExpression(item[2])] : item;
    }

    const [joint, items] = JOINTS.includes(item[0])
        ? [
              item[0],
              item.length === 2 && Array.isArray(item[1]) && item[1].every(Array.isArray) ? item[1] : item.slice(1),
          ]
        : ['&', item];
    const written = items.map(canonicalExpression).filter((one) => one !== null);

    if (written.length === 0) {
        return null;
    }

    return written.length === 1 ? written[0] : [joint, written];
}

/**
 * The template with the value in its place.
 *
 * @param {any} template
 * @param {any} value
 * @returns {any}
 */
export function fillAlias(template, value) {
    if (template === QUERY_VALUE) {
        return value;
    }

    return Array.isArray(template) ? template.map((one) => fillAlias(one, value)) : template;
}

function capture(template, item, found) {
    if (template === QUERY_VALUE) {
        found.value = item;

        return true;
    }

    if (Array.isArray(template)) {
        return (
            Array.isArray(item) &&
            item.length === template.length &&
            template.every((one, index) => capture(one, item[index], found))
        );
    }

    return template === item;
}

/**
 * The value an expression gives the place of `QUERY_VALUE`, or null when it
 * is not the template.
 *
 * @param {any} template
 * @param {any} item
 * @returns {{ value: any }|null}
 */
export function matchAlias(template, item) {
    const found = { value: undefined };

    return capture(canonicalExpression(template), canonicalExpression(item), found) ? found : null;
}

/**
 * The expression an option writes with a value, or null while the value it
 * asks for is missing.
 *
 * @param {AliasOption} option
 * @param {any} value
 * @returns {any}
 */
export function aliasExpression(option, value) {
    if (option.value && isBlank(value)) {
        return null;
    }

    return canonicalExpression(fillAlias(option.expression, value));
}

/**
 * The alias, option and value an expression stands for, among the aliases of
 * its model.
 *
 * @param {Array<FilterAlias>} aliases
 * @param {any} item
 * @returns {{ name: string, option: string, value: any }|null}
 */
export function aliasOf(aliases, item) {
    for (const alias of aliases) {
        for (const option of alias.options) {
            const found = matchAlias(option.expression, item);

            if (found) {
                return { name: alias.name, option: option.id, value: found.value };
            }
        }
    }

    return null;
}

/**
 * A row of the tree drawn as the alias: an opaque node, written as it is,
 * that remembers its alias, option and value.
 *
 * @param {FilterAlias} alias
 * @param {string} [optionId]
 * @param {any} [value]
 * @param {number} [id]
 * @returns {{ id: number, kind: 'opaque', raw: any, alias: { name: string, option: string, value: any } }}
 */
export function aliasNode(alias, optionId = alias.options[0]?.id, value, id = createRule().id) {
    const option = alias.options.find((one) => one.id === optionId) ?? alias.options[0];

    return {
        id,
        kind: 'opaque',
        raw: aliasExpression(option, value),
        alias: { name: alias.name, option: option.id, value },
    };
}

const written = (node) => serializeExpression({ id: 0, kind: 'group', joint: '&', children: [node] });

const aliasRow = (id, raw, found) => ({ id, kind: 'opaque', raw, alias: found });

/**
 * Turn the rows of a tree that match an alias into the alias: a rule, a block,
 * a group, the whole tree too. Not inside the block of a relation, whose
 * fields belong to another model.
 *
 * @param {import('vue-fastedgy').QueryGroup} group
 * @param {Array<FilterAlias>} aliases
 */
export function readAliases(group, aliases) {
    if (!group || aliases.length === 0) {
        return;
    }

    const whole = group.children.length > 1 ? serializeExpression(group) : null;
    const all = whole === null ? null : aliasOf(aliases, whole);

    if (all) {
        group.joint = '&';
        group.children.splice(0, group.children.length, aliasRow(createRule().id, whole, all));

        return;
    }

    group.children.forEach((child, index) => {
        if (!['rule', 'any', 'group'].includes(child.kind)) {
            return;
        }

        const item = written(child);
        const found = item === null ? null : aliasOf(aliases, item);

        if (found) {
            group.children[index] = aliasRow(child.id, item, found);
        } else if (child.kind === 'group') {
            readAliases(child, aliases);
        }
    });
}
