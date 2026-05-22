import type { Request, Response, NextFunction } from "express";
import { randomUUID } from "node:crypto";

/**
 * Request logger middleware.
 * - Injects x-request-id header for tracing
 * - Logs method, url, status, duration on response finish
 */
export function requestLogger(req: Request, res: Response, next: NextFunction): void {
  const requestId = (req.headers["x-request-id"] as string | undefined) ?? randomUUID();
  req.requestId = requestId;
  res.setHeader("X-Request-Id", requestId);

  const start = Date.now();

  res.on("finish", () => {
    const ms = Date.now() - start;
    const status = res.statusCode;
    const color = status >= 500 ? "\x1b[31m" : status >= 400 ? "\x1b[33m" : "\x1b[32m";
    console.log(
      `${color}${status}\x1b[0m ${req.method} ${req.path} ${ms}ms [${requestId.slice(0, 8)}]`,
    );
  });

  next();
}
