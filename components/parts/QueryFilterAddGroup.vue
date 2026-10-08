<script setup>
import { injectQueryFilterContext } from '../../composables/context.js';
import { useQueryFilterControls } from '../../composables/controls.js';
import { useQueryFilterIcons } from '../../composables/icons.js';
import { say } from '../../labels.js';

/** Adds a group holding one empty condition, whose field opens at once. */
const props = defineProps({
    group: { type: Number, default: null },
});

const context = injectQueryFilterContext();
const controls = useQueryFilterControls();
const { icon } = useQueryFilterIcons();

const add = () => {
    const created = context.query.addGroup(props.group ?? context.query.tree.value.id);

    if (created !== null) {
        context.pendingField.value = context.query.addRule(created);
    }
};
</script>

<template>
    <component :is="controls.button" kind="ghost" data-part="add-group" @click="add">
        <component :is="icon('add')" v-if="icon('add')" aria-hidden="true" />
        <slot>{{ say('Add a group') }}</slot>
    </component>
</template>
