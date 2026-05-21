import { useState, useEffect, useCallback } from "react";

/**
 * useState backed by localStorage with JSON serialization.
 * Handles SSR, quota errors, and cross-tab sync.
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [stored, setStored] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(stored));
    } catch {
      // Quota exceeded — silently ignore
    }
  }, [key, stored]);

  // Sync across tabs
  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try { setStored(JSON.parse(e.newValue) as T); } catch { /* ignore */ }
      }
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, [key]);

  const remove = useCallback(() => {
    window.localStorage.removeItem(key);
    setStored(initialValue);
  }, [key, initialValue]);

  return [stored, setStored, remove] as const;
}
