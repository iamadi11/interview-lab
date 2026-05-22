/**
 * DEMO: Incremental Static Regeneration (ISR)
 *
 * Key interview points:
 * - export const revalidate = N  →  regenerate this page every N seconds
 * - export const dynamic = "force-static"  →  never SSR, always use cache
 * - generateStaticParams() → pre-render a list of dynamic routes at build time
 * - On-demand: revalidatePath / revalidateTag purge the Full Route Cache immediately
 * - ISR = Static speed + fresh data — best of both worlds
 */
import type { Metadata } from "next";
import { ConceptBox } from "@/components/ui/ConceptBox";
import { db } from "@/lib/db";

export const metadata: Metadata = { title: "ISR Demo" };

// ← THIS is ISR: regenerate at most every 30 seconds
export const revalidate = 30;

export default async function ISRPage() {
  const posts = await db.posts.findAll(120);
  const generatedAt = new Date().toISOString();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">ISR — Incremental Static Regeneration</h1>
        <p className="text-sm text-slate-400 mt-1">
          Static performance + fresh data. Page rebuilds in the background every 30 s.
        </p>
      </div>

      <ConceptBox
        title="ISR in 30 seconds"
        points={[
          "export const revalidate = 30 — page rebuilds every 30 s (stale-while-revalidate)",
          "First visitor after expiry gets stale page; rebuild triggers in background",
          "Next visitor gets the freshly built page — zero cold-start penalty",
          "revalidatePath() / revalidateTag() force immediate rebuild on demand",
          "generateStaticParams() pre-renders dynamic routes at build time",
        ]}
        code={`// app/posts/[id]/page.tsx\nexport const revalidate = 60; // rebuild every 60 s\n\nexport async function generateStaticParams() {\n  const posts = await db.posts.findAll();\n  return posts.map((p) => ({ id: p.id }));\n}\n\nexport default async function PostPage({ params }) {\n  const post = await db.posts.findById(params.id);\n  return <article>{post.title}</article>;\n}`}
      />

      {/* Proof of ISR — timestamp stays frozen until revalidation window expires */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-slate-300">
          Page generated at{" "}
          <span className="text-slate-500 font-normal">(frozen until next revalidation)</span>
        </h2>
        <div className="px-3 py-3 rounded-lg bg-slate-800/60 font-mono text-emerald-400 text-sm">
          {generatedAt}
        </div>
        <p className="text-xs text-slate-500">
          Hard-refresh this page repeatedly — the timestamp above stays the same.
          After 30 s, Next.js regenerates in the background and the next refresh
          shows a newer timestamp.
        </p>
      </div>

      {/* Post list rendered at build / revalidation time */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-slate-300">Posts (rendered statically)</h2>
        <ul className="space-y-2">
          {posts.slice(0, 5).map((post) => (
            <li
              key={post.id}
              className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-800/60"
            >
              <span className="text-sm text-slate-200 truncate">{post.title}</span>
              <div className="flex items-center gap-3 shrink-0 ml-3">
                <span className="text-xs text-slate-500">{post.views.toLocaleString()} views</span>
                <span className="text-[10px] font-mono text-slate-600">{post.id}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* ISR vs SSG vs SSR comparison */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-slate-300">When to use what</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-slate-300 border-collapse">
            <thead>
              <tr className="text-left text-slate-500">
                <th className="pb-2 pr-4 font-medium">Strategy</th>
                <th className="pb-2 pr-4 font-medium">Config</th>
                <th className="pb-2 font-medium">Best for</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {[
                ["SSG", "export const dynamic = 'force-static'", "Docs, marketing — never changes"],
                ["ISR", "export const revalidate = N", "Blogs, dashboards — changes occasionally"],
                ["SSR", "export const dynamic = 'force-dynamic'", "Personalised, real-time data"],
                ["PPR", "experimental.ppr = true + <Suspense>", "Mix static shell + dynamic islands"],
              ].map(([strategy, config, use]) => (
                <tr key={strategy}>
                  <td className="py-2 pr-4 font-mono text-sky-400 whitespace-nowrap">{strategy}</td>
                  <td className="py-2 pr-4 font-mono text-slate-400 text-[11px]">{config}</td>
                  <td className="py-2 text-slate-500">{use}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
