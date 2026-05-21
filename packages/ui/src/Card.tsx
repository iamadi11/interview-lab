import type { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  glass?: boolean;
}

export function Card({ glass = false, className = "", children, ...props }: CardProps) {
  const base = "rounded-xl border p-4";
  const solid = "bg-slate-900 border-slate-800";
  const glassy = "bg-white/5 border-white/10 backdrop-blur-md";

  return (
    <div className={`${base} ${glass ? glassy : solid} ${className}`} {...props}>
      {children}
    </div>
  );
}
