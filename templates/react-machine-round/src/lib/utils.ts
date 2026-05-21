// ─── Core interview utilities ───────────────────────────────────────────────
// Everything you need for a machine coding round in one file.
// Each function is < 25 lines and explainable in under 30 seconds.

// ─── Timing ──────────────────────────────────────────────────────────────────

/** Returns a debounced version of fn that fires after `delay` ms of silence. */
export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

/** Returns a throttled version of fn that fires at most once per `limit` ms. */
export function throttle<T extends (...args: unknown[]) => unknown>(
  fn: T,
  limit: number
): (...args: Parameters<T>) => void {
  let last = 0;
  return (...args) => {
    const now = Date.now();
    if (now - last >= limit) {
      last = now;
      fn(...args);
    }
  };
}

// ─── Object helpers ───────────────────────────────────────────────────────────

/** Deep clone using the native structured clone algorithm. */
export const deepClone = <T>(val: T): T => structuredClone(val);

/** Flatten nested object to dot-notation keys. */
export function flattenObject(
  obj: Record<string, unknown>,
  prefix = ""
): Record<string, unknown> {
  return Object.entries(obj).reduce<Record<string, unknown>>((acc, [k, v]) => {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v !== null && typeof v === "object" && !Array.isArray(v)) {
      Object.assign(acc, flattenObject(v as Record<string, unknown>, key));
    } else {
      acc[key] = v;
    }
    return acc;
  }, {});
}

/** Pick selected keys from an object. */
export function pick<T extends object, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  return keys.reduce((acc, k) => ({ ...acc, [k]: obj[k] }), {} as Pick<T, K>);
}

/** Omit selected keys from an object. */
export function omit<T extends object, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
  const copy = { ...obj };
  keys.forEach((k) => delete copy[k]);
  return copy;
}

// ─── Array helpers ────────────────────────────────────────────────────────────

/** Group an array by a key. */
export function groupBy<T>(arr: T[], key: keyof T): Record<string, T[]> {
  return arr.reduce<Record<string, T[]>>((acc, item) => {
    const k = String(item[key]);
    (acc[k] ??= []).push(item);
    return acc;
  }, {});
}

/** Chunk array into groups of `size`. */
export function chunk<T>(arr: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += size) result.push(arr.slice(i, i + size));
  return result;
}

/** Remove duplicates by key. */
export function uniqueBy<T>(arr: T[], key: keyof T): T[] {
  const seen = new Set<unknown>();
  return arr.filter((item) => {
    const k = item[key];
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

/** Stable sort (preserves order of equal elements). */
export function sortBy<T>(arr: T[], key: keyof T, dir: "asc" | "desc" = "asc"): T[] {
  return [...arr].sort((a, b) => {
    const av = a[key], bv = b[key];
    const cmp = av < bv ? -1 : av > bv ? 1 : 0;
    return dir === "asc" ? cmp : -cmp;
  });
}

// ─── String helpers ───────────────────────────────────────────────────────────

export const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
export const camelToKebab = (s: string) => s.replace(/([A-Z])/g, "-$1").toLowerCase();
export const truncate = (s: string, max: number) => s.length > max ? `${s.slice(0, max)}…` : s;

// ─── Number helpers ───────────────────────────────────────────────────────────

export const clamp = (n: number, min: number, max: number) => Math.min(Math.max(n, min), max);
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const formatTime = (s: number) =>
  `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

// ─── ID & Random ─────────────────────────────────────────────────────────────

export const generateId = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
export const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

// ─── Type guards ─────────────────────────────────────────────────────────────

export const isDefined = <T>(val: T | undefined | null): val is T => val != null;
export const isString = (val: unknown): val is string => typeof val === "string";
export const isNumber = (val: unknown): val is number => typeof val === "number" && !isNaN(val);

// ─── Async helpers ────────────────────────────────────────────────────────────

export const sleep = (ms: number) => new Promise<void>((res) => setTimeout(res, ms));

export async function retry<T>(
  fn: () => Promise<T>,
  retries = 3,
  delayMs = 300
): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    if (retries <= 0) throw err;
    await sleep(delayMs);
    return retry(fn, retries - 1, delayMs * 2);
  }
}
