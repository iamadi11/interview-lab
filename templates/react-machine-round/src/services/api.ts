/**
 * API service layer — typed, thin wrapper over fetch.
 * In interview context, this hits MSW mock handlers.
 * Pattern: Repository → Service → Component.
 */

const BASE = "/api";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...init?.headers },
    ...init,
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`API ${res.status}: ${body}`);
  }
  return res.json() as Promise<T>;
}

// ─── Types ────────────────────────────────────────────────────────────────────

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
  tags: string[];
  createdAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  perPage: number;
  hasMore: boolean;
}

// ─── User service ─────────────────────────────────────────────────────────────

export const userService = {
  list: (page = 1, perPage = 10) =>
    request<PaginatedResponse<User>>(`/users?page=${page}&perPage=${perPage}`),
  get: (id: string) => request<User>(`/users/${id}`),
  create: (data: Omit<User, "id">) =>
    request<User>("/users", { method: "POST", body: JSON.stringify(data) }),
  update: (id: string, data: Partial<User>) =>
    request<User>(`/users/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  delete: (id: string) => request<void>(`/users/${id}`, { method: "DELETE" }),
};

// ─── Post service ─────────────────────────────────────────────────────────────

export const postService = {
  list: (page = 1, perPage = 10) =>
    request<PaginatedResponse<Post>>(`/posts?page=${page}&perPage=${perPage}`),
  get: (id: string) => request<Post>(`/posts/${id}`),
  create: (data: Omit<Post, "id" | "createdAt">) =>
    request<Post>("/posts", { method: "POST", body: JSON.stringify(data) }),
};
