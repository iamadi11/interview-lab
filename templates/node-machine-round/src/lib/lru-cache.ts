/**
 * LRU Cache — most common Node.js interview problem.
 *
 * Implementation: Map preserves insertion order; on get we delete + re-insert
 * to move the key to the "most recently used" tail.
 *
 * Time: O(1) get/set  |  Space: O(capacity)
 *
 * Interview variants to know:
 * - TTL per entry (add expiresAt, check on get)
 * - LFU (track frequency instead of recency)
 * - Thread-safe (use Mutex / Atomics in workers)
 */
export class LRUCache<K, V> {
  readonly #capacity: number;
  readonly #map = new Map<K, V>();

  constructor(capacity: number) {
    if (capacity < 1) throw new RangeError("LRUCache capacity must be >= 1");
    this.#capacity = capacity;
  }

  get capacity(): number { return this.#capacity; }
  get size(): number     { return this.#map.size; }

  get(key: K): V | undefined {
    if (!this.#map.has(key)) return undefined;
    // Refresh: move to tail by delete + re-insert
    const value = this.#map.get(key) as V;
    this.#map.delete(key);
    this.#map.set(key, value);
    return value;
  }

  set(key: K, value: V): this {
    if (this.#map.has(key)) {
      // Update existing — refresh to tail
      this.#map.delete(key);
    } else if (this.#map.size >= this.#capacity) {
      // Evict LRU: first key in Map is the least-recently-used
      const lruKey = this.#map.keys().next().value as K;
      this.#map.delete(lruKey);
    }
    this.#map.set(key, value);
    return this;
  }

  has(key: K): boolean { return this.#map.has(key); }

  delete(key: K): boolean { return this.#map.delete(key); }

  clear(): void { this.#map.clear(); }

  /** Returns keys from LRU (oldest) to MRU (newest) */
  keys(): IterableIterator<K> { return this.#map.keys(); }

  /** Returns entries from LRU to MRU */
  entries(): IterableIterator<[K, V]> { return this.#map.entries(); }
}
