/**
 * DEMO: Metadata API + SEO
 *
 * Key interview points:
 * - Static metadata: export const metadata = { ... }
 * - Dynamic metadata: export async function generateMetadata({ params })
 * - OG images: app/opengraph-image.tsx (ImageResponse) or static file
 * - Robots / sitemap: app/robots.ts + app/sitemap.ts
 * - next/head is gone in App Router — use the Metadata API only
 */
import type { Metadata } from "next";
import { ConceptBox } from "@/components/ui/ConceptBox";

// ─── Static metadata ──────────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: {
    default: "SEO Demo | Next MR",
    template: "%s | Next MR",           // child pages: "RSC Demo | Next MR"
  },
  description: "How the Next.js Metadata API handles SEO, OG images, and structured data.",
  keywords: ["Next.js", "SEO", "metadata", "OpenGraph", "interview"],
  authors: [{ name: "Aditya Raj" }],
  openGraph: {
    title: "SEO Demo | Next MR",
    description: "Next.js Metadata API — static, dynamic, and file-based.",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "https://picsum.photos/seed/nextmr/1200/630",
        width: 1200,
        height: 630,
        alt: "Next Machine Round Demo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SEO Demo | Next MR",
    description: "Next.js Metadata API — static, dynamic, and file-based.",
    images: ["https://picsum.photos/seed/nextmr/1200/630"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  alternates: { canonical: "/seo" },
};

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function SEOPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Metadata API & SEO</h1>
        <p className="text-sm text-slate-400 mt-1">
          App Router replaces next/head with a typed, co-located Metadata API.
        </p>
      </div>

      <ConceptBox
        title="SEO in 30 seconds"
        points={[
          "export const metadata = { title, description, openGraph, … } — static metadata",
          "export async function generateMetadata({ params }) — dynamic per-route metadata",
          "app/opengraph-image.tsx + ImageResponse — programmatic OG image generation",
          "app/robots.ts + app/sitemap.ts — typed file-based robots.txt + XML sitemap",
          "title.template: '%s | Site' — child pages auto-prefix their title",
        ]}
        code={`// Dynamic metadata (e.g. blog post)\nexport async function generateMetadata({ params }: Props): Promise<Metadata> {\n  const post = await db.posts.findById(params.id);\n  return {\n    title: post.title,\n    openGraph: { title: post.title, type: "article" },\n  };\n}`}
      />

      {/* Rendered metadata tags for this page */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-slate-300">
          Metadata emitted for this page
        </h2>
        <div className="rounded-lg bg-slate-900/80 border border-white/8 p-4 overflow-x-auto">
          <pre className="text-xs text-slate-300 font-mono leading-relaxed whitespace-pre">{[
            `<title>SEO Demo | Next MR</title>`,
            `<meta name="description" content="How the Next.js Metadata API…" />`,
            `<meta property="og:title" content="SEO Demo | Next MR" />`,
            `<meta property="og:image" content="https://picsum.photos/…" />`,
            `<meta name="twitter:card" content="summary_large_image" />`,
            `<link rel="canonical" href="/seo" />`,
            `<meta name="robots" content="index, follow" />`,
          ].join("\n")}</pre>
        </div>
      </div>

      {/* OG image approaches */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-slate-300">OG image strategies</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-slate-300 border-collapse">
            <thead>
              <tr className="text-left text-slate-500">
                <th className="pb-2 pr-4 font-medium">Approach</th>
                <th className="pb-2 pr-4 font-medium">File</th>
                <th className="pb-2 font-medium">Best for</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {[
                ["Static file",   "app/opengraph-image.png",   "Same image for all pages"],
                ["ImageResponse", "app/opengraph-image.tsx",   "Dynamic text/brand colors"],
                ["Per-route",     "app/blog/[id]/opengraph-image.tsx", "Per-post OG with data"],
                ["metadata.openGraph.images", "any page.tsx",  "External CDN images"],
              ].map(([approach, file, use]) => (
                <tr key={approach}>
                  <td className="py-2 pr-4 font-mono text-sky-400 whitespace-nowrap">{approach}</td>
                  <td className="py-2 pr-4 font-mono text-slate-400 text-[11px]">{file}</td>
                  <td className="py-2 text-slate-500">{use}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="p-3 rounded-lg border border-white/8 bg-slate-900/60 text-xs text-slate-500 font-mono">
        View source → &lt;head&gt; — all metadata is injected server-side.
        No client JS required. Use opengraph.xyz to preview the OG card.
      </div>
    </div>
  );
}
