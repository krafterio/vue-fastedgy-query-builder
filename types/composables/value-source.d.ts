/**
 * How the records of a model are offered when nobody said otherwise: listed
 * by the API of the model under the prefix of the list, searched on its
 * fulltext field or on its text fields, shown by the first of the fields that
 * name a record.
 *
 * @param {string} target
 * @param {{ prefix?: string, metadatas?: Record<string, any>|null }} context
 * @returns {import('./registry.js').ValueSource}
 */
export function defaultValueSource(target: string, { prefix, metadatas }?: {
    prefix?: string;
    metadatas?: Record<string, any> | null;
}): import("./registry.js").ValueSource;
/**
 * The source of the values of a relation: the list's, the application's,
 * else the default one.
 *
 * @param {string} target
 * @param {{ prefix?: string, metadatas?: Record<string, any>|null, valueSources?: Record<string, any> }} context
 * @returns {import('./registry.js').ValueSource}
 */
export function resolveValueSource(target: string, context: {
    prefix?: string;
    metadatas?: Record<string, any> | null;
    valueSources?: Record<string, any>;
}): import("./registry.js").ValueSource;
//# sourceMappingURL=value-source.d.ts.map