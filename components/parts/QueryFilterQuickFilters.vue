<script setup>
import { computed } from 'vue';

import { injectQueryFilterContext } from '../../composables/context.js';

/**
 * The quick filters of the list, drawn before the trigger: each one a component
 * `defineQuickFilter` made of a control of the project, given the value the
 * list applies (a boolean, a number, a list…) and changing it there.
 */
const context = injectQueryFilterContext();

const drawn = computed(() =>
    (context.props.list?.quickFilters ?? []).filter(
        (one) => one.quickFilter && (typeof one.setup === 'function' || typeof one.render === 'function')
    )
);
</script>

<template>
    <div v-if="drawn.length > 0" data-slot="query-filter-quick">
        <component :is="one" v-for="one in drawn" :key="one.quickFilter.name" :list="context.props.list" />
    </div>
</template>
