import { createApp } from "./app.js";

const PORT = parseInt(process.env.PORT ?? "3001", 10);

const app = createApp();

const server = app.listen(PORT, () => {
  console.log(`\n\x1b[32m✓\x1b[0m Node Interview Lab running at \x1b[36mhttp://localhost:${PORT}\x1b[0m`);
  console.log(`\n  Routes:`);
  console.log(`    GET  /health`);
  console.log(`    GET  /users         POST /users`);
  console.log(`    GET  /users/:id     PATCH /users/:id   DELETE /users/:id`);
  console.log(`    GET  /posts         POST /posts`);
  console.log(`    GET  /posts/:id`);
  console.log(`    GET  /interview/lru`);
  console.log(`    POST /interview/rate-limit/:algo   (fixed|sliding|token)`);
  console.log(`    POST /interview/deep-clone`);
  console.log(`    POST /interview/flatten`);
  console.log(`    GET  /interview/group-by`);
  console.log(`    GET  /interview/memoize/:n`);
  console.log(`    GET  /interview/event-loop`);
  console.log(`    GET  /interview/stream`);
  console.log(`\n  Auth: Bearer demo-secret-token\n`);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received — shutting down gracefully");
  server.close(() => process.exit(0));
});

process.on("SIGINT", () => {
  server.close(() => process.exit(0));
});
