# vue-fastedgy-query-builder

Query builder for the lists of [FastEdgy](https://github.com/krafterio/fastedgy) applications, on
[vue-fastedgy](https://github.com/krafterio/vue-fastedgy) and [reka-ui](https://reka-ui.com).

- Conditions read from the server metadata: the filterable fields, their types, the operators the
  server accepts, the relations to walk into.
- Groups of all or of at least one, nested as deep as needed, and blocks « at least one / none
  that… » on a relation.
- The value of a condition in an input chosen by a registry, by type and operator, that a project
  completes or replaces (its own date picker, its own user picker).
- Custom views of a list, shared or private, with the favorite of everyone and of each user.
- A popover on a wide screen, the whole screen on a narrow one.
- Dressed by the project: CSS variables on the shadcn tokens, `data-slot` attributes, bricks lent
  by `provide`, and parts to recompose, in the manner of reka-ui.
- Worded in English, French, German, Spanish and Italian through the vue-fastedgy i18n, an
  application keeping its own wording of any text.

```js
import { createQueryFilter } from 'vue-fastedgy-query-builder';
import 'vue-fastedgy-query-builder/styles.css';

app.use(createQueryFilter({ deepFieldSearch: true }));
```

```vue
<QueryFilter model="household" :list="iterator" prefix="/console" />
```

Guide: the Vue.js › Query builder pages of the FastEdgy documentation.

## Conventional Commits Scopes used

| Scope   | Description                                  |
|---------|----------------------------------------------|
| core    | Parts, catalog, registries and their logic   |
| vue     | Components and plugin for Vue.js             |
| project | Project structure, configuration and tooling |

## License

MIT, see `LICENSE`.
