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
import { computed, ref, watch } from 'vue';

import { useQueryFilterControls } from '../../composables/controls.js';
import { say } from '../../labels.js';
import ScrollBox from '../internal/ScrollBox.vue';
import { inputProps } from './props.js';
import RelationInput from './RelationInput.vue';

/**
 * A record of a generic reference: its model among those the field accepts,
 * then the record in that model. The value is `[model, id]`, or a list of them.
 */
const props = defineProps(inputProps);
const emit = defineEmits(['update:modelValue']);
const controls = useQueryFilterControls();

const multiple = computed(() => props.arity === 'list');
const pairs = computed(() => {
    if (multiple.value) {
        return Array.isArray(props.modelValue) ? props.modelValue.filter(Array.isArray) : [];
    }

    return Array.isArray(props.modelValue) ? [props.modelValue] : [];
});

const model = ref(pairs.value[0]?.[0] ?? props.field.targets?.[0] ?? null);

watch(pairs, (next) => {
    if (next[0]?.[0]) {
        model.value = next[0][0];
    }
});

const metadatas = computed(() => props.context.metadatas ?? {});
const ids = computed(() => pairs.value.filter((pair) => pair[0] === model.value).map((pair) => pair[1]));

const choose = (value) => {
    if (multiple.value) {
        emit(
            'update:modelValue',
            (value ?? []).map((id) => [model.value, id])
        );
    } else {
        emit('update:modelValue', value === null || value === undefined ? undefined : [model.value, value]);
    }
};

const switchModel = (next) => {
    model.value = next;
    emit('update:modelValue', undefined);
};
</script>

<template>
    <span data-slot="query-filter-reference">
        <SelectRoot :model-value="model" @update:model-value="switchModel">
            <SelectTrigger as-child>
                <component :is="controls.chip" data-part="model" :aria-label="say('Model')">
                    {{ metadatas[model]?.label ?? model ?? say('Model') }}
                </component>
            </SelectTrigger>
            <SelectPortal>
                <SelectContent data-slot="query-filter-operators" position="popper" :side-offset="4">
                    <ScrollBox>
                        <SelectViewport>
                            <SelectItem
                                v-for="one in field.targets ?? []"
                                :key="one"
                                :value="one"
                                data-slot="query-filter-operator-item"
                            >
                                <SelectItemText>{{ metadatas[one]?.label ?? one }}</SelectItemText>
                            </SelectItem>
                        </SelectViewport>
                    </ScrollBox>
                </SelectContent>
            </SelectPortal>
        </SelectRoot>

        <RelationInput
            v-if="model"
            :key="model"
            :model-value="multiple ? ids : ids[0]"
            :field="field"
            :kind="kind"
            :operator="operator"
            :arity="arity"
            :option="option"
            :context="{ ...context, target: model }"
            @update:model-value="choose"
        />
    </span>
</template>
