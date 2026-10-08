<script setup>
import { computed, ref } from 'vue';

import ComboPicker from '../internal/ComboPicker.vue';
import { inputProps } from './props.js';

/** One of the choices of the field, or several as tags. */
const props = defineProps(inputProps);
const emit = defineEmits(['update:modelValue']);

const text = ref('');
const choices = computed(() =>
    Object.entries(props.field.choices ?? {}).map(([value, label]) => ({ value, label: String(label ?? value) }))
);
const items = computed(() => {
    const folded = text.value.toLowerCase();

    return folded ? choices.value.filter((choice) => choice.label.toLowerCase().includes(folded)) : choices.value;
});

const labelOf = (value) => choices.value.find((choice) => choice.value === value)?.label ?? String(value);
</script>

<template>
    <ComboPicker
        :model-value="modelValue"
        :multiple="arity === 'list'"
        :items="items"
        :label-of="labelOf"
        :aria-label="field.label"
        :delay="0"
        @search="text = $event"
        @update:model-value="emit('update:modelValue', $event)"
    />
</template>
