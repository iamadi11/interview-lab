/**
 * Express app factory — exported separately so tests can import it
 * without starting the HTTP server (no port binding in tests).
 */
import express, { type Application } from "express";
import { requestLogger } from "./middleware/logger.js";
import { rateLimiter } from "./middleware/rateLimiter.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";
import { usersRouter } from "./routes/users.js";
import { postsRouter } from "./routes/posts.js";
import { interviewRouter } from "./routes/interview.js";

export function createApp(): Application {
  const app = express();

  // ── Global middleware ──────────────────────────────────────────────────────
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(requestLogger);
  app.use(rateLimiter({ limit: 100, windowMs: 60_000 }));

  // ── Health ─────────────────────────────────────────────────────────────────
  app.get("/health", (_req, res) => {
    res.json({ ok: true, data: { status: "healthy", ts: new Date().toISOString() } });
  });

  // ── Routes ─────────────────────────────────────────────────────────────────
  app.use("/users",     usersRouter);
  app.use("/posts",     postsRouter);
  app.use("/interview", interviewRouter);

  // ── Error handling (must be last) ─────────────────────────────────────────
  app.use(notFound);
  app.use(errorHandler);

  return app;
}
