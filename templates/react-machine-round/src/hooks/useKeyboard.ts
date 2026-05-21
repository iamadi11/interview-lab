import { useEffect, useRef } from "react";

type KeyMap = Record<string, (e: KeyboardEvent) => void>;

/**
 * Bind keyboard shortcuts declaratively.
 * Key format: "Meta+k", "Ctrl+Shift+Enter", "Escape"
 */
export function useKeyboard(keyMap: KeyMap, active = true) {
  // Stable ref so the effect doesn't re-run on every render
  const mapRef = useRef(keyMap);
  mapRef.current = keyMap;

  useEffect(() => {
    if (!active) return;
    const handler = (e: KeyboardEvent) => {
      const key = [
        e.metaKey  && "Meta",
        e.ctrlKey  && "Ctrl",
        e.shiftKey && "Shift",
        e.altKey   && "Alt",
        e.key,
      ].filter(Boolean).join("+");
      mapRef.current[key]?.(e);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [active]);
}
