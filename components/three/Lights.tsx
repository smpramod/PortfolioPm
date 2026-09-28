"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useScrollProgress } from "@/lib/scroll-context";
import { useTheme } from "@/lib/theme-context";
import { ACCENT_HEX, WARM_HEX } from "@/lib/journey";
import { frameDt } from "@/lib/frame";

const ACCENT = new THREE.Color(ACCENT_HEX);
const WARM = new THREE.Color(WARM_HEX);
const KEY_LIGHT = new THREE.Color("#e6e0d4");
const FOG_COOL = new THREE.Color("#12141c");
const FOG_WARM = new THREE.Color("#241c12");
const FOG_COOL_LIGHT = new THREE.Color("#e4dfd4");
const FOG_WARM_LIGHT = new THREE.Color("#ece6d8");

export function Lights() {
  const scroll = useScrollProgress();
  const { theme } = useTheme();
  const isLight = theme === "light";
  const keyRef = useRef<THREE.DirectionalLight>(null);
  const fillRef = useRef<THREE.DirectionalLight>(null);
  const rimRef = useRef<THREE.DirectionalLight>(null);
  const color = useMemo(() => new THREE.Color().copy(ACCENT), []);
  const fogTarget = useMemo(() => new THREE.Color().copy(FOG_COOL), []);
  const lastCam = useRef(new THREE.Vector3(999, 999, 999));

  useFrame((state, delta) => {
    const dt = frameDt(delta);
    const mix = THREE.MathUtils.smoothstep(Number.isFinite(scroll.get()) ? scroll.get() : 0, 0.72, 1);
    color.copy(ACCENT).lerp(WARM, mix);
    fogTarget.copy(isLight ? FOG_COOL_LIGHT : FOG_COOL).lerp(isLight ? FOG_WARM_LIGHT : FOG_WARM, mix);

    const cam = state.camera.position;
    const moved = lastCam.current.distanceToSquared(cam) > 0.0004;
    if (moved) lastCam.current.copy(cam);

    if (keyRef.current) {
      keyRef.current.color.lerp(isLight ? KEY_LIGHT : color, 1 - Math.exp(-4 * dt));
      if (moved) keyRef.current.position.set(cam.x - 3.4, cam.y + 4.6, cam.z + 4.2);
    }
    if (fillRef.current && moved) {
      fillRef.current.position.set(cam.x + 3.8, cam.y + 1.4, cam.z + 2.2);
    }
    if (rimRef.current) {
      rimRef.current.color.copy(color);
      if (moved) rimRef.current.position.set(cam.x + 4.6, cam.y + 1.2, cam.z - 6.2);
    }

    const fog = state.scene.fog;
    if (fog && fog instanceof THREE.Fog) {
      fog.color.lerp(fogTarget, 1 - Math.exp(-3 * dt));
    }
  });

  return (
    <>
      <hemisphereLight args={isLight ? ["#f7f3ea", "#c5d0d8", 0.62] : ["#b7d4e8", "#0f1016", 0.22]} />
      <directionalLight ref={keyRef} intensity={isLight ? 1.35 : 1.5} color={isLight ? "#e6e0d4" : ACCENT_HEX} />
      <directionalLight ref={fillRef} intensity={isLight ? 0.5 : 0.28} color={isLight ? "#eef4ff" : "#9bb8c8"} />
      <directionalLight ref={rimRef} intensity={isLight ? 0.5 : 0.85} color={ACCENT_HEX} />
    </>
  );
}
