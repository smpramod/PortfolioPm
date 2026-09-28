"use client";

import { useEffect, useState } from "react";
import { useTheme } from "@/lib/theme-context";

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isLight = mounted && theme === "light";

  return (
    <button
      type="button"
      data-cursor="interactive"
      onClick={toggle}
      aria-label={isLight ? "Switch to dark theme" : "Switch to light theme"}
      className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-text-primary/10 bg-surface/90 text-text-primary shadow-[0_8px_32px_rgba(0,0,0,0.18)] backdrop-blur-2xl transition-colors hover:border-accent/50 hover:text-accent sm:h-9 sm:w-9"
    >
      {isLight ? (
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 sm:h-5 sm:w-5" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path
            strokeLinecap="round"
            d="M21 14.5A8.5 8.5 0 1 1 9.5 3 7 7 0 0 0 21 14.5Z"
          />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 sm:h-5 sm:w-5" fill="none" stroke="currentColor" strokeWidth="1.6">
          <circle cx="12" cy="12" r="4" />
          <path
            strokeLinecap="round"
            d="M12 3v1.6M12 19.4V21M4.2 4.2l1.1 1.1M18.7 18.7l1.1 1.1M3 12h1.6M19.4 12H21M4.2 19.8l1.1-1.1M18.7 5.3l1.1-1.1"
          />
        </svg>
      )}
    </button>
  );
}
