"use client";

import { useEffect, useMemo } from "react";
import { useThree, invalidate } from "@react-three/fiber";
import { CameraRig } from "./CameraRig";
import { Lights } from "./Lights";
import { EnvironmentRig } from "./EnvironmentRig";
import { Particles } from "./Particles";
import { DeviceShell } from "./DeviceShell";
import { ArchitectureScene } from "./ArchitectureScene";
import { IdentityHud } from "./IdentityHud";
import { CraftLayers } from "./CraftLayers";
import { WorkIcons } from "./WorkIcons";
import { SignalMotif } from "./SignalMotif";
import { SceneWarmup } from "./SceneWarmup";
import type { PerformanceTier } from "@/hooks/usePerformanceTier";

function WebGLGuard() {
  const gl = useThree((state) => state.gl);

  useEffect(() => {
    const canvas = gl.domElement;
    const onLost = (event: Event) => {
      event.preventDefault();
    };
    const onRestored = () => invalidate();
    canvas.addEventListener("webglcontextlost", onLost);
    canvas.addEventListener("webglcontextrestored", onRestored);
    return () => {
      canvas.removeEventListener("webglcontextlost", onLost);
      canvas.removeEventListener("webglcontextrestored", onRestored);
    };
  }, [gl]);

  return null;
}

export function Scene({ tier }: { tier: PerformanceTier }) {
  const mobile = useMemo(
    () => tier === "low" || window.matchMedia("(max-width: 768px)").matches,
    [tier],
  );

  return (
    <>
      <SceneWarmup />
      <fog attach="fog" args={["#1a1b20", 12, 42]} />
      <WebGLGuard />
      <CameraRig />
      <Lights />
      <EnvironmentRig mobile={mobile} />
      <DeviceShell />
      <ArchitectureScene />
      <IdentityHud />
      <CraftLayers />
      <WorkIcons />
      <SignalMotif />
      <Particles tier={tier} />
    </>
  );
}
