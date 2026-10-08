<script setup>
import { useQueryFilterControls } from '../../composables/controls.js';
import { inputProps } from './props.js';

/** A time of day, `HH:MM`, in the time picker of the browser. */
const props = defineProps(inputProps);
const emit = defineEmits(['update:modelValue']);
const controls = useQueryFilterControls();
</script>

<template>
    <component
        :is="controls.field"
        :model-value="props.modelValue ?? ''"
        type="time"
        :aria-label="field.label"
        @update:model-value="emit('update:modelValue', $event || undefined)"
    />
</template>
