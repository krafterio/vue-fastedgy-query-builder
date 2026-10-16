import { enableAutoUnmount, mount } from '@vue/test-utils';
import { ListboxRoot, SelectRoot } from 'reka-ui';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { computed, defineComponent, h, reactive, ref } from 'vue';
import { defineQuickFilter } from 'vue-fastedgy';

import '../inputs.js';
import QueryBuilder from '../components/QueryBuilder.vue';
import QueryFilter from '../components/QueryFilter.vue';
import QueryGroupBy from '../components/QueryGroupBy.vue';
import QuerySort from '../components/QuerySort.vue';
import { fakeList, settle } from './fixtures.js';

const fakes = vi.hoisted(() => ({ views: null, reader: null }));

vi.mock('vue-fastedgy', async (importOriginal) => {
    const original = await importOriginal();
    const { METADATAS } = await import('./fixtures.js');

    return {
        ...original,
        useMetadataStore: () => ({ getMetadatas: () => Promise.resolve(METADATAS) }),
        useCustomViews: () => fakes.views,
        useApiModel: () => fakes.reader,
        useStorage: () => ({ fileUrl: (path) => path }),
    };
});

enableAutoUnmount(afterEach);

const body = () => document.body;
const buttonOf = (text) => [...body().querySelectorAll('button')].find((button) => button.textContent.trim() === text);
const chips = () =>
    [...body().querySelectorAll('[data-slot="query-filter-chip"]')].map((chip) => chip.textContent.trim());
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const fieldLabels = () =>
    [...body().querySelectorAll('[data-slot="query-filter-field-item"]')].map((item) => item.textContent.trim());
const forwardOf = (label) =>
    [...body().querySelectorAll('[data-slot="query-filter-field-entry"]')]
        .find((entry) => entry.querySelector('[data-slot="query-filter-field-item"]').textContent.trim() === label)
        .querySelector('[data-part="forward"]');

const views = (items = []) => {
    const list = ref(items);
    const favorite = ref(null);
    const current = ref(null);

    return {
        items: list,
        favorite: computed(() => favorite.value),
        current: computed(() => current.value),
        modified: ref(false),
        ensure: vi.fn().mockResolvedValue(undefined),
        apply: vi.fn(),
        create: vi.fn().mockResolvedValue({}),
        save: vi.fn().mockResolvedValue(undefined),
        rename: vi.fn().mockResolvedValue(undefined),
        remove: vi.fn().mockResolvedValue(undefined),
        setDefault: vi.fn().mockResolvedValue(undefined),
        setFavorite: vi.fn(async (view, on) => (favorite.value = on ? view.id : null)),
    };
};

const open = async (wrapper) => {
    await settle();
    await wrapper.find('[data-part="trigger"]').trigger('click');
    await settle();
};

beforeEach(() => {
    body().innerHTML = '';
    fakes.views = views();
    fakes.reader = {
        list: vi.fn().mockResolvedValue({
            data: { items: [{ id: 7, name: 'Member', email: 'member@example.com' }], total: 1 },
        }),
        get: vi.fn(),
    };
    window.matchMedia = (query) => ({ matches: false, media: query, addEventListener() {}, removeEventListener() {} });
});

describe('the query filter of a list', () => {
    it('adds a condition, opens its field at once, and writes the expression once the typing pauses', async () => {
        const list = fakeList();
        const wrapper = mount(QueryFilter, { props: { model: 'household', list, views: false }, attachTo: body() });

        await open(wrapper);
        expect(body().textContent).toContain('No filter. Add a condition to narrow the list.');

        buttonOf('Add a filter').click();
        await settle();

        const name = [...body().querySelectorAll('[data-slot="query-filter-field-item"]')].find(
            (item) => item.textContent.trim() === 'Name'
        );
        name.click();
        await settle();

        expect(chips()).toEqual(expect.arrayContaining(['Name', 'contains']));

        const input = body().querySelector('[data-slot="query-filter-rule"] input[type="text"]');
        input.value = 'du';
        input.dispatchEvent(new Event('input'));
        await wait(350);

        expect(list.expression.value).toEqual(['name', 'icontains', 'du']);
        expect(wrapper.find('[data-slot="query-filter-count"]').text()).toBe('1');
    });

    it('walks into a relation by its chevron, and finds a deeper field from the top when asked to', async () => {
        const list = fakeList();
        const wrapper = mount(QueryFilter, {
            props: { model: 'household', list, views: false, deepFieldSearch: true },
            attachTo: body(),
        });

        await open(wrapper);
        buttonOf('Add a filter').click();
        await settle();

        const filter = body().querySelector('[data-slot="query-filter-fields"] input');
        filter.value = 'mail';
        filter.dispatchEvent(new Event('input'));
        await settle();

        const found = [...body().querySelectorAll('[data-slot="query-filter-field-item"]')].map((item) =>
            item.textContent.trim()
        );
        expect(found).toEqual(['Owner › Email']);

        filter.value = '';
        filter.dispatchEvent(new Event('input'));
        await settle();

        const owner = [...body().querySelectorAll('[data-slot="query-filter-field-entry"]')].find((entry) =>
            entry.textContent.includes('Owner')
        );
        owner.querySelector('[data-part="forward"]').click();
        await settle();

        expect(body().querySelector('[data-slot="query-filter-crumbs"]').textContent.trim()).toBe('Household › Owner');

        const email = [...body().querySelectorAll('[data-slot="query-filter-field-item"]')].find(
            (item) => item.textContent.trim() === 'Email'
        );
        email.click();
        await settle();

        expect(chips()).toContain('Owner › Email');
    });

    it('never offers the way back through the relation just walked', async () => {
        const wrapper = mount(QueryFilter, {
            props: { model: 'household', list: fakeList(), views: false },
            attachTo: body(),
        });

        await open(wrapper);
        buttonOf('Add a filter').click();
        await settle();

        expect(fieldLabels()).toEqual(expect.arrayContaining(['Owner', 'Members']));

        forwardOf('Owner').click();
        await settle();
        expect(fieldLabels()).toEqual(['Email', 'Name']);

        body().querySelector('[data-part="back"]').click();
        await settle();
        forwardOf('Members').click();
        await settle();
        expect(fieldLabels()).toEqual(['Role', 'User']);
    });

    it('nor the way back through the relation of the block a condition sits in', async () => {
        const list = fakeList(['workspace_users', 'any', null]);
        const wrapper = mount(QueryFilter, { props: { model: 'household', list, views: false }, attachTo: body() });

        await open(wrapper);
        body().querySelector('[data-slot="query-filter-block"] [data-part="add-rule"]').click();
        await settle();

        expect(fieldLabels()).toEqual(['Role', 'User']);
    });

    it('draws the quick filters of the list before its button, on the values the list applies', async () => {
        const Toggle = defineComponent({
            props: ['modelValue', 'label'],
            emits: ['update:modelValue'],
            setup:
                (props, { emit }) =>
                () =>
                    h(
                        'button',
                        { 'data-test': 'closed', onClick: () => emit('update:modelValue', !props.modelValue) },
                        `${props.label}: ${props.modelValue}`
                    ),
        });
        const closed = defineQuickFilter({ name: 'closed', default: false, filter: () => null }, Toggle, {
            label: 'Closed',
        });
        const list = { ...fakeList(), quick: reactive({ closed: true }), quickFilters: [closed] };
        const wrapper = mount(QueryFilter, { props: { model: 'household', list, views: false }, attachTo: body() });

        await settle();

        const toggle = wrapper.find('[data-test="closed"]');
        const trigger = wrapper.find('[data-part="trigger"]');

        expect(toggle.text()).toBe('Closed: true');
        expect(toggle.element.compareDocumentPosition(trigger.element) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();

        await toggle.trigger('click');

        expect(list.quick.closed).toBe(false);
    });

    it('turns a relation into a block « at least one that… », written on the related model', async () => {
        const list = fakeList(['workspace_users', 'in', [3]]);
        const wrapper = mount(QueryFilter, { props: { model: 'household', list, views: false }, attachTo: body() });

        await open(wrapper);

        const operator = wrapper.findAllComponents(SelectRoot)[0];
        operator.vm.$emit('update:modelValue', 'any');
        await settle();

        expect(body().textContent).toContain('Members: at least one that…');
        expect(list.expression.value).toEqual(['workspace_users', 'any', null]);
    });

    it('reads a relation and its key as one field, and reads its chosen record back', async () => {
        const list = fakeList(['owner.id', '=', 7]);
        const wrapper = mount(QueryFilter, { props: { model: 'household', list, views: false }, attachTo: body() });

        await open(wrapper);

        expect(chips()).toEqual(expect.arrayContaining(['Owner', 'is']));
        expect(fakes.reader.list).toHaveBeenCalledWith(
            expect.objectContaining({ filter: ['id', 'in', [7]], limit: 1 })
        );
    });

    it('keeps a rule the metadata does not describe, read only, and counts it', async () => {
        const list = fakeList(['secret', 'like', '%x%']);
        const wrapper = mount(QueryFilter, { props: { model: 'household', list, views: false }, attachTo: body() });

        await open(wrapper);

        expect(body().querySelector('[data-slot="query-filter-raw"]').textContent).toBe('["secret","like","%x%"]');
        expect(wrapper.find('[data-slot="query-filter-count"]').text()).toBe('1');
        expect(list.expression.value).toEqual(['secret', 'like', '%x%']);
    });

    it('says the joint above the conditions when asked, the rows then saying nothing before them', async () => {
        const nested = [
            '|',
            [
                ['active', 'is true'],
                ['plan', '=', 'plus'],
            ],
        ];
        const list = fakeList(['&', [['name', 'icontains', 'du'], nested]]);
        const wrapper = mount(QueryFilter, {
            props: { model: 'household', list, views: false, jointAbove: true },
            attachTo: body(),
        });

        await open(wrapper);

        const heading = body().querySelector('[data-slot="query-filter-heading"]');
        const group = body().querySelector('[data-slot="query-filter-group"][data-nested]');

        expect(heading.querySelector('[data-slot="query-filter-title"]').textContent).toBe('Filters');
        expect(heading.querySelector('[data-slot="query-filter-matching"]').textContent).toBe('Households matching');
        expect(heading.querySelector('[data-part="joint"]').textContent.trim()).toBe('all conditions');
        expect(body().querySelector('[data-slot="query-filter-lead"]')).toBeNull();
        expect(
            group.querySelector('[data-slot="query-filter-group-header"] [data-part="joint"]').textContent.trim()
        ).toBe('at least one condition');
        expect(
            group.querySelector('[data-slot="query-filter-group-header"] [data-part="remove-group"]')
        ).not.toBeNull();

        const root = wrapper.findAllComponents(SelectRoot).find((select) => select.props('modelValue') === '&');
        root.vm.$emit('update:modelValue', '|');
        await settle();

        expect(list.expression.value).toEqual(['|', [['name', 'icontains', 'du'], nested]]);
    });

    it('says only its title over no condition, the joint coming with the first one', async () => {
        const wrapper = mount(QueryFilter, {
            props: { model: 'household', list: fakeList(), views: false, jointAbove: true },
            attachTo: body(),
        });

        await open(wrapper);

        const heading = () => body().querySelector('[data-slot="query-filter-heading"]');

        expect(heading().textContent.trim()).toBe('Filters');
        expect(heading().querySelector('[data-part="joint"]')).toBeNull();

        buttonOf('Add a filter').click();
        await settle();

        expect(heading().querySelector('[data-part="joint"]').textContent.trim()).toBe('all conditions');
    });

    it('lists the views, applies one, marks the favorite, and shows what the server refuses', async () => {
        fakes.views = views([
            { id: 1, name: 'Premium', user: null, is_default: true, editable: true, filters: ['plan', '=', 'plus'] },
            { id: 2, name: 'Mine', user: { id: 5 }, is_default: false, editable: true, filters: null },
        ]);
        fakes.views.create.mockRejectedValue({ data: { detail: 'A view of this list already has this name' } });
        const list = fakeList(['active', 'is true']);
        const wrapper = mount(QueryFilter, { props: { model: 'household', list }, attachTo: body() });

        await open(wrapper);

        expect(fakes.views.ensure).toHaveBeenCalled();
        expect(body().textContent).toContain('For everyone');
        expect(body().textContent).toContain('1 filter');

        [...body().querySelectorAll('[data-part="apply"]')][0].click();
        expect(fakes.views.apply).toHaveBeenCalledWith(expect.objectContaining({ id: 1 }));

        [...body().querySelectorAll('[data-part="favorite"]')][1].click();
        await settle();
        expect(fakes.views.setFavorite).toHaveBeenCalledWith(expect.objectContaining({ id: 2 }), true);

        buttonOf('Save as view').click();
        await settle();

        const name = body().querySelector('[data-slot="query-filter-save"] input:not([type="checkbox"])');
        name.value = 'Premium';
        name.dispatchEvent(new Event('input'));
        await settle();
        body().querySelector('[data-slot="query-filter-save"]').dispatchEvent(new Event('submit'));
        await settle();

        expect(fakes.views.create).toHaveBeenCalledWith({ name: 'Premium', shared: true });
        expect(body().querySelector('[data-slot="query-filter-error"]').textContent).toContain('already has this name');
        expect(body().querySelector('[data-slot="query-filter-save"]')).not.toBeNull();
    });

    it('fills the screen on a narrow window, and leads to the results', async () => {
        window.matchMedia = (query) => ({
            matches: query.includes('max-width'),
            media: query,
            addEventListener() {},
            removeEventListener() {},
        });
        const wrapper = mount(QueryFilter, {
            props: { model: 'household', list: fakeList(), views: false },
            attachTo: body(),
        });

        await open(wrapper);

        expect(body().querySelector('[data-slot="query-filter-content"][data-compact]')).not.toBeNull();
        expect(buttonOf('See the 12 results')).toBeTruthy();
        expect(wrapper.find('[data-slot="query-filter-trigger-label"]').exists()).toBe(false);
    });
});

describe('the conditions as chips', () => {
    const applied = () =>
        [...body().querySelectorAll('[data-slot="query-filter-applied"] [data-part="open"]')].map((one) =>
            one.textContent.trim()
        );

    it('says each condition outside the panel, removes one by its cross, and opens the panel on a new one', async () => {
        const list = fakeList([
            '&',
            [
                ['name', 'icontains', 'du'],
                ['plan', 'in', ['plus']],
                ['owner', '=', 7],
            ],
        ]);
        mount(QueryFilter, { props: { model: 'household', list, views: false, chips: true }, attachTo: body() });

        await settle();

        expect(applied()).toEqual(['Name contains du', 'Plan: Plus', 'Owner: Member']);

        body().querySelector('[data-slot="query-filter-applied"] [data-part="remove"]').click();
        await settle();

        expect(list.expression.value).toEqual([
            '&',
            [
                ['plan', 'in', ['plus']],
                ['owner', '=', 7],
            ],
        ]);

        body().querySelector('[data-slot="query-filter-chips"] [data-part="add-rule"]').click();
        await settle();

        expect(body().querySelector('[data-slot="query-filter-content"]')).not.toBeNull();
        expect(body().querySelector('[data-slot="query-filter-picker"]')).not.toBeNull();
    });
});

describe('the order of a list', () => {
    it('says its first field, adds another from its list, turns one around on a click, and resets', async () => {
        const list = { ...fakeList(), orderBy: ref(['name:asc']), defaultOrderBy: ['created_at:desc'] };
        const wrapper = mount(QuerySort, { props: { list, model: 'household' }, attachTo: body() });
        const summary = () => wrapper.find('[data-part="sort"]').attributes('aria-label');
        const terms = () => [...body().querySelectorAll('[data-slot="query-sort-term"]')];
        const offered = () =>
            [...body().querySelectorAll('[data-slot="query-sort-offered"] [data-part="add"]')].map((one) =>
                one.textContent.trim()
            );

        await settle();
        expect(summary()).toBe('Sort: Name, A → Z');
        expect(wrapper.find('[data-slot="query-sort-summary"]').text()).toBe('Name');
        expect(wrapper.find('[data-slot="query-sort-arrow"]').text()).toBe('↑');

        await wrapper.find('[data-part="sort"]').trigger('click');
        await settle();

        expect(offered()).toEqual(['Active', 'Created at', 'Plan', 'Slug']);

        const search = body().querySelector('[data-slot="query-sort-content"] [data-part="search"]');
        search.value = 'act';
        search.dispatchEvent(new Event('input'));
        await settle();
        expect(offered()).toEqual(['Active']);

        body().querySelector('[data-slot="query-sort-offered"] [data-part="add"]').click();
        await settle();
        expect(list.orderBy.value).toEqual(['name:asc', 'active:asc']);
        expect(summary()).toBe('Sort: Name, A → Z +1');
        expect(wrapper.find('[data-slot="query-sort-more"]').text()).toBe('+1');

        terms()[1].querySelector('[data-part="direction"]').click();
        await settle();
        expect(list.orderBy.value).toEqual(['name:asc', 'active:desc']);
        expect(terms()[1].querySelector('[data-slot="query-sort-direction"]').textContent).toBe('true first');

        buttonOf('Reset').click();
        await settle();
        expect(list.orderBy.value).toEqual(['created_at:desc']);
        expect(summary()).toBe('Sort: Created at, newest first');
        expect(wrapper.find('[data-slot="query-sort-arrow"]').text()).toBe('↓');
        expect(buttonOf('Reset')).toBeUndefined();
    });

    it('moves a field by its handle, with the arrow keys or dragged, and goes back to the default without any', async () => {
        const list = { ...fakeList(), orderBy: ref(['name:asc', 'plan:desc', 'slug:asc']) };
        mount(QuerySort, { props: { list, model: 'household' }, attachTo: body() });
        const handles = () => [...body().querySelectorAll('[data-slot="query-sort-term"] [data-part="handle"]')];

        await settle();
        document.querySelector('[data-part="sort"]').click();
        await settle();

        handles()[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
        await settle();
        expect(list.orderBy.value).toEqual(['plan:desc', 'name:asc', 'slug:asc']);

        const transfer = { setData() {}, setDragImage() {}, effectAllowed: '' };
        const dragStart = new Event('dragstart');
        dragStart.dataTransfer = transfer;
        handles()[2].dispatchEvent(dragStart);
        body().querySelectorAll('[data-slot="query-sort-term"]')[0].dispatchEvent(new Event('drop'));
        await settle();
        expect(list.orderBy.value).toEqual(['slug:asc', 'plan:desc', 'name:asc']);

        for (const remove of body().querySelectorAll('[data-slot="query-sort-term"] [data-part="remove"]')) {
            remove.click();
            await settle();
        }

        expect(list.orderBy.value).toBeNull();
        expect(body().querySelector('[data-slot="query-sort-default"]')).not.toBeNull();
    });

    it('names a field the way the screen does', async () => {
        const list = { ...fakeList(), orderBy: ref(['owner.name:desc']) };
        const wrapper = mount(QuerySort, {
            props: { list, model: 'household', fields: [{ path: 'owner.name', label: 'Owner' }] },
            attachTo: body(),
        });

        await settle();

        expect(wrapper.find('[data-part="sort"]').attributes('aria-label')).toBe('Sort: Owner, Z → A');
        expect(wrapper.find('[data-slot="query-sort-summary"]').text()).toBe('Owner');
    });
});

describe('the grouping of a list', () => {
    it('groups by a field the list offers, searched by its name, then by none', async () => {
        const list = {
            groupBy: ref(null),
            groupableFields: computed(() => [
                { name: 'plan', label: 'Plan' },
                { name: 'active', label: 'Active' },
            ]),
        };
        const wrapper = mount(QueryGroupBy, { props: { list }, attachTo: body() });
        const summary = () => wrapper.find('[data-slot="query-group-summary"]').text();
        const items = () => [...body().querySelectorAll('[data-slot="query-group-item"]')];
        const labels = () => items().map((item) => item.querySelector('[data-slot="query-group-label"]').textContent);
        const pick = async (label) => {
            await wrapper.find('[data-part="group-by"]').trigger('click');
            await settle();
            items()
                .find((item) => item.textContent.includes(label))
                .click();
            await settle();
        };

        expect(summary()).toBe('None');

        await wrapper.find('[data-part="group-by"]').trigger('click');
        await settle();
        expect(labels()).toEqual(['No group', 'Plan', 'Active']);

        const search = body().querySelector('[data-slot="query-group-content"] [data-part="search"]');
        search.value = 'pla';
        search.dispatchEvent(new Event('input'));
        await settle();
        expect(labels()).toEqual(['Plan']);

        items()[0].click();
        await settle();
        expect(list.groupBy.value).toBe('plan');
        expect(summary()).toBe('Plan');
        expect(wrapper.find('[data-part="group-by"]').attributes('data-active')).toBe('');

        await pick('No group');
        expect(list.groupBy.value).toBeNull();
        expect(wrapper.find('[data-part="group-by"]').attributes('data-active')).toBeUndefined();
    });

    it('draws nothing for a list with no field to group by', () => {
        const list = { groupBy: ref(null), groupableFields: computed(() => []) };

        expect(mount(QueryGroupBy, { props: { list } }).find('[data-part="group-by"]').exists()).toBe(false);
    });
});

describe('the conditions alone', () => {
    it('take the input a list gives them in place of the package one', async () => {
        const ProjectDays = defineComponent({
            props: ['modelValue'],
            render: () => h('span', { 'data-test': 'project-days' }),
        });
        const expression = ref(['created_at', '>', '2026-10-08T00:00:00.000Z']);

        const wrapper = mount(QueryBuilder, {
            props: {
                model: 'household',
                expression: expression.value,
                'onUpdate:expression': (value) => (expression.value = value),
                inputs: [[{ kinds: ['datetime'] }, ProjectDays]],
            },
            attachTo: body(),
        });

        await settle();

        expect(wrapper.find('[data-test="project-days"]').exists()).toBe(true);
        expect(wrapper.findComponent(ListboxRoot).exists()).toBe(false);
    });
});
