<script setup>
import { Primitive } from 'reka-ui';

/**
 * What opens a choice in a condition: its field, its operator, its joint. It
 * says the choice made, or `placeholder` while there is none.
 */
defineProps({
    placeholder: { type: String, default: '' },
    empty: { type: Boolean, default: false },
});
</script>

<template>
    <Primitive as="button" type="button" data-slot="query-filter-chip" :data-empty="empty ? '' : undefined">
        <slot>{{ placeholder }}</slot>
    </Primitive>
</template>
