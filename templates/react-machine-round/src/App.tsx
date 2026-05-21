import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";
import { Button, Input, Card, Badge, ToastContainer } from "@/components/ui";
import { useAppStore } from "@/store";
import { useDebounce, useKeyboard, useTimer } from "@/hooks";
import { globalBus } from "@/lib/event-bus";
import { staggerContainer, staggerItem, fadeUp } from "@/animations/variants";
import { userService } from "@/services/api";
import { truncate, formatTime } from "@/lib";

// ─── Zod schema (interview: show form validation) ─────────────────────────────
const todoSchema = z.object({
  text: z.string().min(1, "Cannot be empty").max(120, "Too long"),
});
type TodoForm = z.infer<typeof todoSchema>;

// ─── Todo demo section ────────────────────────────────────────────────────────
function TodoSection() {
  const { todos, filter, addTodo, toggleTodo, deleteTodo, clearCompleted, setFilter, filteredTodos, stats } = useAppStore();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<TodoForm>({
    resolver: zodResolver(todoSchema),
  });

  const onSubmit = ({ text }: TodoForm) => {
    addTodo(text);
    reset();
    globalBus.emit("toast:show", { message: "Todo added!", type: "success" });
  };

  const s = stats();
  const displayed = filteredTodos().filter((t) =>
    debouncedSearch ? t.text.toLowerCase().includes(debouncedSearch.toLowerCase()) : true
  );

  // Keyboard: Escape clears search
  useKeyboard({ Escape: () => setSearch("") });

  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-white">Todo — Zustand + RHF + Zod</h2>
        <div className="flex gap-1.5">
          <Badge variant="info">{s.active} active</Badge>
          <Badge variant="success">{s.done} done</Badge>
        </div>
      </div>

      {/* Add form */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex gap-2">
        <div className="flex-1">
          <Input
            {...register("text")}
            placeholder="Add todo… (Enter to submit)"
            error={errors.text?.message}
          />
        </div>
        <Button type="submit" size="md">Add</Button>
      </form>

      {/* Search */}
      <Input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search todos… (Esc to clear)"
      />

      {/* Filter tabs */}
      <div className="flex gap-1">
        {(["all", "active", "done"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all capitalize ${
              filter === f
                ? "bg-sky-500/20 text-sky-300 border border-sky-500/30"
                : "text-slate-500 hover:text-slate-300"
            }`}
          >
            {f}
          </button>
        ))}
        {s.done > 0 && (
          <button onClick={clearCompleted} className="ml-auto text-xs text-slate-600 hover:text-red-400 transition-colors">
            Clear completed
          </button>
        )}
      </div>

      {/* List */}
      <motion.ul variants={staggerContainer} initial="hidden" animate="visible" className="space-y-1.5">
        <AnimatePresence>
          {displayed.map((todo) => (
            <motion.li
              key={todo.id}
              variants={staggerItem}
              exit={{ opacity: 0, x: -20, height: 0 }}
              className="flex items-center gap-3 px-3 py-2 rounded-lg bg-slate-800/60 group"
            >
              <input
                type="checkbox"
                checked={todo.done}
                onChange={() => toggleTodo(todo.id)}
                className="rounded accent-sky-500 cursor-pointer"
              />
              <span className={`flex-1 text-sm ${todo.done ? "line-through text-slate-500" : "text-slate-200"}`}>
                {truncate(todo.text, 80)}
              </span>
              <button
                onClick={() => { deleteTodo(todo.id); globalBus.emit("toast:show", { message: "Deleted", type: "warning" }); }}
                className="text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all text-xs"
              >
                ✕
              </button>
            </motion.li>
          ))}
        </AnimatePresence>
        {displayed.length === 0 && (
          <li className="text-center py-6 text-slate-600 text-sm">
            {search ? "No matching todos" : "No todos yet — add one above"}
          </li>
        )}
      </motion.ul>
    </Card>
  );
}

// ─── Users demo section (React Query + MSW) ───────────────────────────────────
function UsersSection() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = useQuery({
    queryKey: ["users", page],
    queryFn: () => userService.list(page, 5),
  });

  return (
    <Card className="space-y-4">
      <h2 className="font-semibold text-white">Users — React Query + MSW</h2>
      {isLoading && <div className="text-sm text-slate-400 animate-pulse">Loading…</div>}
      {isError && <div className="text-sm text-red-400">Error loading users</div>}
      {data && (
        <>
          <ul className="space-y-2">
            {data.data.map((user) => (
              <li key={user.id} className="flex items-center gap-3 px-3 py-2 rounded-lg bg-slate-800/60">
                <img src={user.avatar} alt={user.name} className="w-7 h-7 rounded-full bg-slate-700" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-slate-200">{user.name}</div>
                  <div className="text-xs text-slate-500 truncate">{user.email}</div>
                </div>
                <Badge variant={user.role === "admin" ? "purple" : "default"}>{user.role}</Badge>
              </li>
            ))}
          </ul>
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Page {data.page} of {Math.ceil(data.total / 5)}</span>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>←</Button>
              <Button variant="ghost" size="sm" disabled={!data.hasMore} onClick={() => setPage((p) => p + 1)}>→</Button>
            </div>
          </div>
        </>
      )}
    </Card>
  );
}

// ─── Timer demo ───────────────────────────────────────────────────────────────
function TimerDemo() {
  const timer = useTimer(30);
  const phaseColor: Record<string, string> = {
    idle: "text-slate-400", warmup: "text-sky-400",
    coding: "text-emerald-400", review: "text-amber-400", done: "text-red-400",
  };

  return (
    <Card className="space-y-4 text-center">
      <h2 className="font-semibold text-white text-left">Timer — useTimer hook</h2>
      <div className={`font-mono text-5xl font-bold tabular-nums ${phaseColor[timer.phase]}`}>
        {timer.display}
      </div>
      <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-sky-500 to-violet-500 rounded-full"
          animate={{ width: `${timer.progressPct}%` }}
          transition={{ duration: 0.8 }}
        />
      </div>
      <div className="text-xs uppercase tracking-widest text-slate-500">{timer.phase}</div>
      <div className="flex gap-2 justify-center">
        {!timer.isRunning
          ? <Button size="sm" onClick={timer.start} disabled={timer.phase === "done"}>Start</Button>
          : <Button size="sm" variant="secondary" onClick={timer.pause}>Pause</Button>
        }
        <Button size="sm" variant="ghost" onClick={() => timer.reset()}>Reset</Button>
      </div>
    </Card>
  );
}

// ─── Root App ─────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <div className="min-h-screen bg-slate-950 p-6">
      {/* Ambient glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-sky-500/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-violet-500/5 rounded-full blur-3xl" />
      </div>

      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="relative max-w-5xl mx-auto space-y-6"
      >
        {/* Header */}
        <div className="text-center space-y-1 py-4">
          <h1 className="text-2xl font-bold text-white">
            React Machine Round
            <span className="ml-2 text-sm font-normal text-slate-500">— interview workspace</span>
          </h1>
          <p className="text-sm text-slate-500">
            Zustand · React Query · React Hook Form · Zod · Framer Motion · MSW · Tailwind
          </p>
        </div>

        {/* Demo grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-4">
            <TodoSection />
          </div>
          <div className="space-y-4">
            <TimerDemo />
            <UsersSection />
          </div>
        </div>

        {/* Quick reference */}
        <Card padding="sm" className="text-xs font-mono text-slate-500">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {[
              ["@/lib", "utils, LRU, EventBus, drag"],
              ["@/hooks", "useDebounce, useTimer, useKeyboard…"],
              ["@/store", "Zustand: todos, theme"],
              ["@/services/api", "userService, postService (MSW)"],
            ].map(([k, v]) => (
              <div key={k}>
                <span className="text-sky-400">{k}</span>
                <div className="text-slate-600">{v}</div>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>

      <ToastContainer />
    </div>
  );
}
