"use client";

import { useEffect, useRef, useState } from "react";
import { usePerformanceTier } from "@/hooks/usePerformanceTier";

export function PerformanceNotice() {
  const tier = usePerformanceTier();
  const [isVisible, setIsVisible] = useState(false);
  // Guard: only ever start the timers once, even if tier value updates.
  const started = useRef(false);

  useEffect(() => {
    if (tier === "high") return; // high-tier devices never see this
    if (started.current) return; // don't restart if tier re-renders
    const hasSeenNotice = sessionStorage.getItem("perf-notice-dismissed");
    if (hasSeenNotice) return;

    started.current = true;

    // Delay slightly so the toast doesn't fight with the preloader animation.
    const showTimer = setTimeout(() => setIsVisible(true), 2500);
    // Auto-dismiss 8 s after it becomes visible (2.5 s delay + 8 s = 10.5 s total).
    const hideTimer = setTimeout(() => {
      setIsVisible(false);
      sessionStorage.setItem("perf-notice-dismissed", "true");
    }, 10500);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [tier]);

  if (!isVisible) return null;

  return (
    <div className="pointer-events-none fixed bottom-6 left-1/2 z-[100] w-[90%] max-w-sm -translate-x-1/2">
      {/* Solid surface + shadow — no backdrop-blur to stay consistent with Phase 1 cleanup */}
      <div className="pointer-events-auto flex items-center justify-between gap-4 rounded-2xl border border-text-primary/10 bg-surface px-4 py-3 shadow-[0_12px_40px_rgba(0,0,0,0.5)] animate-in slide-in-from-bottom-6 fade-in duration-500">
        <p className="text-sm text-text-primary">
          <strong className="text-accent">Heads up &mdash;</strong> this experience is 3D-heavy. For the smoothest version, try a newer device or desktop.
        </p>
        <button
          onClick={() => {
            setIsVisible(false);
            sessionStorage.setItem("perf-notice-dismissed", "true");
          }}
          className="shrink-0 p-1 text-text-secondary transition-colors hover:text-accent"
          aria-label="Dismiss notice"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
    </div>
  );
}

