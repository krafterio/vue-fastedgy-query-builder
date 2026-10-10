/**
 * Days and the instants that bound them, in the time zone of the browser.
 *
 * A datetime is filtered on a day the way a person means it: « on 8 October »
 * is everything from the first to the last instant of that local day, written
 * as a range, and read back as a day when a range covers exactly one.
 */

const pad = (value) => String(value).padStart(2, '0');

const isoOf = (value) => {
    const date = new Date(value);

    return Number.isNaN(date.getTime()) ? null : date.toISOString();
};

/**
 * @param {string} day - `YYYY-MM-DD`
 * @returns {Date|null}
 */
function localDay(day) {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(day ?? ''));

    return match ? new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3])) : null;
}

/**
 * The first instant of a local day, in ISO 8601.
 * @param {string} day
 * @returns {string|null}
 */
export function dayStart(day) {
    return localDay(day)?.toISOString() ?? null;
}

/**
 * The last instant of a local day, in ISO 8601.
 * @param {string} day
 * @returns {string|null}
 */
export function dayEnd(day) {
    const start = localDay(day);

    return start
        ? new Date(start.getFullYear(), start.getMonth(), start.getDate(), 23, 59, 59, 999).toISOString()
        : null;
}

/**
 * The local day an instant falls on, `YYYY-MM-DD`.
 * @param {string|null|undefined} instant
 * @returns {string|null}
 */
export function dayOf(instant) {
    if (!instant) {
        return null;
    }

    if (/^\d{4}-\d{2}-\d{2}$/.test(instant)) {
        return instant;
    }

    const date = new Date(instant);

    return Number.isNaN(date.getTime())
        ? null
        : `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/**
 * Whether a range is exactly one local day, from its first to its last instant.
 * @param {unknown} range
 * @returns {boolean}
 */
export function coversOneDay(range) {
    if (!Array.isArray(range) || range.length !== 2) {
        return false;
    }

    const day = dayOf(range[0]);

    return Boolean(day) && dayStart(day) === isoOf(range[0]) && dayEnd(day) === isoOf(range[1]);
}
