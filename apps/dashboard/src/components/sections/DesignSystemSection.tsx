import { motion } from "framer-motion";
import { EnvCard } from "@/components/cards/EnvCard";
import { DESIGN_CARDS } from "@/data/sections";

const frontendCards = DESIGN_CARDS.slice(0, 4);
const backendCards = DESIGN_CARDS.slice(4);

const BACKEND_DESIGN_CARDS = [
  { id: "api-contracts", label: "API Contracts", description: "OpenAPI specs, versioning, contract testing", color: "sky" as const, icon: "Link", tag: "Phase 7" },
  { id: "events", label: "Event Flow", description: "Event sourcing, CQRS, domain events", color: "violet" as const, icon: "Radio", tag: "Phase 7" },
  { id: "dto", label: "DTO Explorer", description: "Data transfer objects, serialization", color: "emerald" as const, icon: "ArrowLeftRight", tag: "Phase 7" },
  { id: "er", label: "ER Diagrams", description: "Entity relationships, cardinality, normalization", color: "amber" as const, icon: "GitFork", tag: "Phase 7" },
  { id: "service-map", label: "Service Map", description: "Microservices topology, dependencies", color: "rose" as const, icon: "Network", tag: "Phase 7" },
  { id: "cache-viz", label: "Cache Visualizer", description: "Cache hit/miss, eviction, topology", color: "teal" as const, icon: "Layers", tag: "Phase 7" },
];

export function DesignSystemSection() {
  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-5 rounded-2xl border border-emerald-500/20 bg-emerald-500/5"
      >
        <h2 className="text-lg font-bold text-gradient-emerald">Design System Lab</h2>
        <p className="text-sm text-slate-400 mt-1">
          Token editor, component gallery, API contracts, ER diagrams, and architecture visualizers.
        </p>
      </motion.div>

      <div>
        <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-3">Frontend Design</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {[...frontendCards, ...backendCards].map((card, i) => (
            <EnvCard key={card.id} card={card} index={i} />
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-3">Backend Design</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {BACKEND_DESIGN_CARDS.map((card, i) => (
            <EnvCard key={card.id} card={card} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
