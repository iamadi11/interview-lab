import { describe, it, expect, vi, beforeEach } from "vitest";
import { LRUCache } from "../src/lib/lru-cache.js";
import {
  FixedWindowRateLimiter,
  SlidingWindowRateLimiter,
  TokenBucketRateLimiter,
} from "../src/lib/rate-limiter.js";
import { EventBus } from "../src/lib/event-bus.js";
import { debounce, throttle, deepClone, flattenObject, groupBy, memoize } from "../src/lib/utils.js";

// ─── LRU Cache ────────────────────────────────────────────────────────────────
describe("LRUCache", () => {
  it("stores and retrieves values", () => {
    const cache = new LRUCache<string, number>(3);
    cache.set("a", 1);
    expect(cache.get("a")).toBe(1);
  });

  it("evicts the least-recently-used entry when capacity is exceeded", () => {
    const cache = new LRUCache<string, number>(2);
    cache.set("a", 1);
    cache.set("b", 2);
    cache.get("a"); // refresh a — now b is LRU
    cache.set("c", 3); // should evict b
    expect(cache.get("b")).toBeUndefined();
    expect(cache.get("a")).toBe(1);
    expect(cache.get("c")).toBe(3);
  });

  it("updates existing key without growing beyond capacity", () => {
    const cache = new LRUCache<string, number>(2);
    cache.set("a", 1).set("b", 2).set("a", 10);
    expect(cache.size).toBe(2);
    expect(cache.get("a")).toBe(10);
  });

  it("throws on capacity < 1", () => {
    expect(() => new LRUCache(0)).toThrow(RangeError);
  });
});

// ─── Rate Limiters ────────────────────────────────────────────────────────────
describe("FixedWindowRateLimiter", () => {
  it("allows requests up to the limit", () => {
    const limiter = new FixedWindowRateLimiter(3, 10_000);
    expect(limiter.check("ip1")).toBe(true);
    expect(limiter.check("ip1")).toBe(true);
    expect(limiter.check("ip1")).toBe(true);
    expect(limiter.check("ip1")).toBe(false);
  });

  it("tracks remaining correctly", () => {
    const limiter = new FixedWindowRateLimiter(5, 10_000);
    limiter.check("x");
    limiter.check("x");
    expect(limiter.remaining("x")).toBe(3);
  });
});

describe("SlidingWindowRateLimiter", () => {
  it("allows requests up to the limit", () => {
    const limiter = new SlidingWindowRateLimiter(3, 10_000);
    expect(limiter.check("ip")).toBe(true);
    expect(limiter.check("ip")).toBe(true);
    expect(limiter.check("ip")).toBe(true);
    expect(limiter.check("ip")).toBe(false);
    expect(limiter.remaining("ip")).toBe(0);
  });
});

describe("TokenBucketRateLimiter", () => {
  it("starts full and depletes", () => {
    const limiter = new TokenBucketRateLimiter(3, 1);
    expect(limiter.check("u")).toBe(true);
    expect(limiter.check("u")).toBe(true);
    expect(limiter.check("u")).toBe(true);
    expect(limiter.check("u")).toBe(false);
  });
});

// ─── EventBus ─────────────────────────────────────────────────────────────────
describe("EventBus", () => {
  type Events = { greet: string; count: number };

  it("delivers events to registered handlers", () => {
    const bus = new EventBus<Events>();
    const received: string[] = [];
    bus.on("greet", (msg) => received.push(msg));
    bus.emit("greet", "hello");
    expect(received).toEqual(["hello"]);
  });

  it("once() fires only once", () => {
    const bus = new EventBus<Events>();
    let calls = 0;
    bus.once("greet", () => calls++);
    bus.emit("greet", "a");
    bus.emit("greet", "b");
    expect(calls).toBe(1);
  });

  it("unsubscribe function removes the handler", () => {
    const bus = new EventBus<Events>();
    let calls = 0;
    const off = bus.on("greet", () => calls++);
    bus.emit("greet", "a");
    off();
    bus.emit("greet", "b");
    expect(calls).toBe(1);
  });

  it("removeAll clears all handlers", () => {
    const bus = new EventBus<Events>();
    let calls = 0;
    bus.on("greet", () => calls++);
    bus.on("count", () => calls++);
    bus.removeAll();
    bus.emit("greet", "x");
    bus.emit("count", 1);
    expect(calls).toBe(0);
  });
});

// ─── Utils ────────────────────────────────────────────────────────────────────
describe("debounce", () => {
  it("delays invocation", async () => {
    vi.useFakeTimers();
    const fn = vi.fn();
    const debounced = debounce(fn, 100);
    debounced();
    debounced();
    debounced();
    expect(fn).not.toHaveBeenCalled();
    vi.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(1);
    vi.useRealTimers();
  });
});

describe("throttle", () => {
  it("calls function at most once per interval", () => {
    vi.useFakeTimers();
    const fn = vi.fn();
    const throttled = throttle(fn, 100);
    throttled();
    throttled();
    throttled();
    expect(fn).toHaveBeenCalledTimes(1);
    vi.advanceTimersByTime(100);
    throttled();
    expect(fn).toHaveBeenCalledTimes(2);
    vi.useRealTimers();
  });
});

describe("deepClone", () => {
  it("produces a structurally equal but distinct object", () => {
    const original = { a: 1, b: { c: [1, 2, 3] }, d: new Date("2024-01-01") };
    const clone = deepClone(original);
    expect(clone).toEqual(original);
    expect(clone).not.toBe(original);
    expect(clone.b).not.toBe(original.b);
    expect(clone.d).not.toBe(original.d);
    expect(clone.d.getTime()).toBe(original.d.getTime());
  });
});

describe("flattenObject", () => {
  it("flattens nested keys with dot notation", () => {
    const result = flattenObject({ a: { b: { c: 1 } }, d: 2 });
    expect(result).toEqual({ "a.b.c": 1, d: 2 });
  });
});

describe("groupBy", () => {
  it("groups items by key", () => {
    const items = [{ role: "a" }, { role: "b" }, { role: "a" }];
    const grouped = groupBy(items, (i) => i.role);
    expect(grouped["a"]).toHaveLength(2);
    expect(grouped["b"]).toHaveLength(1);
  });
});

describe("memoize", () => {
  it("caches results and avoids recomputation", () => {
    let calls = 0;
    const expensiveFn = memoize((n: number) => { calls++; return n * 2; });
    expect(expensiveFn(5)).toBe(10);
    expect(expensiveFn(5)).toBe(10);
    expect(calls).toBe(1);
    expensiveFn(6);
    expect(calls).toBe(2);
  });
});
