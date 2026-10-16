<script setup>
import QueryFilterAddGroup from './parts/QueryFilterAddGroup.vue';
import QueryFilterAddRule from './parts/QueryFilterAddRule.vue';
import QueryFilterChips from './parts/QueryFilterChips.vue';
import QueryFilterClear from './parts/QueryFilterClear.vue';
import QueryFilterContent from './parts/QueryFilterContent.vue';
import QueryFilterEmpty from './parts/QueryFilterEmpty.vue';
import QueryFilterGroup from './parts/QueryFilterGroup.vue';
import QueryFilterHeader from './parts/QueryFilterHeader.vue';
import QueryFilterQuickFilters from './parts/QueryFilterQuickFilters.vue';
import QueryFilterRoot from './parts/QueryFilterRoot.vue';
import QueryFilterSave from './parts/QueryFilterSave.vue';
import QueryFilterTrigger from './parts/QueryFilterTrigger.vue';
import QueryFilterViews from './parts/QueryFilterViews.vue';

/**
 * The default assembly of the parts: the quick filters of the list, the button,
 * the conditions as chips when asked, then the panel with its header, the views, the conditions, the additions and
 * the footer. Every prop and model of the root goes through; a project wanting another layout composes the parts.
 */
defineOptions({ inheritAttrs: false });

defineProps({
    /** Whether the conditions show as chips after the button, outside the panel. */
    chips: { type: Boolean, default: false },
});
</script>

<template>
    <QueryFilterRoot v-bind="$attrs">
        <QueryFilterQuickFilters />
        <QueryFilterTrigger />
        <QueryFilterChips v-if="chips" />
        <QueryFilterContent>
            <QueryFilterHeader />
            <QueryFilterViews />
            <QueryFilterEmpty />
            <QueryFilterGroup />
            <div data-slot="query-filter-adds">
                <QueryFilterAddRule />
                <QueryFilterAddGroup />
            </div>
            <footer data-slot="query-filter-footer">
                <QueryFilterSave />
                <QueryFilterClear />
            </footer>
        </QueryFilterContent>
    </QueryFilterRoot>
</template>
