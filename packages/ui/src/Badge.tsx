import type { HTMLAttributes } from "react";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  color?: "blue" | "purple" | "green" | "amber" | "red" | "slate";
}

const colors = {
  blue: "bg-sky-500/20 text-sky-300 border-sky-500/30",
  purple: "bg-violet-500/20 text-violet-300 border-violet-500/30",
  green: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  amber: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  red: "bg-red-500/20 text-red-300 border-red-500/30",
  slate: "bg-slate-500/20 text-slate-300 border-slate-500/30",
};

export function Badge({ color = "slate", className = "", children, ...props }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${colors[color]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
