declare const _default: typeof __VLS_export;
export default _default;
export type __VLS_LocalComponents = import("vue").ShallowUnwrapRef<{
    QueryFilterRule: typeof QueryFilterRule;
    QueryFilterAnyBlock: typeof QueryFilterAnyBlock;
    QueryFilterAddRule: typeof QueryFilterAddRule;
    QueryFilterAddGroup: typeof QueryFilterAddGroup;
}>;
export type __VLS_GlobalComponents = import("vue").GlobalComponents;
export type __VLS_LocalDirectives = {};
export type __VLS_Slots = {} & {
    rule?: (props: typeof __VLS_10) => any;
} & {
    rule?: (props: typeof __VLS_24) => any;
} & {
    rule?: (props: typeof __VLS_33) => any;
};
export type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
declare const __VLS_export: __VLS_WithSlots<typeof __VLS_base, __VLS_Slots>;
import QueryFilterRule from './QueryFilterRule.vue';
import QueryFilterAnyBlock from './QueryFilterAnyBlock.vue';
import QueryFilterAddRule from './QueryFilterAddRule.vue';
import QueryFilterAddGroup from './QueryFilterAddGroup.vue';
declare namespace __VLS_10 {
    let rule: any;
    let model: string;
}
declare var __VLS_24: any;
declare var __VLS_33: any;
declare const __VLS_base: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    /** The group node; the root of the tree when absent. */
    group: {
        type: ObjectConstructor;
        default: null;
    };
    /** The model the fields of this group belong to. */
    model: {
        type: StringConstructor;
        default: null;
    };
    /** The relation path this group is on, inside a block. */
    path: {
        type: StringConstructor;
        default: string;
    };
    depth: {
        type: NumberConstructor;
        default: number;
    };
    /** Whether the group shows its own additions and its removal (a nested one). */
    nested: {
        type: BooleanConstructor;
        default: boolean;
    };
    removable: {
        type: BooleanConstructor;
        default: boolean;
    };
}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    /** The group node; the root of the tree when absent. */
    group: {
        type: ObjectConstructor;
        default: null;
    };
    /** The model the fields of this group belong to. */
    model: {
        type: StringConstructor;
        default: null;
    };
    /** The relation path this group is on, inside a block. */
    path: {
        type: StringConstructor;
        default: string;
    };
    depth: {
        type: NumberConstructor;
        default: number;
    };
    /** Whether the group shows its own additions and its removal (a nested one). */
    nested: {
        type: BooleanConstructor;
        default: boolean;
    };
    removable: {
        type: BooleanConstructor;
        default: boolean;
    };
}>> & Readonly<{}>, {
    group: Record<string, any>;
    model: string;
    path: string;
    depth: number;
    nested: boolean;
    removable: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
//# sourceMappingURL=QueryFilterGroup.vue.d.ts.map