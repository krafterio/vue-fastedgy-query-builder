declare const _default: typeof __VLS_export;
export default _default;
export type __VLS_LocalComponents = import("vue").ShallowUnwrapRef<{
    Primitive: typeof Primitive;
}>;
export type __VLS_GlobalComponents = import("vue").GlobalComponents;
export type __VLS_LocalDirectives = {};
export type __VLS_Slots = {} & {
    default?: (props: typeof __VLS_7) => any;
};
export type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
declare const __VLS_export: __VLS_WithSlots<typeof __VLS_base, __VLS_Slots>;
import { Primitive } from 'reka-ui';
declare var __VLS_7: {};
declare const __VLS_base: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    label: {
        type: StringConstructor;
        default: string;
    };
    kind: {
        type: StringConstructor;
        default: string;
    };
}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    label: {
        type: StringConstructor;
        default: string;
    };
    kind: {
        type: StringConstructor;
        default: string;
    };
}>> & Readonly<{}>, {
    label: string;
    kind: string;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
//# sourceMappingURL=FilterButton.vue.d.ts.map