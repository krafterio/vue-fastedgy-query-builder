<script setup>
/**
 * A field typed in: a value, a name, a search. Its attributes (type,
 * placeholder, label, key handlers) reach the input itself.
 */
defineOptions({ inheritAttrs: false });

defineProps({
    modelValue: { type: [String, Number], default: '' },
});

const emit = defineEmits(['update:modelValue']);
</script>

<template>
    <input
        v-bind="$attrs"
        data-slot="query-filter-field"
        :value="modelValue ?? ''"
        @input="emit('update:modelValue', $event.target.value)"
    />
</template>
