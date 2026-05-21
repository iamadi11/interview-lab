#!/usr/bin/env node
// pnpm setup — interactive first-run setup wizard

import * as readline from "readline";
import { writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "../..");

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const ask = (q) => new Promise((res) => rl.question(q, res));

console.log("\n🔬 Interview Lab — Setup Wizard\n");

const name = await ask("  Your name (for session logs): ");
const defaultEnv = await ask("  Default interview env [react/next/node/python] (react): ") || "react";
const defaultTimer = await ask("  Default timer in minutes [30/45/60/90] (60): ") || "60";
const aiEnabled = await ask("  Enable AI features? [y/n] (y): ") || "y";

const config = {
  name: name.trim() || "Anonymous",
  defaultEnv,
  defaultTimer: parseInt(defaultTimer, 10),
  aiEnabled: aiEnabled.toLowerCase() !== "n",
  createdAt: new Date().toISOString(),
};

writeFileSync(join(ROOT, ".interview-config.json"), JSON.stringify(config, null, 2));

rl.close();

console.log("\n✓ Config saved to .interview-config.json");
console.log(`✓ Default env: ${config.defaultEnv}`);
console.log(`✓ Timer: ${config.defaultTimer} minutes`);
console.log(`\nRun \`pnpm interview\` to start!\n`);
