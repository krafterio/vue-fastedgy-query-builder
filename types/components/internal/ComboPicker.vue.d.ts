declare const _default: typeof __VLS_export;
export default _default;
export type __VLS_EmitProps = __VLS_EmitsToProps<__VLS_NormalizeEmits<typeof emit>>;
export type __VLS_LocalComponents = import("vue").ShallowUnwrapRef<{
    ComboboxInput: typeof ComboboxInput;
    ComboboxTrigger: typeof ComboboxTrigger;
    ComboboxAnchor: typeof ComboboxAnchor;
    ComboboxEmpty: typeof ComboboxEmpty;
    ComboboxItem: typeof ComboboxItem;
    ComboboxViewport: typeof ComboboxViewport;
    ScrollBox: typeof ScrollBox;
    ComboboxContent: typeof ComboboxContent;
    ComboboxPortal: typeof ComboboxPortal;
    ComboboxRoot: typeof ComboboxRoot;
}>;
export type __VLS_GlobalComponents = import("vue").GlobalComponents;
export type __VLS_LocalDirectives = import("vue").ShallowUnwrapRef<{
    vFetcherSrc: typeof vFetcherSrc;
}>;
declare const __VLS_export: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    modelValue: {
        type: null;
        default: undefined;
    };
    multiple: {
        type: BooleanConstructor;
        default: boolean;
    };
    /** `{ value, label, subtitle?, image? }` */
    items: {
        type: ArrayConstructor;
        default: () => never[];
    };
    hasMore: {
        type: BooleanConstructor;
        default: boolean;
    };
    loading: {
        type: BooleanConstructor;
        default: boolean;
    };
    /** The label of a chosen value, read or not among the items. */
    labelOf: {
        type: FunctionConstructor;
        required: true;
    };
    ariaLabel: {
        type: StringConstructor;
        default: string;
    };
    delay: {
        type: NumberConstructor;
        default: number;
    };
}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    search: (...args: any[]) => void;
    "update:modelValue": (...args: any[]) => void;
    open: (...args: any[]) => void;
    more: (...args: any[]) => void;
}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    modelValue: {
        type: null;
        default: undefined;
    };
    multiple: {
        type: BooleanConstructor;
        default: boolean;
    };
    /** `{ value, label, subtitle?, image? }` */
    items: {
        type: ArrayConstructor;
        default: () => never[];
    };
    hasMore: {
        type: BooleanConstructor;
        default: boolean;
    };
    loading: {
        type: BooleanConstructor;
        default: boolean;
    };
    /** The label of a chosen value, read or not among the items. */
    labelOf: {
        type: FunctionConstructor;
        required: true;
    };
    ariaLabel: {
        type: StringConstructor;
        default: string;
    };
    delay: {
        type: NumberConstructor;
        default: number;
    };
}>> & Readonly<{
    onSearch?: ((...args: any[]) => any) | undefined;
    "onUpdate:modelValue"?: ((...args: any[]) => any) | undefined;
    onOpen?: ((...args: any[]) => any) | undefined;
    onMore?: ((...args: any[]) => any) | undefined;
}>, {
    modelValue: any;
    items: unknown[];
    multiple: boolean;
    hasMore: boolean;
    loading: boolean;
    ariaLabel: string;
    delay: number;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
declare const emit: (event: "search" | "update:modelValue" | "open" | "more", ...args: any[]) => void;
import { ComboboxInput } from 'reka-ui';
import { ComboboxTrigger } from 'reka-ui';
import { ComboboxAnchor } from 'reka-ui';
import { ComboboxEmpty } from 'reka-ui';
import { ComboboxItem } from 'reka-ui';
import { ComboboxViewport } from 'reka-ui';
import ScrollBox from './ScrollBox.vue';
import { ComboboxContent } from 'reka-ui';
import { ComboboxPortal } from 'reka-ui';
import { ComboboxRoot } from 'reka-ui';
declare const vFetcherSrc: {
    created(el: any, binding: any, vnode: any): void;
    mounted(el: any, binding: any): void;
    beforeUpdate(el: any, binding: any, vnode: any): void;
    updated(el: any, binding: any): void;
    beforeUnmount(el: any): void;
};
//# sourceMappingURL=ComboPicker.vue.d.ts.map