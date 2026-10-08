<script setup>
import {
    ComboboxAnchor,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxInput,
    ComboboxItem,
    ComboboxPortal,
    ComboboxRoot,
    ComboboxTrigger,
    ComboboxViewport,
} from 'reka-ui';
import { nextTick, onBeforeUnmount, ref, watch } from 'vue';
import { fetcherSrc } from 'vue-fastedgy';

import { say } from '../../labels.js';
import ScrollBox from './ScrollBox.vue';

/**
 * One value, or several as tags, chosen in a list searched as it is typed in
 * and read further as it scrolls: the sentinel at its end asks for the next
 * page when it comes into sight.
 */
const props = defineProps({
    modelValue: { type: null, default: undefined },
    multiple: { type: Boolean, default: false },
    /** `{ value, label, subtitle?, image? }` */
    items: { type: Array, default: () => [] },
    hasMore: { type: Boolean, default: false },
    loading: { type: Boolean, default: false },
    /** The label of a chosen value, read or not among the items. */
    labelOf: { type: Function, required: true },
    ariaLabel: { type: String, default: '' },
    delay: { type: Number, default: 300 },
});

const emit = defineEmits(['update:modelValue', 'search', 'more', 'open']);

const vFetcherSrc = fetcherSrc;

const open = ref(false);
const text = ref('');
const sentinel = ref(null);
let timer = null;
let observer = null;

watch(open, (isOpen) => {
    if (isOpen) {
        emit('open');
    }
});

watch(text, (value) => {
    clearTimeout(timer);
    timer = setTimeout(() => emit('search', value), props.delay);
});

const watchSentinel = async () => {
    observer?.disconnect();
    await nextTick();

    if (!open.value || !sentinel.value || typeof IntersectionObserver === 'undefined') {
        return;
    }

    observer = new IntersectionObserver((entries) => {
        if (entries.some((entry) => entry.isIntersecting) && props.hasMore && !props.loading) {
            emit('more');
        }
    });
    observer.observe(sentinel.value);
};

watch([open, () => props.items.length], watchSentinel);

onBeforeUnmount(() => {
    clearTimeout(timer);
    observer?.disconnect();
});

const remove = (value) =>
    emit(
        'update:modelValue',
        (props.modelValue ?? []).filter((one) => one !== value)
    );
const display = (value) => (value === null || value === undefined || Array.isArray(value) ? '' : props.labelOf(value));
</script>

<template>
    <ComboboxRoot
        v-model:open="open"
        data-slot="query-filter-picker-input"
        :model-value="modelValue ?? (multiple ? [] : null)"
        :multiple="multiple"
        ignore-filter
        :reset-search-term-on-blur="!multiple"
        @update:model-value="emit('update:modelValue', $event)"
    >
        <ComboboxAnchor data-slot="query-filter-combobox">
            <template v-if="multiple">
                <span v-for="value in modelValue ?? []" :key="value" data-slot="query-filter-tag">
                    {{ labelOf(value) }}
                    <button
                        type="button"
                        data-slot="query-filter-tag-delete"
                        :aria-label="say('Remove')"
                        @click="remove(value)"
                    >
                        ×
                    </button>
                </span>
            </template>
            <ComboboxInput
                v-model="text"
                data-slot="query-filter-combobox-input"
                :display-value="display"
                :placeholder="multiple ? say('Add a value') : say('Choose')"
                :aria-label="ariaLabel"
            />
            <ComboboxTrigger data-slot="query-filter-combobox-trigger" :aria-label="ariaLabel">▾</ComboboxTrigger>
        </ComboboxAnchor>

        <ComboboxPortal>
            <ComboboxContent data-slot="query-filter-options" position="popper" :side-offset="4">
                <ScrollBox>
                    <ComboboxViewport data-slot="query-filter-options-viewport">
                        <ComboboxEmpty data-slot="query-filter-nothing">{{
                            say('Nothing to choose from.')
                        }}</ComboboxEmpty>
                        <ComboboxItem
                            v-for="item in items"
                            :key="item.value"
                            :value="item.value"
                            data-slot="query-filter-option"
                        >
                            <img
                                v-if="item.image"
                                v-fetcher-src.lazy
                                :src="item.image"
                                alt=""
                                data-slot="query-filter-option-image"
                            />
                            <span data-slot="query-filter-option-label">{{ item.label }}</span>
                            <small v-if="item.subtitle" data-slot="query-filter-option-subtitle">{{
                                item.subtitle
                            }}</small>
                        </ComboboxItem>
                        <div ref="sentinel" data-slot="query-filter-sentinel" aria-hidden="true" />
                    </ComboboxViewport>
                </ScrollBox>
            </ComboboxContent>
        </ComboboxPortal>
    </ComboboxRoot>
</template>
