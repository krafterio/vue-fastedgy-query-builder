<script setup>
import { computed } from 'vue';

import { injectQueryFilterContext } from '../../composables/context.js';
import { useQueryFilterControls } from '../../composables/controls.js';
import { useQueryFilterIcons } from '../../composables/icons.js';
import { say } from '../../labels.js';
import QueryFilterAddGroup from './QueryFilterAddGroup.vue';
import QueryFilterAddRule from './QueryFilterAddRule.vue';
import QueryFilterAnyBlock from './QueryFilterAnyBlock.vue';
import QueryFilterRule from './QueryFilterRule.vue';

/**
 * A group and its rows, sub-groups and blocks drawn inside it: the first row
 * says « Where », the second carries the joint of the whole group, the others
 * repeat it. A nested group carries its own additions and can go.
 */
const props = defineProps({
    /** The group node; the root of the tree when absent. */
    group: { type: Object, default: null },
    /** The model the fields of this group belong to. */
    model: { type: String, default: null },
    /** The relation path this group is on, inside a block. */
    path: { type: String, default: '' },
    depth: { type: Number, default: 0 },
    /** Whether the group shows its own additions and its removal (a nested one). */
    nested: { type: Boolean, default: false },
    removable: { type: Boolean, default: true },
});

const context = injectQueryFilterContext();
const controls = useQueryFilterControls();
const { icon } = useQueryFilterIcons();

const node = computed(() => props.group ?? context.query.tree.value);
const model = computed(() => props.model ?? context.props.model);
const joint = computed(() => (node.value.joint === '|' ? say('Or') : say('And')));

const toggleJoint = () => context.query.setJoint(node.value.id, node.value.joint === '|' ? '&' : '|');
</script>

<template>
    <div
        data-slot="query-filter-group"
        role="list"
        :data-depth="depth"
        :data-joint="node.joint === '|' ? 'or' : 'and'"
        :data-nested="nested ? '' : undefined"
    >
        <div v-for="(child, index) in node.children" :key="child.id" data-slot="query-filter-row" role="listitem">
            <span data-slot="query-filter-lead">
                <template v-if="index === 0">{{ say('Where') }}</template>
                <component
                    :is="controls.chip"
                    v-else-if="index === 1"
                    data-part="joint"
                    :aria-label="joint"
                    @click="toggleJoint"
                >
                    {{ joint }}
                </component>
                <template v-else>{{ joint }}</template>
            </span>

            <slot v-if="child.kind === 'rule' || child.kind === 'opaque'" name="rule" :rule="child" :model="model">
                <QueryFilterRule :rule="child" :model="model" :path="path" />
            </slot>
            <QueryFilterGroup
                v-else-if="child.kind === 'group'"
                :group="child"
                :model="model"
                :path="path"
                :depth="depth + 1"
                nested
            >
                <template v-if="$slots.rule" #rule="scope"><slot name="rule" v-bind="scope" /></template>
            </QueryFilterGroup>
            <QueryFilterAnyBlock
                v-else-if="child.kind === 'any'"
                :block="child"
                :model="model"
                :path="path"
                :depth="depth"
            >
                <template v-if="$slots.rule" #rule="scope"><slot name="rule" v-bind="scope" /></template>
            </QueryFilterAnyBlock>
        </div>

        <div v-if="nested" data-slot="query-filter-group-actions">
            <QueryFilterAddRule :group="node.id" />
            <QueryFilterAddGroup :group="node.id" />
            <component
                :is="controls.button"
                v-if="removable"
                kind="ghost"
                data-part="remove-group"
                :aria-label="say('Remove the group')"
                @click="context.query.remove(node.id)"
            >
                <component :is="icon('remove')" v-if="icon('remove')" aria-hidden="true" />
                <template v-else>{{ say('Remove the group') }}</template>
            </component>
        </div>
    </div>
</template>
