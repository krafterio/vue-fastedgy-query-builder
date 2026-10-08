<script setup>
import { ScrollAreaRoot, ScrollAreaScrollbar, ScrollAreaThumb, ScrollAreaViewport } from 'reka-ui';

/**
 * What scrolls in a query filter: the scroll area of reka, its bar drawn by
 * the stylesheet over the native scrolling, which the wheel, a finger and the
 * keyboard keep using. Its height is capped by `--fe-qb-scroll-height`, or
 * given by the panel it fills.
 */
</script>

<template>
    <ScrollAreaRoot data-slot="query-filter-scroll">
        <ScrollAreaViewport data-slot="query-filter-scroll-viewport">
            <slot />
        </ScrollAreaViewport>
        <ScrollAreaScrollbar orientation="vertical" data-slot="query-filter-scrollbar">
            <ScrollAreaThumb data-slot="query-filter-scroll-thumb" />
        </ScrollAreaScrollbar>
    </ScrollAreaRoot>
</template>
