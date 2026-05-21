import { motion } from "framer-motion";
import { Icon } from "@/components/Icon";
import { NAV_SECTIONS, type SectionId } from "@/data/sections";

interface Props {
  active: SectionId;
  timerDisplay: string;
  timerPhase: string;
  timerRunning: boolean;
  onTimerToggle: () => void;
}

const phaseColor: Record<string, string> = {
  idle: "text-slate-500",
  warmup: "text-sky-400",
  coding: "text-emerald-400",
  review: "text-amber-400",
  done: "text-red-400",
};

export function Header({ active, timerDisplay, timerPhase, timerRunning, onTimerToggle }: Props) {
  const section = NAV_SECTIONS.find((s) => s.id === active);

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between px-6 py-3 border-b border-white/8 bg-slate-950/70 backdrop-blur-xl">
      {/* Section title */}
      <motion.div
        key={active}
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.2 }}
        className="flex items-center gap-2.5"
      >
        {section && (
          <div className={`w-6 h-6 rounded-md bg-gradient-to-br ${section.gradient} flex items-center justify-center`}>
            <Icon name={section.icon} size={12} className="text-white" />
          </div>
        )}
        <div>
          <h1 className="text-sm font-semibold text-white">{section?.label}</h1>
          <p className="text-[11px] text-slate-500">{section?.description}</p>
        </div>
      </motion.div>

      {/* Timer pill */}
      <button
        onClick={onTimerToggle}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full glass hover:bg-white/10 transition-all"
      >
        <span className={`w-1.5 h-1.5 rounded-full ${timerRunning ? "bg-emerald-400 animate-pulse" : "bg-slate-600"}`} />
        <span className={`font-mono text-xs tabular-nums font-semibold ${phaseColor[timerPhase] ?? "text-slate-400"}`}>
          {timerDisplay}
        </span>
        <span className="text-[10px] text-slate-500 uppercase tracking-wide">{timerPhase}</span>
      </button>
    </header>
  );
}
