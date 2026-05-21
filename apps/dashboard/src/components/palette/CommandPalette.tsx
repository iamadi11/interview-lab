import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Command } from "lucide-react";
import { Icon } from "@/components/Icon";
import type { PaletteCommand } from "@/hooks/useCommandPalette";

interface Props {
  open: boolean;
  query: string;
  onQueryChange: (q: string) => void;
  onClose: () => void;
  commands: PaletteCommand[];
}

export function CommandPalette({ open, query, onQueryChange, onClose, commands }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
  }, [open]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") onClose();
    if (e.key === "Enter" && commands[0]) {
      commands[0].action();
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -8 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="fixed top-[20vh] left-1/2 -translate-x-1/2 w-full max-w-xl z-50"
          >
            <div className="glass rounded-2xl overflow-hidden shadow-2xl border border-white/10">
              {/* Search input */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10">
                <Search size={16} className="text-slate-400 shrink-0" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => onQueryChange(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Search commands, environments, tools…"
                  className="flex-1 bg-transparent text-sm text-slate-100 placeholder:text-slate-500 outline-none"
                />
                <button onClick={onClose} className="text-slate-500 hover:text-slate-300 transition-colors">
                  <X size={14} />
                </button>
              </div>

              {/* Results */}
              <div className="max-h-72 overflow-y-auto">
                {commands.length === 0 ? (
                  <div className="px-4 py-8 text-center text-sm text-slate-500">No commands found</div>
                ) : (
                  <ul className="py-1.5">
                    {commands.map((cmd, i) => (
                      <motion.li
                        key={cmd.id}
                        initial={{ opacity: 0, x: -4 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.02 }}
                      >
                        <button
                          onClick={() => { cmd.action(); onClose(); }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 transition-colors text-left group"
                        >
                          {cmd.icon && (
                            <span className="w-7 h-7 flex items-center justify-center rounded-lg bg-slate-800 group-hover:bg-slate-700 transition-colors">
                              <Icon name={cmd.icon} size={14} className="text-slate-400" />
                            </span>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-slate-200">{cmd.label}</div>
                            {cmd.description && (
                              <div className="text-xs text-slate-500 truncate">{cmd.description}</div>
                            )}
                          </div>
                          {cmd.shortcut && (
                            <kbd className="text-[10px] text-slate-500 bg-slate-800 px-1.5 py-0.5 rounded font-mono">
                              {cmd.shortcut}
                            </kbd>
                          )}
                        </button>
                      </motion.li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Footer hint */}
              <div className="px-4 py-2 border-t border-white/5 flex items-center gap-4 text-[10px] text-slate-600">
                <span className="flex items-center gap-1"><Command size={10} /> K to toggle</span>
                <span>↑↓ navigate</span>
                <span>↵ select</span>
                <span>Esc close</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
