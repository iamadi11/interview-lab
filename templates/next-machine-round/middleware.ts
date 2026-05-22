/**
 * MIDDLEWARE (Next.js 15)
 * File: middleware.ts · export function middleware · export const config
 *
 * ⚠ Next.js 16 migration note:
 *   Rename → proxy.ts
 *   export function proxy(request: NextRequest) { … }
 *   export const proxyConfig = { matcher: […] }
 *
 * Interview concepts demonstrated here:
 *   1. Auth protection  — redirect unauthenticated users before the page renders
 *   2. Custom headers   — attach response headers on every request
 *   3. Request timing   — measure + forward as X-Response-Time header
 *   4. Geo / A-B        — can read request.geo, cookies, headers here too
 */
import { type NextRequest, NextResponse } from "next/server";

const PROTECTED_PREFIXES = ["/auth"];
const PUBLIC_PATHS       = ["/auth/login"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const start = Date.now();

  // ── 1. Auth protection ────────────────────────────────────────────────────
  const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));
  const isPublic    = PUBLIC_PATHS.some((p) => pathname === p);

  if (isProtected && !isPublic) {
    const session = request.cookies.get("session");
    if (!session?.value) {
      const loginUrl = new URL("/auth/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // ── 2. Custom headers on every response ───────────────────────────────────
  const response = NextResponse.next();
  response.headers.set("X-Interview-Lab",      "next-machine-round");
  response.headers.set("X-Content-Type-Options","nosniff");
  response.headers.set("X-Response-Time",      `${Date.now() - start}ms`);

  return response;
}

export const config = {
  // Skip static assets and Next.js internals
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
