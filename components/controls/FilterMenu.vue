<script setup>
import {
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuPortal,
    DropdownMenuRoot,
    DropdownMenuTrigger,
} from 'reka-ui';

/**
 * The actions of one thing, behind a button: `items` are `{ label, onSelect,
 * kind }`, in the order offered.
 */
defineProps({
    label: { type: String, default: '' },
    items: { type: Array, default: () => [] },
});
</script>

<template>
    <DropdownMenuRoot>
        <DropdownMenuTrigger data-slot="query-filter-menu" :aria-label="label || undefined">
            <slot name="trigger">⋯</slot>
        </DropdownMenuTrigger>

        <DropdownMenuPortal>
            <DropdownMenuContent data-slot="query-filter-menu-content" align="end" :side-offset="4">
                <DropdownMenuItem
                    v-for="item in items"
                    :key="item.label"
                    data-slot="query-filter-menu-item"
                    :data-kind="item.kind || 'neutral'"
                    :disabled="item.disabled"
                    @select="item.onSelect?.()"
                >
                    {{ item.label }}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenuPortal>
    </DropdownMenuRoot>
</template>
