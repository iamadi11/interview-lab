"use client";

// ✅ Client Component — needs useState/onClick, minimal scope
import { useState } from "react";

export function ClientCounter() {
  const [count, setCount] = useState(0);

  return (
    <div className="flex items-center gap-4 px-4 py-3 rounded-lg bg-slate-800/60 border border-white/8">
      <button
        onClick={() => setCount((c) => c - 1)}
        className="w-8 h-8 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-bold transition-colors"
      >
        −
      </button>
      <span className="font-mono text-xl font-bold text-sky-400 w-8 text-center">{count}</span>
      <button
        onClick={() => setCount((c) => c + 1)}
        className="w-8 h-8 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-bold transition-colors"
      >
        +
      </button>
      <span className="text-xs text-slate-500 ml-2">
        "use client" — only this component hydrates
      </span>
    </div>
  );
}
