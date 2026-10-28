<script setup>
import { computed, reactive, watch } from 'vue';
import { arityOf, countConditions, resolveFieldPath } from 'vue-fastedgy';

import { datetimeDays, isRelative, kindOf, operatorOptions, optionOfRule, relativeDays } from '../../catalog.js';
import { injectQueryFilterContext } from '../../composables/context.js';
import { useQueryFilterIcons } from '../../composables/icons.js';
import { resolveValueSource } from '../../composables/value-source.js';
import { say, sayCount } from '../../labels.js';

/**
 * One condition of the root, said in a line: its field, its operator and its
 * value, the records of a relation by their name once read. Its click opens
 * the panel, its cross removes it. Drawn once the metadata is read, and drawn
 * again when its field changes.
 */
const props = defineProps({
    node: { type: Object, required: true },
});

const SAID_AS_VALUES = ['=', 'in', 'between'];

const context = injectQueryFilterContext();
const { icon } = useQueryFilterIcons();

const metadatas = computed(() => context.metadatas.value ?? {});
const pathOf = (field) => resolveFieldPath(metadatas.value, context.props.model, field);
const nameOf = (path, field) => path?.chain.map((link) => link.field.label).join(' › ') ?? field;

const resolved = computed(() => (props.node.kind === 'rule' && props.node.field ? pathOf(props.node.field) : null));
const kind = computed(() => kindOf(resolved.value?.field));
const target = ['single', 'multiple'].includes(kind.value) ? (resolved.value?.target ?? null) : null;
const source = target
    ? resolveValueSource(target, {
          prefix: context.props.prefix,
          metadatas: metadatas.value,
          valueSources: context.props.valueSources,
      })
    : null;
const names = reactive(new Map());

watch(
    () => (source ? [props.node.value].flat().filter((id) => id !== null && id !== undefined && !names.has(id)) : []),
    (missing) => {
        if (missing.length === 0) {
            return;
        }

        source.reader
            .list({ fields: ['id', ...(source.fields ?? [])], filter: ['id', 'in', missing], limit: missing.length })
            .then((response) => (response?.data?.items ?? []).forEach((item) => names.set(item.id, source.label(item))))
            .catch(() => {});
    },
    { immediate: true }
);

const language = () => document.documentElement.lang || undefined;
const dayText = (day) =>
    day ? new Intl.DateTimeFormat(language(), { dateStyle: 'short' }).format(new Date(`${day}T00:00:00`)) : '';

const textOf = (value) => {
    switch (kind.value) {
        case 'choice':
            return String(resolved.value.field.choices?.[value] ?? value);
        case 'number':
            return Number.isFinite(Number(value)) ? new Intl.NumberFormat(language()).format(Number(value)) : value;
        case 'date':
            return dayText(value);
        case 'single':
        case 'multiple':
            return names.get(value) ?? `#${value}`;
        default:
            return String(value);
    }
};

const ruleLabel = () => {
    const field = nameOf(resolved.value, props.node.field);
    const option = optionOfRule(operatorOptions(metadatas.value, resolved.value.field), props.node);

    if (!option) {
        return field;
    }

    if (arityOf(props.node.operator) === 'none') {
        return `${field} ${say(option.label)}`;
    }

    if (isRelative(option)) {
        const unit = say(option.id === 'more than' ? 'days ago' : 'days');

        return `${field} ${say(option.label)} ${relativeDays(props.node.value) ?? '…'} ${unit}`;
    }

    const days = kind.value === 'datetime' ? datetimeDays(option, props.node.value).map(dayText) : null;
    const values = days ? [...new Set(days)] : [props.node.value].flat().map(textOf);
    const text = values.join(props.node.operator === 'between' ? ' → ' : ', ');

    return SAID_AS_VALUES.includes(props.node.operator)
        ? say('{field}: {values}', { field, values: text })
        : `${field} ${say(option.label)} ${text}`;
};

const label = computed(() => {
    switch (props.node.kind) {
        case 'opaque':
            return JSON.stringify(props.node.raw);
        case 'rule':
            return resolved.value ? ruleLabel() : props.node.field;
        case 'any':
            return say('{field}: {values}', {
                field: nameOf(pathOf(props.node.field), props.node.field),
                values: sayCount(countConditions(props.node.group), '{count} filter', '{count} filters'),
            });
        default:
            return sayCount(countConditions(props.node), '{count} filter', '{count} filters');
    }
});
</script>

<template>
    <span data-slot="query-filter-applied">
        <button type="button" data-part="open" :title="label" @click="context.open.value = true">{{ label }}</button>
        <button type="button" data-part="remove" :aria-label="say('Remove')" @click="context.query.remove(node.id)">
            <component :is="icon('close')" v-if="icon('close')" aria-hidden="true" />
            <template v-else>×</template>
        </button>
    </span>
</template>
