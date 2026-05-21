import { describe, it, expect } from "vitest";
import { debounce, deepClone, flattenObject, groupBy, chunk, LRUCache, generateId, clamp, formatTime } from "@/lib";

describe("debounce", () => {
  it("delays function execution", async () => {
    let callCount = 0;
    const fn = debounce(() => callCount++, 50);
    fn(); fn(); fn();
    expect(callCount).toBe(0);
    await new Promise((r) => setTimeout(r, 60));
    expect(callCount).toBe(1);
  });
});

describe("deepClone", () => {
  it("creates a new reference", () => {
    const obj = { a: { b: 1 } };
    const clone = deepClone(obj);
    clone.a.b = 99;
    expect(obj.a.b).toBe(1);
  });
});

describe("flattenObject", () => {
  it("flattens nested keys to dot notation", () => {
    const result = flattenObject({ a: { b: { c: 1 } } });
    expect(result["a.b.c"]).toBe(1);
  });
});

describe("groupBy", () => {
  it("groups array by key", () => {
    const items = [{ type: "a" }, { type: "b" }, { type: "a" }];
    const grouped = groupBy(items, "type");
    expect(grouped["a"]).toHaveLength(2);
    expect(grouped["b"]).toHaveLength(1);
  });
});

describe("chunk", () => {
  it("splits array into groups", () => {
    expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
  });
});

describe("LRUCache", () => {
  it("evicts the least recently used entry", () => {
    const cache = new LRUCache<string, number>(2);
    cache.set("a", 1);
    cache.set("b", 2);
    cache.get("a");           // access a → b is now LRU
    cache.set("c", 3);        // evicts b
    expect(cache.has("b")).toBe(false);
    expect(cache.has("a")).toBe(true);
    expect(cache.has("c")).toBe(true);
  });

  it("updates existing key without evicting", () => {
    const cache = new LRUCache<string, number>(2);
    cache.set("a", 1); cache.set("b", 2); cache.set("a", 99);
    expect(cache.size).toBe(2);
    expect(cache.get("a")).toBe(99);
  });
});

describe("clamp", () => {
  it("clamps values within bounds", () => {
    expect(clamp(5, 0, 10)).toBe(5);
    expect(clamp(-1, 0, 10)).toBe(0);
    expect(clamp(11, 0, 10)).toBe(10);
  });
});

describe("formatTime", () => {
  it("formats seconds to MM:SS", () => {
    expect(formatTime(0)).toBe("00:00");
    expect(formatTime(65)).toBe("01:05");
    expect(formatTime(3600)).toBe("60:00");
  });
});

describe("generateId", () => {
  it("returns unique ids", () => {
    const ids = new Set(Array.from({ length: 100 }, generateId));
    expect(ids.size).toBe(100);
  });
});
