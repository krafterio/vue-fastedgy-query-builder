import { arityOf, fieldOperators } from 'vue-fastedgy';

import { coversOneDay, dayEnd, dayOf, dayStart } from './dates.js';

const KINDS = {
    char: 'text',
    text: 'text',
    email: 'text',
    uuid: 'text',
    url: 'text',
    u_r_l: 'text',
    integer: 'number',
    small_integer: 'number',
    big_integer: 'number',
    float: 'number',
    decimal: 'number',
    date: 'date',
    datetime: 'datetime',
    date_time: 'datetime',
    time: 'time',
    boolean: 'boolean',
    choice: 'choice',
    char_choice: 'choice',
    many2one: 'single',
    one2one: 'single',
    one_to_one: 'single',
    one2many: 'multiple',
    many2many: 'multiple',
    reference: 'reference',
    many2one_ref: 'reference',
    json: 'content',
    binary: 'content',
};

/**
 * What kind of value a field holds, as the catalog groups them: text, number,
 * date, datetime, time, boolean, choice, a single or a multiple relation, a
 * reference, or content only ever empty or not.
 *
 * @param {import('vue-fastedgy').MetadataField|null|undefined} field
 * @returns {string|null}
 */
export function kindOf(field) {
    if (!field) {
        return null;
    }

    const kind = KINDS[field.type];

    if (field.choices && Object.keys(field.choices).length > 0 && kind !== 'single' && kind !== 'multiple') {
        return 'choice';
    }

    if (kind) {
        return kind;
    }

    return field.filter_operators?.includes('icontains') ? 'text' : 'content';
}

const EMPTY = [
    ['is empty', 'is empty', 'is empty'],
    ['is not empty', 'is not empty', 'is not empty'],
];

/**
 * The operators offered by kind, in the order offered: what the menu shows,
 * the operator written, and the label. Crossed with what the server accepts on
 * the field, which stays the authority.
 */
const OFFERS = {
    text: [
        ['icontains', 'icontains', 'contains'],
        ['not icontains', 'not icontains', 'does not contain'],
        ['=', '=', 'is'],
        ['!=', '!=', 'is not'],
        ['starts with', 'starts with', 'starts with'],
        ['ends with', 'ends with', 'ends with'],
        ['in', 'in', 'is one of'],
        ['not in', 'not in', 'is none of'],
        ...EMPTY,
    ],
    number: [
        ['=', '=', 'is'],
        ['!=', '!=', 'is not'],
        ['<', '<', 'less than'],
        ['<=', '<=', 'at most'],
        ['>', '>', 'greater than'],
        ['>=', '>=', 'at least'],
        ['between', 'between', 'between'],
        ['in', 'in', 'is one of'],
        ['not in', 'not in', 'is none of'],
        ...EMPTY,
    ],
    date: [
        ['=', '=', 'on'],
        ['!=', '!=', 'not on'],
        ['<', '<', 'before'],
        ['<=', '<=', 'until'],
        ['>', '>', 'after'],
        ['>=', '>=', 'from'],
        ['between', 'between', 'between'],
        ...EMPTY,
    ],
    datetime: [
        ['on', 'between', 'on'],
        ['<', '<', 'before'],
        ['<=', '<=', 'until'],
        ['>', '>', 'after'],
        ['>=', '>=', 'from'],
        ['between', 'between', 'between'],
        ...EMPTY,
    ],
    time: [
        ['=', '=', 'is'],
        ['<', '<', 'earlier than'],
        ['<=', '<=', 'at the latest'],
        ['>', '>', 'later than'],
        ['>=', '>=', 'at the earliest'],
        ['between', 'between', 'between'],
        ...EMPTY,
    ],
    boolean: [
        ['is true', 'is true', 'is true'],
        ['is false', 'is false', 'is false'],
    ],
    choice: [
        ['=', '=', 'is'],
        ['!=', '!=', 'is not'],
        ['in', 'in', 'is one of'],
        ['not in', 'not in', 'is none of'],
        ...EMPTY,
    ],
    single: [
        ['=', '=', 'is'],
        ['!=', '!=', 'is not'],
        ['in', 'in', 'is one of'],
        ['not in', 'not in', 'is none of'],
        ...EMPTY,
        ['any', 'any', 'matches…'],
        ['not any', 'not any', 'does not match…'],
        ['<', '<', 'id less than'],
        ['<=', '<=', 'id at most'],
        ['>', '>', 'id greater than'],
        ['>=', '>=', 'id at least'],
        ['between', 'between', 'id between'],
    ],
    multiple: [
        ['in', 'in', 'contains one of'],
        ['not in', 'not in', 'contains none of'],
        ...EMPTY,
        ['any', 'any', 'has at least one that…'],
        ['not any', 'not any', 'has none that…'],
    ],
    reference: [
        ['=', '=', 'is'],
        ['!=', '!=', 'is not'],
        ['in', 'in', 'is one of'],
        ['not in', 'not in', 'is none of'],
        ...EMPTY,
    ],
    content: EMPTY,
};

/**
 * @typedef {Object} OperatorOption
 * @property {string} id - What the menu selects: the operator, or `on` for a datetime on a day
 * @property {string} operator - What the expression carries
 * @property {string} label - The English text, translated where it is shown
 */

/**
 * The operators a field offers, in the catalog's order.
 *
 * @param {Record<string, any>|null} metadatas
 * @param {import('vue-fastedgy').MetadataField|null|undefined} field
 * @returns {Array<OperatorOption>}
 */
export function operatorOptions(metadatas, field) {
    const accepted = fieldOperators(metadatas, field);

    return (OFFERS[kindOf(field)] ?? [])
        .filter(([, operator]) => accepted.includes(operator))
        .map(([id, operator, label]) => ({ id, operator, label }));
}

/**
 * The option a rule stands for: its operator, except a datetime range covering
 * one local day, which reads as « on ».
 *
 * @param {Array<OperatorOption>} options
 * @param {{ operator: string, value?: any, ui?: string }} rule
 * @returns {OperatorOption|null}
 */
export function optionOfRule(options, rule) {
    const on = options.find((option) => option.id === 'on');

    if (
        on &&
        rule.operator === 'between' &&
        (rule.ui === 'on' || (rule.ui === undefined && coversOneDay(rule.value)))
    ) {
        return on;
    }

    return options.find((option) => option.id !== 'on' && option.operator === rule.operator) ?? null;
}

const isBlank = (value) => value === undefined || value === null || value === '';

function daysOf(option, value) {
    if (option.operator === 'between') {
        return Array.isArray(value) ? value.map(dayOf) : [];
    }

    return [dayOf(value)];
}

function encodeDays(option, days) {
    const [first, last = first] = days;

    if (!first) {
        return option.operator === 'between' ? [] : undefined;
    }

    switch (option.id) {
        case 'on':
            return [dayStart(first), dayEnd(first)];
        case 'between':
            return [dayStart(first), dayEnd(last)];
        case '<':
        case '>=':
            return dayStart(first);
        default:
            return dayEnd(first);
    }
}

/**
 * A datetime option written from the days a person picked.
 *
 * @param {OperatorOption} option
 * @param {Array<string|null>} days
 * @returns {any}
 */
export function datetimeValue(option, days) {
    return encodeDays(option, days);
}

/**
 * The days a datetime rule stands for, to show them back.
 *
 * @param {OperatorOption} option
 * @param {any} value
 * @returns {Array<string|null>}
 */
export function datetimeDays(option, value) {
    return daysOf(option, value);
}

/**
 * What a value becomes when the operator changes: kept for the same arity, one
 * value turned into a list of one and back, re-encoded for a datetime, emptied
 * otherwise. Retyping the value after hesitating between two operators is what
 * this spares.
 *
 * @param {string|null} kind
 * @param {OperatorOption} from
 * @param {OperatorOption} to
 * @param {any} value
 * @returns {any}
 */
export function convertValue(kind, from, to, value) {
    if (kind === 'datetime') {
        return encodeDays(to, daysOf(from, value));
    }

    const before = arityOf(from.operator);
    const after = arityOf(to.operator);

    if (before === after) {
        return value;
    }

    if (before === 'one' && after === 'list') {
        return isBlank(value) ? [] : [value];
    }

    if (before === 'list' && after === 'one') {
        return Array.isArray(value) ? value[0] : value;
    }

    return undefined;
}

/**
 * What a rule keeps when its field changes: its operator if the new field offers
 * it, its value too if the kind is the same; the first operator otherwise.
 *
 * @param {Record<string, any>|null} metadatas
 * @param {import('vue-fastedgy').MetadataField|null} before
 * @param {import('vue-fastedgy').MetadataField} after
 * @param {{ operator: string, value?: any, ui?: string }} rule
 * @returns {{ operator: string, value: any, ui?: string }}
 */
export function keepOnFieldChange(metadatas, before, after, rule) {
    const options = operatorOptions(metadatas, after);
    const kept = rule.operator ? optionOfRule(options, rule) : null;
    const option = kept ?? options[0] ?? null;

    if (!option) {
        return { operator: '', value: undefined, ui: undefined };
    }

    const sameKind = kept !== null && kindOf(before) === kindOf(after);

    return {
        operator: option.operator,
        value: sameKind ? rule.value : undefined,
        ui: option.id === 'on' ? 'on' : undefined,
    };
}
