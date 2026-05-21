export type SectionId =
  | "quickstart"
  | "frontend"
  | "backend"
  | "design-system"
  | "tools"
  | "ai";

export interface EnvCard {
  id: string;
  label: string;
  description: string;
  port?: number;
  color: "sky" | "violet" | "emerald" | "amber" | "rose" | "teal" | "orange" | "pink" | "indigo" | "cyan";
  icon: string;
  tag?: string;
  command?: string;
}

export interface Section {
  id: SectionId;
  label: string;
  icon: string;
  description: string;
  gradient: string;
}

export const NAV_SECTIONS: Section[] = [
  { id: "quickstart", label: "Quick Start", icon: "Zap", description: "Launch an interview session instantly", gradient: "from-amber-500 to-orange-600" },
  { id: "frontend", label: "Frontend", icon: "Monitor", description: "React, Next.js, Vanilla, Canvas, and more", gradient: "from-sky-500 to-blue-600" },
  { id: "backend", label: "Backend", icon: "Server", description: "Node, Express, Fastify, queues, and systems", gradient: "from-violet-500 to-purple-600" },
  { id: "design-system", label: "Design System", icon: "Palette", description: "Tokens, components, API contracts", gradient: "from-emerald-500 to-teal-600" },
  { id: "tools", label: "Interview Tools", icon: "Wrench", description: "Timer, notes, whiteboard, scratchpad", gradient: "from-rose-500 to-pink-600" },
  { id: "ai", label: "AI Skills", icon: "Sparkles", description: "Review, coaching, generation, and more", gradient: "from-indigo-500 to-violet-600" },
];

export const FRONTEND_CARDS: EnvCard[] = [
  { id: "react", label: "React", description: "Hooks, context, performance, patterns", port: 3001, color: "sky", icon: "Atom", tag: "Most Common", command: "pnpm interview:react" },
  { id: "next", label: "Next.js", description: "App Router, RSC, Server Actions, caching", port: 3002, color: "indigo", icon: "Globe", tag: "Full Stack", command: "pnpm interview:next" },
  { id: "vanilla", label: "Vanilla JS", description: "DOM APIs, closures, prototypes, async", port: 3004, color: "amber", icon: "Code2", command: "pnpm interview:js" },
  { id: "animation", label: "Animation", description: "Framer Motion, GSAP, CSS transitions", color: "pink", icon: "Wand2", tag: "Phase 2" },
  { id: "canvas", label: "Canvas", description: "2D drawing, particles, game loops", color: "orange", icon: "PenTool", tag: "Phase 2" },
  { id: "threejs", label: "Three.js", description: "3D scenes, shaders, WebGL fundamentals", color: "violet", icon: "Box", tag: "Phase 2" },
  { id: "charts", label: "Charts", description: "Recharts, D3, custom visualizations", color: "emerald", icon: "BarChart2", tag: "Phase 2" },
  { id: "forms", label: "Forms", description: "React Hook Form, Zod, validation flows", color: "teal", icon: "FileInput", tag: "Phase 2" },
  { id: "a11y", label: "Accessibility", description: "ARIA, focus management, screen readers", color: "rose", icon: "Eye", tag: "Phase 2" },
  { id: "performance", label: "Performance", description: "Web Vitals, profiling, memo, lazy", color: "cyan", icon: "Gauge", tag: "Phase 2" },
  { id: "state", label: "State Mgmt", description: "Zustand, Redux, Jotai, context patterns", color: "amber", icon: "GitBranch", tag: "Phase 2" },
];

export const BACKEND_CARDS: EnvCard[] = [
  { id: "node", label: "Node.js", description: "Core modules, streams, workers, events", port: 3003, color: "emerald", icon: "Terminal", tag: "Core", command: "pnpm interview:node" },
  { id: "express", label: "Express", description: "REST API, middleware, error handling", color: "sky", icon: "Server", tag: "Phase 4" },
  { id: "fastapi", label: "FastAPI", description: "Python, Pydantic, async endpoints", port: 8000, color: "teal", icon: "Zap", command: "pnpm interview:python", tag: "Python" },
  { id: "caching", label: "Caching", description: "LRU, TTL, cache strategies, invalidation", color: "amber", icon: "Database", tag: "Phase 4" },
  { id: "queues", label: "Queues", description: "Job queues, BullMQ, retry logic", color: "violet", icon: "List", tag: "Phase 4" },
  { id: "redis", label: "Redis Sim", description: "In-memory store, pub/sub, sorted sets", color: "rose", icon: "Layers", tag: "Phase 4" },
  { id: "events", label: "Event Systems", description: "EventEmitter, pub/sub, CQRS", color: "orange", icon: "Radio", tag: "Phase 4" },
  { id: "workers", label: "Workers", description: "Worker threads, CPU-bound tasks", color: "indigo", icon: "Cpu", tag: "Phase 4" },
  { id: "ratelimiter", label: "Rate Limiter", description: "Token bucket, sliding window, leaky bucket", color: "pink", icon: "Shield", tag: "Phase 4" },
  { id: "api-design", label: "API Design", description: "REST, GraphQL, OpenAPI contracts", color: "cyan", icon: "Link", tag: "Phase 4" },
  { id: "db-design", label: "DB Design", description: "Schema, indexes, ER diagrams, queries", color: "emerald", icon: "Table", tag: "Phase 4" },
];

export const DESIGN_CARDS: EnvCard[] = [
  { id: "tokens", label: "Tokens", description: "Colors, spacing, typography, motion", color: "sky", icon: "Droplets", tag: "Phase 7" },
  { id: "typography", label: "Typography", description: "Type scale, weights, line heights", color: "violet", icon: "Type", tag: "Phase 7" },
  { id: "spacing", label: "Spacing", description: "Grid, density, responsive rhythm", color: "emerald", icon: "AlignCenter", tag: "Phase 7" },
  { id: "elevation", label: "Elevation", description: "Shadow layers, depth, z-index system", color: "amber", icon: "Layers", tag: "Phase 7" },
  { id: "motion", label: "Motion", description: "Easing curves, duration tokens, spring", color: "rose", icon: "Wind", tag: "Phase 7" },
  { id: "theme", label: "Theme Switch", description: "Dark/light/custom theme switcher", color: "indigo", icon: "SunMoon", tag: "Phase 7" },
  { id: "gallery", label: "Component Gallery", description: "All primitives in one view", port: 3005, color: "teal", icon: "LayoutGrid", tag: "Phase 7" },
  { id: "responsive", label: "Responsive Preview", description: "Multi-breakpoint layout testing", color: "orange", icon: "Smartphone", tag: "Phase 7" },
];

export const TOOL_CARDS: EnvCard[] = [
  { id: "timer", label: "Timer", description: "Countdown with phases — warm-up / coding / review", color: "amber", icon: "Timer" },
  { id: "notes", label: "Notes", description: "Markdown scratchpad for interview notes", color: "sky", icon: "FileText" },
  { id: "snippets", label: "Code Snippets", description: "Quick-access patterns and boilerplate", color: "violet", icon: "Code2" },
  { id: "whiteboard", label: "Whiteboard", description: "Free-draw canvas for diagrams", color: "emerald", icon: "PenLine" },
  { id: "arch-canvas", label: "Arch Canvas", description: "Drag-and-drop system architecture builder", color: "rose", icon: "Share2" },
  { id: "api-tester", label: "API Tester", description: "Lightweight HTTP client for testing endpoints", color: "teal", icon: "Send" },
  { id: "json-editor", label: "JSON Editor", description: "Format, validate, and transform JSON", color: "orange", icon: "Braces" },
  { id: "complexity", label: "Complexity Helper", description: "Big-O reference card and analyzer", color: "indigo", icon: "TrendingUp" },
  { id: "dsa", label: "DSA Launcher", description: "Data structure visualizer + problem runner", color: "pink", icon: "Binary" },
  { id: "state-viz", label: "State Visualizer", description: "Live state tree inspector", color: "cyan", icon: "Eye" },
];

export const AI_CARDS: EnvCard[] = [
  { id: "interview-coach", label: "Interview Coach", description: "AI acts as your interviewer — ask follow-ups", color: "violet", icon: "MessageSquare", tag: "Phase 6" },
  { id: "frontend-review", label: "Frontend Review", description: "Code review with interview scoring rubric", color: "sky", icon: "CheckSquare", tag: "Phase 6" },
  { id: "backend-review", label: "Backend Review", description: "Architecture + patterns review", color: "emerald", icon: "Server", tag: "Phase 6" },
  { id: "refactor", label: "Refactor Assistant", description: "Targeted refactors without over-engineering", color: "amber", icon: "Wand2", tag: "Phase 6" },
  { id: "component-gen", label: "Component Generator", description: "Scaffold React components from description", color: "rose", icon: "PlusSquare", tag: "Phase 6" },
  { id: "backend-gen", label: "Backend Generator", description: "Scaffold API routes, services, DTOs", color: "teal", icon: "GitBranch", tag: "Phase 6" },
  { id: "arch-advisor", label: "Architecture Advisor", description: "Evaluate and improve system design", color: "indigo", icon: "Network", tag: "Phase 6" },
  { id: "dsa-coach", label: "DSA Coach", description: "Guided problem solving without spoilers", color: "orange", icon: "Brain", tag: "Phase 6" },
  { id: "prompt-lib", label: "Prompt Library", description: "Reusable prompts for AI pair programming", color: "pink", icon: "BookOpen", tag: "Phase 6" },
  { id: "question-bank", label: "Question Bank", description: "Curated interview questions by category", color: "cyan", icon: "HelpCircle", tag: "Phase 6" },
];

export const QUICK_START_ITEMS = [
  { id: "react", label: "React Round", description: "30–60 min frontend session", color: "sky", icon: "Atom", command: "pnpm interview:react", port: 3001 },
  { id: "next", label: "Next.js Round", description: "Full-stack with App Router", color: "indigo", icon: "Globe", command: "pnpm interview:next", port: 3002 },
  { id: "node", label: "Node Round", description: "Backend APIs and systems", color: "emerald", icon: "Terminal", command: "pnpm interview:node", port: 3003 },
  { id: "python", label: "Python Round", description: "FastAPI + data structures", color: "amber", icon: "Zap", command: "pnpm interview:python", port: 8000 },
  { id: "vanilla", label: "Vanilla JS Round", description: "DOM, closures, async, OOP", color: "orange", icon: "Code2", command: "pnpm interview:js", port: 3004 },
  { id: "system-design", label: "System Design", description: "Architecture whiteboard session", color: "violet", icon: "Share2", command: "pnpm interview:system-design" },
];
