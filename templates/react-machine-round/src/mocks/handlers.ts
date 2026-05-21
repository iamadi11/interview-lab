import { http, HttpResponse } from "msw";
import { MOCK_USERS, MOCK_POSTS } from "./data";

const paginate = <T>(items: T[], page: number, perPage: number) => {
  const start = (page - 1) * perPage;
  const data = items.slice(start, start + perPage);
  return {
    data,
    total: items.length,
    page,
    perPage,
    hasMore: start + perPage < items.length,
  };
};

export const handlers = [
  // ── Users ────────────────────────────────────────────────────────────────
  http.get("/api/users", ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") ?? "1");
    const perPage = parseInt(url.searchParams.get("perPage") ?? "10");
    return HttpResponse.json(paginate(MOCK_USERS, page, perPage));
  }),

  http.get("/api/users/:id", ({ params }) => {
    const user = MOCK_USERS.find((u) => u.id === params["id"]);
    if (!user) return HttpResponse.json({ error: "Not found" }, { status: 404 });
    return HttpResponse.json(user);
  }),

  http.post("/api/users", async ({ request }) => {
    const body = await request.json() as Omit<typeof MOCK_USERS[0], "id">;
    const user = { ...body, id: `user-${Date.now()}` };
    return HttpResponse.json(user, { status: 201 });
  }),

  http.patch("/api/users/:id", async ({ params, request }) => {
    const user = MOCK_USERS.find((u) => u.id === params["id"]);
    if (!user) return HttpResponse.json({ error: "Not found" }, { status: 404 });
    const patch = await request.json() as Partial<typeof MOCK_USERS[0]>;
    return HttpResponse.json({ ...user, ...patch });
  }),

  http.delete("/api/users/:id", ({ params }) => {
    const exists = MOCK_USERS.some((u) => u.id === params["id"]);
    if (!exists) return HttpResponse.json({ error: "Not found" }, { status: 404 });
    return new HttpResponse(null, { status: 204 });
  }),

  // ── Posts ────────────────────────────────────────────────────────────────
  http.get("/api/posts", ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") ?? "1");
    const perPage = parseInt(url.searchParams.get("perPage") ?? "10");
    return HttpResponse.json(paginate(MOCK_POSTS, page, perPage));
  }),

  http.get("/api/posts/:id", ({ params }) => {
    const post = MOCK_POSTS.find((p) => p.id === params["id"]);
    if (!post) return HttpResponse.json({ error: "Not found" }, { status: 404 });
    return HttpResponse.json(post);
  }),
];
