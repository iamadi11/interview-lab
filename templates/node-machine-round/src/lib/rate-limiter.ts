/**
 * Rate Limiter implementations — common interview problem.
 *
 * Three algorithms covered:
 *   1. Fixed Window   — simple, allows burst at window boundary
 *   2. Sliding Window — accurate, higher memory
 *   3. Token Bucket   — allows controlled bursting
 *
 * Interview questions to prepare for:
 * - What's the difference between fixed and sliding window?
 * - When would you use token bucket vs sliding window?
 * - How do you implement this in a distributed system? (Redis + Lua scripts)
 */

// ─── 1. Fixed Window ──────────────────────────────────────────────────────────

export class FixedWindowRateLimiter {
  readonly #limit: number;
  readonly #windowMs: number;
  readonly #windows = new Map<string, { count: number; resetAt: number }>();

  constructor(limit: number, windowMs: number) {
    this.#limit = limit;
    this.#windowMs = windowMs;
  }

  /** Returns true if the request is allowed */
  check(key: string): boolean {
    const now = Date.now();
    const window = this.#windows.get(key);

    if (!window || now >= window.resetAt) {
      this.#windows.set(key, { count: 1, resetAt: now + this.#windowMs });
      return true;
    }

    if (window.count >= this.#limit) return false;
    window.count += 1;
    return true;
  }

  remaining(key: string): number {
    const window = this.#windows.get(key);
    if (!window || Date.now() >= window.resetAt) return this.#limit;
    return Math.max(0, this.#limit - window.count);
  }
}

// ─── 2. Sliding Window ────────────────────────────────────────────────────────

export class SlidingWindowRateLimiter {
  readonly #limit: number;
  readonly #windowMs: number;
  // Per key: sorted array of timestamps
  readonly #requests = new Map<string, number[]>();

  constructor(limit: number, windowMs: number) {
    this.#limit = limit;
    this.#windowMs = windowMs;
  }

  check(key: string): boolean {
    const now = Date.now();
    const cutoff = now - this.#windowMs;

    if (!this.#requests.has(key)) {
      this.#requests.set(key, []);
    }
    const timestamps = this.#requests.get(key)!;

    // Evict expired timestamps
    const start = timestamps.findIndex((t) => t > cutoff);
    if (start > 0) timestamps.splice(0, start);

    if (timestamps.length >= this.#limit) return false;

    timestamps.push(now);
    return true;
  }

  remaining(key: string): number {
    const now = Date.now();
    const cutoff = now - this.#windowMs;
    const timestamps = this.#requests.get(key) ?? [];
    const active = timestamps.filter((t) => t > cutoff).length;
    return Math.max(0, this.#limit - active);
  }
}

// ─── 3. Token Bucket ─────────────────────────────────────────────────────────

export class TokenBucketRateLimiter {
  readonly #capacity: number;
  readonly #refillRate: number; // tokens per ms
  readonly #buckets = new Map<string, { tokens: number; lastRefill: number }>();

  /**
   * @param capacity  Max tokens in bucket (burst size)
   * @param refillPerSecond  Tokens added per second (sustained rate)
   */
  constructor(capacity: number, refillPerSecond: number) {
    this.#capacity = capacity;
    this.#refillRate = refillPerSecond / 1000;
  }

  check(key: string, cost = 1): boolean {
    const now = Date.now();

    if (!this.#buckets.has(key)) {
      this.#buckets.set(key, { tokens: this.#capacity, lastRefill: now });
    }

    const bucket = this.#buckets.get(key)!;

    // Refill
    const elapsed = now - bucket.lastRefill;
    bucket.tokens = Math.min(
      this.#capacity,
      bucket.tokens + elapsed * this.#refillRate,
    );
    bucket.lastRefill = now;

    if (bucket.tokens < cost) return false;
    bucket.tokens -= cost;
    return true;
  }

  tokens(key: string): number {
    return Math.floor(this.#buckets.get(key)?.tokens ?? this.#capacity);
  }
}
