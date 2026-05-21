import { formatTime } from "@interview-lab/utils";
import type { TimerState } from "@interview-lab/types";

const phaseColors: Record<TimerState["phase"], string> = {
  warmup: "text-slate-400",
  coding: "text-emerald-400",
  review: "text-amber-400",
  done: "text-red-400",
};

interface TimerProps {
  state: TimerState;
  className?: string;
}

export function Timer({ state, className = "" }: TimerProps) {
  const pct = state.totalSeconds > 0 ? (state.elapsed / state.totalSeconds) * 100 : 0;

  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      <span className={`font-mono text-4xl font-bold tabular-nums ${phaseColors[state.phase]}`}>
        {formatTime(state.remaining)}
      </span>
      <div className="h-1 w-full rounded-full bg-slate-800">
        <div
          className="h-1 rounded-full bg-sky-500 transition-all duration-1000"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs uppercase tracking-widest text-slate-500">{state.phase}</span>
    </div>
  );
}
