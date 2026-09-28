"use client";

import { useRef, type MouseEvent } from "react";
import type { Project } from "@/lib/types";

const covers: Record<string, { label: string; accent: string }> = {
  "college-erp": { label: "ERP", accent: "#3ecfc0" },
  "park-o": { label: "MAP", accent: "#5ee0d0" },
  "diploma-aspirants": { label: "APP", accent: "#7ad4c4" },
};

function ProjectCover({ id }: { id: string }) {
  const tone = covers[id] ?? covers["college-erp"];

  if (id === "park-o") {
    return (
      <div className="relative h-full overflow-hidden bg-[#0c161c]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,#1b3a40,transparent_45%),radial-gradient(circle_at_70%_70%,#163038,transparent_40%)]" />
        <div className="absolute top-1/2 left-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full border border-accent/40" />
        <div className="absolute top-[38%] left-[38%] h-2.5 w-2.5 rounded-full bg-accent" />
        <div className="absolute top-[32%] left-[58%] h-2.5 w-2.5 rounded-full bg-accent" />
        <div className="absolute top-[58%] left-[52%] h-2.5 w-2.5 rounded-full bg-accent" />
        <span className="absolute right-4 bottom-4 font-mono text-[10px] tracking-[0.2em] text-accent uppercase">
          {tone.label}
        </span>
      </div>
    );
  }

  if (id === "diploma-aspirants") {
    return (
      <div className="relative flex h-full items-center justify-center overflow-hidden bg-void">
        <div className="h-[78%] w-[42%] rounded-[1.75rem] border border-accent/35 bg-surface p-3 shadow-[0_20px_60px_rgba(0,0,0,0.45)]">
          <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-white/15" />
          <div className="space-y-2">
            <div className="h-8 rounded-md bg-accent/20" />
            <div className="h-8 rounded-md bg-white/8" />
            <div className="h-8 rounded-md bg-white/8" />
            <div className="h-16 rounded-md bg-accent/10" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full overflow-hidden bg-[#0c1418]">
      <div className="absolute inset-4 grid grid-cols-[0.28fr_0.72fr] gap-3 rounded-xl border border-white/8 bg-[#10181c] p-3">
        <div className="space-y-2 rounded-lg bg-black/30 p-2">
          <div className="h-2 w-10 rounded bg-accent/50" />
          <div className="h-2 w-14 rounded bg-white/10" />
          <div className="h-2 w-12 rounded bg-white/10" />
          <div className="h-2 w-16 rounded bg-white/10" />
        </div>
        <div className="grid grid-rows-[auto_1fr] gap-2">
          <div className="h-10 rounded-lg bg-accent/15" />
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-lg bg-white/6" />
            <div className="rounded-lg bg-white/6" />
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
    </article>
  );
}
