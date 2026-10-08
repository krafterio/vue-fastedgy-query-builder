<script setup>
import QueryFilterAddGroup from './parts/QueryFilterAddGroup.vue';
import QueryFilterAddRule from './parts/QueryFilterAddRule.vue';
import QueryFilterEmpty from './parts/QueryFilterEmpty.vue';
import QueryFilterGroup from './parts/QueryFilterGroup.vue';
import QueryFilterRoot from './parts/QueryFilterRoot.vue';

/**
 * The conditions alone, without button nor panel nor views, for an expression
 * edited elsewhere than over a list: `v-model:expression`.
 */
defineOptions({ inheritAttrs: false });
</script>

<template>
    <QueryFilterRoot v-bind="$attrs" inline :views="false">
        <div data-slot="query-builder">
            <QueryFilterEmpty />
            <QueryFilterGroup />
            <div data-slot="query-filter-adds">
                <QueryFilterAddRule />
                <QueryFilterAddGroup />
            </div>
        </div>
    </QueryFilterRoot>
</template>
