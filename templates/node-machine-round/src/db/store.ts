/**
 * In-memory store — interview mock.
 * Singleton: shared across the process, reset between tests via store.reset().
 */
import type { User, Post } from "../types/index.js";

const NAMES = [
  "Alice Chen", "Bob Patel", "Carol Kim", "Dave Roy", "Eve Gupta",
  "Frank Lee", "Grace Zhou", "Henry Wang", "Isla Nair", "Jack Sharma",
];

function seed(): { users: User[]; posts: Post[] } {
  const users: User[] = Array.from({ length: 10 }, (_, i) => ({
    id: `u${i + 1}`,
    name: NAMES[i % NAMES.length] as string,
    email: `user${i + 1}@example.com`,
    role: (i % 4 === 0 ? "admin" : "user") as User["role"],
    createdAt: new Date(Date.now() - i * 86_400_000).toISOString(),
  }));

  const TITLES = [
    "Building an LRU Cache",
    "Implementing Debounce",
    "Virtual List in React",
    "Event-Driven Architecture",
    "Rate Limiter Patterns",
    "Node.js Streams Deep Dive",
  ];

  const posts: Post[] = Array.from({ length: 18 }, (_, i) => ({
    id: `p${i + 1}`,
    title: TITLES[i % TITLES.length] as string,
    body: "Detailed explanation with code examples and interview tips.",
    authorId: `u${(i % 10) + 1}`,
    views: Math.floor(Math.random() * 5000),
    createdAt: new Date(Date.now() - i * 86_400_000).toISOString(),
  }));

  return { users, posts };
}

class Store {
  #users: User[];
  #posts: Post[];

  constructor() {
    const { users, posts } = seed();
    this.#users = users;
    this.#posts = posts;
  }

  // ── Users ──────────────────────────────────────────────────────────────────
  getUsers(): User[] { return [...this.#users]; }

  getUserById(id: string): User | undefined {
    return this.#users.find((u) => u.id === id);
  }

  createUser(data: Omit<User, "id" | "createdAt">): User {
    const user: User = { ...data, id: `u${Date.now()}`, createdAt: new Date().toISOString() };
    this.#users.push(user);
    return user;
  }

  updateUser(id: string, patch: Partial<Omit<User, "id" | "createdAt">>): User | undefined {
    const idx = this.#users.findIndex((u) => u.id === id);
    if (idx === -1) return undefined;
    this.#users[idx] = { ...this.#users[idx]!, ...patch };
    return this.#users[idx];
  }

  deleteUser(id: string): boolean {
    const before = this.#users.length;
    this.#users = this.#users.filter((u) => u.id !== id);
    return this.#users.length < before;
  }

  // ── Posts ──────────────────────────────────────────────────────────────────
  getPosts(authorId?: string): Post[] {
    const posts = [...this.#posts];
    return authorId ? posts.filter((p) => p.authorId === authorId) : posts;
  }

  getPostById(id: string): Post | undefined {
    return this.#posts.find((p) => p.id === id);
  }

  createPost(data: Omit<Post, "id" | "views" | "createdAt">): Post {
    const post: Post = {
      ...data,
      id: `p${Date.now()}`,
      views: 0,
      createdAt: new Date().toISOString(),
    };
    this.#posts.push(post);
    return post;
  }

  incrementViews(id: string): Post | undefined {
    const post = this.#posts.find((p) => p.id === id);
    if (post) post.views += 1;
    return post;
  }

  // ── Test helpers ───────────────────────────────────────────────────────────
  reset(): void {
    const { users, posts } = seed();
    this.#users = users;
    this.#posts = posts;
  }
}

// Singleton export
export const store = new Store();
