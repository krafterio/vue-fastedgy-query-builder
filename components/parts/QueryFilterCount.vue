<script setup>
import { computed } from 'vue';

import { injectQueryFilterContext } from '../../composables/context.js';

const context = injectQueryFilterContext();
const count = computed(() => context.query.count.value);
</script>

<template>
    <span v-if="count > 0" data-slot="query-filter-count">{{ count }}</span>
</template>
