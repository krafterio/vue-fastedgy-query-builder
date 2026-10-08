<script setup>
import { DialogRoot, PopoverRoot } from 'reka-ui';
import { computed, ref, shallowRef, watch } from 'vue';
import { sameExpression, useCustomViews, useMetadataStore, useQueryExpression } from 'vue-fastedgy';

import { useCompact } from '../../composables/adaptive.js';
import { provideQueryFilterContext } from '../../composables/context.js';
import { useQueryFilterOptions } from '../../composables/options.js';

/**
 * The root of a query filter: the tree of conditions over the expression of a
 * list (or of `v-model:expression` without one), the metadata, the custom views,
 * and the surface the panel opens on, a popover or the whole screen.
 */
const props = defineProps({
    /** The metadata name of the listed model. */
    model: { type: String, required: true },
    /** The data iterator of the list: the filter reads and writes its expression, order and current view. */
    list: { type: Object, default: null },
    prefix: { type: String, default: '' },
    scope: { type: String, default: '' },
    /** Paths not offered, from the listed model. */
    exclude: { type: Array, default: () => [] },
    /** A restrictive filter per relation path, applied to the values it offers. */
    relationScopes: { type: Object, default: () => ({}) },
    /** Value sources of this list alone, by target model. */
    valueSources: { type: Object, default: () => ({}) },
    /** Inputs of this list alone, `[match, component]`, winning over the registry. */
    inputs: { type: Array, default: () => [] },
    deepFieldSearch: { type: Boolean, default: undefined },
    compactBelow: { type: Number, default: undefined },
    /** Whether the user may save a view for everyone. */
    canShare: { type: Boolean, default: true },
    /** Whether the list keeps custom views. */
    views: { type: Boolean, default: true },
    /** The tree alone, without the surface. */
    inline: { type: Boolean, default: false },
});

const expression = defineModel('expression', { default: null });
const open = defineModel('open', { default: false });

const options = useQueryFilterOptions();
const settings = computed(() => ({
    deepFieldSearch: props.deepFieldSearch ?? options.deepFieldSearch,
    compactBelow: props.compactBelow ?? options.compactBelow,
}));
const compact = useCompact(() => settings.value.compactBelow);

const metadatas = shallowRef(null);

void useMetadataStore()
    .getMetadatas()
    .then((all) => (metadatas.value = all ?? {}))
    .catch(() => (metadatas.value = {}));

const query = useQueryExpression(() => (props.list ? props.list.expression.value : expression.value));

watch(query.expression, (next) => {
    if (props.list) {
        if (!sameExpression(next, props.list.expression.value)) {
            props.list.expression.value = next;
        }

        return;
    }

    if (!sameExpression(next, expression.value)) {
        expression.value = next;
    }
});

const views =
    props.list && props.views
        ? useCustomViews(props.model, { scope: props.scope, prefix: props.prefix, list: props.list })
        : null;

watch(open, (isOpen) => {
    if (isOpen) {
        views?.ensure().catch(() => {});
    }
});

provideQueryFilterContext({
    props,
    settings,
    compact,
    metadatas,
    query,
    views,
    open,
    /** The rule whose field picker opens as soon as it is drawn: the one just added. */
    pendingField: ref(null),
});
</script>

<template>
    <slot v-if="inline" :count="query.count.value" />
    <DialogRoot v-else-if="compact" v-model:open="open">
        <slot :count="query.count.value" :open="open" />
    </DialogRoot>
    <PopoverRoot v-else v-model:open="open">
        <slot :count="query.count.value" :open="open" />
    </PopoverRoot>
</template>
