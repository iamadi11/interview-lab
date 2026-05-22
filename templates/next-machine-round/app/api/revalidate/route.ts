/**
 * Route Handler: /api/revalidate
 *
 * On-demand ISR revalidation endpoint.
 * Demonstrates:
 * - Secret-token guard (never expose an unprotected revalidate endpoint)
 * - revalidatePath for URL-based purge
 * - revalidateTag for tag-based purge
 *
 * Call: POST /api/revalidate
 * Body: { "secret": "demo-secret", "tag": "posts" }
 *    or { "secret": "demo-secret", "path": "/isr" }
 */
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";

const REVALIDATE_SECRET = process.env.REVALIDATE_SECRET ?? "demo-secret";

export async function POST(request: NextRequest) {
  let body: { secret?: string; tag?: string; path?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // ── Auth guard ──────────────────────────────────────────────────────────────
  if (body.secret !== REVALIDATE_SECRET) {
    return NextResponse.json({ error: "Invalid secret" }, { status: 401 });
  }

  // ── Tag-based purge ─────────────────────────────────────────────────────────
  if (body.tag) {
    revalidateTag(body.tag);
    return NextResponse.json({ revalidated: true, type: "tag", value: body.tag });
  }

  // ── Path-based purge ────────────────────────────────────────────────────────
  if (body.path) {
    revalidatePath(body.path);
    return NextResponse.json({ revalidated: true, type: "path", value: body.path });
  }

  return NextResponse.json(
    { error: "Provide either 'tag' or 'path' in the request body" },
    { status: 422 },
  );
}
