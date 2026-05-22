/**
 * DEMO: Edge Runtime
 *
 * Key interview points:
 * - export const runtime = "edge" opts a route into the Edge runtime
 * - Edge runs on V8 isolates at CDN PoPs — no Node.js APIs (fs, crypto subset only)
 * - Ultra-low latency for geo-routing, A/B flags, auth token checks
 * - On Vercel, Fluid Compute (Node.js) is preferred for most use cases;
 *   Edge shines when you need <5 ms response worldwide with no cold start
 * - Middleware always runs on Edge by default
 */
import type { Metadata } from "next";
import { headers } from "next/headers";
import { ConceptBox } from "@/components/ui/ConceptBox";

export const metadata: Metadata = { title: "Edge Runtime Demo" };

// ← opt this route into Edge runtime
export const runtime = "edge";

export default async function EdgePage() {
  const headerStore = await headers();

  // These headers are injected by Vercel at the edge PoP
  const country = headerStore.get("x-vercel-ip-country") ?? "unknown";
  const city    = headerStore.get("x-vercel-ip-city")    ?? "unknown";
  const region  = headerStore.get("x-vercel-ip-region")  ?? "unknown";
  const ip      = headerStore.get("x-forwarded-for")     ?? "unknown";
  const ua      = headerStore.get("user-agent")          ?? "unknown";

  // Custom header injected by middleware.ts
  const requestId = headerStore.get("x-request-id") ?? "not-set";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Edge Runtime</h1>
        <p className="text-sm text-slate-400 mt-1">
          This page renders at the CDN edge — no Node.js, V8 isolate only.
        </p>
      </div>

      <ConceptBox
        title="Edge in 30 seconds"
        points={[
          "export const runtime = 'edge' — opts a route or API handler into Edge",
          "Runs on V8 isolates at CDN PoPs — no cold start, ~1 ms startup",
          "No Node.js APIs: no fs, no child_process, limited crypto subset",
          "Best for: geo-routing, auth checks, header manipulation, A/B flags",
          "Vercel prefers Fluid Compute (Node.js) for general use; Edge for speed-critical paths",
        ]}
        code={`// Edge API route\nexport const runtime = "edge";\n\nexport function GET(req: Request) {\n  const country = req.headers.get("x-vercel-ip-country");\n  return Response.json({ country, ts: Date.now() });\n}`}
      />

      {/* Geo + request headers read at the edge */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-slate-300">
          Request context{" "}
          <span className="text-slate-500 font-normal">(read from edge headers)</span>
        </h2>
        <div className="rounded-lg bg-slate-800/60 divide-y divide-white/5">
          {[
            ["Country",    country],
            ["City",       city],
            ["Region",     region],
            ["IP",         ip],
            ["Request ID", requestId],
            ["User Agent", ua.slice(0, 60) + (ua.length > 60 ? "…" : "")],
          ].map(([label, value]) => (
            <div key={label} className="flex items-start gap-3 px-4 py-2">
              <span className="text-xs text-slate-500 w-24 shrink-0 pt-0.5">{label}</span>
              <span className="text-xs font-mono text-slate-300 break-all">{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Edge vs Node comparison */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-slate-300">Edge vs Node.js (Fluid Compute)</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-slate-300 border-collapse">
            <thead>
              <tr className="text-left text-slate-500">
                <th className="pb-2 pr-4 font-medium">Dimension</th>
                <th className="pb-2 pr-4 font-medium">Edge</th>
                <th className="pb-2 font-medium">Node.js (Fluid)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {[
                ["Cold start",   "~1 ms",              "~50–200 ms (mitigated by Fluid)"],
                ["Runtime",      "V8 isolate",         "Node.js 24"],
                ["APIs",         "Fetch, Web Crypto",  "Full Node.js + npm"],
                ["Bundle limit", "4 MB",               "250 MB"],
                ["Use case",     "Auth, geo, A/B",     "DB queries, file I/O, AI"],
              ].map(([dim, edge, node]) => (
                <tr key={dim}>
                  <td className="py-2 pr-4 text-slate-400 whitespace-nowrap">{dim}</td>
                  <td className="py-2 pr-4 font-mono text-sky-400">{edge}</td>
                  <td className="py-2 font-mono text-emerald-400">{node}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="p-3 rounded-lg border border-white/8 bg-slate-900/60 text-xs text-slate-500 font-mono">
        On Vercel: this page is served from the PoP closest to you. The
        x-vercel-ip-country header is injected automatically — no SDK needed.
      </div>
    </div>
  );
}
