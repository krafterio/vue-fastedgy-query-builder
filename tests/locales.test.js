import { describe, expect, it } from 'vitest';

import { de } from '../locales/de.js';
import { es } from '../locales/es.js';
import { fr } from '../locales/fr.js';
import { it as italian } from '../locales/it.js';

const valuesOf = (text) => [...text.matchAll(/\{(\w+)\}/g)].map(([, name]) => name).sort((a, b) => a.localeCompare(b));

describe('locales', () => {
    it('say every word of the package in every language it ships, with the values the key carries', () => {
        for (const words of [de, es, fr, italian]) {
            expect(Object.keys(words).sort()).toEqual(Object.keys(fr).sort());

            for (const [key, text] of Object.entries(words)) {
                expect(valuesOf(text), key).toEqual(valuesOf(key));
            }
        }
    });
});
