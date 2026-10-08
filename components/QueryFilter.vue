<script setup>
import QueryFilterAddGroup from './parts/QueryFilterAddGroup.vue';
import QueryFilterAddRule from './parts/QueryFilterAddRule.vue';
import QueryFilterClear from './parts/QueryFilterClear.vue';
import QueryFilterContent from './parts/QueryFilterContent.vue';
import QueryFilterEmpty from './parts/QueryFilterEmpty.vue';
import QueryFilterGroup from './parts/QueryFilterGroup.vue';
import QueryFilterRoot from './parts/QueryFilterRoot.vue';
import QueryFilterSave from './parts/QueryFilterSave.vue';
import QueryFilterTrigger from './parts/QueryFilterTrigger.vue';
import QueryFilterViews from './parts/QueryFilterViews.vue';

/**
 * The default assembly of the parts: the button, then the panel with the views,
 * the conditions, the additions and the footer. Every prop and model of the
 * root goes through; a project wanting another layout composes the parts.
 */
defineOptions({ inheritAttrs: false });
</script>

<template>
    <QueryFilterRoot v-bind="$attrs">
        <QueryFilterTrigger />
        <QueryFilterContent>
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
