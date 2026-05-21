import { useState, useEffect, useRef, useCallback } from "react";
import type { TimerState } from "@interview-lab/types";

export function useTimer(totalMinutes: number) {
  const totalSeconds = totalMinutes * 60;
  const [state, setState] = useState<TimerState>({
    totalSeconds,
    elapsed: 0,
    remaining: totalSeconds,
    isRunning: false,
    phase: "warmup",
  });
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const tick = useCallback(() => {
    setState((prev) => {
      const elapsed = prev.elapsed + 1;
      const remaining = prev.totalSeconds - elapsed;
      const pct = elapsed / prev.totalSeconds;
      const phase: TimerState["phase"] =
        pct < 0.1 ? "warmup" : pct < 0.85 ? "coding" : remaining > 0 ? "review" : "done";
      return { ...prev, elapsed, remaining: Math.max(0, remaining), phase };
    });
  }, []);

  const start = useCallback(() => {
    setState((p) => ({ ...p, isRunning: true }));
    intervalRef.current = setInterval(tick, 1000);
  }, [tick]);

  const pause = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setState((p) => ({ ...p, isRunning: false }));
  }, []);

  const reset = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setState({ totalSeconds, elapsed: 0, remaining: totalSeconds, isRunning: false, phase: "warmup" });
  }, [totalSeconds]);

  useEffect(() => () => { if (intervalRef.current) clearInterval(intervalRef.current); }, []);

  return { ...state, start, pause, reset };
}
