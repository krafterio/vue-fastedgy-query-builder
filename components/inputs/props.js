/** What every input receives, cf. the contract of an input. */
export const inputProps = {
    modelValue: { type: null, default: undefined },
    field: { type: Object, required: true },
    kind: { type: String, default: null },
    operator: { type: String, required: true },
    arity: { type: String, required: true },
    option: { type: Object, default: null },
    context: { type: Object, default: () => ({}) },
};

/** The native type of an input for a kind of value. */
export const nativeTypeOf = (kind) =>
    ({ number: 'number', single: 'number', date: 'date', time: 'time' })[kind] ?? 'text';

/** A number typed in, or nothing when it does not read as one. */
export const readNumber = (value) => {
    if (value === '' || value === null || value === undefined) {
        return undefined;
    }

    const number = Number(value);

    return Number.isFinite(number) ? number : undefined;
};
