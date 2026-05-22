"use client";

/**
 * Client shell that calls Server Actions.
 * Owns all interactive form state; actual mutations run on the server.
 */
import { useTransition, useState } from "react";
import { createPostAction, revalidatePostsAction } from "@/lib/actions";
import type { Post } from "@/lib/db";

interface Props {
  initialPosts: Post[];
}

export function ActionForms({ initialPosts }: Props) {
  const [posts, setPosts] = useState(initialPosts);
  const [result, setResult] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function handleCreate(fd: FormData) {
    startTransition(async () => {
      const res = await createPostAction(fd);
      if (res.ok) {
        setPosts((prev) => [res.post, ...prev].slice(0, 5));
        setResult(`✓ Created "${res.post.title}"`);
      } else {
        setResult(`✗ ${res.error ?? "Unknown error"}`);
      }
    });
  }

  async function handleRevalidate() {
    startTransition(async () => {
      await revalidatePostsAction();
      setResult("✓ Cache revalidated — page will refresh data on next visit");
    });
  }

  return (
    <div className="space-y-6">
      {/* ── Create post form ── */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-slate-300">Create post (Server Action)</h2>
        <form action={handleCreate} className="flex gap-2">
          <input
            name="title"
            required
            placeholder="Post title…"
            className="flex-1 px-3 py-2 rounded-lg bg-slate-800/60 border border-white/8 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
          />
          <button
            type="submit"
            disabled={isPending}
            className="px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white text-sm font-medium transition-colors"
          >
            {isPending ? "Saving…" : "Create"}
          </button>
        </form>
        {result && (
          <p className={`text-xs font-mono ${result.startsWith("✓") ? "text-emerald-400" : "text-red-400"}`}>
            {result}
          </p>
        )}
      </div>

      {/* ── Post list ── */}
      <div className="space-y-2">
        <h2 className="text-sm font-semibold text-slate-300">Recent posts</h2>
        <ul className="space-y-2">
          {posts.map((post) => (
            <li
              key={post.id}
              className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-800/60 gap-3"
            >
              <span className="text-sm text-slate-200 truncate">{post.title}</span>
              <span className="text-[10px] text-slate-500 font-mono shrink-0">{post.id}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* ── Revalidate button ── */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-slate-300">
          Revalidate cache{" "}
          <span className="text-slate-500 font-normal">(calls revalidatePath server-side)</span>
        </h2>
        <button
          onClick={handleRevalidate}
          disabled={isPending}
          className="px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white text-sm font-medium transition-colors"
        >
          {isPending ? "Revalidating…" : "Revalidate /server-actions"}
        </button>
      </div>

      <div className="p-3 rounded-lg border border-white/8 bg-slate-900/60 text-xs text-slate-500 font-mono">
        Network tab → look for a POST to the current URL. That is Next.js auto-generated
        Server Action endpoint — no route.ts needed.
      </div>
    </div>
  );
}
