"use client";

import { useTransition, useState } from "react";
import { loginAction } from "@/lib/actions";

export function LoginForm() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(fd: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await loginAction(fd);
      // loginAction redirects on success — we only get here on failure
      if (result && !result.ok) {
        setError(result.error ?? "Login failed");
      }
    });
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="block text-xs font-medium text-slate-400" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          placeholder="you@example.com"
          className="w-full px-3 py-2 rounded-lg bg-slate-800/60 border border-white/8 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-xs font-medium text-slate-400" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          placeholder="••••••••"
          className="w-full px-3 py-2 rounded-lg bg-slate-800/60 border border-white/8 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
        />
      </div>

      {error && (
        <p className="text-xs text-red-400 font-mono">{error}</p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full py-2 rounded-lg bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white text-sm font-medium transition-colors"
      >
        {isPending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
