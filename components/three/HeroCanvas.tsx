"use client";

import { AdaptiveDpr } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { Scene } from "./Scene";
import { usePerformanceTier } from "@/hooks/usePerformanceTier";

export function HeroCanvas() {
  const tier = usePerformanceTier();

  return (
    <Canvas
      dpr={[1, tier === "high" ? 2 : tier === "medium" ? 1.5 : 1]}
      gl={{
        antialias: tier !== "low",
        alpha: true,
        powerPreference: "high-performance",
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.08,
        outputColorSpace: THREE.SRGBColorSpace,
      }}
      frameloop="always"
      camera={{ position: [-0.85, 0.18, 5.6], fov: 36, near: 0.12, far: 48 }}
      style={{ width: "100%", height: "100%" }}
      onCreated={(state) => {
        state.gl.setClearColor(0x000000, 0);
        state.invalidate();
      }}
    >
      <Scene tier={tier} />
      <AdaptiveDpr pixelated={false} />
    </Canvas>
  );
}
