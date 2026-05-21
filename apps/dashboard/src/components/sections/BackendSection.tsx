import { motion } from "framer-motion";
import { EnvCard } from "@/components/cards/EnvCard";
import { BACKEND_CARDS, type EnvCard as EnvCardData } from "@/data/sections";

export function BackendSection() {
  const handleOpen = (card: EnvCardData) => {
    if (card.port) window.open(`http://localhost:${card.port}`, "_blank");
  };

  const live = BACKEND_CARDS.filter((c) => !!c.port);
  const upcoming = BACKEND_CARDS.filter((c) => !c.port);

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-5 rounded-2xl border border-violet-500/20 bg-violet-500/5"
      >
        <h2 className="text-lg font-bold text-gradient-purple">Backend Machine Coding</h2>
        <p className="text-sm text-slate-400 mt-1">
          Node.js, Express, FastAPI, caching, queues, Redis, rate limiters, event systems, and API design.
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
          <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-3">Coming in Phase 4</h3>
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
