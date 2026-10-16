<script setup>
import {
    ListboxContent,
    ListboxFilter,
    ListboxItem,
    ListboxItemIndicator,
    ListboxRoot,
    PopoverContent,
    PopoverPortal,
    PopoverRoot,
    PopoverTrigger,
} from 'reka-ui';
import { computed, ref } from 'vue';

import { useQueryFilterControls } from '../composables/controls.js';
import { useQueryFilterIcons } from '../composables/icons.js';
import { say } from '../labels.js';

/**
 * The field the rows of a list are grouped by, among those it can group by (a
 * choice, a boolean, a single relation), or none: a chip saying it, opening
 * the list of them, searched by their name, the one in force checked. Drawn
 * only for a list with such a field; placed by the project where its design
 * wants it.
 */
const props = defineProps({
    /** The data iterator of the list: its grouping is read and written there. */
    list: { type: Object, required: true },
    /** The names offered, among those the list groups by; all of them when absent. */
    fields: { type: Array, default: null },
});

const NONE = '-';

const controls = useQueryFilterControls();
const { icon } = useQueryFilterIcons();

const open = ref(false);
const search = ref('');

const fold = (text) =>
    String(text ?? '')
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '')
        .toLowerCase();

const offered = computed(() =>
    (props.list.groupableFields?.value ?? []).filter((field) => !props.fields || props.fields.includes(field.name))
);
const current = computed(() => offered.value.find((field) => field.name === props.list.groupBy.value) ?? null);
const shown = computed(() => offered.value.filter((field) => fold(field.label).includes(fold(search.value.trim()))));

const choose = (name) => {
    if (name !== undefined) {
        props.list.groupBy.value = name === NONE ? null : name;
    }

    open.value = false;
};
</script>

<template>
    <PopoverRoot v-if="offered.length > 0" v-model:open="open" @update:open="search = ''">
        <PopoverTrigger as-child>
            <component :is="controls.chip" data-part="group-by" :data-active="current ? '' : undefined">
                <component :is="icon('group')" v-if="icon('group')" aria-hidden="true" />
                <span data-slot="query-group-caption">{{ say('Group:') }}</span>
                <span data-slot="query-group-summary">{{ current?.label ?? say('None') }}</span>
            </component>
        </PopoverTrigger>

        <PopoverPortal>
            <PopoverContent data-slot="query-group-content" align="end" :side-offset="6" :collision-padding="16">
                <p data-slot="query-sort-title">{{ say('Group by') }}</p>

                <ListboxRoot
                    :model-value="current?.name ?? NONE"
                    highlight-on-hover
                    data-slot="query-group-list"
                    @update:model-value="choose"
                >
                    <ListboxFilter
                        v-model="search"
                        data-slot="query-filter-field"
                        data-part="search"
                        :placeholder="say('Search a field')"
                        :aria-label="say('Search a field')"
                        auto-focus
                    />

                    <ListboxContent data-slot="query-group-options">
                        <template v-if="!search.trim()">
                            <ListboxItem :value="NONE" data-slot="query-group-item">
                                <span data-slot="query-group-label">{{ say('No group') }}</span>
                                <ListboxItemIndicator data-slot="query-group-check">
                                    <component :is="icon('check')" v-if="icon('check')" aria-hidden="true" />
                                    <template v-else>✓</template>
                                </ListboxItemIndicator>
                            </ListboxItem>
                            <hr data-slot="query-sort-separator" />
                        </template>

                        <ListboxItem
                            v-for="field in shown"
                            :key="field.name"
                            :value="field.name"
                            data-slot="query-group-item"
                        >
                            <span data-slot="query-group-label">{{ field.label }}</span>
                            <ListboxItemIndicator data-slot="query-group-check">
                                <component :is="icon('check')" v-if="icon('check')" aria-hidden="true" />
                                <template v-else>✓</template>
                            </ListboxItemIndicator>
                        </ListboxItem>

                        <p v-if="shown.length === 0" data-slot="query-filter-nothing">
                            {{ say('Nothing to choose from.') }}
                        </p>
                    </ListboxContent>
                </ListboxRoot>
            </PopoverContent>
        </PopoverPortal>
    </PopoverRoot>
</template>
