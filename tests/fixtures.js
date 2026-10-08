import { ref } from 'vue';

const field = (name, type, extra = {}) => ({
    name,
    label: extra.label ?? name.charAt(0).toUpperCase() + name.slice(1).replaceAll('_', ' '),
    type,
    searchable: true,
    filter_operators: extra.operators ?? OPERATORS[type] ?? [],
    target: extra.target ?? null,
    inverse: extra.inverse ?? null,
    choices: extra.choices ?? null,
    targets: extra.targets ?? null,
});

const TEXT = [
    '=',
    '!=',
    'icontains',
    'not icontains',
    'starts with',
    'ends with',
    'in',
    'not in',
    'is empty',
    'is not empty',
    'like',
];
const NUMBER = ['=', '!=', '<', '<=', '>', '>=', 'between', 'in', 'not in', 'is empty', 'is not empty'];

const OPERATORS = {
    char: TEXT,
    email: TEXT,
    integer: NUMBER,
    float: NUMBER,
    date: ['=', '!=', '<', '<=', '>', '>=', 'between', 'is empty', 'is not empty'],
    datetime: ['=', '!=', '<', '<=', '>', '>=', 'between', 'is empty', 'is not empty'],
    boolean: ['is true', 'is false'],
    choice: ['=', '!=', 'in', 'not in', 'is empty', 'is not empty'],
    many2one: [...NUMBER, 'any', 'not any'],
    one2many: ['in', 'not in', 'is empty', 'is not empty', 'any', 'not any'],
};

export const METADATAS = {
    household: {
        name: 'household',
        label: 'Household',
        fields: {
            id: field('id', 'integer'),
            name: field('name', 'char'),
            slug: field('slug', 'char'),
            created_at: field('created_at', 'datetime', { label: 'Created at' }),
            plan: field('plan', 'choice', { choices: { free: 'Free', plus: 'Plus' } }),
            active: field('active', 'boolean'),
            owner: field('owner', 'many2one', { target: 'user', inverse: 'owned_households' }),
            workspace_users: field('workspace_users', 'one2many', {
                target: 'household_user',
                label: 'Members',
                inverse: 'workspace',
            }),
        },
    },
    household_user: {
        name: 'household_user',
        label: 'Member',
        fields: {
            role: field('role', 'choice', { choices: { admin: 'Admin', member: 'Member' } }),
            user: field('user', 'many2one', { target: 'user' }),
            workspace: field('workspace', 'many2one', { target: 'household', inverse: 'workspace_users' }),
        },
    },
    user: {
        name: 'user',
        label: 'User',
        fields: {
            id: field('id', 'integer'),
            name: field('name', 'char'),
            email: field('email', 'email'),
            owned_households: field('owned_households', 'one2many', { target: 'household', inverse: 'owner' }),
        },
    },
};

/** A data iterator, as far as the filter reads one. */
export function fakeList(expression = null) {
    return {
        expression: ref(expression),
        orderBy: ref(null),
        view: ref(null),
        total: ref(12),
        defaultOrderBy: null,
    };
}

export const settle = async () => {
    for (let index = 0; index < 4; index++) {
        await Promise.resolve();
        await new Promise((resolve) => setTimeout(resolve));
    }
};
