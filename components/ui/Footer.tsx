import { SITE } from "@/lib/site";

const links = [
  { href: SITE.github, label: "GitHub" },
  { href: SITE.linkedin, label: "LinkedIn" },
  { href: `mailto:${SITE.emailWork}`, label: "Email" },
  { href: SITE.resume, label: "Resume" },
];

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/8 py-6 pl-[max(1rem,env(safe-area-inset-left),clamp(1.25rem,5vw,4.5rem))] pr-[max(1rem,env(safe-area-inset-right),clamp(1.25rem,5vw,4.5rem))] pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:py-8">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-mono text-[length:var(--text-mono)] tracking-[0.28em] text-accent uppercase">PM</p>
          <p className="mt-2 text-sm text-text-secondary">Pramod Margudre · Kolhapur</p>
        </div>
        <div className="flex flex-wrap items-center gap-5 font-mono text-[length:var(--text-mono)] text-text-secondary">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              data-cursor="interactive"
              className="transition-colors hover:text-warm"
            >
              {link.label}
            </a>
          ))}
          <a href="#hero" data-cursor="interactive" className="text-warm transition-colors hover:text-text-primary">
            Back to top
          </a>
        </div>
      </div>
    </footer>
  );
}
