import { useState, useEffect } from "react";

/**
 * Debounces a value — returns the stable value after `delay` ms of no changes.
 * Classic interview hook: used for search inputs, autocomplete, etc.
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}
