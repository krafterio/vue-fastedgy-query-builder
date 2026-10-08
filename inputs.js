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
import { registerFilterInput } from './composables/registry.js';

// The package's own inputs, registered at import so an application registering
// its own afterwards replaces any of them for the rules it matches.
registerFilterInput({ kinds: ['text'] }, TextInput);
registerFilterInput({ kinds: ['number'] }, NumberInput);
registerFilterInput({ kinds: ['date'] }, DateInput);
registerFilterInput({ kinds: ['time'] }, TimeInput);
registerFilterInput({ kinds: ['datetime'] }, DateTimeInput);
registerFilterInput({ kinds: ['choice'] }, ChoiceInput);
registerFilterInput({ kinds: ['single', 'multiple'] }, RelationInput);
registerFilterInput({ kinds: ['reference'] }, ReferenceInput);
registerFilterInput({ kinds: ['text', 'number'], arity: 'list' }, ListInput);
registerFilterInput({ kinds: ['number', 'date', 'time'], arity: 'two' }, RangeInput);
registerFilterInput({ kinds: ['datetime'], arity: 'two' }, DateTimeInput);
registerFilterInput({ kinds: ['choice'], arity: 'list' }, ChoiceInput);
registerFilterInput({ kinds: ['single', 'multiple'], arity: 'list' }, RelationInput);
registerFilterInput({ kinds: ['reference'], arity: 'list' }, ReferenceInput);
registerFilterInput({ kinds: ['single'], operators: ['<', '<=', '>', '>='] }, NumberInput);
registerFilterInput({ kinds: ['single'], operators: ['between'] }, RangeInput);

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
