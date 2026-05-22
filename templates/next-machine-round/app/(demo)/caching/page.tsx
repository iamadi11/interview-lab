/**
 * DEMO: Next.js Caching
 *
 * Key interview points:
 * - fetch() cache options: force-cache, no-store, next.revalidate
 * - Route segment config: export const revalidate / dynamic
 * - revalidatePath / revalidateTag for on-demand purge
 * - 'use cache' directive (Next.js 15+ experimental) caches any async function
 * - unstable_cache wraps non-fetch async functions
 */
import type { Metadata } from "next";
import { ConceptBox } from "@/components/ui/ConceptBox";
import { db } from "@/lib/db";
import { RevalidateButton } from "./RevalidateButton";

export const metadata: Metadata = { title: "Caching Demo" };

// Route segment config — revalidate this page every 60 s (ISR-style)
export const revalidate = 60;

// Simulated cached fetch with timestamp to prove caching
async function getCachedData() {
  // In a real app this would be: fetch(url, { next: { revalidate: 60, tags: ["posts"] } })
  // Here we use the in-memory DB and tag it manually for demo purposes
  const posts = await db.posts.findAll(100);
  return { posts: posts.slice(0, 4), fetchedAt: new Date().toISOString() };
}

export default async function CachingPage() {
  const { posts, fetchedAt } = await getCachedData();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Caching</h1>
        <p className="text-sm text-slate-400 mt-1">
          Next.js has four cache layers. Know which one to reach for.
        </p>
      </div>

      <ConceptBox
        title="Caching in 30 seconds"
        points={[
          "fetch cache: force-cache (default), no-store, next.revalidate, next.tags",
          "Route segment: export const revalidate = 60 — whole route revalidates on interval",
          "revalidatePath('/path') — purge by URL; revalidateTag(tag, 'max') — purge by tag (v16+)",
          "'use cache' directive (experimental) — cache any async function at the call site",
          "unstable_cache — wraps non-fetch async functions (ORM queries, etc.)",
        ]}
        code={`// fetch with tag\nconst data = await fetch(url, {\n  next: { revalidate: 60, tags: ["posts"] },\n});\n\n// on-demand purge in a Server Action\n"use server";\nexport async function purge() {\n  // v16+: pass cacheLife profile as second arg\n  revalidateTag("posts", "max");\n}`}
      />

      {/* Cache layers reference table */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-slate-300">Cache layers at a glance</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-slate-300 border-collapse">
            <thead>
              <tr className="text-left text-slate-500">
                <th className="pb-2 pr-4 font-medium">Layer</th>
                <th className="pb-2 pr-4 font-medium">What it caches</th>
                <th className="pb-2 font-medium">Invalidation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {[
                ["Request Memoisation", "fetch() deduplication within one render", "Automatic per-request"],
                ["Data Cache", "fetch() responses across requests", "revalidate / revalidateTag"],
                ["Full Route Cache", "RSC + HTML for static routes", "On redeploy or revalidate"],
                ["Router Cache", "Client-side prefetched segments", "30 s dynamic, 5 min static"],
              ].map(([layer, what, how]) => (
                <tr key={layer}>
                  <td className="py-2 pr-4 font-mono text-sky-400 whitespace-nowrap">{layer}</td>
                  <td className="py-2 pr-4 text-slate-400">{what}</td>
                  <td className="py-2 text-slate-500">{how}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Live demo — shows the cached fetchedAt timestamp */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-slate-300">
          Cached data{" "}
          <span className="text-slate-500 font-normal">
            (revalidates every 60 s — timestamp proves caching)
          </span>
        </h2>
        <div className="px-3 py-2 rounded-lg bg-slate-800/60 text-xs font-mono text-emerald-400">
          Last fetched: {fetchedAt}
        </div>
        <ul className="space-y-2">
          {posts.map((post) => (
            <li key={post.id} className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-800/60">
              <span className="text-sm text-slate-200 truncate">{post.title}</span>
              <span className="text-xs text-slate-500">{post.views.toLocaleString()} views</span>
            </li>
          ))}
        </ul>
      </div>

      {/* On-demand revalidation */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-slate-300">On-demand revalidation</h2>
        <RevalidateButton />
      </div>

      <div className="p-3 rounded-lg border border-white/8 bg-slate-900/60 text-xs text-slate-500 font-mono">
        Hard-reload the page multiple times — fetchedAt stays the same until the 60 s
        window expires or you click Revalidate above.
      </div>
    </div>
  );
}
