// Interview utility functions — framework-agnostic

export function debounce<T extends (...args: unknown[]) => unknown>(fn: T, delay: number): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

export function throttle<T extends (...args: unknown[]) => unknown>(fn: T, limit: number): (...args: Parameters<T>) => void {
  let lastCall = 0;
  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCall >= limit) {
      lastCall = now;
      fn(...args);
    }
  };
}

export function deepClone<T>(obj: T): T {
  return structuredClone(obj);
}

export function flattenObject(obj: Record<string, unknown>, prefix = ""): Record<string, unknown> {
  return Object.entries(obj).reduce<Record<string, unknown>>((acc, [key, val]) => {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (val !== null && typeof val === "object" && !Array.isArray(val)) {
      Object.assign(acc, flattenObject(val as Record<string, unknown>, fullKey));
    } else {
      acc[fullKey] = val;
    }
    return acc;
  }, {});
}

export class LRUCache<K, V> {
  private map = new Map<K, V>();
  constructor(private capacity: number) {}

  get(key: K): V | undefined {
    if (!this.map.has(key)) return undefined;
    const val = this.map.get(key)!;
    this.map.delete(key);
    this.map.set(key, val);
    return val;
  }

  set(key: K, value: V): void {
    if (this.map.has(key)) this.map.delete(key);
    else if (this.map.size >= this.capacity) this.map.delete(this.map.keys().next().value!);
    this.map.set(key, value);
  }

  get size(): number { return this.map.size; }
}

export function generateId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function groupBy<T>(arr: T[], key: keyof T): Record<string, T[]> {
  return arr.reduce<Record<string, T[]>>((acc, item) => {
    const k = String(item[key]);
    (acc[k] ??= []).push(item);
    return acc;
  }, {});
}

// Simple event bus for interview-time pub/sub demos
type Listener<T = unknown> = (data: T) => void;

export class EventBus {
  private listeners = new Map<string, Set<Listener>>();

  on<T>(event: string, listener: Listener<T>): () => void {
    if (!this.listeners.has(event)) this.listeners.set(event, new Set());
    this.listeners.get(event)!.add(listener as Listener);
    return () => this.off(event, listener);
  }

  off<T>(event: string, listener: Listener<T>): void {
    this.listeners.get(event)?.delete(listener as Listener);
  }

  emit<T>(event: string, data: T): void {
    this.listeners.get(event)?.forEach((l) => l(data));
  }
}

export const globalBus = new EventBus();
