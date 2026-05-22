/**
 * DEMO: Server Actions
 *
 * Key interview points:
 * - "use server" marks a function (or whole file) as a Server Action
 * - Called like normal async functions from Client Components
 * - No API route needed — Next.js wires up the POST endpoint automatically
 * - Returns serialisable data; can call revalidatePath / redirect
 * - useFormStatus gives pending state without extra useState
 */
import type { Metadata } from "next";
import { ConceptBox } from "@/components/ui/ConceptBox";
import { db } from "@/lib/db";
import { ActionForms } from "./ActionForms";

export const metadata: Metadata = { title: "Server Actions Demo" };

export default async function ServerActionsPage() {
  // Load existing posts server-side for the initial list
  const posts = await db.posts.findAll();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Server Actions</h1>
        <p className="text-sm text-slate-400 mt-1">
          Mutations that run <em>on the server</em>, called directly from Client Components.
        </p>
      </div>

      <ConceptBox
        title="Server Actions in 30 seconds"
        points={[
          "'use server' at top of file — every export becomes a Server Action",
          "Called like normal async functions; Next.js auto-creates a POST endpoint",
          "Can use DB, cookies, revalidatePath — full server context",
          "useFormStatus().pending gives loading state without useState",
          "Zod validates input before any DB write — always validate server-side",
        ]}
        code={`// lib/actions.ts\n"use server";\nexport async function createPost(fd: FormData) {\n  const title = fd.get("title") as string;\n  const post = await db.posts.create({ title, ... });\n  revalidatePath("/server-actions");\n  return { ok: true, post };\n}`}
      />

      {/* Client component owns all interactive form state */}
      <ActionForms initialPosts={posts.slice(0, 5)} />
    </div>
  );
}
