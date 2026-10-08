<script setup>
import { DialogTrigger, PopoverTrigger } from 'reka-ui';
import { computed } from 'vue';

import { injectQueryFilterContext } from '../../composables/context.js';
import { useQueryFilterControls } from '../../composables/controls.js';
import { useQueryFilterIcons } from '../../composables/icons.js';
import { say, sayCount } from '../../labels.js';
import QueryFilterCount from './QueryFilterCount.vue';

/**
 * What opens the panel. Its default slot replaces the button, the trigger
 * behaviour staying: the project's own button goes in it.
 */
const context = injectQueryFilterContext();
const controls = useQueryFilterControls();
const { icon } = useQueryFilterIcons();

const count = computed(() => context.query.count.value);
const label = computed(() =>
    count.value > 0 ? sayCount(count.value, 'Filter, 1 condition', 'Filter, {count} conditions') : say('Filter')
);
</script>

<template>
    <component :is="context.compact.value ? DialogTrigger : PopoverTrigger" as-child>
        <slot :count="count" :open="context.open.value" :label="label">
            <component
                :is="controls.button"
                kind="trigger"
                data-part="trigger"
                :data-state="count > 0 ? 'active' : 'idle'"
                :aria-label="label"
            >
                <component :is="icon('filter')" v-if="icon('filter')" aria-hidden="true" />
                <span v-if="!context.compact.value" data-slot="query-filter-trigger-label">{{ say('Filter') }}</span>
                <QueryFilterCount />
            </component>
        </slot>
    </component>
</template>
