declare const _default: typeof __VLS_export;
export default _default;
export type __VLS_LocalComponents = import("vue").ShallowUnwrapRef<{
    SelectTrigger: typeof SelectTrigger;
    SelectItemText: typeof SelectItemText;
    SelectItem: typeof SelectItem;
    SelectViewport: typeof SelectViewport;
    SelectContent: typeof SelectContent;
    SelectPortal: typeof SelectPortal;
    SelectRoot: typeof SelectRoot;
    QueryFilterGroup: typeof QueryFilterGroup;
}>;
export type __VLS_GlobalComponents = import("vue").GlobalComponents;
export type __VLS_LocalDirectives = {};
export type __VLS_Slots = {} & {
    rule?: (props: typeof __VLS_88) => any;
};
export type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
declare const __VLS_export: __VLS_WithSlots<typeof __VLS_base, __VLS_Slots>;
import { SelectTrigger } from 'reka-ui';
import { SelectItemText } from 'reka-ui';
import { SelectItem } from 'reka-ui';
import { SelectViewport } from 'reka-ui';
import { SelectContent } from 'reka-ui';
import { SelectPortal } from 'reka-ui';
import { SelectRoot } from 'reka-ui';
import QueryFilterGroup from './QueryFilterGroup.vue';
declare var __VLS_88: any;
declare const __VLS_base: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    block: {
        type: ObjectConstructor;
        required: true;
    };
    model: {
        type: StringConstructor;
        required: true;
    };
    path: {
        type: StringConstructor;
        default: string;
    };
    depth: {
        type: NumberConstructor;
        default: number;
    };
}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    block: {
        type: ObjectConstructor;
        required: true;
    };
    model: {
        type: StringConstructor;
        required: true;
    };
    path: {
        type: StringConstructor;
        default: string;
    };
    depth: {
        type: NumberConstructor;
        default: number;
    };
}>> & Readonly<{}>, {
    path: string;
    depth: number;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
//# sourceMappingURL=QueryFilterAnyBlock.vue.d.ts.map