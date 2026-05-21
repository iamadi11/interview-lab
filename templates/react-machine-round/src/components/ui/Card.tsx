import { motion } from "framer-motion";
import type { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
  glass?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
}

const paddings = { none: "", sm: "p-3", md: "p-4", lg: "p-6" };

export function Card({ hoverable, glass, padding = "md", className = "", children, ...props }: CardProps) {
  const base = `rounded-xl border ${paddings[padding]}`;
  const style = glass
    ? "bg-white/5 border-white/10 backdrop-blur-md"
    : "bg-slate-900 border-slate-800";

  if (hoverable) {
    return (
      <motion.div
        whileHover={{ y: -3, scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        className={`${base} ${style} cursor-pointer transition-shadow hover:shadow-lg ${className}`}
        {...props}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={`${base} ${style} ${className}`} {...props}>
      {children}
    </div>
  );
}
