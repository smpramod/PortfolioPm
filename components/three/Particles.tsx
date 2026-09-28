"use client";

import { Sparkles } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { useScrollProgress } from "@/lib/scroll-context";

import type { PerformanceTier } from "@/hooks/usePerformanceTier";

export function Particles({ tier }: { tier: PerformanceTier }) {
  const group = useRef<THREE.Group>(null);
  const scroll = useScrollProgress();

  useFrame(() => {
    if (!group.current) return;
    const t = Number.isFinite(scroll.get()) ? THREE.MathUtils.clamp(scroll.get(), 0, 1) : 0;
    group.current.position.set(1.55, 0, THREE.MathUtils.lerp(0, -28, t));
  });

  const count = tier === "high" ? 20 : tier === "medium" ? 10 : 4;
  const scale = tier === "high" ? 5 : tier === "medium" ? 4 : 3;
  const size = tier === "high" ? 1.5 : 1.2;

  return (
    <group ref={group}>
      <Sparkles
        count={count}
        scale={scale}
        size={size}
        speed={0.12}
        opacity={0.32}
        color="#b7fff4"
      />
    </group>
  );
}
