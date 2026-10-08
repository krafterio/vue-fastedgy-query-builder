<script setup>
import { computed, nextTick, ref } from 'vue';
import { countConditions, formatValidationErrors, parseExpression } from 'vue-fastedgy';

import { injectQueryFilterContext } from '../../composables/context.js';
import { useQueryFilterControls } from '../../composables/controls.js';
import { useQueryFilterIcons } from '../../composables/icons.js';
import { say, sayCount } from '../../labels.js';

/**
 * One custom view: applied by its name, made the user's favorite by its star,
 * and, when the user may change it, made the favorite of everyone, renamed or
 * deleted from its menu. What the server refuses shows on the row.
 */
const props = defineProps({
    view: { type: Object, required: true },
});

const context = injectQueryFilterContext();
const controls = useQueryFilterControls();
const { icon } = useQueryFilterIcons();
const views = context.views;

const current = computed(() => views.current.value?.id === props.view.id);
const favorite = computed(() => views.favorite.value === props.view.id);
const shared = computed(() => !props.view.user);
const count = computed(() => countConditions(parseExpression(props.view.filters)));

const renaming = ref(false);
const deleting = ref(false);
const name = ref('');
const error = ref('');
const field = ref(null);

const attempt = async (action) => {
    error.value = '';

    try {
        await action();

        return true;
    } catch (failure) {
        error.value = formatValidationErrors(failure);

        return false;
    }
};

const startRename = async () => {
    name.value = props.view.name;
    renaming.value = true;
    await nextTick();
    field.value?.$el?.focus?.();
};

const rename = async () => {
    if (name.value.trim() && (await attempt(() => views.rename(props.view, name.value.trim())))) {
        renaming.value = false;
    }
};

const menu = computed(() => {
    if (!props.view.editable) {
        return [];
    }

    return [
        ...(shared.value
            ? [
                  {
                      label: props.view.is_default
                          ? say('No longer the favorite for everyone')
                          : say('Favorite for everyone'),
                      onSelect: () => attempt(() => views.setDefault(props.view, !props.view.is_default)),
                  },
              ]
            : []),
        { label: say('Rename'), onSelect: startRename },
        { label: say('Delete'), kind: 'danger', onSelect: () => (deleting.value = true) },
    ];
});
</script>

<template>
    <li
        data-slot="query-filter-view"
        :data-current="current ? '' : undefined"
        :data-modified="current && views.modified.value ? '' : undefined"
    >
        <form v-if="renaming" data-slot="query-filter-rename" @submit.prevent="rename">
            <component
                :is="controls.field"
                ref="field"
                v-model="name"
                :aria-label="say('Name of the view')"
                @keydown.esc.prevent="renaming = false"
            />
            <component :is="controls.button" kind="primary" type="submit">{{ say('Save') }}</component>
            <component :is="controls.button" kind="ghost" @click="renaming = false">{{ say('Cancel') }}</component>
        </form>

        <div v-else-if="deleting" data-slot="query-filter-confirm" role="alert">
            <span>{{ say('Delete the view “{name}”?', { name: view.name }) }}</span>
            <component
                :is="controls.button"
                kind="danger"
                data-part="confirm"
                @click="attempt(() => views.remove(view))"
            >
                {{ say('Delete') }}
            </component>
            <component :is="controls.button" kind="ghost" data-part="cancel" @click="deleting = false">
                {{ say('Cancel') }}
            </component>
        </div>

        <template v-else>
            <component :is="controls.button" kind="ghost" data-part="apply" @click="views.apply(view)">
                <span data-slot="query-filter-view-name">{{ view.name }}</span>
                <span v-if="current && views.modified.value" data-slot="query-filter-view-modified">{{
                    say('modified')
                }}</span>
            </component>
            <span data-slot="query-filter-view-meta">
                <component :is="icon('private')" v-if="!shared && icon('private')" :aria-label="say('Private')" />
                <span v-else-if="!shared" data-slot="query-filter-view-private">{{ say('Private') }}</span>
                <span v-if="view.is_default" data-slot="query-filter-view-default">{{ say('For everyone') }}</span>
                <span data-slot="query-filter-view-count">{{
                    sayCount(count, '{count} filter', '{count} filters')
                }}</span>
            </span>
            <span data-slot="query-filter-view-actions">
                <component
                    :is="controls.button"
                    kind="ghost"
                    data-part="favorite"
                    :data-state="favorite ? 'on' : 'off'"
                    :aria-pressed="favorite"
                    :aria-label="say('My favorite')"
                    @click="attempt(() => views.setFavorite(view, !favorite))"
                >
                    <component :is="icon('favorite')" v-if="icon('favorite')" aria-hidden="true" />
                    <template v-else>{{ favorite ? '★' : '☆' }}</template>
                </component>
                <component :is="controls.menu" v-if="menu.length > 0" :items="menu" :label="say('More actions')">
                    <template v-if="icon('more')" #trigger
                        ><component :is="icon('more')" aria-hidden="true"
                    /></template>
                </component>
            </span>
        </template>

        <p v-if="error" data-slot="query-filter-error" role="alert">{{ error }}</p>
    </li>
</template>
