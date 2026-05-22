import { Router, type Router as RouterType } from "express";
import { z } from "zod";
import { store } from "../db/store.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { AppError } from "../middleware/errorHandler.js";
import { appBus } from "../lib/event-bus.js";

export const usersRouter: RouterType = Router();

const CreateUserSchema = z.object({
  name:  z.string().min(2).max(80),
  email: z.string().email(),
  role:  z.enum(["admin", "user"]).default("user"),
});

const UpdateUserSchema = CreateUserSchema.partial();

// GET /users?role=admin
usersRouter.get("/", (req, res) => {
  const role = req.query["role"] as string | undefined;
  const users = store.getUsers();
  const filtered = role ? users.filter((u) => u.role === role) : users;
  res.json({ ok: true, data: { users: filtered, count: filtered.length } });
});

// GET /users/:id
usersRouter.get("/:id", (req, res) => {
  const user = store.getUserById(req.params["id"] as string);
  if (!user) throw new AppError(404, `User ${req.params["id"]} not found`);
  res.json({ ok: true, data: user });
});

// POST /users  (requires auth)
usersRouter.post("/", requireAuth, (req, res) => {
  const data = CreateUserSchema.parse(req.body);
  const user = store.createUser(data);
  appBus.emit("user:created", user);
  res.status(201).json({ ok: true, data: user });
});

// PATCH /users/:id  (requires auth)
usersRouter.patch("/:id", requireAuth, (req, res) => {
  const data = UpdateUserSchema.parse(req.body);
  const user = store.updateUser(req.params["id"] as string, data);
  if (!user) throw new AppError(404, `User ${req.params["id"]} not found`);
  res.json({ ok: true, data: user });
});

// DELETE /users/:id  (requires admin)
usersRouter.delete("/:id", requireAuth, requireRole("admin"), (req, res) => {
  const deleted = store.deleteUser(req.params["id"] as string);
  if (!deleted) throw new AppError(404, `User ${req.params["id"]} not found`);
  appBus.emit("user:deleted", req.params["id"] as string);
  res.json({ ok: true, data: { deleted: true } });
});
