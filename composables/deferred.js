import { onScopeDispose, ref, watch } from 'vue';

/**
 * The value of an input typed in, handed over once the typing pauses: after
 * `delay` without a key, or at once on Enter and when the input loses focus.
 * The list then reads once per thought rather than once per letter.
 *
 * @param {() => any} source - The value given to the input
 * @param {(value: any) => void} emit - Where the value goes
 * @param {{ delay?: number }} [options]
 */
export function useDeferredValue(source, emit, { delay = 300 } = {}) {
    const local = ref(source());
    let timer = null;
    let sent = local.value;

    const flush = () => {
        clearTimeout(timer);
        timer = null;

        if (local.value !== sent) {
            sent = local.value;
            emit(local.value);
        }
    };

    watch(source, (next) => {
        if (timer === null && next !== local.value) {
            local.value = next;
            sent = next;
        }
    });

    const input = (value) => {
        local.value = value;
        clearTimeout(timer);
        timer = setTimeout(flush, delay);
    };

    onScopeDispose(() => clearTimeout(timer));

    return { local, input, flush };
}
