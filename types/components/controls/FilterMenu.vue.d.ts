declare const _default: typeof __VLS_export;
export default _default;
export type __VLS_LocalComponents = import("vue").ShallowUnwrapRef<{
    DropdownMenuTrigger: typeof DropdownMenuTrigger;
    DropdownMenuItem: typeof DropdownMenuItem;
    DropdownMenuContent: typeof DropdownMenuContent;
    DropdownMenuPortal: typeof DropdownMenuPortal;
    DropdownMenuRoot: typeof DropdownMenuRoot;
}>;
export type __VLS_GlobalComponents = import("vue").GlobalComponents;
export type __VLS_LocalDirectives = {};
export type __VLS_Slots = {} & {
    trigger?: (props: typeof __VLS_13) => any;
};
export type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
declare const __VLS_export: __VLS_WithSlots<typeof __VLS_base, __VLS_Slots>;
import { DropdownMenuTrigger } from 'reka-ui';
import { DropdownMenuItem } from 'reka-ui';
import { DropdownMenuContent } from 'reka-ui';
import { DropdownMenuPortal } from 'reka-ui';
import { DropdownMenuRoot } from 'reka-ui';
declare var __VLS_13: {};
declare const __VLS_base: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    label: {
        type: StringConstructor;
        default: string;
    };
    items: {
        type: ArrayConstructor;
        default: () => never[];
    };
}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    label: {
        type: StringConstructor;
        default: string;
    };
    items: {
        type: ArrayConstructor;
        default: () => never[];
    };
}>> & Readonly<{}>, {
    items: unknown[];
    label: string;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
//# sourceMappingURL=FilterMenu.vue.d.ts.map