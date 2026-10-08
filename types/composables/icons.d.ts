/**
 * Lends glyphs, by name: a partial table, what is not named has no glyph and
 * what would have drawn it says its label instead. It adds to what is already
 * lent, the nearer one winning a name both use.
 *
 * @param {Record<string, unknown>} [icons]
 */
export function provideQueryFilterIcons(icons?: Record<string, unknown>): void;
/**
 * @returns {{ icon: (name: string) => unknown }} The glyph of a name, or `null`.
 */
export function useQueryFilterIcons(): {
    icon: (name: string) => unknown;
};
/** The names a query filter draws a glyph for. */
export const queryFilterIconNames: readonly string[];
//# sourceMappingURL=icons.d.ts.map