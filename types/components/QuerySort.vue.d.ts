declare const _default: typeof __VLS_export;
export default _default;
export type __VLS_LocalComponents = import("vue").ShallowUnwrapRef<{
    PopoverTrigger: typeof PopoverTrigger;
    PopoverContent: typeof PopoverContent;
    PopoverPortal: typeof PopoverPortal;
    PopoverRoot: typeof PopoverRoot;
}>;
export type __VLS_GlobalComponents = import("vue").GlobalComponents;
export type __VLS_LocalDirectives = {};
declare const __VLS_export: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    /** The data iterator of the list: its order is read and written there. */
    list: {
        type: ObjectConstructor;
        required: true;
    };
    /** The metadata name of the listed model. */
    model: {
        type: StringConstructor;
        required: true;
    };
    /**
     * The paths offered, `owner.name` included, as names or as `{ path, label }` when the screen names them its own
     * way (the headers of its columns); the stored fields of the model when absent.
     */
    fields: {
        type: ArrayConstructor;
        default: null;
    };
}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    /** The data iterator of the list: its order is read and written there. */
    list: {
        type: ObjectConstructor;
        required: true;
    };
    /** The metadata name of the listed model. */
    model: {
        type: StringConstructor;
        required: true;
    };
    /**
     * The paths offered, `owner.name` included, as names or as `{ path, label }` when the screen names them its own
     * way (the headers of its columns); the stored fields of the model when absent.
     */
    fields: {
        type: ArrayConstructor;
        default: null;
    };
}>> & Readonly<{}>, {
    fields: unknown[];
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
import { PopoverTrigger } from 'reka-ui';
import { PopoverContent } from 'reka-ui';
import { PopoverPortal } from 'reka-ui';
import { PopoverRoot } from 'reka-ui';
//# sourceMappingURL=QuerySort.vue.d.ts.map