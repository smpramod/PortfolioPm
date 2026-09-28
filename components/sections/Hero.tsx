"use client";

import { motion } from "framer-motion";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { SITE } from "@/lib/site";

const ease = [0.22, 1, 0.36, 1] as const;

const stats = [
  { value: "2+", label: "Years Coding" },
  { value: "5+", label: "Technologies" },
  { value: "2", label: "Live Projects" },
];

export function Hero() {
  return (
    <section id="hero" className="section-shell grid items-center md:grid-cols-[minmax(0,1.15fr)_minmax(14rem,40%)] lg:grid-cols-[minmax(0,1fr)_minmax(16rem,42%)]">
      <div className="copy-lane relative z-10">
        <motion.p
          initial={{ opacity: 0, y: 16, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.8, ease }}
          className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 font-mono text-[length:var(--text-mono)] text-accent"
        >
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
          Available for Work
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 18, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.9, delay: 0.08, ease }}
          className="font-serif text-[length:var(--text-hero)] leading-[0.92] text-text-primary"
        >
          Abhishek
          <br />
          Farande
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 18, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.9, delay: 0.16, ease }}
          className="mt-5 max-w-full font-mono text-[length:var(--text-mono)] tracking-[0.12em] text-accent uppercase sm:tracking-[0.18em]"
        >
          Software Developer · Kolhapur
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 18, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.9, delay: 0.24, ease }}
          className="mt-6 max-w-md text-pretty text-text-secondary"
        >
          Software Developer building multi-tenant College ERP modules for academics,
          scholarships, admissions, and admin masters — using Next.js, NestJS, and MongoDB.
        </motion.p>
        <div className="mt-8 flex flex-wrap gap-6 sm:mt-10 sm:gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.7, delay: 0.32 + index * 0.08, ease }}
            >
              <p className="font-serif text-3xl text-text-primary">{stat.value}</p>
              <p className="mt-1 font-mono text-[length:var(--text-mono)] text-text-secondary">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
        <motion.div
          initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.8, delay: 0.56, ease }}
          className="mt-10 flex flex-wrap gap-3"
        >
          <MagneticButton
            href="#work"
            className="rounded-full bg-accent px-4 py-2.5 font-mono text-[length:var(--text-mono)] text-void transition-opacity hover:opacity-90 sm:px-5 sm:py-3"
          >
            View Work
          </MagneticButton>
          <MagneticButton
            href="#contact"
            className="rounded-full border border-white/15 px-4 py-2.5 font-mono text-[length:var(--text-mono)] text-text-primary hover:border-white/35 sm:px-5 sm:py-3"
          >
            Contact Me
          </MagneticButton>
          <MagneticButton
            href={SITE.resume}
            className="rounded-full border border-accent/40 px-4 py-2.5 font-mono text-[length:var(--text-mono)] text-accent hover:bg-accent/10 sm:px-5 sm:py-3"
          >
            Download Resume
          </MagneticButton>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.72, duration: 0.8 }}
          className="mt-8 flex flex-wrap gap-x-5 gap-y-2 font-mono text-[length:var(--text-mono)] text-text-secondary"
        >
          <a href={SITE.github} target="_blank" rel="noreferrer" data-cursor="interactive" className="transition-colors hover:text-accent">
            GitHub
          </a>
          <a href={SITE.linkedin} target="_blank" rel="noreferrer" data-cursor="interactive" className="transition-colors hover:text-accent">
            LinkedIn
          </a>
          <a href={`mailto:${SITE.emailWork}`} data-cursor="interactive" className="transition-colors hover:text-accent">
            Email
          </a>
        </motion.div>
      </div>
      <div className="hidden md:block" aria-hidden />
    </section>
  );
}
