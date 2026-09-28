"use client";

import { useRef, type MouseEvent } from "react";
import type { Project } from "@/lib/types";

const covers: Record<string, { label: string; accent: string }> = {
  "cafe-platform": { label: "CAFE", accent: "#3ecfc0" },
  "clinic-management": { label: "CLINIC", accent: "#5ee0d0" },
  "smartcrop-ai": { label: "AI / ML", accent: "#7ad4c4" },
};

function ProjectCover({ id }: { id: string }) {
  const tone = covers[id] ?? covers["cafe-platform"];

  if (id === "clinic-management") {
    return (
      <div className="relative flex h-full items-center justify-center overflow-hidden bg-void">
        <div className="h-[82%] w-[44%] rounded-[1.75rem] border border-accent/35 bg-surface p-3 shadow-[0_20px_60px_rgba(0,0,0,0.45)]">
          <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-white/15" />
          <div className="space-y-2">
            <div className="flex items-center justify-between rounded-md bg-accent/20 px-2 py-1">
              <span className="font-mono text-[9px] text-accent">PATIENT #204</span>
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            </div>
            <div className="h-6 rounded-md bg-white/8" />
            <div className="h-6 rounded-md bg-white/8" />
            <div className="h-14 rounded-md bg-accent/10 p-1.5 font-mono text-[8px] text-accent/80">
              SQLITE · VERIFIED
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (id === "smartcrop-ai") {
    return (
      <div className="relative h-full overflow-hidden bg-[#0c161c]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,#1b3a32,transparent_45%),radial-gradient(circle_at_70%_70%,#163026,transparent_40%)]" />
        <div className="absolute top-1/2 left-1/2 h-44 w-44 -translate-x-1/2 -translate-y-1/2 rounded-full border border-accent/40" />
        <div className="absolute top-1/2 left-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full border border-accent/25 border-dashed" />
        <div className="absolute top-[38%] left-[38%] h-2.5 w-2.5 rounded-full bg-accent" />
        <div className="absolute top-[32%] left-[58%] h-2.5 w-2.5 rounded-full bg-[#6ad7c4]" />
        <div className="absolute top-[58%] left-[52%] h-2.5 w-2.5 rounded-full bg-accent" />
        <div className="absolute top-[50%] left-[50%] h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-warm" />
        <span className="absolute right-4 bottom-4 font-mono text-[10px] tracking-[0.2em] text-accent uppercase">
          {tone.label}
        </span>
      </div>
    );
  }

  return (
    <div className="relative h-full overflow-hidden bg-[#0c1418]">
      <div className="absolute inset-4 grid grid-cols-[0.32fr_0.68fr] gap-3 rounded-xl border border-white/8 bg-[#10181c] p-3">
        <div className="space-y-2 rounded-lg bg-black/30 p-2">
          <div className="h-2 w-12 rounded bg-accent/60" />
          <div className="h-2 w-16 rounded bg-white/10" />
          <div className="h-2 w-10 rounded bg-white/10" />
          <div className="h-2 w-14 rounded bg-white/10" />
          <div className="mt-4 rounded bg-accent/15 p-1 font-mono text-[8px] text-accent">
            ORDER #4298
          </div>
        </div>
        <div className="grid grid-rows-[auto_1fr] gap-2">
          <div className="flex items-center justify-between rounded-lg bg-accent/15 px-3 py-1.5">
            <span className="font-mono text-[9px] text-accent">LIVE SOCKET ROOM</span>
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-lg bg-white/6 p-2">
              <div className="h-1.5 w-10 rounded bg-warm/60" />
            </div>
            <div className="rounded-lg bg-white/6 p-2">
              <div className="h-1.5 w-8 rounded bg-accent/60" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProjectCard({ project }: { project: Project }) {
  const cardRef = useRef<HTMLElement>(null);

  const onMove = (event: MouseEvent<HTMLElement>) => {
    const node = cardRef.current;
    if (!node || window.matchMedia("(pointer: coarse)").matches) return;
    const rect = node.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;
    node.style.transform = `perspective(900px) rotateX(${(0.5 - py) * 8}deg) rotateY(${(px - 0.5) * 8}deg)`;
  };

  const reset = () => {
    const node = cardRef.current;
    if (node) node.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg)";
  };

  return (
    <article
      ref={cardRef}
      onMouseMove={onMove}
      onMouseLeave={reset}
      className="glass-panel group flex h-full flex-col overflow-hidden rounded-2xl transition-transform duration-200 will-change-transform"
      data-cursor="interactive"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <ProjectCover id={project.id} />
        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          {project.status === "building" && (
            <span className="rounded-full bg-void/70 px-2 py-1 font-mono text-[10px] tracking-wider text-accent uppercase backdrop-blur">
              Currently Building
            </span>
          )}
          {project.private && (
            <span className="rounded-full bg-void/70 px-2 py-1 font-mono text-[10px] tracking-wider text-text-primary uppercase backdrop-blur">
              Private Repo
            </span>
          )}
          {project.liveUrl && (
            <span className="rounded-full bg-void/70 px-2 py-1 font-mono text-[10px] tracking-wider text-warm uppercase backdrop-blur">
              Live Demo
            </span>
          )}
        </div>
      </div>
      <div className="flex flex-1 flex-col space-y-4 p-4 sm:p-6">
        <div>
          <h3 className="font-serif text-xl text-text-primary sm:text-2xl">{project.title}</h3>
          <p className="mt-2 text-sm text-text-secondary">{project.description}</p>
        </div>
        <ul className="space-y-2 text-sm text-text-secondary">
          {project.bullets.slice(0, 3).map((bullet) => (
            <li key={bullet} className="flex gap-2">
              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" />
              {bullet}
            </li>
          ))}
        </ul>
        <div className="mt-auto flex flex-wrap gap-2 pt-2">
          {project.tech.map((tag) => (
            <span
              key={tag}
              className="rounded-md border border-white/10 px-2 py-1 font-mono text-[length:var(--text-mono)] text-text-secondary"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-4">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              data-cursor="interactive"
              className="font-mono text-[length:var(--text-mono)] text-warm transition-colors hover:text-text-primary"
            >
              Live Demo ↗
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noreferrer"
              data-cursor="interactive"
              className="font-mono text-[length:var(--text-mono)] text-accent transition-colors hover:text-text-primary"
            >
              GitHub ↗
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
