import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Timer, FileText, Braces, Code2 } from "lucide-react";
import { EnvCard } from "@/components/cards/EnvCard";
import { TOOL_CARDS } from "@/data/sections";
import { useTimer } from "@/hooks/useTimer";

function formatTime(s: number) {
  return `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;
}

const phaseColor: Record<string, string> = {
  idle: "text-slate-400",
  warmup: "text-sky-400",
  coding: "text-emerald-400",
  review: "text-amber-400",
  done: "text-red-400",
};

function TimerTool({ onClose }: { onClose: () => void }) {
  const [minutes, setMinutes] = useState(60);
  const timer = useTimer(minutes);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-white flex items-center gap-2"><Timer size={16} className="text-amber-400" /> Timer</h3>
        <button onClick={onClose} className="text-slate-500 hover:text-slate-300"><X size={16} /></button>
      </div>

      <div className="text-center space-y-2">
        <div className={`font-mono text-6xl font-bold tabular-nums ${phaseColor[timer.phase]}`}>
          {formatTime(timer.remaining)}
        </div>
        <div className="text-xs uppercase tracking-widest text-slate-500">{timer.phase}</div>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-sky-500 to-violet-500 rounded-full"
          animate={{ width: `${timer.progressPct}%` }}
          transition={{ duration: 0.8 }}
        />
      </div>

      {/* Duration buttons */}
      <div className="flex gap-2">
        {[30, 45, 60, 90].map((m) => (
          <button
            key={m}
            onClick={() => { setMinutes(m); timer.reset(m); }}
            className={`flex-1 py-1.5 rounded-lg text-xs font-medium border transition-all ${
              minutes === m
                ? "bg-sky-500/20 border-sky-500/40 text-sky-300"
                : "border-white/10 bg-white/5 text-slate-400 hover:bg-white/10"
            }`}
          >
            {m}m
          </button>
        ))}
      </div>

      {/* Controls */}
      <div className="flex gap-2">
        {!timer.isRunning ? (
          <button
            onClick={timer.start}
            disabled={timer.phase === "done"}
            className="flex-1 py-2 rounded-lg text-sm font-semibold bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/30 transition-all disabled:opacity-40"
          >
            {timer.elapsed === 0 ? "Start" : "Resume"}
          </button>
        ) : (
          <button
            onClick={timer.pause}
            className="flex-1 py-2 rounded-lg text-sm font-semibold bg-amber-500/20 border border-amber-500/30 text-amber-300 hover:bg-amber-500/30 transition-all"
          >
            Pause
          </button>
        )}
        <button
          onClick={() => timer.reset()}
          className="px-4 py-2 rounded-lg text-sm font-medium border border-white/10 bg-white/5 text-slate-400 hover:bg-white/10 transition-all"
        >
          Reset
        </button>
      </div>
    </div>
  );
}

function NotesTool({ onClose }: { onClose: () => void }) {
  const [notes, setNotes] = useState("## Problem\n\n## Approach\n\n## Complexity\n\n## Edge cases\n");
  return (
    <div className="space-y-3 h-full flex flex-col">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-white flex items-center gap-2"><FileText size={16} className="text-sky-400" /> Notes</h3>
        <button onClick={onClose} className="text-slate-500 hover:text-slate-300"><X size={16} /></button>
      </div>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        className="flex-1 min-h-48 w-full bg-slate-900 border border-white/10 rounded-lg p-3 text-sm font-mono text-slate-300 placeholder:text-slate-600 outline-none focus:border-sky-500/40 resize-none"
        placeholder="Write your notes here…"
      />
      <div className="text-xs text-slate-600">{notes.length} chars · Markdown supported</div>
    </div>
  );
}

function JsonTool({ onClose }: { onClose: () => void }) {
  const [input, setInput] = useState('{\n  "name": "example",\n  "value": 42\n}');
  const [error, setError] = useState("");

  const format = () => {
    try {
      setInput(JSON.stringify(JSON.parse(input), null, 2));
      setError("");
    } catch (e) {
      setError((e as Error).message);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-white flex items-center gap-2"><Braces size={16} className="text-orange-400" /> JSON Editor</h3>
        <button onClick={onClose} className="text-slate-500 hover:text-slate-300"><X size={16} /></button>
      </div>
      <textarea
        value={input}
        onChange={(e) => { setInput(e.target.value); setError(""); }}
        className="w-full h-48 bg-slate-900 border border-white/10 rounded-lg p-3 text-sm font-mono text-slate-300 outline-none focus:border-sky-500/40 resize-none"
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
      <button
        onClick={format}
        className="px-4 py-1.5 rounded-lg text-xs font-medium bg-orange-500/20 border border-orange-500/30 text-orange-300 hover:bg-orange-500/30 transition-all"
      >
        Format JSON
      </button>
    </div>
  );
}

function SnippetsTool({ onClose }: { onClose: () => void }) {
  const snippets = [
    { label: "debounce", code: "const debounce = (fn, delay) => {\n  let t;\n  return (...args) => {\n    clearTimeout(t);\n    t = setTimeout(() => fn(...args), delay);\n  };\n};" },
    { label: "deepClone", code: "const deepClone = (obj) => structuredClone(obj);" },
    { label: "groupBy", code: "const groupBy = (arr, key) =>\n  arr.reduce((acc, item) => {\n    (acc[item[key]] ??= []).push(item);\n    return acc;\n  }, {});" },
    { label: "LRU Cache", code: "class LRUCache {\n  #map = new Map();\n  constructor(capacity) { this.capacity = capacity; }\n  get(key) {\n    if (!this.#map.has(key)) return -1;\n    const v = this.#map.get(key);\n    this.#map.delete(key); this.#map.set(key, v);\n    return v;\n  }\n  put(key, value) {\n    this.#map.delete(key);\n    if (this.#map.size >= this.capacity) this.#map.delete(this.#map.keys().next().value);\n    this.#map.set(key, value);\n  }\n}" },
  ];
  const [copied, setCopied] = useState<string | null>(null);

  const copy = (label: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(label);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-white flex items-center gap-2"><Code2 size={16} className="text-violet-400" /> Snippets</h3>
        <button onClick={onClose} className="text-slate-500 hover:text-slate-300"><X size={16} /></button>
      </div>
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {snippets.map((s) => (
          <div key={s.label} className="rounded-lg border border-white/8 bg-slate-900/60 overflow-hidden">
            <div className="flex items-center justify-between px-3 py-1.5 border-b border-white/8">
              <span className="text-xs font-mono text-violet-300">{s.label}</span>
              <button
                onClick={() => copy(s.label, s.code)}
                className="text-[10px] text-slate-500 hover:text-slate-300 transition-colors"
              >
                {copied === s.label ? "Copied!" : "Copy"}
              </button>
            </div>
            <pre className="px-3 py-2 text-[11px] font-mono text-slate-400 whitespace-pre-wrap overflow-x-auto">{s.code}</pre>
          </div>
        ))}
      </div>
    </div>
  );
}

type ActiveTool = "timer" | "notes" | "json" | "snippets" | null;

export function ToolsSection() {
  const [activeTool, setActiveTool] = useState<ActiveTool>(null);

  const toggle = (tool: ActiveTool) => setActiveTool((t) => (t === tool ? null : tool));

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-5 rounded-2xl border border-rose-500/20 bg-rose-500/5"
      >
        <h2 className="text-lg font-bold bg-gradient-to-r from-rose-400 to-pink-500 bg-clip-text text-transparent">
          Interview Tools
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Timer, notes, whiteboard, API tester, JSON editor, and more — all in one panel.
        </p>
      </motion.div>

      {/* Inline tool panel */}
      <AnimatePresence mode="wait">
        {activeTool && (
          <motion.div
            key={activeTool}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden rounded-xl border border-white/10 bg-slate-900/80 backdrop-blur-sm p-5"
          >
            {activeTool === "timer" && <TimerTool onClose={() => setActiveTool(null)} />}
            {activeTool === "notes" && <NotesTool onClose={() => setActiveTool(null)} />}
            {activeTool === "json" && <JsonTool onClose={() => setActiveTool(null)} />}
            {activeTool === "snippets" && <SnippetsTool onClose={() => setActiveTool(null)} />}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tool cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {TOOL_CARDS.map((card, i) => {
          const isClickable = ["timer", "notes", "json-editor", "snippets"].includes(card.id);
          const toolKey = card.id === "json-editor" ? "json" : card.id === "snippets" ? "snippets" : card.id;
          return (
            <EnvCard
              key={card.id}
              card={card}
              index={i}
              onClick={isClickable ? () => toggle(toolKey as ActiveTool) : undefined}
            />
          );
        })}
      </div>
    </div>
  );
}
