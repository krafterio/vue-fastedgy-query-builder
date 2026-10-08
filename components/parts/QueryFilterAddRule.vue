<script setup>
import { injectQueryFilterContext } from '../../composables/context.js';
import { useQueryFilterControls } from '../../composables/controls.js';
import { useQueryFilterIcons } from '../../composables/icons.js';
import { say } from '../../labels.js';

/** Adds an empty condition to a group, the root by default, and opens its field at once. */
const props = defineProps({
    group: { type: Number, default: null },
});

const context = injectQueryFilterContext();
const controls = useQueryFilterControls();
const { icon } = useQueryFilterIcons();

const add = () => {
    context.pendingField.value = context.query.addRule(props.group ?? context.query.tree.value.id);
};
</script>

<template>
    <component :is="controls.button" kind="ghost" data-part="add-rule" @click="add">
        <component :is="icon('add')" v-if="icon('add')" aria-hidden="true" />
        <slot>{{ say('Add a filter') }}</slot>
    </component>
</template>
