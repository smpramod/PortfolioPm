"use client";

import { createContext, useContext, useEffect, type ReactNode } from "react";
import { useMotionValue, type MotionValue } from "framer-motion";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { eventElement } from "@/lib/dom";
import { detectPerformanceTier } from "@/hooks/usePerformanceTier";

const ScrollProgressContext = createContext<MotionValue<number> | null>(null);

export function ScrollProgressProvider({ children }: { children: ReactNode }) {
  const progress = useMotionValue(0);

  useEffect(() => {
    const previousRestoration = history.scrollRestoration;
    history.scrollRestoration = "manual";
    window.scrollTo(0, 0);

    let lenis: Lenis | null = null;
    let idleHandle: number | null = null;
    let timeoutHandle: ReturnType<typeof setTimeout> | null = null;
    let innerCleanup: (() => void) | undefined;

    function initLenis() {
      const reduceQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      const reduce = reduceQuery.matches;
      const tier = detectPerformanceTier();

      lenis = new Lenis({
        autoRaf: true,
        lerp: reduce ? 1 : tier === "low" ? 0.15 : 0.075,
        smoothWheel: !reduce,
        syncTouch: false,
        respectReducedMotion: false,
      });

      // frameloop="always" on HeroCanvas means R3F renders every tick
      // regardless — invalidate() here is a no-op, so it is removed.
      const onScroll = ({ progress: value, limit }: { progress: number; limit: number }) => {
        const next = !limit || !Number.isFinite(value) ? 0 : Math.min(1, Math.max(0, value));
        progress.set(next);
      };

      lenis.on("scroll", onScroll);
      lenis.scrollTo(0, { immediate: true });
      progress.set(0);

      const easeInOutCubic = (t: number) =>
        t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

      const onClick = (event: MouseEvent) => {
        if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
          return;
        }
        const link = eventElement(event.target)?.closest("a[href^='#']");
        if (!link) return;
        const href = link.getAttribute("href");
        if (!href || href.length < 2) return;
        let target: Element | null = null;
        try {
          target = document.querySelector(href);
        } catch {
          return;
        }
        if (!target) return;
        event.preventDefault();

        // When returning to #hero (e.g. from footer via logo or "back to top"),
        // smoothly animate the reverse scroll over 1.0s so the user experiences
        // the entire reverse 3D camera rewind and navbar un-merge.
        if (href === "#hero") {
          lenis!.scrollTo(0, {
            offset: 0,
            duration: 1.0,
            immediate: false,
            easing: easeInOutCubic,
          });
        } else {
          lenis!.scrollTo(target as HTMLElement, {
            offset: 0,
            duration: 0.9,
            immediate: false,
            easing: easeInOutCubic,
          });
        }
      };

      const onResize = () => lenis!.resize();
      document.addEventListener("click", onClick);
      window.addEventListener("resize", onResize);

      innerCleanup = () => {
        document.removeEventListener("click", onClick);
        window.removeEventListener("resize", onResize);
        lenis!.off("scroll", onScroll);
        lenis!.destroy();
      };
    }

    // Defer Lenis construction until the browser has an idle slot.
    // This decouples it from React's hydration commit phase and the R3F
    // canvas mount cost. timeout:200 guarantees execution even if the
    // main thread never goes idle (e.g., busy background tab).
    // Users typically take 300-500ms before their first intentional scroll,
    // so this is safe in practice.
    if (typeof window !== "undefined" && "requestIdleCallback" in window) {
      idleHandle = requestIdleCallback(() => initLenis(), { timeout: 200 });
    } else {
      // Safari / environments without rIC
      timeoutHandle = setTimeout(initLenis, 50);
    }

    return () => {
      if (idleHandle !== null) cancelIdleCallback(idleHandle);
      if (timeoutHandle !== null) clearTimeout(timeoutHandle);
      innerCleanup?.();
      history.scrollRestoration = previousRestoration;
    };
  }, [progress]);

  return (
    <ScrollProgressContext.Provider value={progress}>{children}</ScrollProgressContext.Provider>
  );
}

export function useScrollProgress() {
  const value = useContext(ScrollProgressContext);
  if (!value) {
    throw new Error("useScrollProgress must be used within ScrollProgressProvider");
  }
  return value;
}
