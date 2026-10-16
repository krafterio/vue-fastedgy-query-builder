<script setup>
import { computed } from 'vue';
import { countConditions } from 'vue-fastedgy';

import { injectQueryFilterContext } from '../../composables/context.js';
import { useQueryFilterControls } from '../../composables/controls.js';
import { useQueryFilterIcons } from '../../composables/icons.js';
import { say } from '../../labels.js';
import AppliedFilter from '../internal/AppliedFilter.vue';

/**
 * The conditions of the list outside the panel, one chip each, the panel
 * opening on a click and a cross removing one; then « Add a filter », which
 * opens the panel on a new condition. Placed by the project where its design
 * wants it, anywhere under the root.
 */
const context = injectQueryFilterContext();
const controls = useQueryFilterControls();
const { icon } = useQueryFilterIcons();

const applied = computed(() =>
    context.metadatas.value ? context.query.tree.value.children.filter((node) => countConditions(node) > 0) : []
);

const add = () => {
    context.pendingField.value = context.query.addRule(context.query.tree.value.id);
    context.open.value = true;
};
</script>

<template>
    <div data-slot="query-filter-chips">
        <AppliedFilter v-for="node in applied" :key="`${node.id}:${node.field ?? ''}`" :node="node" />
        <component :is="controls.button" kind="ghost" data-part="add-rule" @click="add">
            <component :is="icon('add')" v-if="icon('add')" aria-hidden="true" />
            <slot>{{ say('Add a filter') }}</slot>
        </component>
    </div>
</template>
