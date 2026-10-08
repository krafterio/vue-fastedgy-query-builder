import { enableAutoUnmount, mount } from '@vue/test-utils';
import { afterEach, describe, expect, it } from 'vitest';
import { defineComponent, h } from 'vue';

import { useQueryFilterControls } from '../composables/controls.js';
import { useQueryFilterOptions } from '../composables/options.js';
import { createQueryFilter } from '../plugin.js';

enableAutoUnmount(afterEach);

describe('the plugin', () => {
    it('sets the options of the application, the package defaults under them', () => {
        const AppButton = defineComponent({ render: () => h('button') });
        let seen = null;

        mount(
            defineComponent({
                setup() {
                    seen = { options: useQueryFilterOptions(), controls: useQueryFilterControls() };

                    return () => null;
                },
            }),
            { global: { plugins: [createQueryFilter({ deepFieldSearch: true, controls: { button: AppButton } })] } }
        );

        expect(seen.options.deepFieldSearch).toBe(true);
        expect(seen.options.compactBelow).toBe(640);
        expect(seen.controls.button).toBe(AppButton);
        expect(seen.controls.chip).toBeTruthy();
    });
});
