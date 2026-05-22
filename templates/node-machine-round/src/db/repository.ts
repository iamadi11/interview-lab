/**
 * Generic Repository pattern — interview classic.
 *
 * Interview talking points:
 * - Decouples business logic from data source (swap DB without changing callers)
 * - Enables easy unit testing via in-memory implementations
 * - Generic type parameter T + id type I keeps it reusable
 */

export interface Repository<T, I = string> {
  findAll(): T[];
  findById(id: I): T | undefined;
  create(data: Omit<T, "id">): T;
  update(id: I, patch: Partial<T>): T | undefined;
  delete(id: I): boolean;
}

/**
 * InMemoryRepository<T> — concrete generic implementation.
 * Used directly in tests and as the backing store for user/post repos.
 */
export class InMemoryRepository<T extends { id: string }> implements Repository<T> {
  #items: T[];

  constructor(seed: T[] = []) {
    this.#items = [...seed];
  }

  findAll(): T[] {
    return [...this.#items];
  }

  findById(id: string): T | undefined {
    return this.#items.find((item) => item.id === id);
  }

  create(data: Omit<T, "id">): T {
    const item = { ...data, id: `id_${Date.now()}_${Math.random().toString(36).slice(2)}` } as T;
    this.#items.push(item);
    return item;
  }

  update(id: string, patch: Partial<T>): T | undefined {
    const idx = this.#items.findIndex((item) => item.id === id);
    if (idx === -1) return undefined;
    this.#items[idx] = { ...this.#items[idx]!, ...patch };
    return this.#items[idx];
  }

  delete(id: string): boolean {
    const before = this.#items.length;
    this.#items = this.#items.filter((item) => item.id !== id);
    return this.#items.length < before;
  }

  /** Test helper — reset to seed data */
  reset(seed: T[] = []): void {
    this.#items = [...seed];
  }

  get size(): number {
    return this.#items.length;
  }
}
