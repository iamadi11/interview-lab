#!/usr/bin/env node
// pnpm interview — launches the configured interview environment

import { execSync, spawn } from "child_process";
import { parseArgs } from "util";
import { writeFileSync, existsSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "../..");

const { values } = parseArgs({
  args: process.argv.slice(2),
  options: {
    env: { type: "string", short: "e", default: "all" },
    timer: { type: "string", short: "t", default: "60" },
  },
});

const ENV_PORTS = {
  dashboard: 3000,
  react: 3001,
  next: 3002,
  node: 3003,
  python: 8000,
  "design-system": 3005,
};

const ENV_DIRS = {
  dashboard: "apps/dashboard",
  react: "apps/react-playground",
  next: "apps/next-playground",
  node: "apps/node-playground",
  python: "apps/python-playground",
  "design-system": "apps/design-system-lab",
};

function startSession(env) {
  const sessionDir = join(ROOT, ".interview-session");
  if (!existsSync(sessionDir)) mkdirSync(sessionDir, { recursive: true });

  const session = {
    id: `${Date.now().toString(36)}`,
    env,
    startedAt: new Date().toISOString(),
    durationMinutes: parseInt(values.timer, 10),
  };

  writeFileSync(join(sessionDir, "current.json"), JSON.stringify(session, null, 2));
  return session;
}

function printBanner(session) {
  const reset = "\x1b[0m";
  const bold = "\x1b[1m";
  const cyan = "\x1b[36m";
  const green = "\x1b[32m";
  const yellow = "\x1b[33m";

  console.log("\n" + bold + cyan + "╔══════════════════════════════════════════╗" + reset);
  console.log(bold + cyan + "║       INTERVIEW LAB — SESSION START      ║" + reset);
  console.log(bold + cyan + "╚══════════════════════════════════════════╝" + reset);
  console.log(green + `  Session : ${session.id}` + reset);
  console.log(green + `  Env     : ${session.env}` + reset);
  console.log(green + `  Timer   : ${session.durationMinutes} minutes` + reset);
  console.log(green + `  Started : ${session.startedAt}` + reset);

  if (values.env === "all" || values.env === "dashboard") {
    console.log(yellow + `\n  Dashboard → http://localhost:${ENV_PORTS.dashboard}` + reset);
  }
  if (values.env !== "all") {
    const port = ENV_PORTS[values.env];
    if (port) console.log(yellow + `  App      → http://localhost:${port}` + reset);
  }

  console.log("\n  " + bold + "Shortcuts" + reset);
  console.log("  Ctrl+C  → stop session");
  console.log("  pnpm interview:reset → reset workspace\n");
}

const env = values.env ?? "all";
const session = startSession(env);
printBanner(session);

const turboFilter = env === "all"
  ? ["turbo", "run", "dev"]
  : ["turbo", "run", "dev", `--filter=@interview-lab/${ENV_DIRS[env]?.split("/")[1] ?? env}`];

const child = spawn("pnpm", turboFilter, { cwd: ROOT, stdio: "inherit", shell: true });

child.on("error", (err) => {
  console.error("Failed to start:", err.message);
  process.exit(1);
});

process.on("SIGINT", () => {
  console.log("\n\nSession ended. Run `pnpm interview:reset` to clean up.\n");
  child.kill("SIGINT");
  process.exit(0);
});
