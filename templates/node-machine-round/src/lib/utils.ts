/**
 * Pure utility functions — common interview implementations.
 * Each function is under 25 lines; all are interview-ready.
 */

// ─── Debounce ─────────────────────────────────────────────────────────────────
export function debounce<T extends unknown[]>(
  fn: (...args: T) => void,
  ms: number,
): (...args: T) => void {
  let timer: ReturnType<typeof setTimeout> | undefined;
  return (...args: T) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}

// ─── Throttle ─────────────────────────────────────────────────────────────────
export function throttle<T extends unknown[]>(
  fn: (...args: T) => void,
  ms: number,
): (...args: T) => void {
  let lastCall = 0;
  return (...args: T) => {
    const now = Date.now();
    if (now - lastCall >= ms) {
      lastCall = now;
      fn(...args);
    }
  };
}

// ─── Deep clone ───────────────────────────────────────────────────────────────
export function deepClone<T>(value: T): T {
  if (value === null || typeof value !== "object") return value;
  if (value instanceof Date) return new Date(value.getTime()) as T;
  if (Array.isArray(value)) return value.map(deepClone) as T;
  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>).map(([k, v]) => [k, deepClone(v)]),
  ) as T;
}

// ─── Flatten object ───────────────────────────────────────────────────────────
export function flattenObject(
  obj: Record<string, unknown>,
  prefix = "",
): Record<string, unknown> {
  return Object.entries(obj).reduce<Record<string, unknown>>((acc, [key, val]) => {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (val !== null && typeof val === "object" && !Array.isArray(val)) {
      Object.assign(acc, flattenObject(val as Record<string, unknown>, fullKey));
    } else {
      acc[fullKey] = val;
    }
    return acc;
  }, {});
}

// ─── Group by ─────────────────────────────────────────────────────────────────
export function groupBy<T>(items: T[], key: (item: T) => string): Record<string, T[]> {
  return items.reduce<Record<string, T[]>>((acc, item) => {
    const k = key(item);
    (acc[k] ??= []).push(item);
    return acc;
  }, {});
}

// ─── Chunk array ─────────────────────────────────────────────────────────────
export function chunk<T>(arr: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}

// ─── Memoize ─────────────────────────────────────────────────────────────────
export function memoize<T extends unknown[], R>(
  fn: (...args: T) => R,
  keyFn: (...args: T) => string = (...args) => JSON.stringify(args),
): (...args: T) => R {
  const cache = new Map<string, R>();
  return (...args: T): R => {
    const key = keyFn(...args);
    if (cache.has(key)) return cache.get(key) as R;
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
}

// ─── Retry with exponential backoff ──────────────────────────────────────────
export async function retry<T>(
  fn: () => Promise<T>,
  options: { attempts?: number; baseDelayMs?: number } = {},
): Promise<T> {
  const { attempts = 3, baseDelayMs = 100 } = options;
  let lastError: unknown;
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      if (i < attempts - 1) {
        await new Promise((r) => setTimeout(r, baseDelayMs * 2 ** i));
      }
    }
  }
  throw lastError;
}

// ─── Pipe ─────────────────────────────────────────────────────────────────────
export function pipe<T>(...fns: Array<(x: T) => T>): (x: T) => T {
  return (x) => fns.reduce((v, fn) => fn(v), x);
}
