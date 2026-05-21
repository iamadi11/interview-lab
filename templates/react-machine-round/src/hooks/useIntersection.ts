import { useState, useEffect, useRef } from "react";

/**
 * Tracks whether an element is in the viewport.
 * Use for: lazy loading, infinite scroll, scroll-triggered animations.
 */
export function useIntersection<T extends Element>(
  options?: IntersectionObserverInit
) {
  const ref = useRef<T | null>(null);
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([e]) => setEntry(e ?? null), options);
    observer.observe(el);
    return () => observer.disconnect();
  }, [options]);

  return { ref, entry, isVisible: entry?.isIntersecting ?? false };
}
