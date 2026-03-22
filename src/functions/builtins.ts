// ---------------------------------------------------------------------------
// A2UI Built-in Functions
// Spec: basic_catalog.json  "functions" section
// ---------------------------------------------------------------------------

// ---- Validation -----------------------------------------------------------

/** Returns true if value is not null, undefined, or empty string. */
export function required(value: any): boolean {
  return value !== null && value !== undefined && value !== '';
}

/** Tests value against a regex pattern string. */
export function regex(value: string, pattern: string): boolean {
  return new RegExp(pattern).test(value);
}

/** Checks that a string's length falls within [min, max]. */
export function length(value: string, min?: number, max?: number): boolean {
  const len = (value ?? '').length;
  if (min !== undefined && len < min) return false;
  if (max !== undefined && len > max) return false;
  return true;
}

/** Checks that a number falls within [min, max]. */
export function numeric(value: number, min?: number, max?: number): boolean {
  if (min !== undefined && value < min) return false;
  if (max !== undefined && value > max) return false;
  return true;
}

/** Validates email format (simplified RFC 5322). */
export function email(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

// ---- Formatting -----------------------------------------------------------

/**
 * String interpolation placeholder.
 * Full `${expr}` interpolation requires the expression evaluator; for now we
 * pass the resolved value through unchanged.
 */
export function formatString(value: string): string {
  return value;
}

/**
 * Formats a number with optional decimal precision and grouping separators.
 * Uses `Intl.NumberFormat` under the hood.
 */
export function formatNumber(
  value: number,
  decimals?: number,
  grouping?: boolean,
): string {
  const opts: Intl.NumberFormatOptions = {};
  if (decimals !== undefined) {
    opts.minimumFractionDigits = decimals;
    opts.maximumFractionDigits = decimals;
  }
  opts.useGrouping = grouping !== false;
  return new Intl.NumberFormat(undefined, opts).format(value);
}

/**
 * Formats a number as a currency string using ISO 4217 codes.
 */
export function formatCurrency(
  value: number,
  currency: string,
  decimals?: number,
  grouping?: boolean,
): string {
  const opts: Intl.NumberFormatOptions = {
    style: 'currency',
    currency,
  };
  if (decimals !== undefined) {
    opts.minimumFractionDigits = decimals;
    opts.maximumFractionDigits = decimals;
  }
  opts.useGrouping = grouping !== false;
  return new Intl.NumberFormat(undefined, opts).format(value);
}

// ---- formatDate -----------------------------------------------------------

const MONTHS_FULL = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const MONTHS_SHORT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];
const DAYS_FULL = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday',
  'Thursday', 'Friday', 'Saturday',
];
const DAYS_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function pad2(n: number): string {
  return n < 10 ? '0' + n : String(n);
}

/**
 * Formats a date using Unicode TR35 pattern tokens.
 *
 * Supported tokens:
 *   yyyy / yy          year
 *   MMMM / MMM / MM / M   month
 *   dd / d             day of month
 *   EEEE / E           weekday name
 *   HH / H             24-hour
 *   hh / h             12-hour
 *   mm                 minutes
 *   ss                 seconds
 *   a                  AM / PM
 */
export function formatDate(
  value: string | number | Date,
  format: string,
): string {
  const d = value instanceof Date ? value : new Date(value);

  const year = d.getFullYear();
  const month = d.getMonth(); // 0-based
  const day = d.getDate();
  const dow = d.getDay();
  const hours24 = d.getHours();
  const hours12 = hours24 % 12 || 12;
  const minutes = d.getMinutes();
  const seconds = d.getSeconds();
  const ampm = hours24 < 12 ? 'AM' : 'PM';

  // Token map ordered longest-first so the regex greedily matches the longest
  // token before a shorter prefix (e.g. "MMMM" before "MMM" before "MM").
  const tokens: Record<string, string> = {
    yyyy: String(year),
    yy: String(year).slice(-2),
    MMMM: MONTHS_FULL[month],
    MMM: MONTHS_SHORT[month],
    MM: pad2(month + 1),
    M: String(month + 1),
    dd: pad2(day),
    d: String(day),
    EEEE: DAYS_FULL[dow],
    E: DAYS_SHORT[dow],
    HH: pad2(hours24),
    H: String(hours24),
    hh: pad2(hours12),
    h: String(hours12),
    mm: pad2(minutes),
    ss: pad2(seconds),
    a: ampm,
  };

  // Build a regex that matches any token (longest first).
  const tokenPattern = Object.keys(tokens)
    .sort((a, b) => b.length - a.length)
    .map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .join('|');

  return format.replace(new RegExp(tokenPattern, 'g'), (match) => tokens[match]);
}

// ---- pluralize ------------------------------------------------------------

export interface PluralOptions {
  zero?: string;
  one?: string;
  two?: string;
  few?: string;
  many?: string;
  other: string;
}

/**
 * Returns a string based on CLDR plural category.
 * For English the rule is: value === 1 -> "one", else -> "other".
 * Additional categories (zero, two, few, many) are supported for other locales
 * when `Intl.PluralRules` is available.
 */
export function pluralize(value: number, options: PluralOptions): string {
  // Try native PluralRules first (available in all modern runtimes).
  if (typeof Intl !== 'undefined' && Intl.PluralRules) {
    const category = new Intl.PluralRules().select(value);
    const key = category as keyof PluralOptions;
    if (options[key] !== undefined) return options[key] as string;
  } else {
    // Fallback: simple English rule
    if (value === 1 && options.one !== undefined) return options.one;
  }
  return options.other;
}

// ---- Logic ----------------------------------------------------------------

/** Logical AND over an array of booleans. */
export function and(values: boolean[]): boolean {
  return values.every(Boolean);
}

/** Logical OR over an array of booleans. */
export function or(values: boolean[]): boolean {
  return values.some(Boolean);
}

/** Logical NOT. */
export function not(value: boolean): boolean {
  return !value;
}

// ---- Navigation -----------------------------------------------------------

/** Opens the specified URL in a new browser tab / handler. */
export function openUrl(url: string): void {
  window.open(url, '_blank', 'noopener');
}

// ---- Registry & dispatcher ------------------------------------------------

/**
 * Map of all built-in function names to their implementations.
 */
export const builtinRegistry: Record<string, Function> = {
  required,
  regex,
  length,
  numeric,
  email,
  formatString,
  formatNumber,
  formatCurrency,
  formatDate,
  pluralize,
  openUrl,
  and,
  or,
  not,
};

export interface FunctionCall {
  call: string;
  args: Record<string, any>;
  returnType: string;
}

/**
 * Dispatches to the correct built-in function.
 *
 * @param fn          The function call descriptor from the A2UI surface JSON.
 * @param resolveArg  A callback that resolves dynamic argument values
 *                    (e.g. JSON-pointer references, nested function calls).
 * @returns           The return value of the invoked function.
 */
export function evaluateFunction(
  fn: FunctionCall,
  resolveArg: (arg: any) => any,
): any {
  const impl = builtinRegistry[fn.call];
  if (!impl) {
    console.warn(`[a2ui] Unknown built-in function: "${fn.call}"`);
    return undefined;
  }

  const args = fn.args;

  switch (fn.call) {
    // -- Validation --
    case 'required':
      return required(resolveArg(args.value));
    case 'regex':
      return regex(resolveArg(args.value), resolveArg(args.pattern));
    case 'length':
      return length(
        resolveArg(args.value),
        args.min !== undefined ? resolveArg(args.min) : undefined,
        args.max !== undefined ? resolveArg(args.max) : undefined,
      );
    case 'numeric':
      return numeric(
        resolveArg(args.value),
        args.min !== undefined ? resolveArg(args.min) : undefined,
        args.max !== undefined ? resolveArg(args.max) : undefined,
      );
    case 'email':
      return email(resolveArg(args.value));

    // -- Formatting --
    case 'formatString':
      return formatString(resolveArg(args.value));
    case 'formatNumber':
      return formatNumber(
        resolveArg(args.value),
        args.decimals !== undefined ? resolveArg(args.decimals) : undefined,
        args.grouping !== undefined ? resolveArg(args.grouping) : undefined,
      );
    case 'formatCurrency':
      return formatCurrency(
        resolveArg(args.value),
        resolveArg(args.currency),
        args.decimals !== undefined ? resolveArg(args.decimals) : undefined,
        args.grouping !== undefined ? resolveArg(args.grouping) : undefined,
      );
    case 'formatDate':
      return formatDate(resolveArg(args.value), resolveArg(args.format));
    case 'pluralize': {
      const opts: PluralOptions = { other: resolveArg(args.other) };
      if (args.zero !== undefined) opts.zero = resolveArg(args.zero);
      if (args.one !== undefined) opts.one = resolveArg(args.one);
      if (args.two !== undefined) opts.two = resolveArg(args.two);
      if (args.few !== undefined) opts.few = resolveArg(args.few);
      if (args.many !== undefined) opts.many = resolveArg(args.many);
      return pluralize(resolveArg(args.value), opts);
    }

    // -- Logic --
    case 'and':
      return and((args.values as any[]).map(resolveArg));
    case 'or':
      return or((args.values as any[]).map(resolveArg));
    case 'not':
      return not(resolveArg(args.value));

    // -- Navigation --
    case 'openUrl':
      return openUrl(resolveArg(args.url));

    default:
      return undefined;
  }
}
