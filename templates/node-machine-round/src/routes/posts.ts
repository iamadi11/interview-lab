import { Router, type Router as RouterType } from "express";
import { z } from "zod";
import { store } from "../db/store.js";
import { requireAuth } from "../middleware/auth.js";
import { AppError } from "../middleware/errorHandler.js";
import { appBus } from "../lib/event-bus.js";

export const postsRouter: RouterType = Router();

const CreatePostSchema = z.object({
  title:    z.string().min(3).max(120),
  body:     z.string().min(10),
  authorId: z.string().min(1),
});

// GET /posts?authorId=u1
postsRouter.get("/", (req, res) => {
  const authorId = req.query["authorId"] as string | undefined;
  const posts = store.getPosts(authorId);
  res.json({ ok: true, data: { posts, count: posts.length } });
});

// GET /posts/:id  — increments view count
postsRouter.get("/:id", (req, res) => {
  const post = store.incrementViews(req.params["id"]!);
  if (!post) throw new AppError(404, `Post ${req.params["id"]} not found`);
  appBus.emit("post:viewed", post.id);
  res.json({ ok: true, data: post });
});

// POST /posts  (requires auth)
postsRouter.post("/", requireAuth, (req, res) => {
  const data = CreatePostSchema.parse(req.body);
  const post = store.createPost(data);
  appBus.emit("post:created", post);
  res.status(201).json({ ok: true, data: post });
});
