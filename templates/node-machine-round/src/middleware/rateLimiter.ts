import type { Request, Response, NextFunction } from "express";
import { SlidingWindowRateLimiter } from "../lib/rate-limiter.js";

/**
 * Express rate-limiting middleware factory.
 *
 * Uses the SlidingWindowRateLimiter from lib/rate-limiter.ts.
 * Key is req.ip by default; customisable via keyFn.
 *
 * Interview talking points:
 * - Why sliding window > fixed window (no burst at boundary)
 * - Distributed systems: use Redis + Lua atomic script instead of in-process Map
 * - Headers: X-RateLimit-Limit, X-RateLimit-Remaining, Retry-After
 */
export function rateLimiter(options: {
  limit: number;
  windowMs: number;
  keyFn?: (req: Request) => string;
}) {
  const { limit, windowMs, keyFn = (req) => req.ip ?? "unknown" } = options;
  const limiter = new SlidingWindowRateLimiter(limit, windowMs);

  return (req: Request, res: Response, next: NextFunction): void => {
    const key = keyFn(req);
    const allowed = limiter.check(key);
    const remaining = limiter.remaining(key);

    res.setHeader("X-RateLimit-Limit", limit);
    res.setHeader("X-RateLimit-Remaining", remaining);
    res.setHeader("X-RateLimit-Reset", Math.ceil((Date.now() + windowMs) / 1000));

    if (!allowed) {
      res.setHeader("Retry-After", Math.ceil(windowMs / 1000));
      res.status(429).json({
        ok: false,
        error: "Too many requests",
        retryAfterMs: windowMs,
      });
      return;
    }

    next();
  };
}
