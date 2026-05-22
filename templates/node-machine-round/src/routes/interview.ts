/**
 * /interview — endpoints that demonstrate common Node.js interview patterns.
 * Each route is a mini-demo you can explain in a coding round.
 */
import { Router, type Router as RouterType } from "express";
import { LRUCache } from "../lib/lru-cache.js";
import { debounce, deepClone, flattenObject, groupBy, memoize } from "../lib/utils.js";
import { FixedWindowRateLimiter, SlidingWindowRateLimiter, TokenBucketRateLimiter } from "../lib/rate-limiter.js";
import { store } from "../db/store.js";

export const interviewRouter: RouterType = Router();

// ─── LRU Cache demo ───────────────────────────────────────────────────────────
const cache = new LRUCache<string, unknown>(5);

interviewRouter.get("/lru", (req, res) => {
  const { op, key, value } = req.query as Record<string, string>;
  let result: unknown;

  if (op === "set" && key) {
    cache.set(key, value ?? null);
    result = { set: true };
  } else if (op === "get" && key) {
    result = cache.get(key);
  } else if (op === "keys") {
    result = [...cache.keys()];
  } else {
    result = { size: cache.size, capacity: cache.capacity, keys: [...cache.keys()] };
  }

  res.json({ ok: true, data: result });
});

// ─── Rate limiter demo ────────────────────────────────────────────────────────
const fixedLimiter   = new FixedWindowRateLimiter(5, 10_000);
const slidingLimiter = new SlidingWindowRateLimiter(5, 10_000);
const tokenLimiter   = new TokenBucketRateLimiter(10, 2);

interviewRouter.post("/rate-limit/:algo", (req, res) => {
  const algo = req.params["algo"] as string;
  const key = (req.ip ?? "test") + "-" + algo;
  let allowed: boolean;
  let remaining: number;

  if (algo === "fixed") {
    allowed = fixedLimiter.check(key);
    remaining = fixedLimiter.remaining(key);
  } else if (algo === "token") {
    allowed = tokenLimiter.check(key);
    remaining = tokenLimiter.tokens(key);
  } else {
    allowed = slidingLimiter.check(key);
    remaining = slidingLimiter.remaining(key);
  }

  res.status(allowed ? 200 : 429).json({
    ok: allowed,
    data: { algo, allowed, remaining },
  });
});

// ─── Utility demos ────────────────────────────────────────────────────────────
interviewRouter.post("/deep-clone", (req, res) => {
  const cloned = deepClone(req.body);
  res.json({ ok: true, data: { original: req.body, cloned } });
});

interviewRouter.post("/flatten", (req, res) => {
  const flat = flattenObject(req.body as Record<string, unknown>);
  res.json({ ok: true, data: flat });
});

interviewRouter.get("/group-by", (req, res) => {
  const users = store.getUsers();
  const grouped = groupBy(users, (u) => u.role);
  res.json({ ok: true, data: grouped });
});

// ─── Memoize demo ─────────────────────────────────────────────────────────────
let fibCalls = 0;
const fib = memoize((n: number): number => {
  fibCalls++;
  if (n <= 1) return n;
  return fib(n - 1) + fib(n - 2);
});

interviewRouter.get("/memoize/:n", (req, res) => {
  const n = parseInt(req.params["n"]!, 10);
  fibCalls = 0;
  const result = fib(Number.isNaN(n) ? 10 : Math.min(n, 40));
  res.json({ ok: true, data: { n, result, callsMade: fibCalls } });
});

// ─── Event loop demo ─────────────────────────────────────────────────────────
interviewRouter.get("/event-loop", (_req, res) => {
  const log: string[] = [];

  // Demonstrate the different phases of the event loop
  log.push("1. Synchronous code runs first");

  setImmediate(() => log.push("4. setImmediate — check phase"));

  setTimeout(() => log.push("3. setTimeout 0 — timers phase"), 0);

  Promise.resolve().then(() => log.push("2. microtask — Promise.then runs before I/O"));

  // Give the event loop one tick to collect the async results
  setImmediate(() => {
    res.json({ ok: true, data: { executionOrder: log } });
  });
});

// ─── Chunked streaming demo ───────────────────────────────────────────────────
interviewRouter.get("/stream", (_req, res) => {
  res.setHeader("Content-Type", "text/plain");
  res.setHeader("Transfer-Encoding", "chunked");

  let idx = 0;
  const interval = setInterval(() => {
    if (idx < 5) {
      res.write(`chunk-${idx + 1}: data at ${Date.now()}\n`);
      idx++;
    } else {
      clearInterval(interval);
      res.end("\nStream complete.");
    }
  }, 80);
});
