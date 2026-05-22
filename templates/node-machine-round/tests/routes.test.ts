import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import { createApp } from "../src/app.js";
import { store } from "../src/db/store.js";

const app = createApp();
const AUTH = "Bearer demo-secret-token";

beforeEach(() => store.reset());

// ─── Health ───────────────────────────────────────────────────────────────────
describe("GET /health", () => {
  it("returns 200 with ok:true", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
  });
});

// ─── Users ────────────────────────────────────────────────────────────────────
describe("GET /users", () => {
  it("returns all users", async () => {
    const res = await request(app).get("/users");
    expect(res.status).toBe(200);
    expect(res.body.data.users.length).toBeGreaterThan(0);
  });

  it("filters by role", async () => {
    const res = await request(app).get("/users?role=admin");
    expect(res.body.data.users.every((u: { role: string }) => u.role === "admin")).toBe(true);
  });
});

describe("GET /users/:id", () => {
  it("returns a user by id", async () => {
    const res = await request(app).get("/users/u1");
    expect(res.status).toBe(200);
    expect(res.body.data.id).toBe("u1");
  });

  it("returns 404 for unknown id", async () => {
    const res = await request(app).get("/users/doesnotexist");
    expect(res.status).toBe(404);
    expect(res.body.ok).toBe(false);
  });
});

describe("POST /users", () => {
  it("requires auth", async () => {
    const res = await request(app).post("/users").send({ name: "Test", email: "t@t.com" });
    expect(res.status).toBe(401);
  });

  it("creates a user with valid data", async () => {
    const res = await request(app)
      .post("/users")
      .set("Authorization", AUTH)
      .send({ name: "New User", email: "new@example.com", role: "user" });
    expect(res.status).toBe(201);
    expect(res.body.data.name).toBe("New User");
  });

  it("returns 422 for invalid data", async () => {
    const res = await request(app)
      .post("/users")
      .set("Authorization", AUTH)
      .send({ name: "X", email: "not-an-email" });
    expect(res.status).toBe(422);
  });
});

describe("DELETE /users/:id", () => {
  it("requires admin role", async () => {
    const res = await request(app)
      .delete("/users/u1")
      .set("Authorization", AUTH);
    expect(res.status).toBe(200);
    expect(res.body.data.deleted).toBe(true);
  });
});

// ─── Posts ────────────────────────────────────────────────────────────────────
describe("GET /posts", () => {
  it("returns all posts", async () => {
    const res = await request(app).get("/posts");
    expect(res.status).toBe(200);
    expect(res.body.data.posts.length).toBeGreaterThan(0);
  });
});

describe("GET /posts/:id", () => {
  it("returns post and increments views", async () => {
    const res1 = await request(app).get("/posts/p1");
    expect(res1.status).toBe(200);
    const views1 = res1.body.data.views;

    const res2 = await request(app).get("/posts/p1");
    expect(res2.body.data.views).toBe(views1 + 1);
  });
});

describe("POST /posts", () => {
  it("creates a post with auth", async () => {
    const res = await request(app)
      .post("/posts")
      .set("Authorization", AUTH)
      .send({ title: "Interview Tips", body: "Always write clean code.", authorId: "u1" });
    expect(res.status).toBe(201);
    expect(res.body.data.title).toBe("Interview Tips");
  });
});

// ─── Interview endpoints ──────────────────────────────────────────────────────
describe("GET /interview/lru", () => {
  it("returns cache state", async () => {
    const res = await request(app).get("/interview/lru");
    expect(res.body.ok).toBe(true);
  });

  it("set and get ops work", async () => {
    await request(app).get("/interview/lru?op=set&key=foo&value=bar");
    const res = await request(app).get("/interview/lru?op=get&key=foo");
    expect(res.body.data).toBe("bar");
  });
});

describe("GET /interview/group-by", () => {
  it("returns users grouped by role", async () => {
    const res = await request(app).get("/interview/group-by");
    expect(res.body.ok).toBe(true);
    expect(res.body.data).toHaveProperty("admin");
    expect(res.body.data).toHaveProperty("user");
  });
});

describe("GET /interview/memoize/:n", () => {
  it("computes fibonacci", async () => {
    const res = await request(app).get("/interview/memoize/10");
    expect(res.body.data.result).toBe(55);
    expect(res.body.data.callsMade).toBeGreaterThan(0);
  });
});

describe("GET /interview/event-loop", () => {
  it("returns execution order array", async () => {
    const res = await request(app).get("/interview/event-loop");
    expect(res.body.ok).toBe(true);
    expect(Array.isArray(res.body.data.executionOrder)).toBe(true);
  });
});
