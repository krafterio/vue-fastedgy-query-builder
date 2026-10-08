import { addLocaleMessages, t } from 'vue-fastedgy';

import { de } from './locales/de.js';
import { es } from './locales/es.js';
import { fr } from './locales/fr.js';
import { it } from './locales/it.js';

// Handed over at import time, and merged the moment an application names its
// i18n: a key the application already translates keeps its own wording.
addLocaleMessages({ de, es, fr, it });

/**
 * A text of the query builder in the language of the application, the English
 * text being the key. Its values are filled in here when no i18n did it: an
 * application without one still reads « 2 filters ».
 *
 * @param {string} key
 * @param {Record<string, unknown>} [named]
 * @returns {string}
 */
export const say = (key, named) => {
    const text = t(key, named);

    return named ? text.replace(/\{(\w+)\}/g, (match, name) => (name in named ? String(named[name]) : match)) : text;
};

/**
 * One of two texts, by a count: `1 filter`, `3 filters`.
 *
 * @param {number} count
 * @param {string} one - The key for a single one, `{count}` included
 * @param {string} many - The key for several
 * @returns {string}
 */
export const sayCount = (count, one, many) => say(count === 1 ? one : many, { count });
