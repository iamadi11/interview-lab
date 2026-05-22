import type { Request, Response, NextFunction } from "express";
import type { AuthPayload } from "../types/index.js";

const DEMO_TOKEN = "demo-secret-token";

/**
 * Auth middleware — demo token check.
 *
 * In production: verify a signed JWT (jsonwebtoken / jose).
 * Here: any request with Authorization: Bearer demo-secret-token passes.
 *
 * Interview talking points:
 * - JWT structure: header.payload.signature (base64url encoded)
 * - Stateless vs stateful (sessions) auth
 * - Refresh token rotation strategy
 * - Where to store tokens (httpOnly cookie vs localStorage)
 */
export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const header = req.headers.authorization;

  if (!header?.startsWith("Bearer ")) {
    res.status(401).json({ ok: false, error: "Missing Bearer token" });
    return;
  }

  const token = header.slice(7);

  if (token !== DEMO_TOKEN) {
    res.status(401).json({ ok: false, error: "Invalid token" });
    return;
  }

  // Demo: decode a hardcoded payload
  const payload: AuthPayload = {
    userId: "u1",
    role: "admin",
    iat: Math.floor(Date.now() / 1000) - 60,
    exp: Math.floor(Date.now() / 1000) + 3600,
  };

  req.auth = payload;
  next();
}

/**
 * Role guard factory.
 * Usage: router.delete("/users/:id", requireAuth, requireRole("admin"), handler)
 */
export function requireRole(role: AuthPayload["role"]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.auth) {
      res.status(401).json({ ok: false, error: "Unauthenticated" });
      return;
    }
    if (req.auth.role !== role) {
      res.status(403).json({ ok: false, error: `Requires ${role} role` });
      return;
    }
    next();
  };
}
