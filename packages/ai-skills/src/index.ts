// AI skill descriptors — used by Claude Code, Cursor, and Copilot adapters
// Full implementations populated in Phase 6

export type SkillCategory =
  | "frontend-review"
  | "backend-review"
  | "performance-review"
  | "accessibility-review"
  | "animation-review"
  | "system-design-review"
  | "machine-round-review"
  | "refactor-review"
  | "cleanup-review"
  | "interview-coach"
  | "dsa-coach"
  | "architecture-generator"
  | "prompt-generator";

export interface AISkill {
  id: SkillCategory;
  name: string;
  description: string;
  promptFile: string;
  temperature?: number;
  maxTokens?: number;
}

export const skills: AISkill[] = [
  { id: "frontend-review", name: "Frontend Review", description: "Review React/TS code for quality, patterns, and interview readiness.", promptFile: "prompts/frontend-review.md" },
  { id: "backend-review", name: "Backend Review", description: "Review Node/Express/Fastify for patterns, error handling, and scalability.", promptFile: "prompts/backend-review.md" },
  { id: "performance-review", name: "Performance Review", description: "Identify performance bottlenecks and suggest optimizations.", promptFile: "prompts/performance-review.md" },
  { id: "accessibility-review", name: "Accessibility Review", description: "Audit for WCAG compliance and screen reader support.", promptFile: "prompts/accessibility-review.md" },
  { id: "system-design-review", name: "System Design Review", description: "Evaluate architecture diagrams and design decisions.", promptFile: "prompts/system-design-review.md" },
  { id: "machine-round-review", name: "Machine Round Review", description: "Evaluate machine coding round submissions end-to-end.", promptFile: "prompts/machine-round-review.md" },
  { id: "refactor-review", name: "Refactor Review", description: "Suggest targeted refactors without over-engineering.", promptFile: "prompts/refactor-review.md" },
  { id: "interview-coach", name: "Interview Coach", description: "Act as an interviewer — ask follow-up questions.", promptFile: "prompts/interview-coach.md" },
  { id: "dsa-coach", name: "DSA Coach", description: "Guide through data structures & algorithms problems.", promptFile: "prompts/dsa-coach.md" },
  { id: "architecture-generator", name: "Architecture Generator", description: "Generate architecture diagrams and component maps.", promptFile: "prompts/architecture-generator.md" },
  { id: "prompt-generator", name: "Prompt Generator", description: "Generate optimised prompts for AI pair programming.", promptFile: "prompts/prompt-generator.md" },
];
