export const ACCENT_HEX = "#3ecfc0";
export const WARM_HEX = "#e6e0d4";
export const CHASSIS_DARK = "#14181f";
export const CHASSIS_LIGHT = "#d8d2c8";

export const CHAPTERS = [
  { id: "hero", href: "#hero", label: "Arrival", t: 0 },
  { id: "about", href: "#about", label: "Identity", t: 0.2 },
  { id: "skills", href: "#skills", label: "Craft", t: 0.38 },
  { id: "work", href: "#work", label: "Work", t: 0.56 },
  { id: "contact", href: "#contact", label: "Close", t: 0.78 },
] as const;

export function chapterGate(t: number, enter: number, peak: number, fade: number, exit: number) {
  const x = Number.isFinite(t) ? t : 0;
  return Math.min(smoothstep(enter, peak, x), 1 - smoothstep(fade, exit, x));
}

function smoothstep(edge0: number, edge1: number, x: number) {
  const span = edge1 - edge0;
  if (span === 0) return x >= edge1 ? 1 : 0;
  const t = Math.min(1, Math.max(0, (x - edge0) / span));
  return t * t * (3 - 2 * t);
}
