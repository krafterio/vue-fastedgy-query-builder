/**
 * The value of an input typed in, handed over once the typing pauses: after
 * `delay` without a key, or at once on Enter and when the input loses focus.
 * The list then reads once per thought rather than once per letter.
 *
 * @param {() => any} source - The value given to the input
 * @param {(value: any) => void} emit - Where the value goes
 * @param {{ delay?: number }} [options]
 */
export function useDeferredValue(source: () => any, emit: (value: any) => void, { delay }?: {
    delay?: number;
}): {
    local: import("vue").Ref<any, any>;
    input: (value: any) => void;
    flush: () => void;
};
//# sourceMappingURL=deferred.d.ts.map