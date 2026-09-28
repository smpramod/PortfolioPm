"use client";

import { useEffect, useState } from "react";
import { useScrollProgress } from "@/lib/scroll-context";

const SECTION_IDS = ["hero", "about", "skills", "work", "contact"] as const;

function sectionFromScroll(): `#${(typeof SECTION_IDS)[number]}` {
  const scrollingElement = document.scrollingElement ?? document.documentElement;
  const maxScroll = scrollingElement.scrollHeight - window.innerHeight;
  if (maxScroll > 0 && window.scrollY >= maxScroll - 4) {
    return "#contact";
  }

  const probe = Math.min(window.innerHeight * 0.34, 220);
  let current: `#${(typeof SECTION_IDS)[number]}` = "#hero";

  for (const id of SECTION_IDS) {
    const el = document.getElementById(id);
    if (!el) continue;
    if (el.getBoundingClientRect().top <= probe) {
      current = `#${id}`;
    }
  }

  return current;
}

export function useActiveSection() {
  const progress = useScrollProgress();
  const [active, setActive] = useState("#hero");

  useEffect(() => {
    const apply = () => {
      const next = sectionFromScroll();
      setActive((current) => (current === next ? current : next));
    };

    apply();
    const unsub = progress.on("change", apply);
    window.addEventListener("resize", apply);
    return () => {
      unsub();
      window.removeEventListener("resize", apply);
    };
  }, [progress]);

  return active;
}
