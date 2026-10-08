<script setup>
import { useQueryFilterControls } from '../../composables/controls.js';
import { inputProps } from './props.js';

/** A day, `YYYY-MM-DD`, in the date picker of the browser. */
const props = defineProps(inputProps);
const emit = defineEmits(['update:modelValue']);
const controls = useQueryFilterControls();
</script>

<template>
    <component
        :is="controls.field"
        :model-value="props.modelValue ?? ''"
        type="date"
        :aria-label="field.label"
        @update:model-value="emit('update:modelValue', $event || undefined)"
    />
</template>
