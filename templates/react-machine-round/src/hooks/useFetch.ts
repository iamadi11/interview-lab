import { useState, useEffect, useCallback, useRef } from "react";

interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

/**
 * Simple fetch hook without React Query — for whiteboard-style demos.
 * Includes abort on unmount and manual refresh trigger.
 */
export function useFetch<T>(url: string, options?: RequestInit) {
  const [state, setState] = useState<FetchState<T>>({ data: null, loading: true, error: null });
  const abortRef = useRef<AbortController | null>(null);

  const execute = useCallback(async () => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const res = await fetch(url, { ...options, signal: controller.signal });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as T;
      if (!controller.signal.aborted) setState({ data, loading: false, error: null });
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        setState({ data: null, loading: false, error: err as Error });
      }
    }
  }, [url, options]);

  useEffect(() => {
    void execute();
    return () => abortRef.current?.abort();
  }, [execute]);

  return { ...state, refetch: execute };
}
