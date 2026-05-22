/**
 * DEMO: React Server Components
 *
 * Key interview points:
 * - No "use client" = Server Component (default in App Router)
 * - Can be async — fetch data directly, no useEffect/useState
 * - Zero JS sent to client for this file
 * - Cannot use browser APIs, hooks, or event handlers
 */
import type { Metadata } from "next";
import Image from "next/image";
import { ConceptBox } from "@/components/ui/ConceptBox";
import { db } from "@/lib/db";
import { ClientCounter } from "./ClientCounter";

export const metadata: Metadata = { title: "RSC Demo" };

// ✅ RSC: async component, fetches on the server
async function UserList() {
  // Simulated DB call — runs on server, result HTML-streamed to client
  const users = await db.users.findAll(200);

  return (
    <ul className="space-y-2">
      {users.slice(0, 5).map((user) => (
        <li key={user.id} className="flex items-center gap-3 px-3 py-2 rounded-lg bg-slate-800/60">
          <Image
            src={user.avatar}
            alt={user.name}
            width={28}
            height={28}
            className="rounded-full bg-slate-700"
          />
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-slate-200">{user.name}</div>
            <div className="text-xs text-slate-500 truncate">{user.email}</div>
          </div>
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
            user.role === "admin"
              ? "bg-violet-500/20 text-violet-300"
              : "bg-slate-700 text-slate-400"
          }`}>
            {user.role}
          </span>
        </li>
      ))}
    </ul>
  );
}

export default async function RSCPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">React Server Components</h1>
        <p className="text-sm text-slate-400 mt-1">
          Server Components run <em>only</em> on the server. No hydration, no client bundle.
        </p>
      </div>

      <ConceptBox
        title="RSC in 30 seconds"
        points={[
          "Default in App Router — no 'use client' needed",
          "Can be async — fetch data directly in the component body",
          "HTML is streamed to the browser, zero JS for the component itself",
          "Cannot use useState, useEffect, onClick, or browser APIs",
          "Mix RSC + Client Components by importing Client into Server",
        ]}
        code={`// Server Component (default)\nasync function UserList() {\n  const users = await db.users.findAll(); // ← runs on server\n  return <ul>{users.map(u => <li>{u.name}</li>)}</ul>;\n}`}
      />

      {/* ✅ Server Component: fetches users server-side */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-slate-300">
          Server Component — user list (fetched on server)
        </h2>
        <UserList />
      </div>

      {/* ✅ Client Component: needs useState/onClick */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-slate-300">
          Client Component — interactive counter (needs useState)
        </h2>
        <ClientCounter />
      </div>

      <div className="p-3 rounded-lg border border-white/8 bg-slate-900/60 text-xs text-slate-500 font-mono">
        Open DevTools Network tab → no JS file is sent for this page component.
        Only the ClientCounter chunk is hydrated.
      </div>
    </div>
  );
}
