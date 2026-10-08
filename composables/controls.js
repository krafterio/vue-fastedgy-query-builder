import { inject, markRaw, provide } from 'vue';

import FilterButton from '../components/controls/FilterButton.vue';
import FilterChip from '../components/controls/FilterChip.vue';
import FilterField from '../components/controls/FilterField.vue';
import FilterMenu from '../components/controls/FilterMenu.vue';
import { useQueryFilterOptions } from './options.js';

const CONTROLS = Symbol('fe-query-filter-controls');

/**
 * The bricks a query filter draws its furniture with.
 *
 * Each one is an intention, never an appearance: `kind` says what a button is
 * for, and nothing says how it looks. What ships here carries the behaviour and
 * the `data-slot` a stylesheet reaches, so an application dresses the brick it
 * cares about and leaves the others alone.
 */
export const defaultQueryFilterControls = Object.freeze({
    button: markRaw(FilterButton),
    chip: markRaw(FilterChip),
    field: markRaw(FilterField),
    menu: markRaw(FilterMenu),
});

/**
 * Lends bricks to everything mounted under here. It adds to what is already
 * lent, the nearer one winning a brick both dress.
 *
 * @param {Partial<typeof defaultQueryFilterControls>} [controls]
 */
export function provideQueryFilterControls(controls = {}) {
    provide(CONTROLS, { ...useQueryFilterControls(), ...controls });
}

/**
 * The bricks in force: the package's, under the application's (the plugin), under
 * what a parent lent.
 *
 * @returns {typeof defaultQueryFilterControls}
 */
export function useQueryFilterControls() {
    const options = useQueryFilterOptions();

    return inject(CONTROLS, null) ?? { ...defaultQueryFilterControls, ...options.controls };
}
