import { describe, expect, it } from 'vitest';

import {
    convertValue,
    keepOnFieldChange,
    kindOf,
    operatorOptions,
    optionOfRule,
    relativeDays,
    relativeValue,
    uiOf,
} from '../catalog.js';
import { coversOneDay, dayEnd, dayOf, dayStart } from '../dates.js';
import { METADATAS } from './fixtures.js';

const fields = METADATAS.household.fields;
const ids = (options) => options.map((option) => option.id);

describe('the catalog of operators', () => {
    it('sorts the fields by kind', () => {
        expect(
            ['name', 'created_at', 'plan', 'active', 'owner', 'workspace_users'].map((name) => kindOf(fields[name]))
        ).toEqual(['text', 'datetime', 'choice', 'boolean', 'single', 'multiple']);
    });

    it('offers per kind what the server accepts, never like nor a relation compared with !=', () => {
        expect(ids(operatorOptions(METADATAS, fields.name))).not.toContain('like');
        expect(ids(operatorOptions(METADATAS, fields.name))[0]).toBe('icontains');
        expect(ids(operatorOptions(METADATAS, fields.workspace_users))).toEqual([
            'in',
            'not in',
            'is empty',
            'is not empty',
            'any',
            'not any',
        ]);
        expect(ids(operatorOptions(METADATAS, fields.owner))).toContain('between');
        expect(ids(operatorOptions(METADATAS, fields.created_at))[0]).toBe('on');
    });

    it('reads a range over one local day as « on »', () => {
        const options = operatorOptions(METADATAS, fields.created_at);
        const day = '2026-10-08';

        expect(optionOfRule(options, { operator: 'between', value: [dayStart(day), dayEnd(day)] }).id).toBe('on');
        expect(optionOfRule(options, { operator: 'between', value: [dayStart(day), dayEnd('2026-10-09')] }).id).toBe(
            'between'
        );
        expect(coversOneDay([dayStart(day), dayEnd(day)])).toBe(true);
        expect(coversOneDay([dayStart(day), 'x'])).toBe(false);
        expect(optionOfRule(options, { operator: 'between', value: [dayStart(day), 'x'] }).id).toBe('between');
        expect(dayOf(dayEnd(day))).toBe(day);
    });

    it('keeps a value across operators of the same arity, and turns one into a list of one', () => {
        const text = operatorOptions(METADATAS, fields.name);
        const by = (id) => text.find((option) => option.id === id);

        expect(convertValue('text', by('icontains'), by('starts with'), 'du')).toBe('du');
        expect(convertValue('text', by('='), by('in'), 'du')).toEqual(['du']);
        expect(convertValue('text', by('in'), by('='), ['du', 'mo'])).toBe('du');
        expect(convertValue('text', by('='), by('is empty'), 'du')).toBeUndefined();

        const dates = operatorOptions(METADATAS, fields.created_at);
        const on = dates.find((option) => option.id === 'on');
        const before = dates.find((option) => option.id === '<');

        expect(convertValue('datetime', on, before, [dayStart('2026-10-08'), dayEnd('2026-10-08')])).toBe(
            dayStart('2026-10-08')
        );
    });

    it('keeps the operator and the value of a rule moving to a field of the same kind', () => {
        expect(
            keepOnFieldChange(METADATAS, fields.name, fields.slug, { operator: 'starts with', value: 'du' })
        ).toMatchObject({
            operator: 'starts with',
            value: 'du',
        });
        expect(keepOnFieldChange(METADATAS, fields.name, fields.active, { operator: '=', value: 'du' })).toMatchObject({
            operator: 'is true',
            value: undefined,
        });
        expect(keepOnFieldChange(METADATAS, null, fields.created_at, { operator: '' })).toMatchObject({
            operator: 'between',
            ui: 'on',
        });
    });
});

describe('the days counted back from today', () => {
    const options = operatorOptions(METADATAS, fields.created_at);
    const by = (id) => options.find((option) => option.id === id);

    it('offers them on a date, written as an expression the server evaluates', () => {
        expect(ids(options)).toEqual(expect.arrayContaining(['in the last', 'more than']));
        expect(by('in the last').operator).toBe('>=');
        expect(by('more than').operator).toBe('<');
        expect(relativeValue(30)).toBe('`today(-30)`');
        expect(relativeValue(0)).toBeUndefined();
        expect(relativeDays('`today(-30)`')).toBe(30);
        expect(relativeDays('2026-10-08')).toBeNull();
    });

    it('reads a stored rule back as the option that wrote it, and a plain day as a plain operator', () => {
        expect(optionOfRule(options, { operator: '>=', value: '`today(-30)`' }).id).toBe('in the last');
        expect(optionOfRule(options, { operator: '<', value: '`today(-90)`' }).id).toBe('more than');
        expect(optionOfRule(options, { operator: '>=', value: dayStart('2026-10-08') }).id).toBe('>=');
        expect(optionOfRule(options, { operator: '>=', value: undefined, ui: 'in the last' }).id).toBe('in the last');
        expect(uiOf(by('in the last'))).toBe('in the last');
        expect(uiOf(by('>='))).toBeUndefined();
    });

    it('keeps the days from one relative option to the other, and nothing to a day', () => {
        expect(convertValue('datetime', by('in the last'), by('more than'), '`today(-30)`')).toBe('`today(-30)`');
        expect(convertValue('datetime', by('in the last'), by('<'), '`today(-30)`')).toBeUndefined();
        expect(convertValue('datetime', by('<'), by('in the last'), dayStart('2026-10-08'))).toBeUndefined();
    });
});

describe('a JSON field', () => {
    const details = {
        name: 'details',
        label: 'Details',
        type: 'json',
        filter_operators: ['contains', 'not contains', 'is empty', 'is not empty'],
    };

    it('offers what it contains, and whether it is empty', () => {
        expect(kindOf(details)).toBe('json');
        expect(ids(operatorOptions(METADATAS, details))).toEqual([
            'contains',
            'not contains',
            'is empty',
            'is not empty',
        ]);
    });
});
