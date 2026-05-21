#!/usr/bin/env node
// pnpm interview:timer — standalone CLI countdown timer

import { parseArgs } from "util";
import { formatTime } from "../../packages/interview-utils/src/index.ts" assert { type: "ts" };

const { values } = parseArgs({
  args: process.argv.slice(2),
  options: { minutes: { type: "string", short: "m", default: "60" } },
});

const totalSeconds = parseInt(values.minutes, 10) * 60;
let elapsed = 0;

process.stdout.write("\x1b[?25l"); // hide cursor

const interval = setInterval(() => {
  elapsed++;
  const remaining = totalSeconds - elapsed;
  const pct = Math.round((elapsed / totalSeconds) * 20);
  const bar = "█".repeat(pct) + "░".repeat(20 - pct);

  if (remaining <= 0) {
    clearInterval(interval);
    process.stdout.write(`\r\x1b[31m⏰  TIME'S UP!                              \x1b[0m\n`);
    process.stdout.write("\x1b[?25h");
    process.exit(0);
  }

  const color = remaining < 300 ? "\x1b[31m" : remaining < 600 ? "\x1b[33m" : "\x1b[32m";
  process.stdout.write(`\r${color}  ${bar}  ${formatTime(remaining)}\x1b[0m`);
}, 1000);

process.on("SIGINT", () => {
  clearInterval(interval);
  process.stdout.write("\x1b[?25h\n");
  process.exit(0);
});
