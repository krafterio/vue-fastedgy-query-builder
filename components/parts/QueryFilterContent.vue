<script setup>
import {
    DialogClose,
    DialogContent,
    DialogOverlay,
    DialogPortal,
    DialogTitle,
    PopoverContent,
    PopoverPortal,
} from 'reka-ui';
import { computed } from 'vue';

import { injectQueryFilterContext } from '../../composables/context.js';
import { useQueryFilterControls } from '../../composables/controls.js';
import { useQueryFilterIcons } from '../../composables/icons.js';
import { say, sayCount } from '../../labels.js';

defineOptions({ inheritAttrs: false });

/**
 * The panel: a popover under its trigger, or, on a narrow screen, the whole
 * screen with a title, a way out and the results it leads to.
 */
const context = injectQueryFilterContext();
const controls = useQueryFilterControls();
const { icon } = useQueryFilterIcons();

const total = computed(() => context.props.list?.total?.value ?? null);
const results = computed(() =>
    total.value === null ? say('Close') : sayCount(total.value, 'See the result', 'See the {count} results')
);
</script>

<template>
    <DialogPortal v-if="context.compact.value">
        <DialogOverlay data-slot="query-filter-overlay" />
        <DialogContent v-bind="$attrs" data-slot="query-filter-content" data-compact="" :aria-describedby="undefined">
            <header data-slot="query-filter-header">
                <DialogTitle data-slot="query-filter-title">{{ say('Filters') }}</DialogTitle>
                <DialogClose as-child>
                    <component :is="controls.button" kind="ghost" data-part="close" :aria-label="say('Close')">
                        <component :is="icon('close')" v-if="icon('close')" aria-hidden="true" />
                        <template v-else>×</template>
                    </component>
                </DialogClose>
            </header>

            <div data-slot="query-filter-body">
                <slot />
            </div>

            <footer data-slot="query-filter-results">
                <DialogClose as-child>
                    <component :is="controls.button" kind="primary" data-part="results">{{ results }}</component>
                </DialogClose>
            </footer>
        </DialogContent>
    </DialogPortal>

    <PopoverPortal v-else>
        <PopoverContent
            v-bind="$attrs"
            data-slot="query-filter-content"
            align="end"
            :side-offset="6"
            :collision-padding="16"
        >
            <slot />
        </PopoverContent>
    </PopoverPortal>
</template>
