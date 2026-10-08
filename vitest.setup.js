import { config } from '@vue/test-utils';
import { createPinia } from 'pinia';
import { createFetcher } from 'vue-fastedgy';

/** The fetcher and a store, installed as an application installs them. */
config.global.plugins = [createFetcher(), createPinia()];

/** jsdom draws nothing, so nothing ever comes into sight or changes size. */
globalThis.IntersectionObserver ??= class {
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() {
        return [];
    }
};

globalThis.ResizeObserver ??= class {
    observe() {}
    unobserve() {}
    disconnect() {}
};

/** No media query matches unless a test says one does. */
window.matchMedia ??= (query) => ({
    matches: false,
    media: query,
    addEventListener() {},
    removeEventListener() {},
});

/** What reka asks of a pointer and of an element jsdom does not implement. */
const missing = { hasPointerCapture: () => false, releasePointerCapture: () => {}, scrollIntoView: () => {} };

for (const [name, value] of Object.entries(missing)) {
    if (!(name in Element.prototype)) {
        Object.defineProperty(Element.prototype, name, { value, configurable: true, writable: true });
    }
}
