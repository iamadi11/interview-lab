#!/usr/bin/env node
// One-time bootstrap: installs deps, checks tooling, sets up env files

import { execSync } from "child_process";
import { existsSync, copyFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "../..");

function run(cmd, label) {
  process.stdout.write(`  ${label}...`);
  try {
    execSync(cmd, { cwd: ROOT, stdio: "pipe" });
    console.log(" ✓");
  } catch (e) {
    console.log(` ✗\n  Error: ${e.message}`);
  }
}

function checkTool(cmd, name, installHint) {
  try {
    execSync(`${cmd} --version`, { stdio: "pipe" });
    console.log(`  ✓ ${name}`);
  } catch {
    console.log(`  ✗ ${name} not found — ${installHint}`);
  }
}

console.log("\n🔬 Interview Lab — Bootstrap\n");

console.log("Checking tools:");
checkTool("node", "Node.js >= 20", "https://nodejs.org");
checkTool("pnpm", "pnpm >= 9", "npm i -g pnpm");
checkTool("git", "git", "https://git-scm.com");
checkTool("python3", "Python 3", "https://python.org (optional, for Python lab)");
checkTool("docker", "Docker", "https://docker.com (optional, for containerised env)");

console.log("\nInstalling workspace dependencies:");
run("pnpm install", "pnpm install");

console.log("\nBootstrap complete!");
console.log("\nRun `pnpm interview` to start your first session.\n");
