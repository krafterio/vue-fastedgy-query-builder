import { registerFilterInput, registerValueSource } from './composables/registry.js';
import { QUERY_FILTER_OPTIONS, queryFilterDefaults } from './composables/options.js';

/**
 * The configuration of the application, set once when it is installed.
 *
 * @param {{
 *   deepFieldSearch?: boolean,
 *   compactBelow?: number,
 *   controls?: Record<string, unknown>,
 *   icons?: Record<string, unknown>,
 *   inputs?: Array<[import('./composables/registry.js').FilterInputMatch, unknown]>,
 *   valueSources?: Record<string, any>,
 * }} [options]
 * @returns {{ install: (app: import('vue').App) => void }}
 *
 * @example
 * app.use(createQueryFilter({ deepFieldSearch: true, controls: { button: Button } }));
 */
export function createQueryFilter(options = {}) {
    const { inputs = [], valueSources = {}, ...settings } = options;

    return {
        install(app) {
            for (const [match, component] of inputs) {
                registerFilterInput(match, component);
            }

            for (const [target, source] of Object.entries(valueSources)) {
                registerValueSource(target, source);
            }

            app.provide(QUERY_FILTER_OPTIONS, { ...queryFilterDefaults, ...settings });
        },
    };
}
