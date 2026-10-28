/**
 * What kind of value a field holds, as the catalog groups them: text, number,
 * date, datetime, time, boolean, choice, a single or a multiple relation, a
 * reference, or content only ever empty or not.
 *
 * @param {import('vue-fastedgy').MetadataField|null|undefined} field
 * @returns {string|null}
 */
export function kindOf(field: import("vue-fastedgy").MetadataField | null | undefined): string | null;
/**
 * @typedef {Object} OperatorOption
 * @property {string} id - What the menu selects: the operator, `on` for a datetime on a day, `in the last` or
 *     `more than` for a number of days before today
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
export function operatorOptions(metadatas: Record<string, any> | null, field: import("vue-fastedgy").MetadataField | null | undefined): Array<OperatorOption>;
/**
 * The option a rule stands for: its operator, except a datetime range covering
 * one local day, which reads as « on ».
 *
 * @param {Array<OperatorOption>} options
 * @param {{ operator: string, value?: any, ui?: string }} rule
 * @returns {OperatorOption|null}
 */
export function optionOfRule(options: Array<OperatorOption>, rule: {
    operator: string;
    value?: any;
    ui?: string;
}): OperatorOption | null;
/**
 * Whether an option counts days back from today rather than naming a day.
 *
 * @param {OperatorOption|null|undefined} option
 * @returns {boolean}
 */
export function isRelative(option: OperatorOption | null | undefined): boolean;
/**
 * The days a relative value counts back, `` `today(-30)` `` reading 30.
 *
 * @param {any} value
 * @returns {number|null}
 */
export function relativeDays(value: any): number | null;
/**
 * The expression of a number of days back from today, evaluated by the server
 * each time the filter is read.
 *
 * @param {number|null|undefined} days
 * @returns {string|undefined}
 */
export function relativeValue(days: number | null | undefined): string | undefined;
/**
 * What the menu remembers of an option on the rule, when its operator alone
 * would read as another one.
 *
 * @param {OperatorOption} option
 * @returns {string|undefined}
 */
export function uiOf(option: OperatorOption): string | undefined;
/**
 * A datetime option written from the days a person picked.
 *
 * @param {OperatorOption} option
 * @param {Array<string|null>} days
 * @returns {any}
 */
export function datetimeValue(option: OperatorOption, days: Array<string | null>): any;
/**
 * The days a datetime rule stands for, to show them back.
 *
 * @param {OperatorOption} option
 * @param {any} value
 * @returns {Array<string|null>}
 */
export function datetimeDays(option: OperatorOption, value: any): Array<string | null>;
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
export function convertValue(kind: string | null, from: OperatorOption, to: OperatorOption, value: any): any;
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
export function keepOnFieldChange(metadatas: Record<string, any> | null, before: import("vue-fastedgy").MetadataField | null, after: import("vue-fastedgy").MetadataField, rule: {
    operator: string;
    value?: any;
    ui?: string;
}): {
    operator: string;
    value: any;
    ui?: string;
};
export type OperatorOption = {
    /**
     * - What the menu selects: the operator, `on` for a datetime on a day, `in the last` or
     * `more than` for a number of days before today
     */
    id: string;
    /**
     * - What the expression carries
     */
    operator: string;
    /**
     * - The English text, translated where it is shown
     */
    label: string;
};
//# sourceMappingURL=catalog.d.ts.map