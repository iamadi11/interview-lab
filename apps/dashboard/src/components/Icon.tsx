import * as icons from "lucide-react";
import type { LucideProps } from "lucide-react";
import type { ForwardRefExoticComponent, RefAttributes } from "react";

type LucideIcon = ForwardRefExoticComponent<LucideProps & RefAttributes<SVGSVGElement>>;

interface IconProps {
  name: string;
  size?: number;
  className?: string;
}

export function Icon({ name, size = 16, className }: IconProps) {
  const LucideIcon = (icons as unknown as Record<string, LucideIcon>)[name];
  if (!LucideIcon) return <span className={className} style={{ width: size, height: size, display: "inline-block" }} />;
  return <LucideIcon size={size} className={className} />;
}
