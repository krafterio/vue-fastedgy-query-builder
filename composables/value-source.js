import { useApiModel } from 'vue-fastedgy';

import { registeredValueSource } from './registry.js';

const LABEL_FIELDS = ['display_name', 'name', 'title', 'label', 'code', 'email'];
const IMAGE_FIELDS = ['avatar', 'image', 'logo', 'cover'];
const TEXT_TYPES = ['char', 'text', 'email'];

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
export function defaultValueSource(target, { prefix = '', metadatas = null } = {}) {
    const fields = metadatas?.[target]?.fields ?? {};
    const labelField = LABEL_FIELDS.find((name) => name in fields) ?? null;
    const subtitleField = labelField !== 'email' && 'email' in fields ? 'email' : null;
    const imageField = IMAGE_FIELDS.find((name) => name in fields) ?? null;
    const texts = Object.values(fields)
        .filter((field) => TEXT_TYPES.includes(field.type) && field.filter_operators?.includes('icontains'))
        .map((field) => field.name);
    const fulltext = Object.values(fields).find((field) => field.type === 'fulltext');

    return {
        reader: useApiModel(target, { prefix }),
        fields: [labelField, subtitleField, imageField].filter(Boolean),
        label: (item) => (labelField && item?.[labelField]) || `#${item?.id}`,
        subtitle: subtitleField ? (item) => item?.[subtitleField] ?? null : null,
        image: imageField ? (item) => item?.[imageField] ?? null : null,
        searchFilter: (text) => {
            if (fulltext) {
                return [fulltext.name, 'search_fuzzy', text];
            }

            const rules = texts.map((name) => [name, 'icontains', text]);

            return rules.length > 1 ? ['|', rules] : (rules[0] ?? ['id', '=', Number(text) || 0]);
        },
    };
}

/**
 * The source of the values of a relation: the list's, the application's,
 * else the default one.
 *
 * @param {string} target
 * @param {{ prefix?: string, metadatas?: Record<string, any>|null, valueSources?: Record<string, any> }} context
 * @returns {import('./registry.js').ValueSource}
 */
export function resolveValueSource(target, context) {
    const declared = registeredValueSource(target, context.valueSources ?? {});
    const source = typeof declared === 'function' ? declared(context) : declared;
    const fallback = defaultValueSource(target, context);

    return source ? { ...fallback, ...source } : fallback;
}
