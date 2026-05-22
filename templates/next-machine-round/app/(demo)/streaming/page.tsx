/**
 * DEMO: Streaming + Suspense
 *
 * Key interview points:
 * - loading.tsx = automatic Suspense boundary at the route level
 * - <Suspense> inside a page = fine-grained streaming for sub-components
 * - Slow components stream in independently — fast ones don't wait
 * - React 19 "use" hook can unwrap promises in Client Components
 */
import { Suspense } from "react";
import type { Metadata } from "next";
import { ConceptBox } from "@/components/ui/ConceptBox";
import { db } from "@/lib/db";

export const metadata: Metadata = { title: "Streaming Demo" };

// ─── Slow server component (800 ms) ──────────────────────────────────────────
async function SlowPosts() {
  const posts = await db.posts.findAll(800); // intentional delay

  return (
    <ul className="space-y-2">
      {posts.slice(0, 4).map((post) => (
        <li
          key={post.id}
          className="flex items-start justify-between px-3 py-2 rounded-lg bg-slate-800/60 gap-3"
        >
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-slate-200 truncate">{post.title}</div>
            <div className="text-xs text-slate-500 mt-0.5">{post.views.toLocaleString()} views</div>
          </div>
          <span className="text-[10px] text-slate-500 font-mono shrink-0">
            {new Date(post.createdAt).toLocaleDateString()}
          </span>
        </li>
      ))}
    </ul>
  );
}

// ─── Fast server component (50 ms) ───────────────────────────────────────────
async function FastStats() {
  const users = await db.users.findAll(50);
  const posts = await db.posts.findAll(50);
  const admins = users.filter((u) => u.role === "admin").length;

  return (
    <div className="grid grid-cols-3 gap-3">
      {[
        { label: "Total Users", value: users.length },
        { label: "Total Posts", value: posts.length },
        { label: "Admins", value: admins },
      ].map(({ label, value }) => (
        <div key={label} className="px-3 py-3 rounded-lg bg-slate-800/60 text-center">
          <div className="text-2xl font-bold text-sky-400 font-mono">{value}</div>
          <div className="text-xs text-slate-500 mt-0.5">{label}</div>
        </div>
      ))}
    </div>
  );
}

// ─── Skeleton fallbacks ───────────────────────────────────────────────────────
function StatsSkeleton() {
  return (
    <div className="grid grid-cols-3 gap-3 animate-pulse">
      {[0, 1, 2].map((i) => (
        <div key={i} className="h-16 rounded-lg bg-slate-800/60" />
      ))}
    </div>
  );
}

function PostsSkeleton() {
  return (
    <div className="space-y-2 animate-pulse">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="h-12 rounded-lg bg-slate-800/60" />
      ))}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function StreamingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Streaming + Suspense</h1>
        <p className="text-sm text-slate-400 mt-1">
          Fast components render immediately. Slow ones stream in without blocking.
        </p>
      </div>

      <ConceptBox
        title="Streaming in 30 seconds"
        points={[
          "loading.tsx wraps the whole page in a Suspense boundary automatically",
          "<Suspense fallback={...}> gives per-component streaming control",
          "Slow components don't block fast ones — HTML flushes in chunks",
          "Works with any async Server Component — no extra config needed",
          "React 19 'use(promise)' lets Client Components suspend on data too",
        ]}
        code={`// Fine-grained streaming\nexport default function Page() {\n  return (\n    <>\n      <Suspense fallback={<StatsSkeleton />}>\n        <FastStats />   {/* renders ~50 ms */}\n      </Suspense>\n      <Suspense fallback={<PostsSkeleton />}>\n        <SlowPosts />   {/* streams in ~800 ms */}\n      </Suspense>\n    </>\n  );\n}`}
      />

      {/* Stats: fast — renders quickly */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-slate-300">
          Fast component <span className="text-slate-500 font-normal">(~50 ms latency)</span>
        </h2>
        <Suspense fallback={<StatsSkeleton />}>
          <FastStats />
        </Suspense>
      </div>

      {/* Posts: slow — streams in after 800 ms */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-slate-300">
          Slow component <span className="text-slate-500 font-normal">(~800 ms latency — watch it stream in)</span>
        </h2>
        <Suspense fallback={<PostsSkeleton />}>
          <SlowPosts />
        </Suspense>
      </div>

      <div className="p-3 rounded-lg border border-white/8 bg-slate-900/60 text-xs text-slate-500 font-mono">
        Open DevTools → Network tab → Fetch/XHR → watch the document response
        arrive in chunks. FastStats HTML comes first, SlowPosts streams ~750 ms later.
      </div>
    </div>
  );
}
