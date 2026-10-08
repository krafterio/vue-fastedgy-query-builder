import ChoiceInput from './components/inputs/ChoiceInput.vue';
import DateInput from './components/inputs/DateInput.vue';
import DateTimeInput from './components/inputs/DateTimeInput.vue';
import ListInput from './components/inputs/ListInput.vue';
import NumberInput from './components/inputs/NumberInput.vue';
import RangeInput from './components/inputs/RangeInput.vue';
import ReferenceInput from './components/inputs/ReferenceInput.vue';
import RelationInput from './components/inputs/RelationInput.vue';
import TextInput from './components/inputs/TextInput.vue';
import TimeInput from './components/inputs/TimeInput.vue';

/**
 * The package's own inputs, read by the registry before any an application
 * registers, which replace them for the rules they match.
 */
export const defaultFilterInputs = [
    [{ kinds: ['text'] }, TextInput],
    [{ kinds: ['number'] }, NumberInput],
    [{ kinds: ['date'] }, DateInput],
    [{ kinds: ['time'] }, TimeInput],
    [{ kinds: ['datetime'] }, DateTimeInput],
    [{ kinds: ['choice'] }, ChoiceInput],
    [{ kinds: ['single', 'multiple'] }, RelationInput],
    [{ kinds: ['reference'] }, ReferenceInput],
    [{ kinds: ['text', 'number'], arity: 'list' }, ListInput],
    [{ kinds: ['number', 'date', 'time'], arity: 'two' }, RangeInput],
    [{ kinds: ['datetime'], arity: 'two' }, DateTimeInput],
    [{ kinds: ['choice'], arity: 'list' }, ChoiceInput],
    [{ kinds: ['single', 'multiple'], arity: 'list' }, RelationInput],
    [{ kinds: ['reference'], arity: 'list' }, ReferenceInput],
    [{ kinds: ['single'], operators: ['<', '<=', '>', '>='] }, NumberInput],
    [{ kinds: ['single'], operators: ['between'] }, RangeInput],
];

export {
    ChoiceInput,
    DateInput,
    DateTimeInput,
    ListInput,
    NumberInput,
    RangeInput,
    ReferenceInput,
    RelationInput,
    TextInput,
    TimeInput,
};
