/**
 * Cookie-based session auth — interview demo.
 * In production: use NextAuth.js / Clerk / Auth.js.
 * Here: simple signed cookie for demo clarity.
 */
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const SESSION_COOKIE = "session";
const DEMO_USER = { id: "u1", name: "Aditya Raj", email: "aditya@example.com", role: "admin" as const };

// In prod: verify a signed JWT or session token from a DB
export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  // Demo: any non-empty token = valid session
  return DEMO_USER;
}

export async function requireAuth() {
  const session = await getSession();
  if (!session) redirect("/auth/login");
  return session;
}
