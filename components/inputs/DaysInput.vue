<script setup>
import { computed } from 'vue';

import { relativeDays, relativeValue } from '../../catalog.js';
import { useQueryFilterControls } from '../../composables/controls.js';
import { useDeferredValue } from '../../composables/deferred.js';
import { say } from '../../labels.js';
import { inputProps, readNumber } from './props.js';

/**
 * A number of days back from today, written as the expression the server
 * evaluates each time it reads the filter: « in the last 30 days » stays the
 * last thirty days whatever the day.
 */
const props = defineProps(inputProps);
const emit = defineEmits(['update:modelValue']);
const controls = useQueryFilterControls();

const { local, input, flush } = useDeferredValue(
    () => relativeDays(props.modelValue) ?? '',
    (value) => emit('update:modelValue', relativeValue(readNumber(value)))
);

const unit = computed(() => (props.option?.id === 'more than' ? 'days ago' : 'days'));
</script>

<template>
    <span data-slot="query-filter-days">
        <component
            :is="controls.field"
            :model-value="local"
            type="number"
            inputmode="numeric"
            min="1"
            :placeholder="say('Value')"
            :aria-label="field.label"
            @update:model-value="input"
            @keydown.enter="flush"
            @blur="flush"
        />
        <span data-part="unit">{{ say(unit) }}</span>
    </span>
</template>
