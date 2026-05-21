import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { CommandPalette } from "@/components/palette/CommandPalette";
import { QuickStartSection } from "@/components/sections/QuickStartSection";
import { FrontendSection } from "@/components/sections/FrontendSection";
import { BackendSection } from "@/components/sections/BackendSection";
import { DesignSystemSection } from "@/components/sections/DesignSystemSection";
import { ToolsSection } from "@/components/sections/ToolsSection";
import { AISection } from "@/components/sections/AISection";
import { useSection } from "@/hooks/useSection";
import { useCommandPalette, type PaletteCommand } from "@/hooks/useCommandPalette";
import { useTimer } from "@/hooks/useTimer";
import type { SectionId } from "@/data/sections";

function formatTime(s: number) {
  return `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;
}

const SECTION_KEYS: Record<string, SectionId> = {
  "1": "quickstart",
  "2": "frontend",
  "3": "backend",
  "4": "design-system",
  "5": "tools",
  "6": "ai",
};

export default function App() {
  const { active, setActive } = useSection("quickstart");
  const timer = useTimer(60);

  const commands: PaletteCommand[] = [
    { id: "nav-quickstart", label: "Quick Start", description: "Jump to quick start", icon: "Zap", shortcut: "1", action: () => setActive("quickstart") },
    { id: "nav-frontend", label: "Frontend Machine Coding", description: "React, Next, Canvas, Charts", icon: "Monitor", shortcut: "2", action: () => setActive("frontend") },
    { id: "nav-backend", label: "Backend Machine Coding", description: "Node, Express, FastAPI, Redis", icon: "Server", shortcut: "3", action: () => setActive("backend") },
    { id: "nav-design", label: "Design System Lab", description: "Tokens, components, API contracts", icon: "Palette", shortcut: "4", action: () => setActive("design-system") },
    { id: "nav-tools", label: "Interview Tools", description: "Timer, notes, whiteboard, JSON", icon: "Wrench", shortcut: "5", action: () => setActive("tools") },
    { id: "nav-ai", label: "AI Skills", description: "Review, coaching, generation", icon: "Sparkles", shortcut: "6", action: () => setActive("ai") },
    { id: "timer-start", label: "Start Timer", description: "Start the interview countdown", icon: "Play", action: () => { if (!timer.isRunning) timer.start(); } },
    { id: "timer-pause", label: "Pause Timer", description: "Pause the countdown", icon: "Pause", action: () => { if (timer.isRunning) timer.pause(); } },
    { id: "timer-reset", label: "Reset Timer", description: "Reset timer to 60 min", icon: "RotateCcw", action: () => timer.reset() },
    { id: "open-react", label: "Open React Playground", description: "localhost:3001", icon: "Atom", action: () => window.open("http://localhost:3001", "_blank") },
    { id: "open-next", label: "Open Next Playground", description: "localhost:3002", icon: "Globe", action: () => window.open("http://localhost:3002", "_blank") },
    { id: "open-node", label: "Open Node Playground", description: "localhost:3003", icon: "Terminal", action: () => window.open("http://localhost:3003", "_blank") },
    { id: "open-python", label: "Open Python Lab", description: "localhost:8000", icon: "Zap", action: () => window.open("http://localhost:8000", "_blank") },
  ];

  const palette = useCommandPalette(commands);

  // Number keys for section jump
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (palette.open) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const section = SECTION_KEYS[e.key];
      if (section) setActive(section);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [palette.open, setActive]);

  const timerToggle = () => {
    if (timer.isRunning) timer.pause();
    else timer.start();
  };

  return (
    <div className="flex min-h-screen bg-slate-950">
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-sky-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -right-40 w-96 h-96 bg-violet-500/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
      </div>

      <Sidebar active={active} onSelect={setActive} onPaletteOpen={palette.toggle} />

      <div className="flex-1 flex flex-col min-w-0">
        <Header
          active={active}
          timerDisplay={formatTime(timer.remaining)}
          timerPhase={timer.phase}
          timerRunning={timer.isRunning}
          onTimerToggle={timerToggle}
        />

        <main className="flex-1 overflow-y-auto p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
            >
              {active === "quickstart" && <QuickStartSection />}
              {active === "frontend" && <FrontendSection />}
              {active === "backend" && <BackendSection />}
              {active === "design-system" && <DesignSystemSection />}
              {active === "tools" && <ToolsSection />}
              {active === "ai" && <AISection />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <CommandPalette
        open={palette.open}
        query={palette.query}
        onQueryChange={palette.setQuery}
        onClose={() => palette.setOpen(false)}
        commands={palette.filtered}
      />
    </div>
  );
}
