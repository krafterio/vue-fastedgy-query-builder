/**
 * Lends bricks to everything mounted under here. It adds to what is already
 * lent, the nearer one winning a brick both dress.
 *
 * @param {Partial<typeof defaultQueryFilterControls>} [controls]
 */
export function provideQueryFilterControls(controls?: Partial<typeof defaultQueryFilterControls>): void;
/**
 * The bricks in force: the package's, under the application's (the plugin), under
 * what a parent lent.
 *
 * @returns {typeof defaultQueryFilterControls}
 */
export function useQueryFilterControls(): typeof defaultQueryFilterControls;
/**
 * The bricks a query filter draws its furniture with.
 *
 * Each one is an intention, never an appearance: `kind` says what a button is
 * for, and nothing says how it looks. What ships here carries the behaviour and
 * the `data-slot` a stylesheet reaches, so an application dresses the brick it
 * cares about and leaves the others alone.
 */
export const defaultQueryFilterControls: Readonly<{
    button: import("vue").Raw<import("../components/controls/FilterButton.vue").__VLS_WithSlots<import("vue").DefineComponent<import("vue").ExtractPropTypes<{
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
        kind: string;
        label: string;
    }, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>, {
        default?: (props: {}) => any;
    }>>;
    chip: import("vue").Raw<import("../components/controls/FilterChip.vue").__VLS_WithSlots<import("vue").DefineComponent<import("vue").ExtractPropTypes<{
        placeholder: {
            type: StringConstructor;
            default: string;
        };
        empty: {
            type: BooleanConstructor;
            default: boolean;
        };
    }>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
        placeholder: {
            type: StringConstructor;
            default: string;
        };
        empty: {
            type: BooleanConstructor;
            default: boolean;
        };
    }>> & Readonly<{}>, {
        placeholder: string;
        empty: boolean;
    }, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>, {
        default?: (props: {}) => any;
    }>>;
    field: import("vue").Raw<import("vue").DefineComponent<import("vue").ExtractPropTypes<{
        modelValue: {
            type: (StringConstructor | NumberConstructor)[];
            default: string;
        };
    }>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
        "update:modelValue": (...args: any[]) => void;
    }, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
        modelValue: {
            type: (StringConstructor | NumberConstructor)[];
            default: string;
        };
    }>> & Readonly<{
        "onUpdate:modelValue"?: ((...args: any[]) => any) | undefined;
    }>, {
        modelValue: string | number;
    }, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>>;
    menu: import("vue").Raw<import("../components/controls/FilterMenu.vue").__VLS_WithSlots<import("vue").DefineComponent<import("vue").ExtractPropTypes<{
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
    }, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>, {
        trigger?: (props: {}) => any;
    }>>;
}>;
//# sourceMappingURL=controls.d.ts.map