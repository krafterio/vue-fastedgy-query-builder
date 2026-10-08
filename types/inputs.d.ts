/**
 * The package's own inputs, read by the registry before any an application
 * registers, which replace them for the rules they match.
 */
export const defaultFilterInputs: ((import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    modelValue: {
        type: null;
        default: undefined;
    };
    field: {
        type: ObjectConstructor;
        required: boolean;
    };
    kind: {
        type: StringConstructor;
        default: null;
    };
    operator: {
        type: StringConstructor;
        required: boolean;
    };
    arity: {
        type: StringConstructor;
        required: boolean;
    };
    option: {
        type: ObjectConstructor;
        default: null;
    };
    context: {
        type: ObjectConstructor;
        default: () => {};
    };
}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    "update:modelValue": (...args: any[]) => void;
}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    modelValue: {
        type: null;
        default: undefined;
    };
    field: {
        type: ObjectConstructor;
        required: boolean;
    };
    kind: {
        type: StringConstructor;
        default: null;
    };
    operator: {
        type: StringConstructor;
        required: boolean;
    };
    arity: {
        type: StringConstructor;
        required: boolean;
    };
    option: {
        type: ObjectConstructor;
        default: null;
    };
    context: {
        type: ObjectConstructor;
        default: () => {};
    };
}>> & Readonly<{
    "onUpdate:modelValue"?: ((...args: any[]) => any) | undefined;
}>, {
    kind: string;
    modelValue: any;
    option: Record<string, any>;
    context: Record<string, any>;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any> | {
    kinds: string[];
})[] | (import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    modelValue: {
        type: null;
        default: undefined;
    };
    field: {
        type: ObjectConstructor;
        required: boolean;
    };
    kind: {
        type: StringConstructor;
        default: null;
    };
    operator: {
        type: StringConstructor;
        required: boolean;
    };
    arity: {
        type: StringConstructor;
        required: boolean;
    };
    option: {
        type: ObjectConstructor;
        default: null;
    };
    context: {
        type: ObjectConstructor;
        default: () => {};
    };
}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    "update:modelValue": (...args: any[]) => void;
}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    modelValue: {
        type: null;
        default: undefined;
    };
    field: {
        type: ObjectConstructor;
        required: boolean;
    };
    kind: {
        type: StringConstructor;
        default: null;
    };
    operator: {
        type: StringConstructor;
        required: boolean;
    };
    arity: {
        type: StringConstructor;
        required: boolean;
    };
    option: {
        type: ObjectConstructor;
        default: null;
    };
    context: {
        type: ObjectConstructor;
        default: () => {};
    };
}>> & Readonly<{
    "onUpdate:modelValue"?: ((...args: any[]) => any) | undefined;
}>, {
    kind: string;
    modelValue: any;
    option: Record<string, any>;
    context: Record<string, any>;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any> | {
    kinds: string[];
    arity: string;
})[] | (import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    modelValue: {
        type: null;
        default: undefined;
    };
    field: {
        type: ObjectConstructor;
        required: boolean;
    };
    kind: {
        type: StringConstructor;
        default: null;
    };
    operator: {
        type: StringConstructor;
        required: boolean;
    };
    arity: {
        type: StringConstructor;
        required: boolean;
    };
    option: {
        type: ObjectConstructor;
        default: null;
    };
    context: {
        type: ObjectConstructor;
        default: () => {};
    };
}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    "update:modelValue": (...args: any[]) => void;
}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    modelValue: {
        type: null;
        default: undefined;
    };
    field: {
        type: ObjectConstructor;
        required: boolean;
    };
    kind: {
        type: StringConstructor;
        default: null;
    };
    operator: {
        type: StringConstructor;
        required: boolean;
    };
    arity: {
        type: StringConstructor;
        required: boolean;
    };
    option: {
        type: ObjectConstructor;
        default: null;
    };
    context: {
        type: ObjectConstructor;
        default: () => {};
    };
}>> & Readonly<{
    "onUpdate:modelValue"?: ((...args: any[]) => any) | undefined;
}>, {
    kind: string;
    modelValue: any;
    option: Record<string, any>;
    context: Record<string, any>;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any> | {
    kinds: string[];
    operators: string[];
})[])[];
import ChoiceInput from './components/inputs/ChoiceInput.vue';
import DateInput from './components/inputs/DateInput.vue';
import DateTimeInput from './components/inputs/DateTimeInput.vue';
import ListInput from './components/inputs/ListInput.vue';
import NumberInput from './components/inputs/NumberInput.vue';
import RangeInput from './components/inputs/RangeInput.vue';
import ReferenceInput from './components/inputs/ReferenceInput.vue';
import RelationInput from './components/inputs/RelationInput.vue';
import TextInput from './components/inputs/TextInput.vue';
import TimeInput from './components/inputs/TimeInput.vue';
export { ChoiceInput, DateInput, DateTimeInput, ListInput, NumberInput, RangeInput, ReferenceInput, RelationInput, TextInput, TimeInput };
//# sourceMappingURL=inputs.d.ts.map