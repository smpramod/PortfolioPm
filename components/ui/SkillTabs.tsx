"use client";

import { skills, skillTabs } from "@/lib/skillsData";
import { SkillBar } from "./SkillBar";
import { useSkillTab } from "@/lib/skill-tab-context";

export function SkillTabs() {
  const { tab: active, setTab } = useSkillTab();
  const visible = skills.filter((skill) => skill.category === active);

  return (
    <div>
      <div className="mb-8 flex flex-wrap gap-2">
        {skillTabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            data-cursor="interactive"
            onClick={() => setTab(tab.id)}
            className={`rounded-full px-3 py-1.5 font-mono text-[length:var(--text-mono)] transition-colors sm:px-4 sm:py-2 ${
              active === tab.id
                ? "bg-accent text-void"
                : "border border-white/10 text-text-secondary hover:border-white/25 hover:text-text-primary"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="space-y-5">
        {visible.map((skill, index) => (
          <SkillBar key={skill.name} skill={skill} index={index} />
        ))}
      </div>
    </div>
  );
}
