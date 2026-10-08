<script setup>
import { Primitive } from 'reka-ui';

/**
 * What a button is for, never what it looks like: `neutral`, `primary`,
 * `danger`, `ghost`, or `trigger` for the one opening the panel.
 *
 * `Primitive` rather than a bare tag: it is what lets an application render this
 * as whatever it dresses buttons with, `as-child` included, without this knowing.
 */
defineProps({
    label: { type: String, default: '' },
    kind: { type: String, default: 'neutral' },
});
</script>

<template>
    <Primitive as="button" type="button" data-slot="query-filter-button" :data-kind="kind">
        <slot>{{ label }}</slot>
    </Primitive>
</template>
