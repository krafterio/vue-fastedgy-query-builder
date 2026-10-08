<script setup>
import { computed, ref, watch } from 'vue';

import { datetimeDays, datetimeValue } from '../../catalog.js';
import { useQueryFilterControls } from '../../composables/controls.js';
import { say } from '../../labels.js';
import { inputProps } from './props.js';

/**
 * The day of a datetime, or the days of a range: picked as days, written as
 * the instants of the local day they mean, « on 8 October » being the whole of
 * that day.
 */
const props = defineProps(inputProps);
const emit = defineEmits(['update:modelValue']);
const controls = useQueryFilterControls();

const option = computed(() => props.option ?? { id: props.operator, operator: props.operator });
const range = computed(() => option.value.id === 'between');
const days = ref([]);

watch(
    () => [option.value.id, JSON.stringify(props.modelValue ?? null)],
    () => {
        days.value = datetimeDays(option.value, props.modelValue);
    },
    { immediate: true }
);

const set = (index, day) => {
    const next = [...days.value];

    next[index] = day || null;
    days.value = next;

    if (!range.value || (next[0] && next[1])) {
        emit('update:modelValue', datetimeValue(option.value, next));
    }
};
</script>

<template>
    <span data-slot="query-filter-range">
        <component
            :is="controls.field"
            :model-value="days[0] ?? ''"
            type="date"
            :aria-label="range ? say('Start') : field.label"
            @update:model-value="set(0, $event)"
        />
        <component
            :is="controls.field"
            v-if="range"
            :model-value="days[1] ?? ''"
            type="date"
            :aria-label="say('End')"
            @update:model-value="set(1, $event)"
        />
    </span>
</template>
