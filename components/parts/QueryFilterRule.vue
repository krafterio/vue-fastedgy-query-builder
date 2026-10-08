<script setup>
import { computed } from 'vue';
import { arityOf, resolveFieldPath } from 'vue-fastedgy';

import { operatorOptions, optionOfRule } from '../../catalog.js';
import { injectQueryFilterContext } from '../../composables/context.js';
import { useQueryFilterControls } from '../../composables/controls.js';
import { useQueryFilterIcons } from '../../composables/icons.js';
import { say } from '../../labels.js';
import QueryFilterField from './QueryFilterField.vue';
import QueryFilterOperator from './QueryFilterOperator.vue';
import QueryFilterValue from './QueryFilterValue.vue';

/**
 * One condition: its field, its operator, its value, and a way to remove it.
 * A rule the metadata does not describe is shown as written, read only, and
 * stays in the expression until it is removed.
 */
const props = defineProps({
    rule: { type: Object, required: true },
    model: { type: String, required: true },
    path: { type: String, default: '' },
});

const context = injectQueryFilterContext();
const controls = useQueryFilterControls();
const { icon } = useQueryFilterIcons();

const resolved = computed(() =>
    props.rule.kind === 'rule' && props.rule.field && context.metadatas.value
        ? resolveFieldPath(context.metadatas.value, props.model, props.rule.field)
        : null
);
const options = computed(() => (resolved.value ? operatorOptions(context.metadatas.value, resolved.value.field) : []));
const option = computed(() => (props.rule.operator ? optionOfRule(options.value, props.rule) : null));

const readOnly = computed(() => {
    if (props.rule.kind === 'opaque') {
        return true;
    }

    if (!context.metadatas.value || !props.rule.field) {
        return false;
    }

    return !resolved.value || (Boolean(props.rule.operator) && !option.value);
});

const written = computed(() => {
    const raw =
        props.rule.kind === 'opaque'
            ? props.rule.raw
            : [props.rule.field, props.rule.operator, ...(props.rule.value === undefined ? [] : [props.rule.value])];

    return JSON.stringify(raw);
});

const hasValue = computed(() => Boolean(option.value) && !['none', 'sub'].includes(arityOf(props.rule.operator)));
</script>

<template>
    <div data-slot="query-filter-rule" :data-readonly="readOnly ? '' : undefined">
        <code v-if="readOnly" data-slot="query-filter-raw">{{ written }}</code>
        <template v-else>
            <QueryFilterField :rule="rule" :model="model" :path="path" :resolved="resolved" />
            <QueryFilterOperator
                v-if="resolved"
                :rule="rule"
                :resolved="resolved"
                :options="options"
                :option="option"
            />
            <QueryFilterValue
                v-if="resolved && hasValue"
                :rule="rule"
                :resolved="resolved"
                :option="option"
                :path="path"
            />
        </template>

        <component
            :is="controls.button"
            kind="ghost"
            data-part="remove"
            :aria-label="say('Remove')"
            @click="context.query.remove(rule.id)"
        >
            <component :is="icon('remove')" v-if="icon('remove')" aria-hidden="true" />
            <template v-else>×</template>
        </component>
    </div>
</template>
