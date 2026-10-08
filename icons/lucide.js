import { ArrowLeft, ChevronRight, Ellipsis, ListFilter, Lock, Plus, Search, Star, X } from '@lucide/vue';

/**
 * The glyphs of the query filter in Lucide, for an application that draws with
 * it: `createQueryFilter({ icons: queryFilterLucideIcons })`.
 */
export const queryFilterLucideIcons = Object.freeze({
    filter: ListFilter,
    add: Plus,
    remove: X,
    back: ArrowLeft,
    forward: ChevronRight,
    favorite: Star,
    private: Lock,
    more: Ellipsis,
    search: Search,
    close: X,
});
