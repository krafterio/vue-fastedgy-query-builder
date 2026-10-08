<script setup>
import { useQueryFilterControls } from '../../composables/controls.js';
import { useDeferredValue } from '../../composables/deferred.js';
import { say } from '../../labels.js';
import { inputProps } from './props.js';

const props = defineProps(inputProps);
const emit = defineEmits(['update:modelValue']);
const controls = useQueryFilterControls();

const { local, input, flush } = useDeferredValue(
    () => props.modelValue ?? '',
    (value) => emit('update:modelValue', value)
);
</script>

<template>
    <component
        :is="controls.field"
        :model-value="local"
        type="text"
        :placeholder="say('Value')"
        :aria-label="field.label"
        @update:model-value="input"
        @keydown.enter="flush"
        @blur="flush"
    />
</template>
