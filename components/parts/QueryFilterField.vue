<script setup>
import {
    DialogClose,
    DialogContent,
    DialogOverlay,
    DialogPortal,
    DialogRoot,
    DialogTitle,
    DialogTrigger,
    ListboxContent,
    ListboxFilter,
    ListboxItem,
    ListboxRoot,
    PopoverContent,
    PopoverPortal,
    PopoverRoot,
    PopoverTrigger,
} from 'reka-ui';
import { computed, onMounted, ref, watch } from 'vue';
import { filterableFields, relationKindOf } from 'vue-fastedgy';

import { keepOnFieldChange } from '../../catalog.js';
import { injectQueryFilterContext } from '../../composables/context.js';
import { useQueryFilterControls } from '../../composables/controls.js';
import { useQueryFilterIcons } from '../../composables/icons.js';
import { say } from '../../labels.js';

/**
 * The field of a condition, chosen in a list of the filterable fields that
 * walks into the relations: a chevron opens the fields of the related model,
 * the name of the relation chooses the relation itself.
 */
const props = defineProps({
    rule: { type: Object, required: true },
    /** The model the path starts from. */
    model: { type: String, required: true },
    /** The relation path of the enclosing block, for the excluded paths. */
    path: { type: String, default: '' },
    resolved: { type: Object, default: null },
});

const context = injectQueryFilterContext();
const controls = useQueryFilterControls();
const { icon } = useQueryFilterIcons();

const open = ref(false);
const levels = ref([]);
const search = ref('');

const metadatas = computed(() => context.metadatas.value ?? {});

const chip = computed(() =>
    props.resolved ? props.resolved.chain.map((link) => link.field.label).join(' › ') : say('Choose a field')
);

const modelAt = (names) => {
    let model = props.model;

    for (const name of names) {
        model = metadatas.value[model]?.fields?.[name]?.target ?? null;
    }

    return model;
};

const levelModel = computed(() => modelAt(levels.value));

const crumbs = computed(() => {
    const crumbs = [metadatas.value[props.model]?.label ?? props.model];
    let model = props.model;

    for (const name of levels.value) {
        const field = metadatas.value[model]?.fields?.[name];

        crumbs.push(field?.label ?? name);
        model = field?.target ?? null;
    }

    return crumbs;
});

const fold = (text) =>
    String(text ?? '')
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '')
        .toLowerCase();

const fullPath = (names) => [props.path, ...names].filter(Boolean).join('.');

const fieldsAt = (model, names) =>
    filterableFields(metadatas.value[model], { exclude: context.props.exclude, prefix: fullPath(names) })
        .map((field) => ({
            path: [...names, field.name].join('.'),
            label: field.label,
            field,
            relation: Boolean(relationKindOf(field) && metadatas.value[field.target]),
        }))
        .sort((a, b) => a.label.localeCompare(b.label));

const entries = computed(() => {
    const own = fieldsAt(levelModel.value, levels.value);
    const text = fold(search.value);

    if (!text) {
        return own;
    }

    const matching = own.filter((entry) => fold(entry.label).includes(text));

    if (!context.settings.value.deepFieldSearch || levels.value.length > 0) {
        return matching;
    }

    const deeper = own
        .filter((entry) => entry.relation && relationKindOf(entry.field) === 'single')
        .flatMap((relation) =>
            fieldsAt(relation.field.target, [relation.field.name])
                .filter((entry) => fold(entry.label).includes(text))
                .map((entry) => ({ ...entry, label: `${relation.label} › ${entry.label}`, relation: false }))
        );

    return [...matching, ...deeper];
});

watch(open, (isOpen) => {
    if (isOpen) {
        levels.value = [];
        search.value = '';
    }
});

onMounted(() => {
    if (context.pendingField.value === props.rule.id) {
        context.pendingField.value = null;
        open.value = true;
    }
});

const choose = (entry) => {
    const next = keepOnFieldChange(metadatas.value, props.resolved?.field ?? null, entry.field, props.rule);

    context.query.update(props.rule.id, { field: entry.path, ...next });
    open.value = false;
};

const enter = (entry) => {
    levels.value = [...levels.value, entry.field.name];
    search.value = '';
};

const back = () => {
    levels.value = levels.value.slice(0, -1);
};

const onSelect = (path) => {
    const entry = entries.value.find((one) => one.path === path);

    if (entry) {
        choose(entry);
    }
};
</script>

<template>
    <component :is="context.compact.value ? DialogRoot : PopoverRoot" v-model:open="open">
        <component :is="context.compact.value ? DialogTrigger : PopoverTrigger" as-child>
            <component :is="controls.chip" data-part="field" :empty="!resolved">{{ chip }}</component>
        </component>

        <component :is="context.compact.value ? DialogPortal : PopoverPortal">
            <DialogOverlay v-if="context.compact.value" data-slot="query-filter-overlay" />
            <component
                :is="context.compact.value ? DialogContent : PopoverContent"
                data-slot="query-filter-picker"
                :data-compact="context.compact.value ? '' : undefined"
                :aria-describedby="undefined"
                v-bind="context.compact.value ? {} : { align: 'start', sideOffset: 4, collisionPadding: 16 }"
            >
                <header data-slot="query-filter-picker-header">
                    <component
                        :is="controls.button"
                        v-if="levels.length > 0"
                        kind="ghost"
                        data-part="back"
                        :aria-label="say('Back')"
                        @click="back"
                    >
                        <component :is="icon('back')" v-if="icon('back')" aria-hidden="true" />
                        <template v-else>‹</template>
                    </component>
                    <component :is="context.compact.value ? DialogTitle : 'span'" data-slot="query-filter-crumbs">
                        {{ crumbs.join(' › ') }}
                    </component>
                    <DialogClose v-if="context.compact.value" as-child>
                        <component :is="controls.button" kind="ghost" data-part="close" :aria-label="say('Close')">
                            <component :is="icon('close')" v-if="icon('close')" aria-hidden="true" />
                            <template v-else>×</template>
                        </component>
                    </DialogClose>
                </header>

                <ListboxRoot highlight-on-hover data-slot="query-filter-fields" @update:model-value="onSelect">
                    <ListboxFilter
                        v-model="search"
                        data-slot="query-filter-field"
                        :placeholder="say('Search a field')"
                        auto-focus
                    />
                    <ListboxContent data-slot="query-filter-field-list">
                        <div v-for="entry in entries" :key="entry.path" data-slot="query-filter-field-entry">
                            <ListboxItem
                                :value="entry.path"
                                data-slot="query-filter-field-item"
                                @keydown.right.prevent="entry.relation && enter(entry)"
                            >
                                {{ entry.label }}
                            </ListboxItem>
                            <component
                                :is="controls.button"
                                v-if="entry.relation"
                                kind="ghost"
                                data-part="forward"
                                tabindex="-1"
                                :aria-label="entry.label"
                                @click="enter(entry)"
                            >
                                <component :is="icon('forward')" v-if="icon('forward')" aria-hidden="true" />
                                <template v-else>›</template>
                            </component>
                        </div>
                        <p v-if="entries.length === 0" data-slot="query-filter-nothing">
                            {{ say('Nothing to choose from.') }}
                        </p>
                    </ListboxContent>
                </ListboxRoot>
            </component>
        </component>
    </component>
</template>
