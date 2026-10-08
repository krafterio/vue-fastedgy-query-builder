<script setup>
import { computed, ref, watch } from 'vue';

import { useQueryFilterControls } from '../../composables/controls.js';
import { say } from '../../labels.js';
import { inputProps, nativeTypeOf, readNumber } from './props.js';

/** Both ends of a range: numbers, ids, dates or times, by the kind of the field. */
const props = defineProps(inputProps);
const emit = defineEmits(['update:modelValue']);
const controls = useQueryFilterControls();

const type = computed(() => nativeTypeOf(props.kind));
const ends = ref(['', '']);

watch(
    () => props.modelValue,
    (value) => {
        ends.value = Array.isArray(value) ? value.map((one) => one ?? '') : ['', ''];
    },
    { immediate: true }
);

const read = (value) => (type.value === 'number' ? readNumber(value) : value || undefined);

const commit = () => {
    const next = ends.value.map(read);

    if (JSON.stringify(next) !== JSON.stringify(props.modelValue ?? null)) {
        emit('update:modelValue', next);
    }
};

const set = (index, value) => {
    ends.value = ends.value.map((one, at) => (at === index ? value : one));

    if (type.value !== 'number') {
        commit();
    }
};
</script>

<template>
    <span data-slot="query-filter-range">
        <component
            :is="controls.field"
            :model-value="ends[0]"
            :type="type"
            :aria-label="say('Start')"
            :placeholder="say('Start')"
            @update:model-value="set(0, $event)"
            @keydown.enter="commit"
            @blur="commit"
        />
        <component
            :is="controls.field"
            :model-value="ends[1]"
            :type="type"
            :aria-label="say('End')"
            :placeholder="say('End')"
            @update:model-value="set(1, $event)"
            @keydown.enter="commit"
            @blur="commit"
        />
    </span>
</template>
