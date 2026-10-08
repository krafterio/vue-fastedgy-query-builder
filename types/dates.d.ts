/**
 * The first instant of a local day, in ISO 8601.
 * @param {string} day
 * @returns {string|null}
 */
export function dayStart(day: string): string | null;
/**
 * The last instant of a local day, in ISO 8601.
 * @param {string} day
 * @returns {string|null}
 */
export function dayEnd(day: string): string | null;
/**
 * The local day an instant falls on, `YYYY-MM-DD`.
 * @param {string|null|undefined} instant
 * @returns {string|null}
 */
export function dayOf(instant: string | null | undefined): string | null;
/**
 * Whether a range is exactly one local day, from its first to its last instant.
 * @param {unknown} range
 * @returns {boolean}
 */
export function coversOneDay(range: unknown): boolean;
//# sourceMappingURL=dates.d.ts.map