<script setup>
import { computed, nextTick, ref } from 'vue';
import { formatValidationErrors } from 'vue-fastedgy';

import { injectQueryFilterContext } from '../../composables/context.js';
import { useQueryFilterControls } from '../../composables/controls.js';
import { say } from '../../labels.js';

/**
 * Keeps what the list shows as a new view, or writes it into the current one
 * when the list moved away from it. The form stays open on a refusal, which
 * shows under it.
 */
const context = injectQueryFilterContext();
const controls = useQueryFilterControls();
const views = context.views;

const saving = ref(false);
const name = ref('');
const shared = ref(true);
const error = ref('');
const field = ref(null);

const count = computed(() => context.query.count.value);
const updatable = computed(() => Boolean(views?.modified.value && views.current.value?.editable));

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

const start = async () => {
    name.value = '';
    shared.value = context.props.canShare;
    saving.value = true;
    await nextTick();
    field.value?.$el?.focus?.();
};

const save = async () => {
    const value = name.value.trim();

    if (value && (await attempt(() => views.create({ name: value, shared: context.props.canShare && shared.value })))) {
        saving.value = false;
    }
};

const update = () => attempt(() => views.save(views.current.value));
</script>

<template>
    <template v-if="views">
        <form v-if="saving" data-slot="query-filter-save" @submit.prevent="save">
            <component
                :is="controls.field"
                ref="field"
                v-model="name"
                :placeholder="say('Name of the view')"
                :aria-label="say('Name of the view')"
                @keydown.esc.prevent="saving = false"
            />
            <label v-if="context.props.canShare" data-slot="query-filter-share">
                <input v-model="shared" type="checkbox" />
                {{ say('Visible to everyone') }}
            </label>
            <component :is="controls.button" kind="primary" type="submit" :disabled="!name.trim()">{{
                say('Save')
            }}</component>
            <component :is="controls.button" kind="ghost" @click="saving = false">{{ say('Cancel') }}</component>
        </form>

        <template v-else>
            <component :is="controls.button" v-if="updatable" kind="primary" data-part="update" @click="update">
                {{ say('Update the view') }}
            </component>
            <component :is="controls.button" kind="ghost" data-part="save" :disabled="count === 0" @click="start">
                {{ say('Save as view') }}
            </component>
        </template>

        <p v-if="error" data-slot="query-filter-error" role="alert">{{ error }}</p>
    </template>
</template>
