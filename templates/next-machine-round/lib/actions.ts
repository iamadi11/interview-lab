"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "./db";

// ─── Types ────────────────────────────────────────────────────────────────────
export type ActionState<T = void> =
  | { ok: true; data: T }
  | { ok: false; error: string; fieldErrors?: Record<string, string[]> };

// ─── Auth actions ─────────────────────────────────────────────────────────────

const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Min 6 characters"),
});

export async function loginAction(formData: FormData): Promise<ActionState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return {
      ok: false,
      error: "Validation failed",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  // Demo: accept any valid email/password
  const cookieStore = await cookies();
  cookieStore.set("session", `demo-token-${Date.now()}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24, // 1 day
    path: "/",
  });

  redirect("/auth");
}

export async function logoutAction(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete("session");
  redirect("/auth/login");
}

// ─── Post actions ─────────────────────────────────────────────────────────────

const postSchema = z.object({
  title: z.string().min(3, "Title too short").max(100),
  body: z.string().min(10, "Body too short"),
});

export async function createPostAction(
  formData: FormData
): Promise<{ ok: true; post: import("./db").Post } | { ok: false; error: string; fieldErrors?: Record<string, string[]> }> {
  const parsed = postSchema.safeParse({
    title: formData.get("title"),
    body: formData.get("body") ?? "Created via Server Action demo.",
  });

  if (!parsed.success) {
    return {
      ok: false,
      error: "Validation failed",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const post = await db.posts.create({ ...parsed.data, authorId: "u1" });

  // Revalidate the posts list page so ISR/cache is cleared
  revalidatePath("/server-actions");
  revalidateTag("posts");

  return { ok: true, post };
}

// ─── Revalidation actions ─────────────────────────────────────────────────────

export async function revalidatePostsAction(): Promise<ActionState> {
  revalidatePath("/caching");
  revalidateTag("posts");
  return { ok: true, data: undefined };
}
