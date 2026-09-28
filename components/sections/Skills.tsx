"use client";

import { motion } from "framer-motion";
import { SkillTabs } from "@/components/ui/SkillTabs";

export function Skills() {
  return (
    <section id="skills" className="section-shell">
      <div className="copy-lane">
        <motion.p
          initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="kicker"
        >
          Skills
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 16, filter: "blur(4px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="mt-3 font-serif text-[length:var(--text-h2)]"
        >
          Tools I reach for.
        </motion.h2>
        <div className="glass-panel mt-8 rounded-2xl p-4 sm:mt-10 sm:p-8">
          <SkillTabs />
        </div>
      </div>
    </section>
  );
}
