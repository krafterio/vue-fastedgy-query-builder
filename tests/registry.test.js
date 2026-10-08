import { describe, expect, it } from 'vitest';

import { registerFilterInput, resolveFilterInput } from '../composables/registry.js';
import ChoiceInput from '../components/inputs/ChoiceInput.vue';
import DateInput from '../components/inputs/DateInput.vue';
import ListInput from '../components/inputs/ListInput.vue';
import NumberInput from '../components/inputs/NumberInput.vue';
import RangeInput from '../components/inputs/RangeInput.vue';
import RelationInput from '../components/inputs/RelationInput.vue';
import TextInput from '../components/inputs/TextInput.vue';

const rule = (kind, operator, arity, type = kind) => ({ kind, operator, arity, type });

describe('the registry of inputs', () => {
    it('gives each rule the input matching the most of what an entry declares', () => {
        expect(resolveFilterInput(rule('text', 'icontains', 'one'))).toBe(TextInput);
        expect(resolveFilterInput(rule('choice', '=', 'one'))).toBe(ChoiceInput);
        expect(resolveFilterInput(rule('text', 'in', 'list'))).toBe(ListInput);
        expect(resolveFilterInput(rule('number', 'between', 'two'))).toBe(RangeInput);
        expect(resolveFilterInput(rule('single', '=', 'one'))).toBe(RelationInput);
        expect(resolveFilterInput(rule('single', 'in', 'list'))).toBe(RelationInput);
        expect(resolveFilterInput(rule('single', '<', 'one'))).toBe(NumberInput);
        expect(resolveFilterInput(rule('single', 'between', 'two'))).toBe(RangeInput);
        expect(resolveFilterInput(rule('date', '=', 'one'))).toBe(DateInput);
        expect(resolveFilterInput(rule('date', 'between', 'two'))).toBe(RangeInput);
    });

    it('lets one list replace an input for itself alone, and an application for all', () => {
        const ProjectDate = { name: 'ProjectDate', render: () => null };
        const ListDate = { name: 'ListDate', render: () => null };

        expect(resolveFilterInput(rule('date', '=', 'one'), [[{ types: ['date'] }, ListDate]])).toBe(ListDate);

        registerFilterInput({ types: ['date'], arity: 'one' }, ProjectDate);

        expect(resolveFilterInput(rule('date', '=', 'one'))).toBe(ProjectDate);
        expect(resolveFilterInput(rule('date', 'between', 'two'))).toBe(RangeInput);
    });
});
