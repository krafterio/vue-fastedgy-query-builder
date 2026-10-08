<script setup>
import { computed } from 'vue';
import { arityOf } from 'vue-fastedgy';

import { kindOf } from '../../catalog.js';
import { injectQueryFilterContext } from '../../composables/context.js';
import { resolveFilterInput } from '../../composables/registry.js';

/**
 * The value of a condition, in the input the registry gives its type and its
 * operator: the package's, the application's, or the list's own.
 */
const props = defineProps({
    rule: { type: Object, required: true },
    resolved: { type: Object, required: true },
    option: { type: Object, default: null },
    path: { type: String, default: '' },
});

const context = injectQueryFilterContext();

const kind = computed(() => kindOf(props.resolved.field));
const arity = computed(() => arityOf(props.rule.operator));
const fullPath = computed(() => [props.path, props.resolved.path].filter(Boolean).join('.'));

const input = computed(() =>
    resolveFilterInput(
        { type: props.resolved.field.type, kind: kind.value, operator: props.rule.operator, arity: arity.value },
        context.props.inputs
    )
);

const inputContext = computed(() => ({
    prefix: context.props.prefix,
    scope: context.props.scope,
    compact: context.compact.value,
    metadatas: context.metadatas.value,
    valueSources: context.props.valueSources,
    relationScope: context.props.relationScopes[fullPath.value] ?? null,
    path: fullPath.value,
}));

const update = (value) => context.query.update(props.rule.id, { value });
</script>

<template>
    <component
        :is="input"
        v-if="input"
        data-part="value"
        :model-value="rule.value"
        :field="resolved.field"
        :kind="kind"
        :operator="rule.operator"
        :arity="arity"
        :option="option"
        :context="inputContext"
        @update:model-value="update"
    />
</template>
