import type { HTMLAttributes } from "react";

type BadgeVariant = "default" | "success" | "warning" | "error" | "info" | "purple";

const variants: Record<BadgeVariant, string> = {
  default: "bg-slate-700 text-slate-300",
  success: "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30",
  warning: "bg-amber-500/20 text-amber-300 border border-amber-500/30",
  error:   "bg-red-500/20 text-red-300 border border-red-500/30",
  info:    "bg-sky-500/20 text-sky-300 border border-sky-500/30",
  purple:  "bg-violet-500/20 text-violet-300 border border-violet-500/30",
};

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

export function Badge({ variant = "default", className = "", children, ...props }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
