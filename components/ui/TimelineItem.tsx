import type { ExperienceEntry } from "@/lib/types";

const typeLabel: Record<ExperienceEntry["type"], string> = {
  experience: "Experience",
  training: "Training",
  certification: "Certification",
};

export function TimelineItem({ entry }: { entry: ExperienceEntry }) {
  return (
    <article className="relative grid gap-3 border-l border-warm/25 pl-5 sm:pl-6 md:grid-cols-[9.5rem_1fr] md:gap-8">
      <span className="absolute top-1.5 -left-[5px] h-2.5 w-2.5 rounded-full bg-warm shadow-[0_0_12px_oklch(0.75_0.14_60/0.6)]" />
      <p className="font-mono text-[length:var(--text-mono)] text-text-secondary">{entry.period}</p>
      <div className="space-y-3">
        <p className="font-mono text-[10px] tracking-[0.18em] text-warm uppercase">
          {typeLabel[entry.type]}
        </p>
        <h3 className="font-serif text-xl sm:text-2xl">{entry.title}</h3>
        <p className="text-text-primary/80">{entry.org}</p>
        <p className="max-w-2xl text-sm text-text-secondary">{entry.description}</p>
        <div className="flex flex-wrap gap-2">
          {entry.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-md border border-white/10 px-2 py-1 font-mono text-[length:var(--text-mono)] text-text-secondary"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}
