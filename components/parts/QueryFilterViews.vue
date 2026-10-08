<script setup>
import { computed } from 'vue';

import { injectQueryFilterContext } from '../../composables/context.js';
import { say } from '../../labels.js';
import QueryFilterViewItem from './QueryFilterViewItem.vue';

/** The custom views of the list, when it has any. */
const context = injectQueryFilterContext();
const views = computed(() => context.views?.items.value ?? []);
</script>

<template>
    <section v-if="views.length > 0" data-slot="query-filter-views">
        <h3 data-slot="query-filter-views-title">{{ say('Saved views') }}</h3>
        <ul data-slot="query-filter-view-list">
            <QueryFilterViewItem v-for="view in views" :key="view.id" :view="view" />
        </ul>
    </section>
</template>
