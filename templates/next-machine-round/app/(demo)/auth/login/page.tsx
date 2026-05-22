/**
 * DEMO: Login page
 *
 * - Form POSTs to loginAction (Server Action) — no API route needed
 * - On success: loginAction sets cookie + redirects to /auth
 * - LoginForm is "use client" only so it can show pending/error state
 */
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Login" };

import { LoginForm } from "./LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white">Sign in</h1>
          <p className="text-sm text-slate-400 mt-1">
            Demo credentials: any email + any password
          </p>
        </div>
        <LoginForm />
        <p className="text-center text-xs text-slate-600">
          Cookie-based session · No real auth · Interview demo only
        </p>
      </div>
    </div>
  );
}
