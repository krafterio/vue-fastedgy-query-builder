<script setup>
import { PopoverContent, PopoverPortal, PopoverRoot, PopoverTrigger } from 'reka-ui';
import { computed, ref, shallowRef } from 'vue';
import { orderByTerm, resolveFieldPath, useMetadataStore } from 'vue-fastedgy';

import { kindOf } from '../catalog.js';
import { useQueryFilterControls } from '../composables/controls.js';
import { useQueryFilterIcons } from '../composables/icons.js';
import { say } from '../labels.js';

/**
 * The order of a list, one field after the other: a chip saying the first,
 * opening the whole order. A field turns around on a click, moves by its
 * handle (dragged, or with the arrow keys) and goes by its cross; the fields
 * left are added from a list searched by their name. Removing the last one,
 * or « Reset », brings the default order of the list back. Placed by the
 * project where its design wants it.
 */
const props = defineProps({
    /** The data iterator of the list: its order is read and written there. */
    list: { type: Object, required: true },
    /** The metadata name of the listed model. */
    model: { type: String, required: true },
    /**
     * The paths offered, `owner.name` included, as names or as `{ path, label }` when the screen names them its own
     * way (the headers of its columns); the stored fields of the model when absent.
     */
    fields: { type: Array, default: null },
});

const SORTED_KINDS = ['text', 'number', 'date', 'datetime', 'time', 'boolean', 'choice'];
const DIRECTIONS = {
    text: ['A → Z', 'Z → A'],
    choice: ['A → Z', 'Z → A'],
    number: ['1 → 9', '9 → 1'],
    date: ['oldest first', 'newest first'],
    datetime: ['oldest first', 'newest first'],
    boolean: ['false first', 'true first'],
};

const controls = useQueryFilterControls();
const { icon } = useQueryFilterIcons();

const metadatas = shallowRef(null);
const search = ref('');
const dragged = ref(null);
const over = ref(null);

void useMetadataStore()
    .getMetadatas()
    .then((all) => (metadatas.value = all ?? {}))
    .catch(() => (metadatas.value = {}));

const pathOf = (one) => (typeof one === 'object' ? one.path : one);
const named = computed(
    () => new Map((props.fields ?? []).filter((one) => one?.label).map((one) => [one.path, one.label]))
);

const describe = (path) => {
    const resolved = metadatas.value ? resolveFieldPath(metadatas.value, props.model, path) : null;

    return {
        path,
        label: named.value.get(path) ?? (resolved ? resolved.chain.map((link) => link.field.label).join(' › ') : path),
        kind: kindOf(resolved?.field),
    };
};

const stored = computed(() =>
    Object.values(metadatas.value?.[props.model]?.fields ?? {})
        .filter((field) => field.name !== 'id' && !['computed', 'fulltext'].includes(field.type))
        .filter((field) => SORTED_KINDS.includes(kindOf(field)))
        .map((field) => field.name)
);

const offered = computed(() => {
    const described = (props.fields ?? stored.value).map(pathOf).map(describe);

    return props.fields ? described : described.sort((a, b) => a.label.localeCompare(b.label));
});

const terms = computed(() =>
    (props.list.orderBy.value ?? []).map(orderByTerm).map((term) => ({ ...term, ...describe(term.field) }))
);

const directionOf = (term) =>
    say((DIRECTIONS[term.kind] ?? ['ascending', 'descending'])[term.direction === 'desc' ? 1 : 0]);

const arrowOf = (term) => (term.direction === 'desc' ? 'descending' : 'ascending');
const first = computed(() => terms.value[0] ?? null);
const others = computed(() => Math.max(terms.value.length - 1, 0));

const spoken = computed(() => {
    if (!first.value) {
        return `${say('Sort:')} ${say('Default')}`;
    }

    const said = say('{field}, {direction}', { field: first.value.label, direction: directionOf(first.value) });

    return `${say('Sort:')} ${said}${others.value > 0 ? ` +${others.value}` : ''}`;
});

const addable = computed(() => {
    const text = search.value.trim().toLowerCase();

    return offered.value
        .filter((one) => !terms.value.some((term) => term.field === one.path))
        .filter((one) => !text || one.label.toLowerCase().includes(text));
});

const byDefault = computed(() => props.list.defaultOrderBy ?? null);
const custom = computed(() => JSON.stringify(props.list.orderBy.value ?? null) !== JSON.stringify(byDefault.value));

const write = (next) => {
    props.list.orderBy.value =
        next.length > 0 ? next.map((term) => `${term.field}:${term.direction}`) : byDefault.value;
};

const toggle = (index) =>
    write(
        terms.value.map((term, at) =>
            at === index ? { ...term, direction: term.direction === 'desc' ? 'asc' : 'desc' } : term
        )
    );
const remove = (index) => write(terms.value.filter((term, at) => at !== index));

const add = (one) => {
    write([...terms.value, { field: one.path, direction: 'asc' }]);
    search.value = '';
};

const move = (from, to) => {
    if (to < 0 || to >= terms.value.length || from === to) {
        return;
    }

    const next = [...terms.value];
    const [moved] = next.splice(from, 1);

    next.splice(to, 0, moved);
    write(next);
};

const start = (event, index) => {
    dragged.value = index;
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', terms.value[index].field);
    event.dataTransfer.setDragImage(event.currentTarget.closest('[data-slot="query-sort-term"]'), 12, 12);
};

const drop = (index) => {
    if (dragged.value !== null) {
        move(dragged.value, index);
    }

    dragged.value = null;
    over.value = null;
};
</script>

<template>
    <PopoverRoot @update:open="search = ''">
        <PopoverTrigger as-child>
            <component :is="controls.chip" data-part="sort" :aria-label="spoken">
                <component :is="icon('sort')" v-if="icon('sort')" aria-hidden="true" />
                <span data-slot="query-sort-caption">{{ say('Sort:') }}</span>
                <span data-slot="query-sort-summary">{{ first ? first.label : say('Default') }}</span>
                <template v-if="first">
                    <component
                        :is="icon(arrowOf(first))"
                        v-if="icon(arrowOf(first))"
                        data-slot="query-sort-arrow"
                        aria-hidden="true"
                    />
                    <span v-else data-slot="query-sort-arrow" aria-hidden="true">
                        {{ first.direction === 'desc' ? '↓' : '↑' }}
                    </span>
                </template>
                <span v-if="others > 0" data-slot="query-sort-more" aria-hidden="true">+{{ others }}</span>
            </component>
        </PopoverTrigger>

        <PopoverPortal>
            <PopoverContent data-slot="query-sort-content" align="end" :side-offset="6" :collision-padding="16">
                <p data-slot="query-sort-title">{{ say('Sort by') }}</p>

                <ol v-if="terms.length > 0" data-slot="query-sort-terms">
                    <li
                        v-for="(term, index) in terms"
                        :key="term.field"
                        data-slot="query-sort-term"
                        :data-dragging="dragged === index ? '' : undefined"
                        :data-over="over === index && dragged !== index ? '' : undefined"
                        @dragover.prevent="over = index"
                        @drop.prevent="drop(index)"
                    >
                        <button
                            type="button"
                            draggable="true"
                            data-part="handle"
                            :aria-label="say('Move {field}', { field: term.label })"
                            @dragstart="start($event, index)"
                            @dragend="dragged = over = null"
                            @keydown.up.prevent="move(index, index - 1)"
                            @keydown.down.prevent="move(index, index + 1)"
                        >
                            <component :is="icon('drag')" v-if="icon('drag')" aria-hidden="true" />
                            <template v-else>⠿</template>
                        </button>

                        <button
                            type="button"
                            data-part="direction"
                            :data-direction="term.direction"
                            :title="directionOf(term)"
                            :aria-label="
                                say('{field}, {direction}', { field: term.label, direction: directionOf(term) })
                            "
                            @click="toggle(index)"
                        >
                            <span data-slot="query-sort-field">{{ term.label }}</span>
                            <span data-slot="query-sort-direction">{{ directionOf(term) }}</span>
                            <component
                                :is="icon(term.direction === 'desc' ? 'descending' : 'ascending')"
                                v-if="icon(term.direction === 'desc' ? 'descending' : 'ascending')"
                                aria-hidden="true"
                            />
                            <template v-else>{{ term.direction === 'desc' ? '↓' : '↑' }}</template>
                        </button>

                        <button
                            type="button"
                            data-part="remove"
                            :aria-label="say('Remove {field}', { field: term.label })"
                            @click="remove(index)"
                        >
                            <component :is="icon('close')" v-if="icon('close')" aria-hidden="true" />
                            <template v-else>×</template>
                        </button>
                    </li>
                </ol>

                <p v-else data-slot="query-sort-default">{{ say('The list keeps its default order.') }}</p>

                <hr data-slot="query-sort-separator" />

                <component
                    :is="controls.field"
                    v-model="search"
                    type="search"
                    data-part="search"
                    :placeholder="say('Add a sort')"
                    :aria-label="say('Add a sort')"
                />

                <div data-slot="query-sort-offered">
                    <button v-for="one in addable" :key="one.path" type="button" data-part="add" @click="add(one)">
                        <component :is="icon('add')" v-if="icon('add')" aria-hidden="true" />
                        <span>{{ one.label }}</span>
                    </button>
                    <p v-if="addable.length === 0" data-slot="query-filter-nothing">
                        {{ say('Nothing to choose from.') }}
                    </p>
                </div>

                <template v-if="custom">
                    <hr data-slot="query-sort-separator" />

                    <component :is="controls.button" kind="ghost" data-part="reset" @click="write([])">
                        <component :is="icon('reset')" v-if="icon('reset')" aria-hidden="true" />
                        {{ say('Reset') }}
                    </component>
                </template>
            </PopoverContent>
        </PopoverPortal>
    </PopoverRoot>
</template>
