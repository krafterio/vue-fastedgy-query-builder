declare const _default: typeof __VLS_export;
export default _default;
export type __VLS_EmitProps = __VLS_EmitsToProps<__VLS_NormalizeEmits<typeof emit>>;
export type __VLS_LocalComponents = import("vue").ShallowUnwrapRef<{
    TagsInputItemText: typeof TagsInputItemText;
    TagsInputItemDelete: typeof TagsInputItemDelete;
    TagsInputItem: typeof TagsInputItem;
    TagsInputInput: typeof TagsInputInput;
    TagsInputRoot: typeof TagsInputRoot;
}>;
export type __VLS_GlobalComponents = import("vue").GlobalComponents;
export type __VLS_LocalDirectives = {};
declare const __VLS_export: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
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
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
declare const emit: (event: "update:modelValue", ...args: any[]) => void;
import { TagsInputItemText } from 'reka-ui';
import { TagsInputItemDelete } from 'reka-ui';
import { TagsInputItem } from 'reka-ui';
import { TagsInputInput } from 'reka-ui';
import { TagsInputRoot } from 'reka-ui';
//# sourceMappingURL=ListInput.vue.d.ts.map