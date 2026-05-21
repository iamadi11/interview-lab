import { motion } from "framer-motion";
import { Command, FlaskConical } from "lucide-react";
import { Icon } from "@/components/Icon";
import { NAV_SECTIONS, type SectionId } from "@/data/sections";

interface Props {
  active: SectionId;
  onSelect: (id: SectionId) => void;
  onPaletteOpen: () => void;
}

export function Sidebar({ active, onSelect, onPaletteOpen }: Props) {
  return (
    <aside className="w-56 shrink-0 h-screen sticky top-0 flex flex-col border-r border-white/8 bg-slate-950/80 backdrop-blur-xl">
      {/* Logo */}
      <div className="px-4 py-5 border-b border-white/8">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-sky-500 to-violet-600 flex items-center justify-center">
            <FlaskConical size={14} className="text-white" />
          </div>
          <div>
            <div className="text-sm font-bold text-white leading-none">Interview Lab</div>
            <div className="text-[10px] text-slate-500 mt-0.5">v0.1 · Phase 0–1</div>
          </div>
        </div>
      </div>

      {/* Command palette trigger */}
      <div className="px-3 py-3 border-b border-white/8">
        <button
          onClick={onPaletteOpen}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg bg-slate-800/60 hover:bg-slate-800 border border-white/8 hover:border-white/15 transition-all text-left group"
        >
          <Command size={13} className="text-slate-500" />
          <span className="text-xs text-slate-500 group-hover:text-slate-400 flex-1">Search…</span>
          <kbd className="text-[9px] text-slate-600 bg-slate-900 px-1 py-0.5 rounded font-mono">⌘K</kbd>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-0.5">
        <p className="text-[10px] uppercase tracking-widest text-slate-600 px-2 mb-2">Sections</p>
        {NAV_SECTIONS.map((section) => {
          const isActive = active === section.id;
          return (
            <button
              key={section.id}
              onClick={() => onSelect(section.id)}
              className={`
                relative w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-all duration-150
                ${isActive
                  ? "bg-white/8 text-white"
                  : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                }
              `}
            >
              {isActive && (
                <motion.div
                  layoutId="nav-indicator"
                  className={`absolute inset-0 rounded-lg bg-gradient-to-r ${section.gradient} opacity-10`}
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <Icon name={section.icon} size={15} className={isActive ? "text-white" : "text-slate-500"} />
              <span className="relative text-xs font-medium">{section.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-white/8">
        <div className="text-[10px] text-slate-600 space-y-0.5">
          <div className="flex justify-between">
            <span>⌘K</span><span>Command palette</span>
          </div>
          <div className="flex justify-between">
            <span>1–6</span><span>Jump to section</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
