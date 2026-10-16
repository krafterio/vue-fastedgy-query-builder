<script setup>
import { computed } from 'vue';

import { injectQueryFilterContext } from '../../composables/context.js';
import { say } from '../../labels.js';
import QueryFilterJoint from './QueryFilterJoint.vue';

/**
 * Over the conditions, when the groups say their joint above them: the title
 * of the panel, and, once there is a condition, the records kept, those
 * matching all the conditions or at least one. Neither the screen-wide panel,
 * which has its own title, nor the conditions alone repeat the title.
 */
const context = injectQueryFilterContext();

const titled = computed(() => !context.compact.value && !context.props.inline);
const conditioned = computed(() => context.query.tree.value.children.length > 0);
const shown = computed(() => context.settings.value.jointAbove && (titled.value || conditioned.value));
const models = computed(() => {
    const metadata = context.metadatas.value?.[context.props.model];

    return metadata?.label_plural ?? metadata?.label ?? context.props.model;
});
</script>

<template>
    <header v-if="shown" data-slot="query-filter-heading">
        <span v-if="titled" data-slot="query-filter-title">{{ say('Filters') }}</span>
        <template v-if="conditioned">
            <span data-slot="query-filter-matching">{{ say('{models} matching', { models }) }}</span>
            <QueryFilterJoint />
        </template>
    </header>
</template>
