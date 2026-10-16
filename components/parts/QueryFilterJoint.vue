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

import { injectQueryFilterContext } from '../../composables/context.js';
import { useQueryFilterControls } from '../../composables/controls.js';
import { say } from '../../labels.js';

/** The joint of a group, the root by default, chosen in a list: all of its conditions, or at least one. */
const props = defineProps({
    /** The group node; the root of the tree when absent. */
    group: { type: Object, default: null },
});

const JOINTS = [
    { joint: '&', label: 'all conditions' },
    { joint: '|', label: 'at least one condition' },
];

const context = injectQueryFilterContext();
const controls = useQueryFilterControls();

const node = computed(() => props.group ?? context.query.tree.value);
const current = computed(() => JOINTS.find((one) => one.joint === node.value.joint) ?? JOINTS[0]);
</script>

<template>
    <SelectRoot :model-value="current.joint" @update:model-value="context.query.setJoint(node.id, $event)">
        <SelectTrigger as-child>
            <component :is="controls.chip" data-part="joint">{{ say(current.label) }}</component>
        </SelectTrigger>

        <SelectPortal>
            <SelectContent data-slot="query-filter-joints" position="popper" :side-offset="4">
                <SelectViewport>
                    <SelectItem
                        v-for="one in JOINTS"
                        :key="one.joint"
                        :value="one.joint"
                        data-slot="query-filter-joint-item"
                    >
                        <SelectItemText>{{ say(one.label) }}</SelectItemText>
                    </SelectItem>
                </SelectViewport>
            </SelectContent>
        </SelectPortal>
    </SelectRoot>
</template>
