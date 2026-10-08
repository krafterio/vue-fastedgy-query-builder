import { enableAutoUnmount, mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import ComboPicker from '../components/internal/ComboPicker.vue';
import DateTimeInput from '../components/inputs/DateTimeInput.vue';
import ListInput from '../components/inputs/ListInput.vue';
import RangeInput from '../components/inputs/RangeInput.vue';
import RelationInput from '../components/inputs/RelationInput.vue';
import { dayEnd, dayStart } from '../dates.js';
import { METADATAS, settle } from './fixtures.js';

const fakes = vi.hoisted(() => ({ reader: null }));

vi.mock('vue-fastedgy', async (importOriginal) => ({
    ...(await importOriginal()),
    useApiModel: () => fakes.reader,
    useStorage: () => ({ fileUrl: (path) => path }),
}));

enableAutoUnmount(afterEach);

const fields = METADATAS.household.fields;

beforeEach(() => {
    document.body.innerHTML = '';
    fakes.reader = { list: vi.fn().mockResolvedValue({ data: { items: [], total: 0 } }), get: vi.fn() };
});

describe('the inputs of the package', () => {
    it('writes a datetime picked on a day as the whole of that local day', async () => {
        const wrapper = mount(DateTimeInput, {
            props: {
                field: fields.created_at,
                kind: 'datetime',
                operator: 'between',
                arity: 'two',
                option: { id: 'on', operator: 'between' },
            },
        });

        await wrapper.find('input').setValue('2026-10-08');

        expect(wrapper.emitted('update:modelValue').at(-1)[0]).toEqual([dayStart('2026-10-08'), dayEnd('2026-10-08')]);
    });

    it('keeps the first day of a range until the second one is picked', async () => {
        const wrapper = mount(DateTimeInput, {
            props: {
                field: fields.created_at,
                kind: 'datetime',
                operator: 'between',
                arity: 'two',
                option: { id: 'between', operator: 'between' },
            },
        });
        const [start, end] = wrapper.findAll('input');

        await start.setValue('2026-10-01');
        expect(wrapper.emitted('update:modelValue')).toBeUndefined();

        await end.setValue('2026-10-08');
        expect(wrapper.emitted('update:modelValue').at(-1)[0]).toEqual([dayStart('2026-10-01'), dayEnd('2026-10-08')]);
    });

    it('writes both ends of a range of numbers once typed in', async () => {
        const wrapper = mount(RangeInput, {
            props: { field: fields.id, kind: 'number', operator: 'between', arity: 'two' },
        });
        const [start, end] = wrapper.findAll('input');

        await start.setValue('10');
        await end.setValue('20');
        await end.trigger('blur');

        expect(wrapper.emitted('update:modelValue').at(-1)[0]).toEqual([10, 20]);
    });

    it('reads a list of numbers as numbers', () => {
        const wrapper = mount(ListInput, {
            props: { modelValue: [1, 2], field: fields.id, kind: 'number', operator: 'in', arity: 'list' },
        });

        wrapper.findComponent({ name: 'TagsInputRoot' }).vm.$emit('update:modelValue', ['1', '2', '3', 'x']);

        expect(wrapper.emitted('update:modelValue')[0][0]).toEqual([1, 2, 3]);
    });

    it('says when a chosen record is gone, and reads the next page when the list end comes into sight', async () => {
        const wrapper = mount(RelationInput, {
            props: {
                modelValue: [9],
                field: fields.owner,
                kind: 'single',
                operator: 'in',
                arity: 'list',
                context: { metadatas: METADATAS },
            },
            attachTo: document.body,
        });

        await settle();

        expect(fakes.reader.list).toHaveBeenCalledWith(expect.objectContaining({ filter: ['id', 'in', [9]] }));
        expect(wrapper.text()).toContain('#9 not found');

        let seen = null;
        globalThis.IntersectionObserver = class {
            constructor(callback) {
                seen = callback;
            }
            observe() {}
            disconnect() {}
        };

        const picker = mount(ComboPicker, {
            props: { items: [{ value: 1, label: 'One' }], hasMore: true, labelOf: String },
            attachTo: document.body,
        });
        await picker.find('[data-slot="query-filter-combobox-trigger"]').trigger('click');
        await settle();

        seen?.([{ isIntersecting: true }]);

        expect(picker.emitted('more')).toBeTruthy();
    });
});
