/**
 * EventBus — typed pub/sub for interview demos.
 *
 * Usage:
 *   const bus = new EventBus<{ "user:login": { id: string } }>();
 *   const off = bus.on("user:login", (e) => console.log(e.id));
 *   bus.emit("user:login", { id: "123" });
 *   off(); // unsubscribe
 */
type Listener<T = unknown> = (payload: T) => void;

export class EventBus<Events extends Record<string, unknown> = Record<string, unknown>> {
  readonly #listeners = new Map<keyof Events, Set<Listener>>();

  on<K extends keyof Events>(event: K, listener: Listener<Events[K]>): () => void {
    if (!this.#listeners.has(event)) this.#listeners.set(event, new Set());
    this.#listeners.get(event)!.add(listener as Listener);
    return () => this.off(event, listener);
  }

  once<K extends keyof Events>(event: K, listener: Listener<Events[K]>): () => void {
    const wrapper: Listener<Events[K]> = (payload) => {
      listener(payload);
      this.off(event, wrapper);
    };
    return this.on(event, wrapper);
  }

  off<K extends keyof Events>(event: K, listener: Listener<Events[K]>): void {
    this.#listeners.get(event)?.delete(listener as Listener);
  }

  emit<K extends keyof Events>(event: K, payload: Events[K]): void {
    this.#listeners.get(event)?.forEach((l) => l(payload));
  }

  clear(event?: keyof Events): void {
    if (event) this.#listeners.delete(event);
    else this.#listeners.clear();
  }

  listenerCount(event: keyof Events): number {
    return this.#listeners.get(event)?.size ?? 0;
  }
}

// Singleton global bus — typed for common interview scenarios
export type GlobalEvents = {
  "toast:show": { message: string; type: "success" | "error" | "info" | "warning" };
  "modal:open": { id: string; props?: Record<string, unknown> };
  "modal:close": { id: string };
  "timer:tick": { elapsed: number; remaining: number };
  "session:reset": Record<string, never>;
};

export const globalBus = new EventBus<GlobalEvents>();
