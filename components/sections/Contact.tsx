"use client";

import { useActionState } from "react";
import { motion } from "framer-motion";
import { experience } from "@/lib/experienceData";
import { submitContact } from "@/lib/actions";
import { TimelineItem } from "@/components/ui/TimelineItem";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { SITE } from "@/lib/site";
import type { ContactFormState } from "@/lib/types";

const initialState: ContactFormState = { ok: false, error: "" };
const ease = [0.22, 1, 0.36, 1] as const;
const fieldClass =
  "w-full rounded-lg border border-white/10 bg-void/80 px-3 py-2.5 text-text-primary outline-none transition-colors placeholder:text-text-secondary/50 focus:border-warm";

function ContactForm() {
  const [state, action, pending] = useActionState(submitContact, initialState);

  return (
    <form action={action} className="glass-panel space-y-4 rounded-2xl p-4 sm:p-8">
      <p className="font-mono text-[length:var(--text-mono)] tracking-[0.18em] text-warm uppercase">
        Write a note
      </p>
      <label className="block space-y-2">
        <span className="font-mono text-[length:var(--text-mono)] text-text-secondary">Name</span>
        <input name="name" required minLength={2} maxLength={80} autoComplete="name" placeholder="Your name" className={fieldClass} />
      </label>
      <label className="block space-y-2">
        <span className="font-mono text-[length:var(--text-mono)] text-text-secondary">Email</span>
        <input name="email" type="email" required maxLength={254} autoComplete="email" placeholder="you@email.com" className={fieldClass} />
      </label>
      <label className="block space-y-2">
        <span className="font-mono text-[length:var(--text-mono)] text-text-secondary">Message</span>
        <textarea name="message" required minLength={10} maxLength={5000} rows={5} placeholder="What should we build?" className={fieldClass} />
      </label>
      <label style={{ position: "absolute", opacity: 0, pointerEvents: "none", zIndex: -1 }} aria-hidden="true">
        <span>Company</span>
        <input name="company" tabIndex={-1} autoComplete="off" />
      </label>
      {state.error && <p className="text-sm text-red-400">{state.error}</p>}
      {state.ok && <p className="text-sm text-warm">Message received. I&apos;ll get back to you soon.</p>}
      <MagneticButton
        type="submit"
        disabled={pending}
        className="rounded-full bg-warm px-5 py-3 font-mono text-[length:var(--text-mono)] text-void disabled:opacity-60"
      >
        {pending ? "Sending..." : "Send message"}
      </MagneticButton>
    </form>
  );
}

export function Contact() {
  return (
    <section id="contact" className="section-shell space-y-10 !min-h-0 pb-[max(4rem,env(safe-area-inset-bottom))] sm:space-y-16">
      <div className="copy-lane space-y-10 sm:space-y-16">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease }}
            className="font-mono text-[length:var(--text-mono)] tracking-[0.2em] text-warm uppercase"
          >
            Contact
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 16, filter: "blur(4px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.08, ease }}
            className="mt-3 font-serif text-[length:var(--text-h2)]"
          >
            Let&apos;s work together.
          </motion.h2>
        </div>

        <div className="glass-panel space-y-8 rounded-2xl p-4 sm:space-y-10 sm:p-8">
          {experience.map((entry, index) => (
            <motion.div
              key={`${entry.title}-${entry.org}`}
              initial={{ opacity: 0, y: 16, filter: "blur(4px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: index * 0.08, ease }}
            >
              <TimelineItem entry={entry} />
            </motion.div>
          ))}
        </div>

        <div className="grid items-start gap-10">
          <div className="space-y-6">
            <p className="text-text-secondary break-words">
              Work: {SITE.emailWork}
              <br />
              Personal: {SITE.emailPersonal}
              <br />
              {SITE.phone}
              <br />
              {SITE.location}
            </p>
            <div className="flex flex-wrap gap-3">
              <MagneticButton
                href={SITE.resume}
                className="rounded-full bg-warm px-5 py-3 font-mono text-[length:var(--text-mono)] text-void"
              >
                Download PDF
              </MagneticButton>
              <MagneticButton
                href={SITE.resume}
                className="rounded-full border border-warm/50 px-5 py-3 font-mono text-[length:var(--text-mono)] text-warm hover:bg-warm/10"
              >
                View Resume
              </MagneticButton>
            </div>
            <div className="flex flex-wrap gap-x-5 gap-y-2 font-mono text-[length:var(--text-mono)] text-text-secondary">
              <a href={SITE.github} target="_blank" rel="noreferrer" className="transition-colors hover:text-warm">
                GitHub
              </a>
              <a href={SITE.linkedin} target="_blank" rel="noreferrer" className="transition-colors hover:text-warm">
                LinkedIn
              </a>
              <a href={`mailto:${SITE.emailWork}`} className="transition-colors hover:text-warm">
                Work email
              </a>
              <a href={`mailto:${SITE.emailPersonal}`} className="transition-colors hover:text-warm">
                Personal
              </a>
            </div>
          </div>
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
