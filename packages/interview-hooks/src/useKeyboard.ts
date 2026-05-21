import { useEffect } from "react";

type KeyMap = Record<string, (e: KeyboardEvent) => void>;

export function useKeyboard(keyMap: KeyMap, active = true) {
  useEffect(() => {
    if (!active) return;
    const handler = (e: KeyboardEvent) => {
      const key = [
        e.metaKey && "Meta",
        e.ctrlKey && "Ctrl",
        e.shiftKey && "Shift",
        e.altKey && "Alt",
        e.key,
      ].filter(Boolean).join("+");
      keyMap[key]?.(e);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [keyMap, active]);
}
