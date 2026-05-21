import { useEffect } from "react";
import { globalBus, type GlobalEvents } from "@/lib/event-bus";

/**
 * Subscribe to a global event bus event.
 * Automatically unsubscribes on unmount.
 */
export function useEventBus<K extends keyof GlobalEvents>(
  event: K,
  handler: (payload: GlobalEvents[K]) => void
) {
  useEffect(() => globalBus.on(event, handler), [event, handler]);
}
