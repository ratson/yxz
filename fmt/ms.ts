// Ported from https://github.com/vercel/ms
// Copyright 2022 Vercel, Inc. All rights reserved. MIT license.
import {
  DAY as d,
  HOUR as h,
  MINUTE as m,
  SECOND as s,
  WEEK as w
} from "https://deno.land/std@0.193.0/datetime/constants.ts";

// Helpers.
const y = d * 365.25;

type Unit =
  | "Years"
  | "Year"
  | "Yrs"
  | "Yr"
  | "Y"
  | "Weeks"
  | "Week"
  | "W"
  | "Days"
  | "Day"
  | "D"
  | "Hours"
  | "Hour"
  | "Hrs"
  | "Hr"
  | "H"
  | "Minutes"
  | "Minute"
  | "Mins"
  | "Min"
  | "M"
  | "Seconds"
  | "Second"
  | "Secs"
  | "Sec"
  | "s"
  | "Milliseconds"
  | "Millisecond"
  | "Msecs"
  | "Msec"
  | "Ms";

type UnitAnyCase = Unit | Uppercase<Unit> | Lowercase<Unit>;

export type StringValue =
  | `${number}`
  | `${number}${UnitAnyCase}`
  | `${number} ${UnitAnyCase}`;

interface Options {
  /**
   * Set to `true` to use verbose formatting. Defaults to `false`.
   */
  long?: boolean;
}

/**
 * Parse or format the given value.
 *
 * @param value - The string or number to convert
 * @param options - Options for the conversion
 * @throws Error if `value` is not a non-empty string or a number
 */
function msFn(value: StringValue, options?: Options): number;
function msFn(value: number, options?: Options): string;
function msFn(value: StringValue | number, options?: Options): number | string {
  try {
    if (typeof value === "string" && value.length > 0) {
      return parse(value);
    } else if (typeof value === "number" && isFinite(value)) {
      return options?.long ? fmtLong(value) : fmtShort(value);
    }
    throw new Error("Value is not a string or number.");
  } catch (error) {
    const message = isError(error)
      ? `${error.message}. value=${JSON.stringify(value)}`
      : "An unknown error has occurred.";
    throw new Error(message);
  }
}

/**
 * Parse the given string and return milliseconds.
 *
 * @param str - A string to parse to milliseconds
 * @returns The parsed value in milliseconds, or `NaN` if the string can't be
 * parsed
 */
function parse(str: string): number {
  if (str.length > 100) {
    throw new Error("Value exceeds the maximum length of 100 characters.");
  }
  const match =
    /^(?<value>-?(?:\d+)?\.?\d+) *(?<type>milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i
      .exec(
        str,
      );
  // Named capture groups need to be manually typed today.
  // https://github.com/microsoft/TypeScript/issues/32098
  const groups = match?.groups as { value: string; type?: string } | undefined;
  if (!groups) {
    return NaN;
  }
  const n = parseFloat(groups.value);
  const type = (groups.type || "ms").toLowerCase() as Lowercase<Unit>;
  switch (type) {
    case "years":
    case "year":
    case "yrs":
    case "yr":
    case "y":
      return n * y;
    case "weeks":
    case "week":
    case "w":
      return n * w;
    case "days":
    case "day":
    case "d":
      return n * d;
    case "hours":
    case "hour":
    case "hrs":
    case "hr":
    case "h":
      return n * h;
    case "minutes":
    case "minute":
    case "mins":
    case "min":
    case "m":
      return n * m;
    case "seconds":
    case "second":
    case "secs":
    case "sec":
    case "s":
      return n * s;
    case "milliseconds":
    case "millisecond":
    case "msecs":
    case "msec":
    case "ms":
      return n;
    default:
      // This should never occur.
      throw new Error(
        `The unit ${type} was matched, but no matching case exists.`,
      );
  }
}

export { msFn as ms };

/**
 * Short format for `ms`.
 */
function fmtShort(ms: number): StringValue {
  const msAbs = Math.abs(ms);
  if (msAbs >= d) {
    return `${Math.round(ms / d)}d`;
  }
  if (msAbs >= h) {
    return `${Math.round(ms / h)}h`;
  }
  if (msAbs >= m) {
    return `${Math.round(ms / m)}m`;
  }
  if (msAbs >= s) {
    return `${Math.round(ms / s)}s`;
  }
  return `${ms}ms`;
}

/**
 * Long format for `ms`.
 */
function fmtLong(ms: number): StringValue {
  const msAbs = Math.abs(ms);
  if (msAbs >= d) {
    return plural(ms, msAbs, d, "day");
  }
  if (msAbs >= h) {
    return plural(ms, msAbs, h, "hour");
  }
  if (msAbs >= m) {
    return plural(ms, msAbs, m, "minute");
  }
  if (msAbs >= s) {
    return plural(ms, msAbs, s, "second");
  }
  return `${ms} ms`;
}

/**
 * Pluralization helper.
 */
function plural(
  ms: number,
  msAbs: number,
  n: number,
  name: string,
): StringValue {
  const isPlural = msAbs >= n * 1.5;
  return `${Math.round(ms / n)} ${name}${isPlural ? "s" : ""}` as StringValue;
}

/**
 * A type guard for errors.
 *
 * @param value - The value to test
 * @returns A boolean `true` if the provided value is an Error-like object
 */
function isError(value: unknown): value is Error {
  return typeof value === "object" && value !== null && "message" in value;
}
