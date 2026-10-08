import { inject, provide } from 'vue';

import { useQueryFilterOptions } from './options.js';

/** The names a query filter draws a glyph for. */
export const queryFilterIconNames = Object.freeze([
    'filter',
    'add',
    'remove',
    'back',
    'forward',
    'favorite',
    'private',
    'more',
    'check',
    'search',
    'close',
]);

const ICONS = Symbol('fe-query-filter-icons');

/**
 * Lends glyphs, by name: a partial table, what is not named has no glyph and
 * what would have drawn it says its label instead. It adds to what is already
 * lent, the nearer one winning a name both use.
 *
 * @param {Record<string, unknown>} [icons]
 */
export function provideQueryFilterIcons(icons = {}) {
    const options = useQueryFilterOptions();

    provide(ICONS, { ...options.icons, ...inject(ICONS, {}), ...icons });
}

/**
 * @returns {{ icon: (name: string) => unknown }} The glyph of a name, or `null`.
 */
export function useQueryFilterIcons() {
    const options = useQueryFilterOptions();
    const icons = inject(ICONS, null) ?? options.icons ?? {};

    return { icon: (name) => icons[name] ?? null };
}
