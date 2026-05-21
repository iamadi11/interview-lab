import { motion } from "framer-motion";
import { Sparkles, ExternalLink } from "lucide-react";
import { EnvCard } from "@/components/cards/EnvCard";
import { AI_CARDS } from "@/data/sections";

const PROMPT_EXAMPLES = [
  { label: "Review my React component for interview readiness", tag: "frontend" },
  { label: "What follow-up questions would you ask about this API design?", tag: "backend" },
  { label: "Walk me through optimising this O(n²) solution", tag: "dsa" },
  { label: "Generate a machine round problem for a 60-min React session", tag: "generate" },
  { label: "Evaluate my LLD for a rate limiter service", tag: "system-design" },
];

const tagColor: Record<string, string> = {
  frontend: "bg-sky-500/20 text-sky-300",
  backend: "bg-violet-500/20 text-violet-300",
  dsa: "bg-emerald-500/20 text-emerald-300",
  generate: "bg-amber-500/20 text-amber-300",
  "system-design": "bg-rose-500/20 text-rose-300",
};

export function AISection() {
  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-5 rounded-2xl border border-indigo-500/20 bg-indigo-500/5"
      >
        <h2 className="text-lg font-bold bg-gradient-to-r from-indigo-400 to-violet-500 bg-clip-text text-transparent">
          AI Skills
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Claude, Cursor, and Copilot adapters for interview coaching, code review, generation, and architecture advisory.
        </p>
      </motion.div>

      {/* Prompt examples */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-3">Prompt examples</h3>
        <div className="space-y-2">
          {PROMPT_EXAMPLES.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="group flex items-center gap-3 px-4 py-2.5 rounded-xl border border-white/8 bg-slate-900/60 hover:bg-slate-800/60 hover:border-white/15 cursor-pointer transition-all"
            >
              <Sparkles size={13} className="text-indigo-400 shrink-0" />
              <span className="text-sm text-slate-300 flex-1">"{p.label}"</span>
              <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${tagColor[p.tag]}`}>{p.tag}</span>
              <ExternalLink size={11} className="text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>
          ))}
        </div>
      </div>

      {/* AI skill cards */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-3">Available skills (Phase 6)</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {AI_CARDS.map((card, i) => (
            <EnvCard key={card.id} card={card} index={i} />
          ))}
        </div>
      </div>

      {/* AI config note */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="p-4 rounded-xl border border-white/8 bg-slate-900/40 space-y-2"
      >
        <div className="text-xs font-semibold text-slate-400">AI configuration</div>
        <div className="space-y-1 text-xs text-slate-500">
          <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> <code className="font-mono">CLAUDE.md</code> — Claude Code project rules</div>
          <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-sky-400" /> <code className="font-mono">.cursor/rules</code> — Cursor AI code style rules</div>
          <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-violet-400" /> <code className="font-mono">.github/copilot-instructions.md</code> — Copilot completion guidance</div>
          <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-400" /> <code className="font-mono">packages/ai-skills/prompts/</code> — Reusable prompt templates</div>
        </div>
      </motion.div>
    </div>
  );
}
