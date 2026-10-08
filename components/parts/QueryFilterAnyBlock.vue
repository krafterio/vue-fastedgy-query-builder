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
import { computed, ref } from 'vue';
import { createRule, relationKindOf, resolveFieldPath } from 'vue-fastedgy';

import { operatorOptions } from '../../catalog.js';
import { injectQueryFilterContext } from '../../composables/context.js';
import { useQueryFilterControls } from '../../composables/controls.js';
import { useQueryFilterIcons } from '../../composables/icons.js';
import { say } from '../../labels.js';
import QueryFilterGroup from './QueryFilterGroup.vue';

/**
 * « Members: at least one that… » or « none that… »: a group of conditions on
 * the related model, one and the same related record satisfying them all.
 * Choosing another operator folds it back into a row, after confirming when
 * it holds conditions.
 */
const props = defineProps({
    block: { type: Object, required: true },
    model: { type: String, required: true },
    path: { type: String, default: '' },
    depth: { type: Number, default: 0 },
});

const context = injectQueryFilterContext();
const controls = useQueryFilterControls();
const { icon } = useQueryFilterIcons();

const resolved = computed(() =>
    context.metadatas.value ? resolveFieldPath(context.metadatas.value, props.model, props.block.field) : null
);
const single = computed(() => relationKindOf(resolved.value?.field) === 'single');
const relation = computed(() => resolved.value?.chain.map((link) => link.field.label).join(' › ') ?? props.block.field);
const title = computed(() => {
    const key = single.value
        ? props.block.negated
            ? '{relation}: not matching…'
            : '{relation}: matching…'
        : props.block.negated
          ? '{relation}: none that…'
          : '{relation}: at least one that…';

    return say(key, { relation: relation.value });
});

const options = computed(() => (resolved.value ? operatorOptions(context.metadatas.value, resolved.value.field) : []));
const selected = computed(() => (props.block.negated ? 'not any' : 'any'));
const folding = ref(null);

const fold = (id) => {
    const option = options.value.find((one) => one.id === id);

    if (!option) {
        return;
    }

    if (option.operator === 'any' || option.operator === 'not any') {
        context.query.update(props.block.id, { negated: option.operator === 'not any' });

        return;
    }

    if (props.block.group.children.length > 0 && folding.value === null) {
        folding.value = option;

        return;
    }

    context.query.replace(props.block.id, createRule(props.block.field, option.operator));
    folding.value = null;
};

const target = computed(() => resolved.value?.target ?? props.model);
const innerPath = computed(() => [props.path, props.block.field].filter(Boolean).join('.'));
</script>

<template>
    <div data-slot="query-filter-block" :data-negated="block.negated ? '' : undefined">
        <header data-slot="query-filter-block-header">
            <SelectRoot :model-value="selected" @update:model-value="fold">
                <SelectTrigger as-child>
                    <component :is="controls.chip" data-part="block">{{ title }}</component>
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

            <component
                :is="controls.button"
                kind="ghost"
                data-part="remove"
                :aria-label="say('Remove')"
                @click="context.query.remove(block.id)"
            >
                <component :is="icon('remove')" v-if="icon('remove')" aria-hidden="true" />
                <template v-else>×</template>
            </component>
        </header>

        <div v-if="folding" data-slot="query-filter-confirm" role="alert">
            <component :is="controls.button" kind="danger" data-part="confirm" @click="fold(folding.id)">
                {{ say('Remove') }}
            </component>
            <component :is="controls.button" kind="ghost" data-part="cancel" @click="folding = null">
                {{ say('Cancel') }}
            </component>
        </div>

        <QueryFilterGroup
            :group="block.group"
            :model="target"
            :path="innerPath"
            :depth="depth + 1"
            nested
            :removable="false"
        >
            <template v-if="$slots.rule" #rule="scope"><slot name="rule" v-bind="scope" /></template>
        </QueryFilterGroup>
    </div>
</template>
