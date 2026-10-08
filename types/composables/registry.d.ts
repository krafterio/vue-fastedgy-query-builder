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
export function registerFilterInput(match: FilterInputMatch, component: unknown): void;
/**
 * The input of a rule, from the registry and from what a list adds for itself.
 *
 * @param {{ type?: string, kind?: string|null, operator: string, arity: string }} rule
 * @param {Array<[FilterInputMatch, unknown]>} [local] - Entries of one list, winning over the registry
 * @returns {unknown}
 */
export function resolveFilterInput(rule: {
    type?: string;
    kind?: string | null;
    operator: string;
    arity: string;
}, local?: Array<[FilterInputMatch, unknown]>): unknown;
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
export function registerValueSource(target: string, source: ValueSource | ((context: {
    prefix: string;
}) => ValueSource)): void;
/**
 * @param {string} target
 * @param {Record<string, any>} [local] - The sources of one list
 * @returns {ValueSource|((context: { prefix: string }) => ValueSource)|null}
 */
export function registeredValueSource(target: string, local?: Record<string, any>): ValueSource | ((context: {
    prefix: string;
}) => ValueSource) | null;
export type ValueSource = {
    /**
     * - What lists the records, an api model or alike
     */
    reader: {
        list: Function;
        get?: Function;
    };
    /**
     * - What a record is read with
     */
    fields?: string[] | undefined;
    label?: ((item: any) => string) | undefined;
    subtitle?: ((item: any) => string | null) | undefined;
    image?: ((item: any) => string | null) | undefined;
    searchFilter?: ((text: string) => any) | undefined;
};
export type FilterInputMatch = {
    /**
     * - Metadata types (`date`, `many2one`)
     */
    types?: string[] | undefined;
    /**
     * - Kinds of the catalog (`number`, `single`)
     */
    kinds?: string[] | undefined;
    /**
     * - Operators (`between`, `in`)
     */
    operators?: string[] | undefined;
    /**
     * - `one`, `two`, `list`
     */
    arity?: string | undefined;
};
//# sourceMappingURL=registry.d.ts.map