import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { Icon } from "@/components/Icon";
import type { EnvCard as EnvCardData } from "@/data/sections";

const colorMap: Record<string, { bg: string; border: string; text: string; glow: string; badge: string }> = {
  sky:     { bg: "bg-sky-500/10",     border: "border-sky-500/20",     text: "text-sky-400",     glow: "hover:shadow-sky-500/20",     badge: "bg-sky-500/20 text-sky-300" },
  violet:  { bg: "bg-violet-500/10",  border: "border-violet-500/20",  text: "text-violet-400",  glow: "hover:shadow-violet-500/20",  badge: "bg-violet-500/20 text-violet-300" },
  emerald: { bg: "bg-emerald-500/10", border: "border-emerald-500/20", text: "text-emerald-400", glow: "hover:shadow-emerald-500/20", badge: "bg-emerald-500/20 text-emerald-300" },
  amber:   { bg: "bg-amber-500/10",   border: "border-amber-500/20",   text: "text-amber-400",   glow: "hover:shadow-amber-500/20",   badge: "bg-amber-500/20 text-amber-300" },
  rose:    { bg: "bg-rose-500/10",    border: "border-rose-500/20",    text: "text-rose-400",    glow: "hover:shadow-rose-500/20",    badge: "bg-rose-500/20 text-rose-300" },
  teal:    { bg: "bg-teal-500/10",    border: "border-teal-500/20",    text: "text-teal-400",    glow: "hover:shadow-teal-500/20",    badge: "bg-teal-500/20 text-teal-300" },
  orange:  { bg: "bg-orange-500/10",  border: "border-orange-500/20",  text: "text-orange-400",  glow: "hover:shadow-orange-500/20",  badge: "bg-orange-500/20 text-orange-300" },
  pink:    { bg: "bg-pink-500/10",    border: "border-pink-500/20",    text: "text-pink-400",    glow: "hover:shadow-pink-500/20",    badge: "bg-pink-500/20 text-pink-300" },
  indigo:  { bg: "bg-indigo-500/10",  border: "border-indigo-500/20",  text: "text-indigo-400",  glow: "hover:shadow-indigo-500/20",  badge: "bg-indigo-500/20 text-indigo-300" },
  cyan:    { bg: "bg-cyan-500/10",    border: "border-cyan-500/20",    text: "text-cyan-400",    glow: "hover:shadow-cyan-500/20",    badge: "bg-cyan-500/20 text-cyan-300" },
};

interface Props {
  card: EnvCardData;
  index: number;
  onClick?: (card: EnvCardData) => void;
}

export function EnvCard({ card, index, onClick }: Props) {
  const c = colorMap[card.color] ?? colorMap.sky;
  const isLive = !!card.port;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04, ease: "easeOut" }}
      whileHover={{ y: -4, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onClick?.(card)}
      className={`
        relative group cursor-pointer rounded-xl border p-4 transition-all duration-200
        bg-slate-900/60 backdrop-blur-sm
        ${c.border} hover:border-opacity-60
        hover:shadow-lg ${c.glow}
        ${onClick ? "hover:bg-slate-800/80" : "opacity-60 cursor-default"}
      `}
    >
      {/* Icon */}
      <div className={`inline-flex items-center justify-center w-9 h-9 rounded-lg mb-3 ${c.bg}`}>
        <Icon name={card.icon} size={18} className={c.text} />
      </div>

      {/* Content */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-100 text-sm">{card.label}</span>
          {card.tag && (
            <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${c.badge}`}>
              {card.tag}
            </span>
          )}
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">{card.description}</p>
      </div>

      {/* Footer */}
      {(isLive || card.command) && (
        <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between">
          {isLive ? (
            <span className="flex items-center gap-1.5 text-[10px] text-slate-500">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              :{card.port}
            </span>
          ) : (
            <span className="text-[10px] text-slate-600">{card.command}</span>
          )}
          {isLive && (
            <ExternalLink size={11} className={`${c.text} opacity-0 group-hover:opacity-100 transition-opacity`} />
          )}
        </div>
      )}
    </motion.div>
  );
}
