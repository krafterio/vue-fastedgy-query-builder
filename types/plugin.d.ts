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
export function createQueryFilter(options?: {
    deepFieldSearch?: boolean;
    compactBelow?: number;
    controls?: Record<string, unknown>;
    icons?: Record<string, unknown>;
    inputs?: Array<[import("./composables/registry.js").FilterInputMatch, unknown]>;
    valueSources?: Record<string, any>;
}): {
    install: (app: import("vue").App) => void;
};
//# sourceMappingURL=plugin.d.ts.map