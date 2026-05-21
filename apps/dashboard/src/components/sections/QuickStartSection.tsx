import { motion } from "framer-motion";
import { ExternalLink, Terminal, Clock } from "lucide-react";
import { Icon } from "@/components/Icon";
import { QUICK_START_ITEMS } from "@/data/sections";

const colorMap: Record<string, { bg: string; border: string; text: string; gradient: string }> = {
  sky:    { bg: "bg-sky-500/10",    border: "border-sky-500/30",    text: "text-sky-400",    gradient: "from-sky-500 to-blue-600" },
  indigo: { bg: "bg-indigo-500/10", border: "border-indigo-500/30", text: "text-indigo-400", gradient: "from-indigo-500 to-blue-600" },
  emerald:{ bg: "bg-emerald-500/10",border: "border-emerald-500/30",text: "text-emerald-400",gradient: "from-emerald-500 to-teal-600" },
  amber:  { bg: "bg-amber-500/10",  border: "border-amber-500/30",  text: "text-amber-400",  gradient: "from-amber-500 to-orange-600" },
  orange: { bg: "bg-orange-500/10", border: "border-orange-500/30", text: "text-orange-400", gradient: "from-orange-500 to-red-600" },
  violet: { bg: "bg-violet-500/10", border: "border-violet-500/30", text: "text-violet-400", gradient: "from-violet-500 to-purple-600" },
};

const durations = ["30 min", "45 min", "60 min", "90 min"];

export function QuickStartSection() {
  return (
    <div className="space-y-8">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900 to-slate-800 p-6"
      >
        {/* Background glow */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative space-y-2">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Ready to interview
          </div>
          <h2 className="text-2xl font-bold text-white">
            Launch your session
            <span className="text-gradient-sky"> instantly.</span>
          </h2>
          <p className="text-sm text-slate-400 max-w-lg">
            Pick an environment below, choose your timer, and start coding. Each workspace is pre-configured with all the tools you need for a professional machine round.
          </p>
        </div>

        {/* Duration pills */}
        <div className="relative mt-4 flex items-center gap-2">
          <Clock size={12} className="text-slate-500" />
          <div className="flex gap-1.5">
            {durations.map((d) => (
              <button
                key={d}
                className="px-2.5 py-1 rounded-full text-[11px] font-medium border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 text-slate-400 hover:text-slate-200 transition-all"
              >
                {d}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Environment grid */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-4">Environments</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {QUICK_START_ITEMS.map((item, i) => {
            const c = colorMap[item.color] ?? colorMap.sky;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06, duration: 0.35, ease: "easeOut" }}
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className={`
                  relative group cursor-pointer rounded-xl border p-4 transition-all duration-200
                  bg-slate-900/60 backdrop-blur-sm ${c.border} hover:shadow-lg
                `}
              >
                {/* Gradient strip */}
                <div className={`absolute top-0 left-0 right-0 h-0.5 rounded-t-xl bg-gradient-to-r ${c.gradient} opacity-60 group-hover:opacity-100 transition-opacity`} />

                <div className="flex items-start justify-between">
                  <div className={`w-9 h-9 rounded-lg ${c.bg} flex items-center justify-center`}>
                    <Icon name={item.icon} size={18} className={c.text} />
                  </div>
                  <ExternalLink size={12} className={`${c.text} opacity-0 group-hover:opacity-70 transition-opacity mt-1`} />
                </div>

                <div className="mt-3 space-y-1">
                  <div className="text-sm font-semibold text-slate-100">{item.label}</div>
                  <div className="text-xs text-slate-400">{item.description}</div>
                </div>

                {item.port && (
                  <div className="mt-3 flex items-center gap-1.5 text-[10px] text-slate-500">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    localhost:{item.port}
                  </div>
                )}

                <div className="mt-2 text-[10px] font-mono text-slate-600">{item.command}</div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Terminal hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-900/60 border border-white/8"
      >
        <Terminal size={14} className="text-slate-500 shrink-0" />
        <code className="text-xs font-mono text-slate-400">
          pnpm interview<span className="text-slate-600"> · or ·</span> pnpm interview:react --timer 60
        </code>
      </motion.div>
    </div>
  );
}
