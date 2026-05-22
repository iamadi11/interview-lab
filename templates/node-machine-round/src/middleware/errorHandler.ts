import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

/**
 * Global error-handling middleware.
 * Must be registered LAST in the Express middleware chain.
 *
 * Express identifies error middleware by its 4-arg signature (err, req, res, next).
 *
 * Interview talking points:
 * - Always define error handler after all routes
 * - Never expose stack traces in production
 * - Distinguish operational errors (safe to expose) from programmer errors
 * - Use process.on("uncaughtException") + "unhandledRejection" as last resort
 */
export class AppError extends Error {
  constructor(
    readonly statusCode: number,
    message: string,
    readonly isOperational = true,
  ) {
    super(message);
    this.name = "AppError";
    Error.captureStackTrace(this, this.constructor);
  }
}

export function notFound(req: Request, res: Response): void {
  res.status(404).json({ ok: false, error: `Route ${req.method} ${req.path} not found` });
}

// 4-arg signature — do NOT remove the unused `next`; Express requires it
export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
): void {
  const isDev = process.env.NODE_ENV !== "production";

  // Zod validation error
  if (err instanceof ZodError) {
    res.status(422).json({
      ok: false,
      error: "Validation failed",
      details: err.flatten(),
    });
    return;
  }

  // Known operational error
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      ok: false,
      error: err.message,
      ...(isDev && { stack: err.stack }),
    });
    return;
  }

  // Unknown error — don't leak details in prod
  const message = isDev && err instanceof Error ? err.message : "Internal server error";
  console.error("[ErrorHandler]", err);
  res.status(500).json({
    ok: false,
    error: message,
    requestId: req.requestId,
  });
}
