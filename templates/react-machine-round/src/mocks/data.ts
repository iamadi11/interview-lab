import type { User, Post } from "@/services/api";

export const MOCK_USERS: User[] = Array.from({ length: 50 }, (_, i) => ({
  id: `user-${i + 1}`,
  name: ["Alice Chen", "Bob Patel", "Carol Kim", "Dave Roy", "Eve Gupta",
         "Frank Lee", "Grace Zhou", "Henry Wang", "Isla Nair", "Jack Sharma"][i % 10]!,
  email: `user${i + 1}@example.com`,
  avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`,
  role: i % 7 === 0 ? "admin" : "user",
}));

export const MOCK_POSTS: Post[] = Array.from({ length: 100 }, (_, i) => ({
  id: `post-${i + 1}`,
  title: [
    "Building a Virtual Scroll Component",
    "LRU Cache: The Interview Classic",
    "Zustand vs Redux: When to Use What",
    "React Query Patterns You Should Know",
    "Designing a Rate Limiter",
    "The Art of the Machine Coding Round",
    "TypeScript Generics Deep Dive",
    "Framer Motion Animation Patterns",
  ][i % 8]!,
  body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  authorId: `user-${(i % 10) + 1}`,
  tags: [["react", "typescript"], ["dsa", "algorithms"], ["node", "backend"], ["design", "ui"]][i % 4]!,
  createdAt: new Date(Date.now() - i * 86_400_000).toISOString(),
}));
