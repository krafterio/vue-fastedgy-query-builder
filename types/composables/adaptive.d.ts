/**
 * Whether a media query matches, kept current.
 *
 * @param {import('vue').MaybeRefOrGetter<string>} query
 * @returns {import('vue').Ref<boolean>}
 */
export function useMedia(query: import("vue").MaybeRefOrGetter<string>): import("vue").Ref<boolean>;
/**
 * Whether the room is narrow enough for the panel to fill the screen.
 *
 * @param {import('vue').MaybeRefOrGetter<number>} below - Width in pixels
 * @returns {import('vue').Ref<boolean>}
 */
export function useCompact(below: import("vue").MaybeRefOrGetter<number>): import("vue").Ref<boolean>;
//# sourceMappingURL=adaptive.d.ts.map