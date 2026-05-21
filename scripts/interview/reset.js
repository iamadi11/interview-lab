#!/usr/bin/env node
// pnpm interview:reset — clears session data and temp files

import { rmSync, existsSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "../..");

const sessionDir = join(ROOT, ".interview-session");

if (existsSync(sessionDir)) {
  rmSync(sessionDir, { recursive: true, force: true });
  console.log("✓ Session data cleared");
} else {
  console.log("  No active session found");
}

console.log("✓ Workspace reset complete\n");
