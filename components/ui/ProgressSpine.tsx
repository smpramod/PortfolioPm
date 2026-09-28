"use client";

import { useEffect, useRef } from "react";
import { useScrollProgress } from "@/lib/scroll-context";
import { useActiveSection } from "@/lib/use-active-section";
import { CHAPTERS } from "@/lib/journey";

export function ProgressSpine() {
  const progress = useScrollProgress();
  const active = useActiveSection();
  const fillRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    return progress.on("change", (next) => {
      if (fillRef.current) {
        const value = Number.isFinite(next) ? Math.min(1, Math.max(0, next)) : 0;
        fillRef.current.style.transform = `scaleY(${value})`;
      }
    });
  }, [progress]);

  return (
    <aside className="pointer-events-auto fixed top-1/2 right-3 z-40 hidden -translate-y-1/2 lg:flex xl:right-5">
      <div className="relative flex flex-col items-end gap-5">
        <span
          className="absolute top-1 right-[7px] w-px bg-white/10"
          style={{ height: "calc(100% - 8px)" }}
        />
        <span
          ref={fillRef}
          className="absolute top-1 right-[7px] h-[calc(100%-8px)] w-px origin-top bg-accent"
          style={{ transform: "scaleY(0)" }}
        />
        {CHAPTERS.map((chapter) => {
          const isCurrent = active === chapter.href;
          return (
            <a
              key={chapter.id}
              href={chapter.href}
              data-cursor="interactive"
              className="group relative flex items-center gap-3"
            >
              <span
                className={`hidden font-mono text-[10px] tracking-[0.18em] uppercase transition-colors xl:inline ${
                  isCurrent ? "text-accent" : "text-text-secondary/70 group-hover:text-text-primary"
                }`}
              >
                {chapter.label}
              </span>
              <span
                className={`relative z-10 h-[9px] w-[9px] rounded-full border transition-colors ${
                  isCurrent ? "border-accent bg-accent" : "border-white/30 bg-void"
                }`}
              />
            </a>
          );
        })}
      </div>
    </aside>
  );
}
