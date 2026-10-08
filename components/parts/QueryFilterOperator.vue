<script setup>
import {
    SelectContent,
    SelectItem,
    SelectItemText,
    SelectPortal,
    SelectRoot,
    SelectTrigger,
    SelectViewport,
} from 'reka-ui';
import { computed } from 'vue';
import { createAnyBlock } from 'vue-fastedgy';

import { convertValue, kindOf } from '../../catalog.js';
import { injectQueryFilterContext } from '../../composables/context.js';
import { useQueryFilterControls } from '../../composables/controls.js';
import { say } from '../../labels.js';

/**
 * The operator of a condition, among those the catalog offers for its field.
 * Choosing « at least one that… » on a relation turns the row into a block.
 */
const props = defineProps({
    rule: { type: Object, required: true },
    resolved: { type: Object, required: true },
    options: { type: Array, required: true },
    option: { type: Object, default: null },
});

const context = injectQueryFilterContext();
const controls = useQueryFilterControls();

const kind = computed(() => kindOf(props.resolved.field));

const choose = (id) => {
    const next = props.options.find((one) => one.id === id);

    if (!next) {
        return;
    }

    if (next.operator === 'any' || next.operator === 'not any') {
        context.query.replace(props.rule.id, createAnyBlock(props.rule.field, next.operator === 'not any'));

        return;
    }

    const value = props.option ? convertValue(kind.value, props.option, next, props.rule.value) : undefined;

    context.query.update(props.rule.id, { operator: next.operator, value, ui: next.id === 'on' ? 'on' : undefined });
};
</script>

<template>
    <SelectRoot :model-value="option?.id ?? ''" @update:model-value="choose">
        <SelectTrigger as-child>
            <component :is="controls.chip" data-part="operator" :empty="!option">
                {{ option ? say(option.label) : say('Choose') }}
            </component>
        </SelectTrigger>

        <SelectPortal>
            <SelectContent data-slot="query-filter-operators" position="popper" :side-offset="4">
                <SelectViewport>
                    <SelectItem
                        v-for="one in options"
                        :key="one.id"
                        :value="one.id"
                        data-slot="query-filter-operator-item"
                    >
                        <SelectItemText>{{ say(one.label) }}</SelectItemText>
                    </SelectItem>
                </SelectViewport>
            </SelectContent>
        </SelectPortal>
    </SelectRoot>
</template>
