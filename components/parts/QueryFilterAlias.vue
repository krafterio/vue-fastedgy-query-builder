<script setup>
import { computed } from 'vue';
import { arityOf } from 'vue-fastedgy';

import { aliasExpression, sayAlias } from '../../aliases.js';
import { kindOf } from '../../catalog.js';
import { injectQueryFilterContext } from '../../composables/context.js';
import { useQueryFilterControls } from '../../composables/controls.js';
import { useQueryFilterIcons } from '../../composables/icons.js';
import { filterAliasesOf, resolveFilterInput } from '../../composables/registry.js';
import { say } from '../../labels.js';
import QueryFilterField from './QueryFilterField.vue';
import QueryFilterOperator from './QueryFilterOperator.vue';

/**
 * A pseudo field: its alias in the field picker, its options in the operator
 * menu, its value in the input of a field of its type. Each change writes the
 * expression the alias stands for.
 */
const props = defineProps({
    /** The opaque node carrying `alias: { name, option, value }`. */
    node: { type: Object, required: true },
    model: { type: String, required: true },
    path: { type: String, default: '' },
    alias: { type: Object, required: true },
});

const context = injectQueryFilterContext();
const controls = useQueryFilterControls();
const { icon } = useQueryFilterIcons();

const menu = computed(() =>
    props.alias.options.map((one) => ({ id: one.id, operator: one.id, label: sayAlias(one.label) }))
);
const chosen = computed(
    () => props.alias.options.find((one) => one.id === props.node.alias.option) ?? props.alias.options[0]
);
const current = computed(() => menu.value.find((one) => one.id === chosen.value.id) ?? null);

const typed = computed(() => chosen.value.value ?? null);
const operator = computed(() => typed.value?.operator ?? '=');
const field = computed(() =>
    typed.value
        ? {
              name: props.alias.name,
              label: sayAlias(props.alias.label),
              type: typed.value.type,
              target: typed.value.target ?? null,
              choices: typed.value.choices ?? null,
          }
        : null
);
const option = computed(() => ({ id: typed.value?.option ?? operator.value, operator: operator.value }));

const input = computed(() =>
    field.value
        ? resolveFilterInput(
              {
                  type: field.value.type,
                  kind: kindOf(field.value),
                  operator: operator.value,
                  option: option.value.id,
                  arity: arityOf(operator.value),
              },
              context.props.inputs
          )
        : null
);

const inputContext = computed(() => ({
    prefix: context.props.prefix,
    scope: context.props.scope,
    compact: context.compact.value,
    metadatas: context.metadatas.value,
    valueSources: context.props.valueSources,
    relationScope: null,
    path: props.path,
}));

const write = (change) => {
    const next = { ...props.node.alias, ...change };
    const target = props.alias.options.find((one) => one.id === next.option) ?? chosen.value;

    context.query.update(props.node.id, { alias: next, raw: aliasExpression(target, next.value) });
};

const sameValue = (a, b) => Boolean(a && b) && a.type === b.type && arityOf(a.operator) === arityOf(b.operator);

const choose = (id) => {
    const next = props.alias.options.find((one) => one.id === id);

    if (next) {
        write({ option: id, value: sameValue(chosen.value.value, next.value) ? props.node.alias.value : undefined });
    }
};
</script>

<template>
    <div data-slot="query-filter-rule" :data-alias="alias.name">
        <QueryFilterField :rule="node" :model="model" :path="path" :label="sayAlias(alias.label)" />
        <QueryFilterOperator :rule="node" :resolved="{}" :options="menu" :option="current" :select="choose" />
        <component
            :is="input"
            v-if="input"
            data-part="value"
            :model-value="node.alias.value"
            :field="field"
            :kind="kindOf(field)"
            :operator="operator"
            :arity="arityOf(operator)"
            :option="option"
            :context="inputContext"
            @update:model-value="write({ value: $event })"
        />

        <component
            :is="controls.button"
            kind="ghost"
            data-part="remove"
            :aria-label="say('Remove')"
            @click="context.query.remove(node.id)"
        >
            <component :is="icon('remove')" v-if="icon('remove')" aria-hidden="true" />
            <template v-else>×</template>
        </component>
    </div>
</template>
