declare const _default: typeof __VLS_export;
export default _default;
export type __VLS_ModelProps = {
    "expression"?: (typeof __VLS_defaultModels)["expression"];
    "open"?: (typeof __VLS_defaultModels)["open"];
};
export type __VLS_ModelEmit = {
    "update:expression": [value: (typeof __VLS_defaultModels)["expression"]];
    "update:open": [value: (typeof __VLS_defaultModels)["open"]];
};
export type __VLS_PublicProps = __VLS_ModelProps;
export type __VLS_EmitProps = __VLS_EmitsToProps<__VLS_NormalizeEmits<typeof __VLS_modelEmit>>;
export type __VLS_LocalComponents = import("vue").ShallowUnwrapRef<{
    DialogRoot: typeof DialogRoot;
    PopoverRoot: typeof PopoverRoot;
}>;
export type __VLS_GlobalComponents = import("vue").GlobalComponents;
export type __VLS_LocalDirectives = {};
export type __VLS_Slots = {} & {
    default?: (props: typeof __VLS_1) => any;
} & {
    default?: (props: typeof __VLS_9) => any;
} & {
    default?: (props: typeof __VLS_17) => any;
};
export type __VLS_TypePropsToOption<T> = { [K in keyof T]-?: {} extends Pick<T, K> ? {
    type: import("vue").PropType<Required<T>[K]>;
} : {
    type: import("vue").PropType<T[K]>;
    required: true;
}; };
export type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
declare const __VLS_export: __VLS_WithSlots<typeof __VLS_base, __VLS_Slots>;
declare namespace __VLS_defaultModels {
    let expression: null;
    let open: boolean;
}
declare var __VLS_modelEmit: __VLS_ShortEmits<__VLS_ModelEmit>;
import { DialogRoot } from 'reka-ui';
import { PopoverRoot } from 'reka-ui';
declare namespace __VLS_1 {
    let count: any;
}
declare namespace __VLS_9 {
    let count_1: any;
    export { count_1 as count };
    let open_1: false;
    export { open_1 as open };
}
declare namespace __VLS_17 {
    let count_2: any;
    export { count_2 as count };
    let open_2: false;
    export { open_2 as open };
}
declare const __VLS_base: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    /** The metadata name of the listed model. */
    model: {
        type: StringConstructor;
        required: true;
    };
    /** The data iterator of the list: the filter reads and writes its expression, order and current view. */
    list: {
        type: ObjectConstructor;
        default: null;
    };
    prefix: {
        type: StringConstructor;
        default: string;
    };
    scope: {
        type: StringConstructor;
        default: string;
    };
    /** Paths not offered, from the listed model. */
    exclude: {
        type: ArrayConstructor;
        default: () => never[];
    };
    /** A restrictive filter per relation path, applied to the values it offers. */
    relationScopes: {
        type: ObjectConstructor;
        default: () => {};
    };
    /** Value sources of this list alone, by target model. */
    valueSources: {
        type: ObjectConstructor;
        default: () => {};
    };
    /** Inputs of this list alone, `[match, component]`, winning over the registry. */
    inputs: {
        type: ArrayConstructor;
        default: () => never[];
    };
    deepFieldSearch: {
        type: BooleanConstructor;
        default: undefined;
    };
    compactBelow: {
        type: NumberConstructor;
        default: undefined;
    };
    /** Whether the user may save a view for everyone. */
    canShare: {
        type: BooleanConstructor;
        default: boolean;
    };
    /** Whether the list keeps custom views. */
    views: {
        type: BooleanConstructor;
        default: boolean;
    };
    /** The tree alone, without the surface. */
    inline: {
        type: BooleanConstructor;
        default: boolean;
    };
    expression: {
        type: import("vue").PropType<null>;
    };
    open: {
        type: import("vue").PropType<boolean>;
    };
}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    "update:expression": (value: null) => any;
    "update:open": (value: boolean) => any;
}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    /** The metadata name of the listed model. */
    model: {
        type: StringConstructor;
        required: true;
    };
    /** The data iterator of the list: the filter reads and writes its expression, order and current view. */
    list: {
        type: ObjectConstructor;
        default: null;
    };
    prefix: {
        type: StringConstructor;
        default: string;
    };
    scope: {
        type: StringConstructor;
        default: string;
    };
    /** Paths not offered, from the listed model. */
    exclude: {
        type: ArrayConstructor;
        default: () => never[];
    };
    /** A restrictive filter per relation path, applied to the values it offers. */
    relationScopes: {
        type: ObjectConstructor;
        default: () => {};
    };
    /** Value sources of this list alone, by target model. */
    valueSources: {
        type: ObjectConstructor;
        default: () => {};
    };
    /** Inputs of this list alone, `[match, component]`, winning over the registry. */
    inputs: {
        type: ArrayConstructor;
        default: () => never[];
    };
    deepFieldSearch: {
        type: BooleanConstructor;
        default: undefined;
    };
    compactBelow: {
        type: NumberConstructor;
        default: undefined;
    };
    /** Whether the user may save a view for everyone. */
    canShare: {
        type: BooleanConstructor;
        default: boolean;
    };
    /** Whether the list keeps custom views. */
    views: {
        type: BooleanConstructor;
        default: boolean;
    };
    /** The tree alone, without the surface. */
    inline: {
        type: BooleanConstructor;
        default: boolean;
    };
    expression: {
        type: import("vue").PropType<null>;
    };
    open: {
        type: import("vue").PropType<boolean>;
    };
}>> & Readonly<{
    "onUpdate:expression"?: ((value: null) => any) | undefined;
    "onUpdate:open"?: ((value: boolean) => any) | undefined;
}>, {
    deepFieldSearch: boolean;
    compactBelow: number;
    exclude: unknown[];
    list: Record<string, any>;
    prefix: string;
    scope: string;
    relationScopes: Record<string, any>;
    valueSources: Record<string, any>;
    inputs: unknown[];
    canShare: boolean;
    views: boolean;
    inline: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
//# sourceMappingURL=QueryFilterRoot.vue.d.ts.map