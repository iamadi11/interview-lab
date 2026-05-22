import Link from "next/link";

const colorMap: Record<string, { border: string; badge: string; dot: string }> = {
  sky:    { border: "hover:border-sky-500/40",    badge: "bg-sky-500/20 text-sky-300",    dot: "bg-sky-400"    },
  violet: { border: "hover:border-violet-500/40", badge: "bg-violet-500/20 text-violet-300", dot: "bg-violet-400" },
  emerald:{ border: "hover:border-emerald-500/40",badge: "bg-emerald-500/20 text-emerald-300",dot: "bg-emerald-400"},
  amber:  { border: "hover:border-amber-500/40",  badge: "bg-amber-500/20 text-amber-300",  dot: "bg-amber-400"  },
  rose:   { border: "hover:border-rose-500/40",   badge: "bg-rose-500/20 text-rose-300",   dot: "bg-rose-400"   },
  indigo: { border: "hover:border-indigo-500/40", badge: "bg-indigo-500/20 text-indigo-300",dot: "bg-indigo-400" },
  teal:   { border: "hover:border-teal-500/40",   badge: "bg-teal-500/20 text-teal-300",   dot: "bg-teal-400"   },
  orange: { border: "hover:border-orange-500/40", badge: "bg-orange-500/20 text-orange-300",dot: "bg-orange-400" },
};

interface DemoCardProps {
  href: string;
  title: string;
  description: string;
  badge: string;
  color: string;
  concept: string;
}

export function DemoCard({ href, title, description, badge, color, concept }: DemoCardProps) {
  const c = colorMap[color] ?? colorMap["sky"]!;
  return (
    <Link
      href={href}
      className={`group block rounded-xl border border-white/8 bg-slate-900/60 p-4 transition-all duration-200 hover:bg-slate-800/60 ${c.border} hover:shadow-lg`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="font-semibold text-slate-100 text-sm group-hover:text-white transition-colors">
          {title}
        </h3>
        <span className={`shrink-0 text-[10px] font-medium px-2 py-0.5 rounded-full ${c.badge}`}>
          {badge}
        </span>
      </div>
      <p className="text-xs text-slate-400 leading-relaxed mb-3">{description}</p>
      <code className="flex items-center gap-1.5 text-[11px] font-mono text-slate-500">
        <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
        {concept}
      </code>
    </Link>
  );
}
