import { inject } from 'vue';

/** What a query filter does unless the application or the list says otherwise. */
export const queryFilterDefaults = Object.freeze({
    deepFieldSearch: false,
    compactBelow: 640,
    controls: {},
    icons: {},
});

export const QUERY_FILTER_OPTIONS = Symbol('fe-query-filter-options');

/**
 * The options the application set when it installed the plugin, over the defaults.
 *
 * @returns {typeof queryFilterDefaults}
 */
export function useQueryFilterOptions() {
    return inject(QUERY_FILTER_OPTIONS, queryFilterDefaults);
}
