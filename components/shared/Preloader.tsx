"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export function Preloader() {
  const [pct, setPct] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";

    let cancelled = false;
    let raf = 0;
    const started = performance.now();
    const duration = reduce ? 280 : 1700;

    const fonts = document.fonts?.ready ?? Promise.resolve();
    let fontsReady = !document.fonts;
    fonts.then(() => {
      fontsReady = true;
    }).catch(() => {
      fontsReady = true;
    });

    const tick = (now: number) => {
      if (cancelled) return;
      const t = Math.min(1, (now - started) / duration);
      const eased = 1 - (1 - t) ** 3;
      setPct(Math.round(eased * 100));
      if (t < 1) {
        raf = requestAnimationFrame(tick);
        return;
      }
      const finish = () => {
        if (cancelled) return;
        window.setTimeout(() => setVisible(false), reduce ? 80 : 380);
      };
      if (fontsReady) finish();
      else fonts.finally(finish);
    };

    raf = requestAnimationFrame(tick);

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      document.documentElement.style.overflow = previousOverflow;
    };
  }, []);

  useEffect(() => {
    if (visible) return;
    document.documentElement.style.overflow = "";
  }, [visible]);

  const label = pct >= 100 ? "100" : String(pct).padStart(2, "0");

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-7 bg-void"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: "blur(10px)" }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.p
            className="font-mono text-sm tracking-[0.55em] text-accent uppercase"
            initial={{ opacity: 0.35, letterSpacing: "0.28em" }}
            animate={{ opacity: 1, letterSpacing: "0.55em" }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          >
            AF
          </motion.p>
          <div className="h-[2px] w-48 overflow-hidden rounded-full bg-white/12 sm:w-56">
            <motion.div
              className="h-full origin-left rounded-full bg-accent"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: pct / 100 }}
              transition={{ duration: 0.12, ease: "linear" }}
            />
          </div>
          <p className="font-mono text-sm text-accent/80 tabular-nums">{label}</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
