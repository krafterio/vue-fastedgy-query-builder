import { onScopeDispose, ref, toValue, watchEffect } from 'vue';

/**
 * Whether a media query matches, kept current.
 *
 * @param {import('vue').MaybeRefOrGetter<string>} query
 * @returns {import('vue').Ref<boolean>}
 */
export function useMedia(query) {
    const matches = ref(false);
    let list = null;
    const update = () => (matches.value = Boolean(list?.matches));

    const stop = watchEffect((onCleanup) => {
        if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
            return;
        }

        list = window.matchMedia(toValue(query));
        update();
        list.addEventListener?.('change', update);
        onCleanup(() => list?.removeEventListener?.('change', update));
    });

    onScopeDispose(stop);

    return matches;
}

/**
 * Whether the room is narrow enough for the panel to fill the screen.
 *
 * @param {import('vue').MaybeRefOrGetter<number>} below - Width in pixels
 * @returns {import('vue').Ref<boolean>}
 */
export function useCompact(below) {
    return useMedia(() => `(max-width: ${toValue(below) - 0.02}px)`);
}
