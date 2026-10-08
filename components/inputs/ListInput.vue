<script setup>
import { TagsInputInput, TagsInputItem, TagsInputItemDelete, TagsInputItemText, TagsInputRoot } from 'reka-ui';
import { computed } from 'vue';

import { say } from '../../labels.js';
import { inputProps, readNumber } from './props.js';

/** Free values, as tags: Enter or a comma adds one, Backspace takes the last off. */
const props = defineProps(inputProps);
const emit = defineEmits(['update:modelValue']);

const numeric = computed(() => props.kind === 'number' || props.kind === 'single');
const values = computed(() => (Array.isArray(props.modelValue) ? props.modelValue.map(String) : []));

const update = (next) => {
    const read = next.map((value) => (numeric.value ? readNumber(value) : String(value).trim()));

    emit(
        'update:modelValue',
        read.filter((value) => value !== undefined && value !== '')
    );
};
</script>

<template>
    <TagsInputRoot
        data-slot="query-filter-tags"
        :model-value="values"
        add-on-paste
        add-on-blur
        delimiter=","
        @update:model-value="update"
    >
        <TagsInputItem v-for="value in values" :key="value" :value="value" data-slot="query-filter-tag">
            <TagsInputItemText />
            <TagsInputItemDelete data-slot="query-filter-tag-delete" :aria-label="say('Remove')">×</TagsInputItemDelete>
        </TagsInputItem>
        <TagsInputInput
            data-slot="query-filter-tags-input"
            :placeholder="say('Add a value')"
            :aria-label="field.label"
        />
    </TagsInputRoot>
</template>
