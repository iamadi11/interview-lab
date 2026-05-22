/**
 * Route Handler: /api/posts
 *
 * Demonstrates:
 * - GET with optional query filtering + next.tags for cache tagging
 * - POST with Zod validation
 * - Cache-Tag header on the Response lets revalidateTag purge this handler by tag
 */
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

// ─── GET /api/posts?authorId=u1&limit=10 ─────────────────────────────────────
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const authorId = searchParams.get("authorId");
  const limit    = Math.min(parseInt(searchParams.get("limit") ?? "10", 10), 50);

  const posts = await db.posts.findAll();
  const filtered = authorId
    ? posts.filter((p) => p.authorId === authorId)
    : posts;

  return NextResponse.json(
    { posts: filtered.slice(0, limit), total: filtered.length },
    {
      headers: {
        // Tag this response — call revalidateTag with "posts" to purge it
        "Cache-Tag": "posts",
      },
    },
  );
}

// ─── POST /api/posts ──────────────────────────────────────────────────────────
const CreatePostSchema = z.object({
  title:    z.string().min(3).max(120),
  body:     z.string().min(10),
  authorId: z.string().min(1),
});

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = CreatePostSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten() },
      { status: 422 },
    );
  }

  const post = await db.posts.create(parsed.data);
  return NextResponse.json({ post }, { status: 201 });
}
