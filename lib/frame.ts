export function frameDt(delta: number) {
  if (!Number.isFinite(delta) || delta < 0) return 1 / 60;
  return Math.min(delta, 1 / 20);
}

export function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
