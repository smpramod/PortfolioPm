"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import type { skillTabs } from "@/lib/skillsData";

export type SkillTabId = (typeof skillTabs)[number]["id"];

const SkillTabContext = createContext<{
  tab: SkillTabId;
  setTab: (tab: SkillTabId) => void;
} | null>(null);

export function SkillTabProvider({ children }: { children: ReactNode }) {
  const [tab, setTab] = useState<SkillTabId>("language");
  return <SkillTabContext.Provider value={{ tab, setTab }}>{children}</SkillTabContext.Provider>;
}

export function useSkillTab() {
  const value = useContext(SkillTabContext);
  if (!value) {
    throw new Error("useSkillTab must be used within SkillTabProvider");
  }
  return value;
}
