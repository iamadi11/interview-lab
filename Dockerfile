FROM node:24-slim AS base

RUN npm install -g pnpm@10
WORKDIR /workspace

# Install dependencies layer
FROM base AS deps
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml* ./
COPY apps/dashboard/package.json apps/dashboard/
COPY apps/react-playground/package.json apps/react-playground/
COPY apps/next-playground/package.json apps/next-playground/
COPY apps/node-playground/package.json apps/node-playground/
COPY apps/js-playground/package.json apps/js-playground/
COPY apps/design-system-lab/package.json apps/design-system-lab/
COPY apps/backend-design-lab/package.json apps/backend-design-lab/
COPY packages/ui/package.json packages/ui/
COPY packages/tokens/package.json packages/tokens/
COPY packages/interview-hooks/package.json packages/interview-hooks/
COPY packages/interview-utils/package.json packages/interview-utils/
COPY packages/interview-generators/package.json packages/interview-generators/
COPY packages/ai-skills/package.json packages/ai-skills/
COPY packages/shared-types/package.json packages/shared-types/
RUN pnpm install --frozen-lockfile

# Development image
FROM base AS dev
COPY --from=deps /workspace/node_modules ./node_modules
COPY . .

EXPOSE 3000 3001 3002 3003 3004 3005 8000

CMD ["pnpm", "interview"]
