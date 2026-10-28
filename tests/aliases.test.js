import { enableAutoUnmount, mount } from '@vue/test-utils';
import { SelectRoot } from 'reka-ui';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import '../inputs.js';
import { aliasExpression, aliasOf, canonicalExpression, fillAlias, matchAlias, QUERY_VALUE } from '../aliases.js';
import QueryBuilder from '../components/QueryBuilder.vue';
import QueryFilter from '../components/QueryFilter.vue';
import { registerFilterAlias } from '../composables/registry.js';
import { fakeList, settle } from './fixtures.js';

vi.mock('vue-fastedgy', async (importOriginal) => {
    const original = await importOriginal();
    const { METADATAS } = await import('./fixtures.js');

    return {
        ...original,
        useMetadataStore: () => ({ getMetadatas: () => Promise.resolve(METADATAS) }),
        useApiModel: () => ({ list: vi.fn().mockResolvedValue({ data: { items: [], total: 0 } }), get: vi.fn() }),
        useStorage: () => ({ fileUrl: (path) => path }),
    };
});

enableAutoUnmount(afterEach);

const ADMIN = ['workspace_users', 'any', [['role', '=', 'admin']]];
const fresh = (value) => [
    '&',
    [
        ['created_at', '>=', value],
        ['active', 'is true'],
    ],
];

const ALIASES = [
    {
        name: 'admin',
        label: 'Has an admin',
        options: [
            { id: 'yes', label: 'yes', expression: ADMIN },
            { id: 'no', label: () => 'no', expression: ['workspace_users', 'not any', [['role', '=', 'admin']]] },
        ],
    },
    {
        name: 'fresh',
        label: 'Fresh and active',
        options: [
            {
                id: 'in the last',
                label: 'in the last',
                expression: fresh(QUERY_VALUE),
                value: { type: 'datetime', operator: '>=', option: 'in the last' },
            },
            {
                id: 'not in the last',
                label: 'not in the last',
                expression: [
                    '&',
                    [
                        ['created_at', '<', QUERY_VALUE],
                        ['active', 'is true'],
                    ],
                ],
                value: { type: 'datetime', operator: '>=', option: 'in the last' },
            },
        ],
    },
];

const body = () => document.body;
const row = (name) => body().querySelector(`[data-alias="${name}"]`);
const chipsOf = (element) =>
    [...element.querySelectorAll('[data-part="field"], [data-part="operator"]')].map((one) => one.textContent.trim());

function edit(expression) {
    const written = [];
    const wrapper = mount(QueryBuilder, {
        props: { model: 'household', expression, 'onUpdate:expression': (value) => written.push(value) },
        attachTo: body(),
    });

    return { wrapper, written };
}

beforeEach(() => {
    body().innerHTML = '';
    ALIASES.forEach((alias) => registerFilterAlias('household', alias));
    window.matchMedia = (query) => ({ matches: false, media: query, addEventListener() {}, removeEventListener() {} });
});

describe('the templates of an alias', () => {
    it('put the value in its place and find it back', () => {
        expect(fillAlias(fresh(QUERY_VALUE), '`today(-30)`')).toEqual(fresh('`today(-30)`'));
        expect(matchAlias(fresh(QUERY_VALUE), fresh('`today(-30)`'))).toEqual({ value: '`today(-30)`' });
        expect(matchAlias(fresh(QUERY_VALUE), ['created_at', '>=', '`today(-30)`'])).toBeNull();
        expect(matchAlias(ADMIN, ADMIN)).toEqual({ value: undefined });
    });

    it('read a sub-filter of one rule, a list and a flat group as the conditions write them', () => {
        expect(canonicalExpression(['workspace_users', 'any', [['role', '=', 'admin']]])).toEqual([
            'workspace_users',
            'any',
            ['role', '=', 'admin'],
        ]);
        expect(
            canonicalExpression([
                ['name', '=', 'a'],
                ['plan', '=', QUERY_VALUE],
            ])
        ).toEqual([
            '&',
            [
                ['name', '=', 'a'],
                ['plan', '=', QUERY_VALUE],
            ],
        ]);
        expect(canonicalExpression(['|', ['name', '=', 'a'], ['name', '=', 'b']])).toEqual([
            '|',
            [
                ['name', '=', 'a'],
                ['name', '=', 'b'],
            ],
        ]);
        expect(matchAlias(ADMIN, ['workspace_users', 'any', ['role', '=', 'admin']])).toEqual({ value: undefined });
    });

    it('write nothing while the value they ask for is missing', () => {
        expect(aliasExpression(ALIASES[1].options[0], undefined)).toBeNull();
        expect(aliasExpression(ALIASES[1].options[0], '')).toBeNull();
        expect(aliasExpression(ALIASES[0].options[0], undefined)).toEqual(canonicalExpression(ADMIN));
    });

    it('say which alias and which option an expression stands for', () => {
        expect(aliasOf(ALIASES, ['workspace_users', 'not any', [['role', '=', 'admin']]])).toEqual({
            name: 'admin',
            option: 'no',
            value: undefined,
        });
        expect(aliasOf(ALIASES, ['workspace_users', 'any', [['role', '=', 'member']]])).toBeNull();
    });
});

describe('an alias in the conditions', () => {
    it('reads an expression back as its alias, among the other rows, and writes nothing for it', async () => {
        const { written } = edit(['&', [ADMIN, ['name', 'icontains', 'du']]]);

        await settle();

        expect(chipsOf(row('admin'))).toEqual(['Has an admin', 'yes']);
        expect(body().querySelectorAll('[data-slot="query-filter-rule"]')).toHaveLength(2);
        expect(written).toEqual([]);
    });

    it('reads the whole expression as an alias, and shows its value in the input of its type', async () => {
        const { written } = edit(fresh('`today(-30)`'));

        await settle();

        const input = row('fresh').querySelector('input');

        expect(input.value).toBe('30');

        input.value = '45';
        input.dispatchEvent(new Event('input'));
        input.dispatchEvent(new Event('blur'));
        await settle();

        expect(written.at(-1)).toEqual(fresh('`today(-45)`'));
    });

    it('keeps the value across options typed alike, and writes the expression of the other one', async () => {
        const { wrapper, written } = edit(fresh('`today(-30)`'));

        await settle();
        wrapper
            .findAllComponents(SelectRoot)
            .find((select) => select.props('modelValue') === 'in the last')
            .vm.$emit('update:modelValue', 'not in the last');
        await settle();

        expect(written.at(-1)).toEqual([
            '&',
            [
                ['created_at', '<', '`today(-30)`'],
                ['active', 'is true'],
            ],
        ]);
    });

    it('is offered first in the field picker, and once chosen writes its expression', async () => {
        const { written } = edit(null);

        await settle();
        [...body().querySelectorAll('button')].find((button) => button.textContent.trim() === 'Add a filter').click();
        await settle();

        const items = [...body().querySelectorAll('[data-slot="query-filter-field-item"]')].map((item) =>
            item.textContent.trim()
        );

        expect(items.slice(0, 2)).toEqual(['Has an admin', 'Fresh and active']);

        [...body().querySelectorAll('[data-slot="query-filter-field-item"]')]
            .find((item) => item.textContent.trim() === 'Has an admin')
            .click();
        await settle();

        expect(written.at(-1)).toEqual(canonicalExpression(ADMIN));
    });

    it('turns back into a rule when a field is chosen in its place', async () => {
        const { written } = edit(ADMIN);

        await settle();
        row('admin').querySelector('[data-part="field"]').click();
        await settle();
        [...body().querySelectorAll('[data-slot="query-filter-field-item"]')]
            .find((item) => item.textContent.trim() === 'Active')
            .click();
        await settle();

        expect(row('admin')).toBeNull();
        expect(written.at(-1)).toEqual(['active', 'is true']);
    });
});

describe('an alias as a chip', () => {
    it('says the alias, its option and its days', async () => {
        const list = fakeList(['&', [ADMIN, fresh('`today(-30)`')]]);

        mount(QueryFilter, { props: { model: 'household', list, views: false, chips: true }, attachTo: body() });
        await settle();

        expect(
            [...body().querySelectorAll('[data-slot="query-filter-applied"] [data-part="open"]')].map((one) =>
                one.textContent.trim()
            )
        ).toEqual(['Has an admin yes', 'Fresh and active in the last 30 days']);
    });
});
