/**
 * Route Handler: /api/users
 *
 * Key interview points:
 * - Route Handlers live in app/api/[segment]/route.ts — no pages/api needed
 * - Export named functions: GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS
 * - Return Response (Web API) or NextResponse for convenience helpers
 * - GET handlers are cached by default; add dynamic = "force-dynamic" to opt out
 * - Conflict rule: route.ts and page.tsx cannot coexist in the same segment
 */
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";

// Force dynamic so GET always reads the latest in-memory store
export const dynamic = "force-dynamic";

// ─── GET /api/users ───────────────────────────────────────────────────────────
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const role = searchParams.get("role") as "admin" | "user" | null;

  const users = await db.users.findAll();
  const filtered = role ? users.filter((u) => u.role === role) : users;

  return NextResponse.json({ users: filtered, count: filtered.length });
}

// ─── POST /api/users ──────────────────────────────────────────────────────────
const CreateUserSchema = z.object({
  name:   z.string().min(2).max(80),
  email:  z.string().email(),
  role:   z.enum(["admin", "user"]).default("user"),
  avatar: z.string().url().optional(),
});

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = CreateUserSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten() },
      { status: 422 },
    );
  }

  const user = await db.users.create({
    ...parsed.data,
    avatar: parsed.data.avatar ?? `https://api.dicebear.com/7.x/avataaars/svg?seed=${Date.now()}`,
  });

  return NextResponse.json({ user }, { status: 201 });
}
