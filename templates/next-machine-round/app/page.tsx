// ✅ SERVER COMPONENT — runs on server, zero client JS sent for this file
// This is the default in App Router. No "use client" = Server Component.

import Link from "next/link";
import { DemoCard } from "@/components/ui/DemoCard";

const DEMOS = [
  {
    href: "/rsc",
    title: "React Server Components",
    description: "Data fetching on the server, zero client JS. Compare RSC vs Client Component patterns.",
    badge: "Core concept",
    color: "sky",
    concept: "No useState/useEffect — fetch directly in async component",
  },
  {
    href: "/streaming",
    title: "Streaming + Suspense",
    description: "Stream slow data from the server. Page shell renders instantly, content streams in.",
    badge: "UX pattern",
    color: "violet",
    concept: "<Suspense fallback={<Skeleton/>}> wraps async components",
  },
  {
    href: "/server-actions",
    title: "Server Actions",
    description: "Mutate data with functions, not API routes. Progressive enhancement built-in.",
    badge: "Mutations",
    color: "emerald",
    concept: "'use server' → call like a function, works without JS",
  },
  {
    href: "/caching",
    title: "Caching Strategies",
    description: "fetch cache options, unstable_cache, revalidatePath, revalidateTag.",
    badge: "Performance",
    color: "amber",
    concept: "force-cache / no-store / revalidate: 60",
  },
  {
    href: "/isr",
    title: "ISR — Incremental Static Regeneration",
    description: "Static page that auto-regenerates in the background after revalidation window.",
    badge: "Rendering",
    color: "rose",
    concept: "export const revalidate = 60",
  },
  {
    href: "/auth",
    title: "Auth Demo",
    description: "Cookie-based session auth with middleware protection. Login/logout flow.",
    badge: "Auth",
    color: "indigo",
    concept: "middleware.ts → read cookie → redirect if unauthenticated",
  },
  {
    href: "/edge",
    title: "Edge Runtime",
    description: "Route that runs at the edge. Faster cold starts, geolocation, A/B testing.",
    badge: "Runtime",
    color: "teal",
    concept: "export const runtime = 'edge'",
  },
  {
    href: "/seo",
    title: "SEO + Metadata",
    description: "Static metadata, generateMetadata(), OG images, canonical URLs.",
    badge: "SEO",
    color: "orange",
    concept: "export const metadata / export async function generateMetadata()",
  },
] as const;

// RSC: fetch at build/request time, no useEffect needed
async function getServerTime(): Promise<string> {
  // Simulates a DB call — in RSC, this runs on the server
  return new Date().toISOString();
}

export default async function HomePage() {
  const serverTime = await getServerTime();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Server Component · rendered at {serverTime}
        </div>
        <h1 className="text-3xl font-bold text-white">
          Next.js 15{" "}
          <span className="bg-gradient-to-r from-sky-400 to-violet-500 bg-clip-text text-transparent">
            Machine Round
          </span>
        </h1>
        <p className="text-slate-400 max-w-xl">
          App Router interview workspace. Each demo is a self-contained page
          covering one core concept. Start at <code className="text-sky-400">/rsc</code> and work down.
        </p>
      </div>

      {/* Demo grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {DEMOS.map((demo) => (
          <DemoCard key={demo.href} {...demo} />
        ))}
      </div>

      {/* Quick reference */}
      <div className="p-4 rounded-xl border border-white/8 bg-slate-900/60 text-xs font-mono space-y-1 text-slate-500">
        <div className="text-slate-400 font-semibold mb-2">Quick launch</div>
        <div><span className="text-sky-400">pnpm next-round</span>   → http://localhost:3200</div>
        <div><span className="text-emerald-400">pnpm typecheck</span>  → zero errors</div>
      </div>
    </div>
  );
}
