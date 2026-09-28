"use client";

import dynamic from "next/dynamic";
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";

const HeroCanvas = dynamic(
  () => import("./HeroCanvas").then((mod) => mod.HeroCanvas),
  { ssr: false },
);

export default function HeroCanvasWrapper() {
  return (
    <div className="pointer-events-none fixed inset-0 z-[5]" aria-hidden>
      <ErrorBoundary>
        <HeroCanvas />
      </ErrorBoundary>
    </div>
  );
}
