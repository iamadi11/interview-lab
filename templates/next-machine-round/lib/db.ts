/**
 * In-memory database — interview mock for demos.
 * Simulates async latency to demonstrate streaming/suspense patterns.
 */

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: "admin" | "user";
}

export interface Post {
  id: string;
  title: string;
  body: string;
  authorId: string;
  views: number;
  createdAt: string;
}

// Singleton in-memory store (persists across requests in dev, resets on cold start)
const store = {
  users: Array.from({ length: 20 }, (_, i) => ({
    id: `u${i + 1}`,
    name: ["Alice Chen","Bob Patel","Carol Kim","Dave Roy","Eve Gupta",
           "Frank Lee","Grace Zhou","Henry Wang","Isla Nair","Jack Sharma"][i % 10]!,
    email: `user${i + 1}@example.com`,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`,
    role: (i % 5 === 0 ? "admin" : "user") as User["role"],
  })) satisfies User[],

  posts: Array.from({ length: 30 }, (_, i) => ({
    id: `p${i + 1}`,
    title: [
      "Building an LRU Cache","Implementing Debounce","Virtual List in React",
      "Event-Driven Architecture","Rate Limiter Patterns","Next.js Caching Deep Dive",
    ][i % 6]!,
    body: "Detailed explanation of the concept with code examples and interview tips.",
    authorId: `u${(i % 10) + 1}`,
    views: Math.floor(Math.random() * 5000),
    createdAt: new Date(Date.now() - i * 86_400_000).toISOString(),
  })) satisfies Post[],
};

/** Simulate async DB latency */
const delay = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

export const db = {
  users: {
    findAll: async (latency = 0): Promise<User[]> => { await delay(latency); return store.users; },
    findById: async (id: string, latency = 0): Promise<User | undefined> => { await delay(latency); return store.users.find((u) => u.id === id); },
    create: async (data: Omit<User, "id">): Promise<User> => {
      const user = { ...data, id: `u${Date.now()}` };
      store.users.push(user);
      return user;
    },
  },
  posts: {
    findAll: async (latency = 0): Promise<Post[]> => { await delay(latency); return store.posts; },
    findById: async (id: string, latency = 0): Promise<Post | undefined> => { await delay(latency); return store.posts.find((p) => p.id === id); },
    create: async (data: Omit<Post, "id" | "createdAt" | "views">): Promise<Post> => {
      const post = { ...data, id: `p${Date.now()}`, views: 0, createdAt: new Date().toISOString() };
      store.posts.push(post);
      return post;
    },
  },
};
