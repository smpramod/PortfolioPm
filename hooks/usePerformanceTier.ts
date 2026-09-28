"use client";

import { useState } from "react";

export type PerformanceTier = "low" | "medium" | "high";

export function detectPerformanceTier(): PerformanceTier {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return "high"; // SSR default
  }

  let score = 0;

  // --- Signal 1: CPU core count (universally available) ---
  const cores = navigator.hardwareConcurrency ?? 4;
  if (cores >= 8) score += 3;
  else if (cores >= 6) score += 2;
  else if (cores >= 4) score += 1;
  // <= 3 cores: no contribution, score stays low

  // --- Signal 2: deviceMemory (Chrome/Edge only — undefined on Safari/Firefox/iOS) ---
  // Treat undefined as "unknown, skip" — not as a negative signal.
  // An iPhone 14 Pro has 6 GB RAM but deviceMemory is never exposed by Safari.
  // Penalising undefined would misclassify every Apple device into medium tier.
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
  if (memory !== undefined) {
    // Only adjust score when we actually have the data
    if (memory >= 8) score += 3;
    else if (memory >= 4) score += 1;
    else if (memory < 2) score -= 2; // Definitively low-end: < 2 GB confirmed
    // 2–3 GB: no adjustment — borderline, let cores decide
  }
  // undefined → no score change; decision deferred to cores + UA

  // --- Signal 3: Android phone UA (thermal / sustained performance headroom) ---
  const ua = navigator.userAgent;
  const isAndroidMobile = /android/i.test(ua) && /mobile/i.test(ua);
  // iPhone/iPad UA is NOT penalised — Apple mobile hardware is consistently
  // high-performance for WebGL. Only penalise Android phones (not tablets).
  if (isAndroidMobile) score -= 1;

  // --- Thresholds ---
  // iPhone 12+ (8 cores, no deviceMemory, not Android)      = 3       → "high"   ✓
  // Android mid-range (4 cores, 4 GB memory, mobile)         = 1+1-1=1 → "medium" ✓
  // Budget Android (2 cores, 1 GB memory, mobile)            = 0-2-1=-3 → "low"   ✓
  // Desktop/Mac (8-12 cores, 8+ GB memory)                   = 3+3=6   → "high"   ✓
  if (score >= 3) return "high";
  if (score >= 1) return "medium";
  return "low";
}

// Computed once at module load (client-only — this file is "use client").
// Avoids a useEffect → re-render cycle that would briefly set the wrong Canvas
// DPR or Lenis lerp on the first paint.
const INITIAL_TIER: PerformanceTier =
  typeof window !== "undefined" ? detectPerformanceTier() : "high";

export function usePerformanceTier(): PerformanceTier {
  // useState with a stable initial value — no effect or setter needed.
  const [tier] = useState<PerformanceTier>(INITIAL_TIER);
  return tier;
}
