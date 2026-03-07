/**
 * Server-side validation for ERP list API filters.
 * Prevents arbitrary filter injection; only allowlisted operators and safe field names.
 */

const ALLOWED_OPS = new Set([
  "=",
  "!=",
  ">",
  "<",
  ">=",
  "<=",
  "like",
  "not like",
  "in",
  "not in",
  "is",
  "is not",
]);

/** Frappe field names: alphanumeric and underscore only (no path/dots). */
const SAFE_FIELD_REGEX = /^[a-zA-Z_][a-zA-Z0-9_]*$/;

const MAX_FILTERS = 20;
const MAX_VALUE_LENGTH = 500;

function isSafeValue(v: unknown): boolean {
  if (typeof v === "string") return v.length <= MAX_VALUE_LENGTH;
  if (typeof v === "number") return Number.isFinite(v);
  if (Array.isArray(v)) return v.length <= 50 && v.every((x) => typeof x === "string" || typeof x === "number");
  return false;
}

/**
 * Parse and validate filters query param for ERP list.
 * Returns validated JSON string for ERPNext or error message.
 */
export function parseAndValidateFilters(raw: string | null): { ok: true; filters: string } | { ok: false; error: string } {
  if (!raw || !raw.trim()) return { ok: true, filters: "[]" };
  let arr: unknown;
  try {
    arr = JSON.parse(raw) as unknown;
  } catch {
    return { ok: false, error: "filters: invalid JSON" };
  }
  if (!Array.isArray(arr)) return { ok: false, error: "filters: must be an array" };
  if (arr.length > MAX_FILTERS) return { ok: false, error: `filters: max ${MAX_FILTERS} conditions` };
  const out: [string, string, string | number | (string | number)[]][] = [];
  for (let i = 0; i < arr.length; i++) {
    const row = arr[i];
    if (!Array.isArray(row) || row.length !== 3) {
      return { ok: false, error: `filters[${i}]: expected [field, operator, value]` };
    }
    const [field, op, value] = row;
    if (typeof field !== "string" || !SAFE_FIELD_REGEX.test(field)) {
      return { ok: false, error: `filters[${i}]: invalid field name` };
    }
    if (typeof op !== "string" || !ALLOWED_OPS.has(op)) {
      return { ok: false, error: `filters[${i}]: invalid operator` };
    }
    if (!isSafeValue(value)) {
      return { ok: false, error: `filters[${i}]: invalid value` };
    }
    out.push([field, op, value as string | number | (string | number)[]]);
  }
  return { ok: true, filters: JSON.stringify(out) };
}
