import { useState, useEffect, useRef, useCallback } from "react";
import { formatTime } from "@/lib";

export type TimerPhase = "idle" | "warmup" | "coding" | "review" | "done";

export interface UseTimerReturn {
  elapsed: number;
  remaining: number;
  totalSeconds: number;
  progressPct: number;
  isRunning: boolean;
  phase: TimerPhase;
  display: string;
  start: () => void;
  pause: () => void;
  reset: (minutes?: number) => void;
}

function getPhase(elapsed: number, total: number): TimerPhase {
  if (elapsed === 0) return "idle";
  const pct = elapsed / total;
  if (pct < 0.1) return "warmup";
  if (pct < 0.85) return "coding";
  return total - elapsed > 0 ? "review" : "done";
}

/** Phase-aware countdown timer. Phases: idle → warmup → coding → review → done. */
export function useTimer(totalMinutes = 60): UseTimerReturn {
  const total = totalMinutes * 60;
  const [elapsed, setElapsed] = useState(0);
  const [totalSec, setTotalSec] = useState(total);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const tick = useCallback(() => {
    setElapsed((e) => {
      const next = e + 1;
      if (next >= totalSec && intervalRef.current) {
        clearInterval(intervalRef.current);
        setIsRunning(false);
      }
      return next;
    });
  }, [totalSec]);

  const start = useCallback(() => {
    if (isRunning) return;
    setIsRunning(true);
    intervalRef.current = setInterval(tick, 1000);
  }, [isRunning, tick]);

  const pause = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsRunning(false);
  }, []);

  const reset = useCallback((minutes?: number) => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    const newTotal = (minutes ?? totalMinutes) * 60;
    setTotalSec(newTotal);
    setElapsed(0);
    setIsRunning(false);
  }, [totalMinutes]);

  useEffect(() => () => { if (intervalRef.current) clearInterval(intervalRef.current); }, []);

  const remaining = Math.max(0, totalSec - elapsed);
  return {
    elapsed, remaining, totalSeconds: totalSec,
    progressPct: totalSec > 0 ? (elapsed / totalSec) * 100 : 0,
    isRunning, phase: getPhase(elapsed, totalSec),
    display: formatTime(remaining),
    start, pause, reset,
  };
}
