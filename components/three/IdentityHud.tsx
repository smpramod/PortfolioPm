"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { useScrollProgress } from "@/lib/scroll-context";
import { useTheme } from "@/lib/theme-context";
import { chapterGate } from "@/lib/journey";
import { chassisProps, makeGrainMap } from "@/lib/pbr";

function createHudTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 1280;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  ctx.fillStyle = "#071014";
  ctx.fillRect(0, 0, 1024, 1280);
  ctx.strokeStyle = "rgba(62, 207, 192, 0.5)";
  ctx.lineWidth = 5;
  ctx.strokeRect(36, 36, 952, 1208);

  ctx.fillStyle = "#3ecfc0";
  ctx.font = "600 34px 'JetBrains Mono', monospace";
  ctx.fillText("IDENTITY  //  HUD", 80, 130);
  ctx.fillStyle = "#f4f1ea";
  ctx.font = "500 64px 'Instrument Serif', Georgia, serif";
  ctx.fillText("Abhishek", 80, 230);
  ctx.fillText("Farande", 80, 304);

  const rows = [
    ["ROLE", "Software Developer"],
    ["FOCUS", "College ERP"],
    ["EDU", "B.Tech IT  8.76"],
    ["NOW", "Seratek Systems"],
    ["BASE", "Kolhapur, IN"],
    ["OPEN", "Full-time / freelance"],
  ];
  rows.forEach((row, i) => {
    const y = 420 + i * 118;
    ctx.fillStyle = "#6d7c86";
    ctx.font = "500 26px 'JetBrains Mono', monospace";
    ctx.fillText(row[0], 80, y);
    ctx.fillStyle = "#d7e2e8";
    ctx.font = "500 38px 'JetBrains Mono', monospace";
    ctx.fillText(row[1], 80, y + 48);
    ctx.fillStyle = "rgba(62, 207, 192, 0.2)";
    ctx.fillRect(80, y + 64, 820, 2);
  });

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

export function IdentityHud() {
  const scroll = useScrollProgress();
  const { theme } = useTheme();
  const light = theme === "light";
  const group = useRef<THREE.Group>(null);
  const mat = useRef<THREE.MeshPhysicalMaterial>(null);
  const texture = useMemo(() => createHudTexture(), []);
  const grain = useMemo(() => makeGrainMap(), []);
  const chassis = chassisProps(light);

  useEffect(() => () => texture.dispose(), [texture]);

  useFrame((state, delta) => {
    const mesh = group.current;
    const material = mat.current;
    if (!mesh || !material) return;
    const t = scroll.get();
    const visible = chapterGate(t, 0.14, 0.22, 0.34, 0.44);
    mesh.visible = visible > 0.03;
    if (!mesh.visible) return;
    mesh.position.set(1.72, 0.1 + Math.sin(state.clock.elapsedTime * 0.6) * 0.04, -8);
    mesh.rotation.y = -0.2 + Math.sin(state.clock.elapsedTime * 0.32) * 0.06;
    material.opacity = THREE.MathUtils.damp(material.opacity, visible * 0.98, 5, delta);
    material.emissiveIntensity = 0.62 + Math.sin(state.clock.elapsedTime * 1.3) * 0.1;
  });

  return (
    <group ref={group} position={[1.72, 0.1, -8]}>
      <RoundedBox args={[1.78, 2.28, 0.1]} radius={0.05} smoothness={2}>
        <meshPhysicalMaterial {...chassis} roughnessMap={grain} />
      </RoundedBox>
      <mesh position={[0, 0, 0.058]}>
        <planeGeometry args={[1.58, 2.08]} />
        <meshPhysicalMaterial
          ref={mat}
          map={texture}
          emissiveMap={texture}
          emissive="#ffffff"
          emissiveIntensity={0.65}
          roughness={0.16}
          metalness={0.08}
          clearcoat={0.35}
          transparent
          opacity={0}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}
