/**
 * An expression in the one form the conditions write it: a group of one is
 * that one, a list is a group of all of them, a sub-filter too. The values,
 * `QUERY_VALUE` included, are left as they are.
 *
 * @param {any} item
 * @returns {any}
 */
export function canonicalExpression(item: any): any;
/**
 * The template with the value in its place.
 *
 * @param {any} template
 * @param {any} value
 * @returns {any}
 */
export function fillAlias(template: any, value: any): any;
/**
 * The value an expression gives the place of `QUERY_VALUE`, or null when it
 * is not the template.
 *
 * @param {any} template
 * @param {any} item
 * @returns {{ value: any }|null}
 */
export function matchAlias(template: any, item: any): {
    value: any;
} | null;
/**
 * The expression an option writes with a value, or null while the value it
 * asks for is missing.
 *
 * @param {AliasOption} option
 * @param {any} value
 * @returns {any}
 */
export function aliasExpression(option: AliasOption, value: any): any;
/**
 * The alias, option and value an expression stands for, among the aliases of
 * its model.
 *
 * @param {Array<FilterAlias>} aliases
 * @param {any} item
 * @returns {{ name: string, option: string, value: any }|null}
 */
export function aliasOf(aliases: Array<FilterAlias>, item: any): {
    name: string;
    option: string;
    value: any;
} | null;
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
export function aliasNode(alias: FilterAlias, optionId?: string, value?: any, id?: number): {
    id: number;
    kind: "opaque";
    raw: any;
    alias: {
        name: string;
        option: string;
        value: any;
    };
};
/**
 * Turn the rows of a tree that match an alias into the alias: a rule, a block,
 * a group, the whole tree too. Not inside the block of a relation, whose
 * fields belong to another model.
 *
 * @param {import('vue-fastedgy').QueryGroup} group
 * @param {Array<FilterAlias>} aliases
 */
export function readAliases(group: import("vue-fastedgy").QueryGroup, aliases: Array<FilterAlias>): void;
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
export const QUERY_VALUE: Readonly<{
    queryValue: true;
}>;
export function sayAlias(text: string | (() => string)): string;
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
 */
export type AliasOption = {
    /**
     * - What the menu selects, unique in the alias
     */
    id: string;
    /**
     * - Said in the menu
     */
    label: string | (() => string);
    /**
     * - The template, `QUERY_VALUE` where the value goes
     */
    expression: any;
    /**
     * How the value is typed, as a rule on a field of this type with this operator; none without a value
     */
    value?: {
        type: string;
        operator?: string;
        option?: string;
        target?: string;
        choices?: Record<string, string>;
    } | undefined;
};
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
 */
export type FilterAlias = {
    /**
     * - Unique on its model
     */
    name: string;
    /**
     * - Said in the field picker
     */
    label: string | (() => string);
    options: Array<AliasOption>;
};
//# sourceMappingURL=aliases.d.ts.map