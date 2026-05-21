import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useDebounce } from "@/hooks/useDebounce";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useTimer } from "@/hooks/useTimer";

describe("useDebounce", () => {
  beforeEach(() => { vi.useFakeTimers(); });
  afterEach(() => { vi.useRealTimers(); });

  it("returns initial value immediately", () => {
    const { result } = renderHook(() => useDebounce("hello", 300));
    expect(result.current).toBe("hello");
  });

  it("updates value after delay", async () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: "initial" } }
    );
    rerender({ value: "updated" });
    expect(result.current).toBe("initial");
    act(() => vi.advanceTimersByTime(300));
    expect(result.current).toBe("updated");
  });
});

describe("useLocalStorage", () => {
  beforeEach(() => localStorage.clear());

  it("returns initial value when key is absent", () => {
    const { result } = renderHook(() => useLocalStorage("test-key", 42));
    expect(result.current[0]).toBe(42);
  });

  it("persists value to localStorage", () => {
    const { result } = renderHook(() => useLocalStorage("test-persist", 0));
    act(() => result.current[1](99));
    expect(localStorage.getItem("test-persist")).toBe("99");
  });
});

describe("useTimer", () => {
  beforeEach(() => { vi.useFakeTimers(); });
  afterEach(() => { vi.useRealTimers(); });

  it("starts at idle phase with full remaining time", () => {
    const { result } = renderHook(() => useTimer(1));
    expect(result.current.phase).toBe("idle");
    expect(result.current.remaining).toBe(60);
    expect(result.current.isRunning).toBe(false);
  });

  it("transitions to warmup when started", () => {
    const { result } = renderHook(() => useTimer(60));
    act(() => result.current.start());
    act(() => { vi.advanceTimersByTime(1000); });
    expect(result.current.elapsed).toBe(1);
    expect(result.current.phase).toBe("warmup");
  });

  it("resets correctly", () => {
    const { result } = renderHook(() => useTimer(60));
    act(() => result.current.start());
    act(() => { vi.advanceTimersByTime(5000); });
    act(() => result.current.reset());
    expect(result.current.elapsed).toBe(0);
    expect(result.current.isRunning).toBe(false);
  });
});
