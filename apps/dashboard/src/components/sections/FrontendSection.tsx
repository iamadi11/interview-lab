import { motion } from "framer-motion";
import { EnvCard } from "@/components/cards/EnvCard";
import { FRONTEND_CARDS, type EnvCard as EnvCardData } from "@/data/sections";

export function FrontendSection() {
  const handleOpen = (card: EnvCardData) => {
    if (card.port) window.open(`http://localhost:${card.port}`, "_blank");
  };

  const live = FRONTEND_CARDS.filter((c) => !!c.port);
  const upcoming = FRONTEND_CARDS.filter((c) => !c.port);

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-5 rounded-2xl border border-sky-500/20 bg-sky-500/5"
      >
        <h2 className="text-lg font-bold text-gradient-sky">Frontend Machine Coding</h2>
        <p className="text-sm text-slate-400 mt-1">
          React, Next.js, Vanilla JS, animations, Canvas, charts, forms, accessibility, and performance.
        </p>
      </motion.div>

      {live.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-3">Ready now</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {live.map((card, i) => (
              <EnvCard key={card.id} card={card} index={i} onClick={handleOpen} />
            ))}
          </div>
        </div>
      )}

      {upcoming.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-3">Coming in Phase 2</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {upcoming.map((card, i) => (
              <EnvCard key={card.id} card={card} index={i} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
