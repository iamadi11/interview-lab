/**
 * LRU Cache — classic interview question, interview-ready implementation.
 *
 * O(1) get and set using a Map (insertion-ordered).
 * Evicts the least-recently-used entry when capacity is exceeded.
 */
export class LRUCache<K, V> {
  readonly #map = new Map<K, V>();

  constructor(readonly capacity: number) {
    if (capacity <= 0) throw new RangeError("LRUCache capacity must be > 0");
  }

  get(key: K): V | undefined {
    if (!this.#map.has(key)) return undefined;
    // Refresh: delete + re-insert moves to "most recent" position
    const val = this.#map.get(key)!;
    this.#map.delete(key);
    this.#map.set(key, val);
    return val;
  }

  set(key: K, value: V): this {
    if (this.#map.has(key)) this.#map.delete(key);
    else if (this.#map.size >= this.capacity) {
      // Delete the first (least-recently-used) entry
      this.#map.delete(this.#map.keys().next().value!);
    }
    this.#map.set(key, value);
    return this;
  }

  has(key: K): boolean { return this.#map.has(key); }
  delete(key: K): boolean { return this.#map.delete(key); }
  clear(): void { this.#map.clear(); }
  get size(): number { return this.#map.size; }

  /** Returns entries from LRU → MRU order */
  entries(): [K, V][] { return [...this.#map.entries()]; }

  toJSON(): Record<string, V> {
    return Object.fromEntries(
      [...this.#map.entries()].map(([k, v]) => [String(k), v])
    );
  }
}
