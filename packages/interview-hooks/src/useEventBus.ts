import { useEffect } from "react";
import { globalBus } from "@interview-lab/utils";

export function useEventBus<T>(event: string, listener: (data: T) => void) {
  useEffect(() => {
    return globalBus.on<T>(event, listener);
  }, [event, listener]);
}
