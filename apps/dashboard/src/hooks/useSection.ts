import { useState } from "react";
import type { SectionId } from "@/data/sections";

export function useSection(initial: SectionId = "quickstart") {
  const [active, setActive] = useState<SectionId>(initial);
  return { active, setActive };
}
