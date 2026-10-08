import { createContext } from 'reka-ui';

/**
 * What the root of a query filter shares with its parts: the model, the list,
 * the tree being edited, the metadata, the custom views and the settings in
 * force. Read through `injectQueryFilterContext()` by every part, so a project
 * that recomposes them passes nothing down by hand.
 */
export const [injectQueryFilterContext, provideQueryFilterContext] = createContext('QueryFilterRoot');
