"use client";

import { motion } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

const facts = [
  { label: "Education", value: "B.Tech IT — Walchand Institute of Technology · CGPA 8.76" },
  { label: "Diploma", value: "DKTE YCP, Ichalkaranji · 82.46%" },
  { label: "Now", value: "Software Developer — Seratek Systems" },
  { label: "Open to", value: "Full-time & freelance opportunities" },
];

export function About() {
  return (
    <section id="about" className="section-shell">
      <div className="copy-lane space-y-8">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease }}
            className="kicker"
          >
            About
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 16, filter: "blur(4px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.08, ease }}
            className="mt-3 font-serif text-[length:var(--text-h2)] text-pretty"
          >
            I build things for the web.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16, filter: "blur(4px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.16, ease }}
            className="mt-6 text-pretty text-text-secondary"
          >
            B.Tech IT graduate from Walchand Institute of Technology. Software Developer
            at Seratek Systems (formerly Akron Systems), building a multi-tenant College ERP
            for academics, scholarships, admissions, and admin masters.
          </motion.p>
          <motion.blockquote
            initial={{ opacity: 0, y: 16, filter: "blur(4px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.24, ease }}
            className="mt-8 border-l-2 border-accent pl-5 font-serif text-[clamp(1.25rem,2vw,1.75rem)] leading-snug text-text-primary"
          >
            I care about clean code, fast UIs, and solving real problems.
          </motion.blockquote>
        </div>
        <motion.aside
          initial={{ opacity: 0, y: 16, filter: "blur(4px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.16, ease }}
          className="glass-panel rounded-2xl p-4 sm:p-6"
        >
          <p className="kicker">Quick facts</p>
          <ul className="mt-5 divide-y divide-white/8">
            {facts.map((fact, index) => (
              <motion.li
                key={fact.label}
                initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.08, ease }}
                className="py-3 first:pt-0 last:pb-0"
              >
                <p className="font-mono text-[10px] tracking-[0.16em] text-accent uppercase">
                  {fact.label}
                </p>
                <p className="mt-1 text-sm text-text-secondary">{fact.value}</p>
              </motion.li>
            ))}
          </ul>
        </motion.aside>
      </div>
    </section>
  );
}
