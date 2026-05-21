# Interview Lab — Claude Code Instructions

## Project purpose
This is a local-first interview workspace. NOT a production application.
Optimise for: clarity, explainability, fast iteration, and interview-readiness.

## Monorepo structure
- `apps/` — runnable applications (Vite/Next/Node/Python)
- `packages/` — shared code (ui, tokens, hooks, utils, generators, ai-skills, types)
- `templates/` — machine round starter templates
- `scripts/` — interview automation CLI tools
- `.vscode/` — editor config (tasks, launch, settings, extensions)
- `.devcontainer/` — Docker dev environment

## Package manager
Always use `pnpm`. Never `npm` or `yarn`.
Run installs from repo root: `pnpm install`
Filter builds: `pnpm --filter @interview-lab/<name> <command>`

## TypeScript
- Strict mode enabled globally
- No `any` — use `unknown` + type narrowing
- All shared types live in `packages/shared-types/src/index.ts`
- Path aliases: `@interview-lab/ui`, `@interview-lab/tokens`, etc.

## Key commands
- `pnpm interview` — start all environments
- `pnpm interview:react` — start react env only
- `pnpm interview:reset` — clear session state
- `pnpm bootstrap` — first-time setup
- `pnpm build` — build all workspaces via turbo
- `pnpm typecheck` — typecheck all workspaces

## Phase status
- Phase 0: Monorepo foundation ✅
- Phase 1: Interview Dashboard (pending)
- Phase 2: React Machine Round Template (pending)
- Phase 3: Next Template (pending)
- Phase 4: Node Interview Lab (pending)
- Phase 5: Python Lab (pending)
- Phase 6: AI Assisted Development (pending)
- Phase 7: Design System Lab (pending)
- Phase 8: Interview Automation (pending)
- Phase 9: DX (pending)
- Phase 10: Documentation (pending)

## AI assistance guidelines
- When creating components, check `packages/ui/` first — prefer extending existing primitives
- AI skill prompts live in `packages/ai-skills/prompts/`
- Cursor rules live in `.cursor/rules`
- Copilot instructions live in `.github/copilot-instructions.md`

## Interview-first principles
1. Keep startup time low (cold start < 5s)
2. Every feature must be demo-able in under 60 seconds
3. Prefer readable code over clever code
4. Every utility should be explainable without docs
5. Demos use mock data — never real external APIs in interview context

## Commit style
- Conventional commits: `feat:`, `fix:`, `docs:`, `chore:`, `refactor:`
- Scope with phase: `feat(phase0):`, `feat(phase1):`
- Keep messages under 72 chars
