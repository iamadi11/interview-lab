# 🔬 Interview Lab

> Interview-first local development workspace — fast, AI-assisted, offline-capable.

A local monorepo optimised for machine coding rounds, system design demos, and frontend/backend interview sessions. Think **Codesandbox + Cursor + Storybook + Backend playground + Interview dashboard** — all running locally, zero cloud dependency.

---

## Quick start

```bash
# First time
node scripts/bootstrap/index.js

# Every session
pnpm interview
```

---

## Environments

| Environment | URL | Command |
|---|---|---|
| Dashboard | http://localhost:3000 | `pnpm interview` |
| React Playground | http://localhost:3001 | `pnpm interview:react` |
| Next Playground | http://localhost:3002 | `pnpm interview:next` |
| Node Playground | http://localhost:3003 | `pnpm interview:node` |
| JS Playground | http://localhost:3004 | — |
| Design System Lab | http://localhost:3005 | — |
| Python Lab | http://localhost:8000 | `pnpm interview:python` |

---

## Interview commands

```bash
pnpm interview              # Launch all environments
pnpm interview:react        # React only
pnpm interview:next         # Next.js only
pnpm interview:node         # Node.js only
pnpm interview:python       # Python / FastAPI only
pnpm interview:timer        # CLI countdown timer (default 60 min)
pnpm interview:reset        # Clear session state
pnpm setup                  # Interactive first-run config
pnpm bootstrap              # Install deps + tooling check
```

---

## Monorepo structure

```
interview-lab/
├── apps/
│   ├── dashboard/            Central launchpad (Phase 1)
│   ├── react-playground/     React sandbox (Phase 2)
│   ├── next-playground/      Next.js sandbox (Phase 3)
│   ├── node-playground/      Node.js sandbox (Phase 4)
│   ├── js-playground/        Vanilla JS sandbox
│   ├── python-playground/    Python / FastAPI sandbox (Phase 5)
│   ├── design-system-lab/    Token/component explorer (Phase 7)
│   └── backend-design-lab/   API/DB design visualizer (Phase 7)
│
├── packages/
│   ├── ui/                   Shared React components
│   ├── tokens/               Design tokens (colors, spacing, typography)
│   ├── interview-hooks/      useTimer, useDebounce, useKeyboard, …
│   ├── interview-utils/      debounce, LRUCache, EventBus, …
│   ├── interview-generators/ Component / hook / route generators
│   ├── ai-skills/            AI skill descriptors + prompt templates
│   └── shared-types/         TypeScript types shared across workspaces
│
├── templates/
│   ├── react-machine-round/  React + Vite starter
│   ├── next-machine-round/   Next.js App Router starter
│   ├── node-machine-round/   Express + TS starter
│   ├── python-machine-round/ FastAPI starter
│   └── vanilla-machine-round/ Zero-framework starter
│
├── scripts/
│   ├── bootstrap/            First-time setup
│   ├── interview/            start.js, reset.js, timer.js
│   └── setup/                Interactive config wizard
│
├── .vscode/                  Settings, tasks, launch configs, extensions
├── .cursor/                  Cursor AI rules
├── .devcontainer/            Docker dev container config
├── CLAUDE.md                 Claude Code instructions
└── .github/copilot-instructions.md
```

---

## Phase roadmap

| Phase | Name | Status |
|---|---|---|
| 0 | Monorepo Foundation | ✅ Done |
| 1 | Interview Dashboard | ⏳ Pending |
| 2 | React Machine Round Template | ⏳ Pending |
| 3 | Next.js Template | ⏳ Pending |
| 4 | Node Interview Lab | ⏳ Pending |
| 5 | Python Lab | ⏳ Pending |
| 6 | AI Assisted Development | ⏳ Pending |
| 7 | Design System Lab | ⏳ Pending |
| 8 | Interview Automation | ⏳ Pending |
| 9 | DX | ⏳ Pending |
| 10 | Documentation | ⏳ Pending |

---

## AI support

- **Claude Code** — `CLAUDE.md` at root with full project context
- **Cursor** — `.cursor/rules` with code style and interview-specific patterns
- **Copilot** — `.github/copilot-instructions.md` with completion guidance
- **AI Skills** — `packages/ai-skills/` with prompts for frontend review, backend review, DSA coaching, system design review, and more

---

## Docker

```bash
# Full workspace in container
docker compose up workspace

# Python lab separately
docker compose --profile python up python-lab
```

---

## Dev container

Open in VS Code → **Reopen in Container** — ports auto-forwarded, extensions auto-installed, bootstrap auto-runs.

---

## Requirements

- Node.js >= 20
- pnpm >= 9
- Python 3.13+ (optional, for Python lab)
- Docker (optional, for containerised env)
