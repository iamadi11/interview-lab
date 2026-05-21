import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { generateId } from "@/lib";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Todo {
  id: string;
  text: string;
  done: boolean;
  createdAt: number;
}

export type Theme = "dark" | "light";
export type Filter = "all" | "active" | "done";

// ─── App Store ────────────────────────────────────────────────────────────────
// Demonstrates Zustand pattern: flat state + actions colocated.

interface AppState {
  // Theme
  theme: Theme;
  toggleTheme: () => void;

  // Todos (classic machine round demo)
  todos: Todo[];
  filter: Filter;
  addTodo: (text: string) => void;
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
  clearCompleted: () => void;
  setFilter: (f: Filter) => void;

  // Computed (derived — call as selector)
  filteredTodos: () => Todo[];
  stats: () => { total: number; done: number; active: number };
}

export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (set, get) => ({
        // ── Theme ──────────────────────────────────────────────────────────
        theme: "dark",
        toggleTheme: () => set((s) => ({ theme: s.theme === "dark" ? "light" : "dark" })),

        // ── Todos ──────────────────────────────────────────────────────────
        todos: [],
        filter: "all",

        addTodo: (text) =>
          set((s) => ({
            todos: [
              ...s.todos,
              { id: generateId(), text: text.trim(), done: false, createdAt: Date.now() },
            ],
          })),

        toggleTodo: (id) =>
          set((s) => ({
            todos: s.todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
          })),

        deleteTodo: (id) =>
          set((s) => ({ todos: s.todos.filter((t) => t.id !== id) })),

        clearCompleted: () =>
          set((s) => ({ todos: s.todos.filter((t) => !t.done) })),

        setFilter: (filter) => set({ filter }),

        // ── Computed ───────────────────────────────────────────────────────
        filteredTodos: () => {
          const { todos, filter } = get();
          if (filter === "active") return todos.filter((t) => !t.done);
          if (filter === "done") return todos.filter((t) => t.done);
          return todos;
        },

        stats: () => {
          const todos = get().todos;
          const done = todos.filter((t) => t.done).length;
          return { total: todos.length, done, active: todos.length - done };
        },
      }),
      { name: "react-machine-round" }
    ),
    { name: "AppStore" }
  )
);
