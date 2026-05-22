/**
 * DEMO: Auth — protected route
 *
 * Key interview points:
 * - requireAuth() reads the cookie server-side and redirects if unauthenticated
 * - No client JS needed to protect this route — the server handles it
 * - Middleware (middleware.ts) can also guard routes before the page renders
 * - In production: use NextAuth.js / Clerk / Auth.js
 */
import type { Metadata } from "next";
import { ConceptBox } from "@/components/ui/ConceptBox";
import { requireAuth } from "@/lib/auth";
import { db } from "@/lib/db";

export const metadata: Metadata = { title: "Auth Demo" };

export default async function AuthPage() {
  // ← redirects to /auth/login if no session cookie
  const session = await requireAuth();

  const users = await db.users.findAll(80);
  const adminCount = users.filter((u) => u.role === "admin").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Authentication</h1>
        <p className="text-sm text-slate-400 mt-1">
          This page is server-protected. You were redirected here because you have a session.
        </p>
      </div>

      <ConceptBox
        title="Auth in 30 seconds"
        points={[
          "requireAuth() reads the session cookie server-side — redirects if missing",
          "Middleware gate: check cookies in middleware.ts before the page loads",
          "Server Actions can call requireAuth() to protect mutations too",
          "Never trust client-side auth checks alone — always verify server-side",
          "Production: NextAuth.js / Clerk / Auth.js handle tokens, OAuth, PKCE",
        ]}
        code={`// lib/auth.ts\nexport async function requireAuth() {\n  const cookieStore = await cookies();\n  const token = cookieStore.get("session")?.value;\n  if (!token) redirect("/auth/login");\n  return verifyToken(token); // returns user\n}\n\n// page.tsx\nexport default async function ProtectedPage() {\n  const session = await requireAuth(); // throws redirect if unauthed\n  return <div>Hello {session.name}</div>;\n}`}
      />

      {/* Session info */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-slate-300">Current session</h2>
        <div className="px-4 py-3 rounded-lg bg-slate-800/60 space-y-2">
          {[
            ["User ID", session.id],
            ["Name", session.name],
            ["Email", session.email],
            ["Role", session.role],
          ].map(([label, value]) => (
            <div key={label} className="flex items-center gap-3">
              <span className="text-xs text-slate-500 w-16 shrink-0">{label}</span>
              <span className={`text-sm font-mono ${
                label === "Role" && value === "admin"
                  ? "text-violet-400"
                  : "text-slate-200"
              }`}>
                {value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* User stats */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-slate-300">User store (server-read)</h2>
        <div className="grid grid-cols-2 gap-3">
          <div className="px-3 py-3 rounded-lg bg-slate-800/60 text-center">
            <div className="text-2xl font-bold text-sky-400 font-mono">{users.length}</div>
            <div className="text-xs text-slate-500 mt-0.5">Total users</div>
          </div>
          <div className="px-3 py-3 rounded-lg bg-slate-800/60 text-center">
            <div className="text-2xl font-bold text-violet-400 font-mono">{adminCount}</div>
            <div className="text-xs text-slate-500 mt-0.5">Admins</div>
          </div>
        </div>
      </div>

      <div className="p-3 rounded-lg border border-white/8 bg-slate-900/60 text-xs text-slate-500 font-mono">
        Try clearing cookies then visiting this URL directly — you will be redirected
        to /auth/login automatically by requireAuth().
      </div>
    </div>
  );
}
