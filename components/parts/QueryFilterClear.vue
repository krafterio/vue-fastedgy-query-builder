<script setup>
import { computed } from 'vue';

import { injectQueryFilterContext } from '../../composables/context.js';
import { useQueryFilterControls } from '../../composables/controls.js';
import { say } from '../../labels.js';

/** Removes every condition and the current view; the search and the order stay. */
const context = injectQueryFilterContext();
const controls = useQueryFilterControls();

const shown = computed(() => context.query.tree.value.children.length > 0);

const clear = () => {
    context.query.clear();

    if (context.props.list?.view) {
        context.props.list.view.value = null;
    }
};
</script>

<template>
    <component :is="controls.button" v-if="shown" kind="ghost" data-part="clear" @click="clear">
        <slot>{{ say('Clear all') }}</slot>
    </component>
</template>
