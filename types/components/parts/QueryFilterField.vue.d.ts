declare const _default: typeof __VLS_export;
export default _default;
export type __VLS_LocalComponents = import("vue").ShallowUnwrapRef<{
    DialogOverlay: typeof DialogOverlay;
    DialogClose: typeof DialogClose;
    ListboxFilter: typeof ListboxFilter;
    ListboxItem: typeof ListboxItem;
    ListboxContent: typeof ListboxContent;
    ScrollBox: typeof ScrollBox;
    ListboxRoot: typeof ListboxRoot;
}>;
export type __VLS_GlobalComponents = import("vue").GlobalComponents;
export type __VLS_LocalDirectives = {};
declare const __VLS_export: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    rule: {
        type: ObjectConstructor;
        required: true;
    };
    /** The model the path starts from. */
    model: {
        type: StringConstructor;
        required: true;
    };
    /** The relation path of the enclosing block, for the excluded paths. */
    path: {
        type: StringConstructor;
        default: string;
    };
    resolved: {
        type: ObjectConstructor;
        default: null;
    };
}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    rule: {
        type: ObjectConstructor;
        required: true;
    };
    /** The model the path starts from. */
    model: {
        type: StringConstructor;
        required: true;
    };
    /** The relation path of the enclosing block, for the excluded paths. */
    path: {
        type: StringConstructor;
        default: string;
    };
    resolved: {
        type: ObjectConstructor;
        default: null;
    };
}>> & Readonly<{}>, {
    path: string;
    resolved: Record<string, any>;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
import { DialogOverlay } from 'reka-ui';
import { DialogClose } from 'reka-ui';
import { ListboxFilter } from 'reka-ui';
import { ListboxItem } from 'reka-ui';
import { ListboxContent } from 'reka-ui';
import ScrollBox from '../internal/ScrollBox.vue';
import { ListboxRoot } from 'reka-ui';
//# sourceMappingURL=QueryFilterField.vue.d.ts.map