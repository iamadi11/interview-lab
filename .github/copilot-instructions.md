# GitHub Copilot Instructions — Interview Lab

## Context
This is an interview-first monorepo workspace. Code here is written for machine coding rounds,
system design demos, and live coding interviews — NOT for production use.

## Preferred patterns

### React components
- Functional components with explicit TypeScript props interfaces
- Named exports only
- Tailwind CSS for styling
- `@interview-lab/ui` primitives before writing custom UI

### Hooks
- All hooks in `packages/interview-hooks/src/`
- Return typed objects, not arrays (except simple [value, setter] pairs)
- Include `cleanup` in effects that subscribe to external sources

### Utilities
- All shared utils in `packages/interview-utils/src/index.ts`
- Pure functions, no side effects
- Each function under 20 lines — extract if longer

### API / Backend
- Express for Node demos, FastAPI for Python demos
- Repository pattern for data access
- Zod for input validation
- Always include error handling middleware

## Completions to prefer
- Use existing workspace packages (`@interview-lab/types`, `@interview-lab/utils`) over reimplementing
- Use `structuredClone` over `JSON.parse(JSON.stringify(x))`
- Use `Array.from` over spread for large arrays
- Use optional chaining and nullish coalescing
- Prefer `const` over `let`; avoid `var`

## Completions to avoid
- Do NOT use `any` type
- Do NOT use default exports
- Do NOT add `console.log` without a `// debug` comment
- Do NOT generate test data calling real external APIs
- Do NOT add dependencies not already in the workspace

## Test patterns
- vitest for unit tests, Playwright for E2E
- `describe` block per module, `it` per behaviour
- Mock at the boundary — not deep inside implementations
