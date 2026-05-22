// ─── Domain types ─────────────────────────────────────────────────────────────

export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
  createdAt: string;
}

export interface Post {
  id: string;
  title: string;
  body: string;
  authorId: string;
  views: number;
  createdAt: string;
}

// ─── API types ────────────────────────────────────────────────────────────────

export interface ApiSuccess<T> {
  ok: true;
  data: T;
}

export interface ApiError {
  ok: false;
  error: string;
  details?: unknown;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface AuthPayload {
  userId: string;
  role: "admin" | "user";
  iat: number;
  exp: number;
}

// Augment Express Request with our auth payload
declare global {
  namespace Express {
    interface Request {
      auth?: AuthPayload;
      requestId?: string;
    }
  }
}
