// Shared types across all interview-lab workspaces

export type InterviewEnv = "react" | "next" | "node" | "python" | "vanilla" | "design-system" | "backend-design";

export type InterviewDifficulty = "easy" | "medium" | "hard";

export type InterviewRoundDuration = 30 | 45 | 60 | 90;

export interface InterviewSession {
  id: string;
  env: InterviewEnv;
  startedAt: Date;
  durationMinutes: InterviewRoundDuration;
  problem?: string;
  notes?: string;
}

export interface InterviewProblem {
  id: string;
  title: string;
  difficulty: InterviewDifficulty;
  category: string;
  tags: string[];
  description: string;
  starterCode?: string;
  expectedOutput?: string;
  hints?: string[];
}

export interface TimerState {
  totalSeconds: number;
  elapsed: number;
  remaining: number;
  isRunning: boolean;
  phase: "warmup" | "coding" | "review" | "done";
}

export interface WorkspaceConfig {
  env: InterviewEnv;
  port: number;
  startCommand: string;
  buildCommand?: string;
  installCommand?: string;
}

export type Theme = "dark" | "light" | "system";

export interface UserPreferences {
  theme: Theme;
  defaultEnv: InterviewEnv;
  defaultDuration: InterviewRoundDuration;
  aiEnabled: boolean;
}
