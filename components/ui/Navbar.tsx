"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";
import { motion, useTransform } from "framer-motion";
import { useScrollProgress } from "@/lib/scroll-context";
import { useActiveSection } from "@/lib/use-active-section";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

// ─── Scroll progress range constants (tune these to taste) ───────────────────
// Progress is 0.0 (Hero) → 1.0 (Footer). 
// Start immediately at 0 so even a 5px scroll produces movement.
const MERGE_START = 0.0;
const MERGE_END   = 1.0; // Gradually moves across entire page and only fully merges at the footer

// ─── Links ───────────────────────────────────────────────────────────────────
const links = [
  { href: "#hero",    label: "Home"    },
  { href: "#about",   label: "About"   },
  { href: "#skills",  label: "Skills"  },
  { href: "#work",    label: "Work"    },
  { href: "#contact", label: "Contact" },
] as const;

// ─── Scan shimmer ─────────────────────────────────────────────────────────────
function ScanShimmer() {
  return (
    <motion.span
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden rounded-full"
    >
      <motion.span
        className="absolute top-0 bottom-0 w-1/3 rounded-full"
        style={{
          background:
            "linear-gradient(90deg,transparent 0%,color-mix(in oklch,var(--accent) 40%,transparent) 50%,transparent 100%)",
        }}
        initial={{ left: "-34%" }}
        animate={{ left: "134%" }}
        transition={{
          duration: 1.05,
          ease: "easeInOut",
          repeat: Infinity,
          repeatDelay: 5.5,
          delay: 2.0,
        }}
      />
    </motion.span>
  );
}

// ─── NavLink ──────────────────────────────────────────────────────────────────
type NavLinkProps = {
  href: string;
  label: string;
  isActive: boolean;
  isHovered: boolean;
  onHoverStart: () => void;
  reduceMotion: boolean;
};

function NavLink({ href, label, isActive, isHovered, onHoverStart, reduceMotion }: NavLinkProps) {
  return (
    <a
      href={href}
      data-cursor="interactive"
      aria-current={isActive ? "page" : undefined}
      onMouseEnter={onHoverStart}
      onFocus={onHoverStart}
      className={`relative shrink-0 select-none rounded-full px-1.5 py-0.5 font-mono text-[8.5px] uppercase tracking-normal outline-none transition-colors duration-200 sm:px-3 sm:py-1.5 sm:text-[10px] sm:tracking-wider lg:px-3.5 lg:py-2 lg:text-[length:var(--text-mono)] ${isActive ? "font-semibold" : "font-normal"}`}
      style={{
        color: isActive
          ? "var(--accent)"
          : isHovered
          ? "var(--text-primary)"
          : "var(--text-secondary)",
      }}
    >
      {isActive && (
        <motion.span
          layoutId="nav-active-pill"
          className="absolute inset-0 rounded-full border border-accent/40 bg-accent/15"
          style={{ boxShadow: "0 0 16px -2px color-mix(in oklch,var(--accent) 28%,transparent)" }}
          transition={
            reduceMotion
              ? { duration: 0 }
              : { type: "spring", stiffness: 420, damping: 32, mass: 0.8 }
          }
        >
          {!reduceMotion && <ScanShimmer />}
        </motion.span>
      )}
      {isHovered && !isActive && (
        <motion.span
          layoutId="nav-hover-glider"
          className="absolute inset-0 rounded-full border border-accent/25"
          style={{
            background:
              "radial-gradient(ellipse at center, color-mix(in oklch,var(--accent) 18%,transparent) 0%, color-mix(in oklch,var(--accent) 6%,transparent) 100%)",
            boxShadow: "0 0 18px -2px color-mix(in oklch,var(--accent) 22%,transparent)",
          }}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={
            reduceMotion
              ? { duration: 0 }
              : { type: "spring", stiffness: 440, damping: 30, mass: 0.75 }
          }
        />
      )}
      <motion.span
        className="relative z-10 flex items-center gap-1 sm:gap-1.5"
        animate={!reduceMotion && isHovered ? { y: -1 } : { y: 0 }}
        transition={{ type: "spring", stiffness: 450, damping: 26 }}
      >
        {isActive && (
          <motion.span
            layoutId="nav-active-dot"
            className="h-1 w-1 sm:h-1.5 sm:w-1.5 rounded-full bg-accent shadow-[0_0_8px_var(--accent)]"
            transition={
              reduceMotion
                ? { duration: 0 }
                : { type: "spring", stiffness: 480, damping: 30 }
            }
          />
        )}
        {isHovered && !isActive && (
          <motion.span
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="h-1 w-1 rounded-full bg-accent/80 shadow-[0_0_6px_var(--accent)]"
            transition={{ duration: 0.15 }}
          />
        )}
        <span>{label}</span>
      </motion.span>
    </a>
  );
}

function progressToT(raw: number, start: number, end: number): number {
  if (raw <= start) return 0;
  if (raw >= end) return 1;
  // Linear interpolation ensures 1:1 direct connection to scroll position
  return (raw - start) / (end - start);
}



// ─── Navbar ───────────────────────────────────────────────────────────────────
export function Navbar() {
  const progress  = useScrollProgress();
  const active    = useActiveSection();
  const [hoveredHref,  setHoveredHref]  = useState<string | null>(null);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);

  const shiftsRef   = useRef({ logoX: 0, navX: 0 });
  const headerRef   = useRef<HTMLElement>(null);
  const logoRef     = useRef<HTMLAnchorElement>(null);
  const navGroupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduceMotion(e.matches);
    mq.addEventListener("change", onChange);

    const desktopMq = window.matchMedia("(min-width: 1280px)");
    setIsDesktop(desktopMq.matches);
    const onDesktopChange = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    desktopMq.addEventListener("change", onDesktopChange);

    return () => {
      mq.removeEventListener("change", onChange);
      desktopMq.removeEventListener("change", onDesktopChange);
    };
  }, []);

  const measureShifts = useCallback(() => {
    if (!headerRef.current || !logoRef.current || !navGroupRef.current) return;

    // Temporarily remove transforms to measure intrinsic layout positions
    const origLogoTransform = logoRef.current.style.transform;
    const origNavTransform = navGroupRef.current.style.transform;
    logoRef.current.style.transform = "none";
    navGroupRef.current.style.transform = "none";

    const hr = headerRef.current.getBoundingClientRect();
    const lr = logoRef.current.getBoundingClientRect();
    const nr = navGroupRef.current.getBoundingClientRect();

    // Restore transforms immediately
    logoRef.current.style.transform = origLogoTransform;
    navGroupRef.current.style.transform = origNavTransform;

    // Skip if elements haven't painted with real dimensions yet
    if (!hr.width || lr.width < 4 || nr.width < 4) return;
    const gap = 8;
    const merged = lr.width + gap + nr.width;
    // Only bail if there's genuinely no room (tight margin to avoid false trips)
    if (merged > hr.width - 16) { shiftsRef.current = { logoX: 0, navX: 0 }; return; }
    const cx = hr.width / 2;
    const targetLogoLeft = cx - merged / 2;
    const targetNavLeft  = targetLogoLeft + lr.width + gap;
    shiftsRef.current = {
      logoX: targetLogoLeft - (lr.left - hr.left),
      navX:  targetNavLeft  - (nr.left - hr.left),
    };
  }, []);

  useEffect(() => {
    // Fire at multiple delays: 0ms catches SSR-hydrated layouts,
    // later delays handle async font / SVG image load races.
    const timers = [0, 150, 400, 900, 2200].map(ms => setTimeout(measureShifts, ms));
    // Re-measure once fonts settle (nav text widths change with web fonts)
    void document.fonts.ready.then(measureShifts);
    window.addEventListener("resize", measureShifts);
    return () => {
      timers.forEach(clearTimeout);
      window.removeEventListener("resize", measureShifts);
    };
  }, [measureShifts]);

  // Position movement is ALWAYS computed — even on prefers-reduced-motion.
  // Only the gooey blob effect (gooT) is skipped on reduced-motion.
  // Root cause of the zero-movement bug on Windows: Windows often has
  // "Show animations" disabled, which sets prefers-reduced-motion:reduce,
  // causing `if (reduceMotion) return 0` to permanently zero the transform.
  const logoX = useTransform(progress, (raw: number) =>
    isDesktop ? shiftsRef.current.logoX * progressToT(raw, MERGE_START, MERGE_END) : 0
  );
  const navX = useTransform(progress, (raw: number) =>
    isDesktop ? shiftsRef.current.navX * progressToT(raw, MERGE_START, MERGE_END) : 0
  );
  const mergeT = useTransform(progress, (raw: number) =>
    (reduceMotion || !isDesktop) ? 0 : progressToT(raw, MERGE_START, MERGE_END)
  );
  const ringOpacity = useTransform(mergeT, [0, 0.6, 1], [0, 0, 1]);

  return (
    <header
      ref={headerRef}
      role="banner"
      className="fixed top-0 right-0 left-0 z-50 pointer-events-none flex items-center justify-between bg-transparent pt-[max(0.65rem,env(safe-area-inset-top))] pr-[max(0.4rem,env(safe-area-inset-right))] pb-3 pl-[max(0.4rem,env(safe-area-inset-left))] sm:px-[clamp(1rem,5vw,4.5rem)] sm:pt-4 sm:pb-4"
    >
          <motion.a
            ref={logoRef}
            href="#hero"
            data-cursor="interactive"
            aria-label="AF — back to top"
            style={{ x: isDesktop ? logoX : 0 }}
            className="relative pointer-events-auto shrink-0 flex items-center rounded-full border border-text-primary/10 bg-surface/90 px-2 py-0.5 sm:px-3 sm:py-1.5 shadow-[0_8px_32px_rgba(0,0,0,0.18)] backdrop-blur-2xl outline-none will-change-transform lg:px-3 lg:py-1.5"
            whileHover={reduceMotion ? {} : { scale: 1.04 }}
            whileTap={reduceMotion ? {} : { scale: 0.96 }}
          >
            <motion.span
              style={{ opacity: ringOpacity }}
              className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-accent/45 shadow-[0_0_22px_-2px_color-mix(in_oklch,var(--accent)_32%,transparent)]"
            />
            <Image
              src="/AF-navbar-logo.svg"
              alt="AF logo"
              width={72}
              height={28}
              priority
              // Re-measure after image load: SVG logo changes pill width once
              // it renders, so the 0ms/150ms timers may have a stale lr.width.
              onLoad={() => { measureShifts(); setTimeout(measureShifts, 60); }}
              className="relative z-10 h-3.5 w-auto sm:h-5 lg:h-7"
            />
          </motion.a>

        <motion.div
          ref={navGroupRef}
          style={{ x: isDesktop ? navX : 0 }}
          className="pointer-events-auto flex shrink min-w-0 max-w-full items-center gap-1 will-change-transform sm:max-w-[calc(100vw-8rem)] sm:gap-2"
        >

          <nav
            aria-label="Site navigation"
            onMouseLeave={() => setHoveredHref(null)}
            className="relative flex min-w-0 max-w-full shrink items-center gap-0.5 overflow-x-auto rounded-full border border-text-primary/10 bg-surface/90 p-0.5 shadow-[0_8px_32px_rgba(0,0,0,0.18)] backdrop-blur-2xl transition-colors duration-300 hover:border-text-primary/20 [-ms-overflow-style:none] [scrollbar-width:none] sm:gap-1 sm:p-1.5 [&::-webkit-scrollbar]:hidden"
          >
            {links.map((link) => (
              <NavLink
                key={link.href}
                href={link.href}
                label={link.label}
                isActive={active === link.href}
                isHovered={hoveredHref === link.href}
                onHoverStart={() => setHoveredHref(link.href)}
                reduceMotion={reduceMotion}
              />
            ))}
          </nav>
          <motion.div
            whileHover={reduceMotion ? {} : { scale: 1.08, rotate: 6 }}
            whileTap={reduceMotion ? {} : { scale: 0.92, rotate: -4 }}
            transition={{ type: "spring", stiffness: 500, damping: 22 }}
            className="shrink-0"
          >
            <ThemeToggle />
          </motion.div>
        </motion.div>
      </header>
  );
}
