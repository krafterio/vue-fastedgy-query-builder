<script setup>
import { computed } from 'vue';

import { injectQueryFilterContext } from '../../composables/context.js';
import { say } from '../../labels.js';

const context = injectQueryFilterContext();
const empty = computed(() => context.query.tree.value.children.length === 0);
</script>

<template>
    <p v-if="empty" data-slot="query-filter-empty">
        <slot>{{ say('No filter. Add a condition to narrow the list.') }}</slot>
    </p>
</template>
