/**
 * Typed EventBus — interview favourite for pub/sub architecture.
 *
 * Usage:
 *   const bus = new EventBus<{ "user:created": User; "post:viewed": string }>();
 *   bus.on("user:created", (user) => console.log(user.name));
 *   bus.emit("user:created", newUser);
 *
 * Interview talking points:
 * - EventEmitter vs custom typed bus (type safety)
 * - Memory leaks: always remove listeners with off()
 * - once() for one-time subscriptions
 * - Async handlers: emit can return Promise.all of handler results
 */
type Handler<T> = (payload: T) => void | Promise<void>;

export class EventBus<Events extends Record<string, unknown>> {
  readonly #handlers = new Map<keyof Events, Set<Handler<unknown>>>();

  on<K extends keyof Events>(event: K, handler: Handler<Events[K]>): () => void {
    if (!this.#handlers.has(event)) {
      this.#handlers.set(event, new Set());
    }
    this.#handlers.get(event)!.add(handler as Handler<unknown>);
    // Return unsubscribe function
    return () => this.off(event, handler);
  }

  once<K extends keyof Events>(event: K, handler: Handler<Events[K]>): () => void {
    const wrapper: Handler<Events[K]> = (payload) => {
      this.off(event, wrapper);
      return handler(payload);
    };
    return this.on(event, wrapper);
  }

  off<K extends keyof Events>(event: K, handler: Handler<Events[K]>): void {
    this.#handlers.get(event)?.delete(handler as Handler<unknown>);
  }

  emit<K extends keyof Events>(event: K, payload: Events[K]): void {
    this.#handlers.get(event)?.forEach((h) => void h(payload));
  }

  async emitAsync<K extends keyof Events>(event: K, payload: Events[K]): Promise<void> {
    const handlers = [...(this.#handlers.get(event) ?? [])];
    await Promise.all(handlers.map((h) => h(payload)));
  }

  listenerCount(event: keyof Events): number {
    return this.#handlers.get(event)?.size ?? 0;
  }

  removeAll(event?: keyof Events): void {
    if (event) {
      this.#handlers.delete(event);
    } else {
      this.#handlers.clear();
    }
  }
}

// ─── App-wide event bus ───────────────────────────────────────────────────────
import type { User, Post } from "../types/index.js";

export type AppEvents = {
  "user:created":  User;
  "user:deleted":  string; // userId
  "post:created":  Post;
  "post:viewed":   string; // postId
};

export const appBus = new EventBus<AppEvents>();
