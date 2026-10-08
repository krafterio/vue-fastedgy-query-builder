<script setup>
import { computed, reactive, ref, watch } from 'vue';
import { useApiOptions, useStorage } from 'vue-fastedgy';

import { resolveValueSource } from '../../composables/value-source.js';
import { say } from '../../labels.js';
import ComboPicker from '../internal/ComboPicker.vue';
import { inputProps } from './props.js';

/**
 * A record of the related model, or several as tags: searched by the server as
 * it is typed in, read further as the list scrolls, and its chosen ids read
 * back in one request when a view or a link reopens the condition.
 */
const props = defineProps(inputProps);
const emit = defineEmits(['update:modelValue']);
const { fileUrl } = useStorage();

const multiple = computed(() => props.arity === 'list');
const target = props.context.target ?? props.field.target;
const source = resolveValueSource(target, props.context);

const options = useApiOptions(source.reader, {
    fields: source.fields ?? [],
    filter: () => props.context.relationScope ?? null,
    searchFilter: source.searchFilter,
    limit: 50,
});

const known = reactive(new Map());
const lost = reactive(new Set());
const opened = ref(false);

watch(options.items, (items) => items.forEach((item) => known.set(item.id, item)), { immediate: true });

const chosen = computed(() => {
    if (multiple.value) {
        return Array.isArray(props.modelValue) ? props.modelValue : [];
    }

    return props.modelValue === undefined || props.modelValue === null ? [] : [props.modelValue];
});

watch(
    chosen,
    async (ids) => {
        const missing = ids.filter((id) => !known.has(id) && !lost.has(id));

        if (missing.length === 0) {
            return;
        }

        try {
            const response = await source.reader.list({
                fields: ['id', ...(source.fields ?? [])],
                filter: ['id', 'in', missing],
                limit: missing.length,
            });

            for (const item of response?.data?.items ?? []) {
                known.set(item.id, item);
            }
        } finally {
            for (const id of missing) {
                if (!known.has(id)) {
                    lost.add(id);
                }
            }
        }
    },
    { immediate: true }
);

const items = computed(() =>
    options.items.value.map((item) => ({
        value: item.id,
        label: source.label?.(item) ?? `#${item.id}`,
        subtitle: source.subtitle?.(item) ?? null,
        image: source.image?.(item) ? fileUrl(source.image(item)) : null,
    }))
);

const labelOf = (id) => {
    const item = known.get(id);

    if (item) {
        return source.label?.(item) ?? `#${id}`;
    }

    return lost.has(id) ? say('#{id} not found', { id }) : `#${id}`;
};

const onOpen = () => {
    if (!opened.value) {
        opened.value = true;
        void options.search('');
    }
};
</script>

<template>
    <ComboPicker
        :model-value="multiple ? chosen : (chosen[0] ?? null)"
        :multiple="multiple"
        :items="items"
        :has-more="options.hasMore.value"
        :loading="options.loading.value"
        :label-of="labelOf"
        :aria-label="field.label"
        @open="onOpen"
        @search="options.search($event)"
        @more="options.loadMore()"
        @update:model-value="emit('update:modelValue', $event)"
    />
</template>
