/**
 * The options the application set when it installed the plugin, over the defaults.
 *
 * @returns {typeof queryFilterDefaults}
 */
export function useQueryFilterOptions(): typeof queryFilterDefaults;
/** What a query filter does unless the application or the list says otherwise. */
export const queryFilterDefaults: Readonly<{
    deepFieldSearch: false;
    compactBelow: 640;
    controls: {};
    icons: {};
}>;
export const QUERY_FILTER_OPTIONS: unique symbol;
//# sourceMappingURL=options.d.ts.map