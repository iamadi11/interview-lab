import { useState, useEffect, useRef, useCallback } from "react";

export type TimerPhase = "idle" | "warmup" | "coding" | "review" | "done";

export interface TimerState {
  totalSeconds: number;
  elapsed: number;
  remaining: number;
  isRunning: boolean;
  phase: TimerPhase;
}

export function useTimer(totalMinutes = 60) {
  const totalSeconds = totalMinutes * 60;
  const [state, setState] = useState<TimerState>({
    totalSeconds,
    elapsed: 0,
    remaining: totalSeconds,
    isRunning: false,
    phase: "idle",
  });
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const getPhase = (elapsed: number, total: number): TimerPhase => {
    if (elapsed === 0) return "idle";
    const pct = elapsed / total;
    if (pct < 0.1) return "warmup";
    if (pct < 0.85) return "coding";
    const remaining = total - elapsed;
    return remaining > 0 ? "review" : "done";
  };

  const tick = useCallback(() => {
    setState((prev) => {
      const elapsed = prev.elapsed + 1;
      const remaining = Math.max(0, prev.totalSeconds - elapsed);
      const phase = getPhase(elapsed, prev.totalSeconds);
      if (remaining === 0 && intervalRef.current) clearInterval(intervalRef.current);
      return { ...prev, elapsed, remaining, phase };
    });
  }, []);

  const start = useCallback(() => {
    setState((p) => ({ ...p, isRunning: true, phase: p.phase === "idle" ? "warmup" : p.phase }));
    intervalRef.current = setInterval(tick, 1000);
  }, [tick]);

  const pause = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setState((p) => ({ ...p, isRunning: false }));
  }, []);

  const reset = useCallback((minutes?: number) => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    const total = (minutes ?? totalMinutes) * 60;
    setState({ totalSeconds: total, elapsed: 0, remaining: total, isRunning: false, phase: "idle" });
  }, [totalMinutes]);

  useEffect(() => () => { if (intervalRef.current) clearInterval(intervalRef.current); }, []);

  const progressPct = state.totalSeconds > 0 ? (state.elapsed / state.totalSeconds) * 100 : 0;

  return { ...state, progressPct, start, pause, reset };
}
