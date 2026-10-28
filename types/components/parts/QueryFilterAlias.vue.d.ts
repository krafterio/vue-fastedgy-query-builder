declare const _default: typeof __VLS_export;
export default _default;
export type __VLS_LocalComponents = import("vue").ShallowUnwrapRef<{
    QueryFilterField: typeof QueryFilterField;
    QueryFilterOperator: typeof QueryFilterOperator;
}>;
export type __VLS_GlobalComponents = import("vue").GlobalComponents;
export type __VLS_LocalDirectives = {};
declare const __VLS_export: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    /** The opaque node carrying `alias: { name, option, value }`. */
    node: {
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
    alias: {
        type: ObjectConstructor;
        required: true;
    };
}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    /** The opaque node carrying `alias: { name, option, value }`. */
    node: {
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
    alias: {
        type: ObjectConstructor;
        required: true;
    };
}>> & Readonly<{}>, {
    path: string;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
import QueryFilterField from './QueryFilterField.vue';
import QueryFilterOperator from './QueryFilterOperator.vue';
//# sourceMappingURL=QueryFilterAlias.vue.d.ts.map