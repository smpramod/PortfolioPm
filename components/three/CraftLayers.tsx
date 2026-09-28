"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { useScrollProgress } from "@/lib/scroll-context";
import { useSkillTab } from "@/lib/skill-tab-context";
import { useTheme } from "@/lib/theme-context";
import { ACCENT_HEX, chapterGate } from "@/lib/journey";
import { chassisProps, makeGrainMap } from "@/lib/pbr";

const LAYERS = [
  { id: "language", label: "FRONTEND", y: 0.78, color: "#3ecfc0" },
  { id: "framework", label: "FRAMEWORKS", y: 0.26, color: "#6ad7c4" },
  { id: "tool", label: "TOOLS", y: -0.26, color: "#9fd4a4" },
  { id: "concept", label: "SYSTEMS", y: -0.78, color: "#e6e0d4" },
] as const;

function plateTexture(label: string, hex: string) {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  ctx.fillStyle = "#070c10";
  ctx.fillRect(0, 0, 1024, 512);

  ctx.strokeStyle = hex;
  ctx.globalAlpha = 0.35;
  ctx.lineWidth = 2;
  for (let x = 48; x < 980; x += 56) {
    ctx.beginPath();
    ctx.moveTo(x, 36);
    ctx.lineTo(x, 476);
    ctx.stroke();
  }
  ctx.globalAlpha = 0.55;
  ctx.lineWidth = 3;
  ctx.strokeRect(28, 28, 968, 456);

  for (let i = 0; i < 18; i++) {
    const x = 70 + (i % 9) * 100;
    const y = 70 + Math.floor(i / 9) * 300;
    ctx.fillStyle = hex;
    ctx.globalAlpha = 0.45;
    ctx.fillRect(x, y, 18, 18);
  }

  ctx.globalAlpha = 1;
  ctx.fillStyle = hex;
  ctx.font = "600 72px 'JetBrains Mono', monospace";
  ctx.fillText(label, 64, 280);
  ctx.fillStyle = "#8aa0a8";
  ctx.font = "500 28px 'JetBrains Mono', monospace";
  ctx.fillText("LAYER  " + String(LAYERS.findIndex((l) => l.label === label) + 1).padStart(2, "0"), 64, 340);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

export function CraftLayers() {
  const scroll = useScrollProgress();
  const { tab } = useSkillTab();
  const { theme } = useTheme();
  const light = theme === "light";
  const tabRef = useRef(tab);
  tabRef.current = tab;
  const group = useRef<THREE.Group>(null);
  const plates = useRef<(THREE.Group | null)[]>([]);
  const mats = useRef<(THREE.MeshPhysicalMaterial | null)[]>([]);
  const textures = useMemo(() => LAYERS.map((layer) => plateTexture(layer.label, layer.color)), []);
  const grain = useMemo(() => makeGrainMap(), []);
  const chassis = chassisProps(light);

  useEffect(
    () => () => {
      textures.forEach((texture) => texture.dispose());
    },
    [textures],
  );

  useFrame((state, delta) => {
    const mesh = group.current;
    if (!mesh) return;
    const t = scroll.get();
    const visible = chapterGate(t, 0.3, 0.38, 0.54, 0.64);
    mesh.visible = visible > 0.03;
    if (!mesh.visible) return;
    mesh.rotation.y = -0.28 + Math.sin(state.clock.elapsedTime * 0.25) * 0.06;
    mesh.rotation.x = 0.16;

    LAYERS.forEach((layer, i) => {
      const plate = plates.current[i];
      const mat = mats.current[i];
      const active = tabRef.current === layer.id;
      if (plate) {
        const y = layer.y + (active ? 0.08 : 0) + Math.sin(state.clock.elapsedTime * 0.9 + i) * 0.012;
        plate.position.y = THREE.MathUtils.damp(plate.position.y, y, 6, delta);
        const s = visible * (active ? 1 : 0.92);
        plate.scale.setScalar(THREE.MathUtils.damp(plate.scale.x || 1, Math.max(0.001, s), 7, delta));
      }
      if (mat) {
        mat.emissiveIntensity = THREE.MathUtils.damp(mat.emissiveIntensity, active ? 0.85 : 0.18, 6, delta);
        mat.opacity = THREE.MathUtils.damp(mat.opacity, visible * (active ? 1 : 0.78), 6, delta);
      }
    });
  });

  return (
    <group ref={group} position={[1.7, 0.08, -16]}>
      <mesh>
        <cylinderGeometry args={[0.07, 0.07, 2.05, 24]} />
        <meshPhysicalMaterial {...chassis} roughnessMap={grain} color={ACCENT_HEX} metalness={0.7} />
      </mesh>
      {LAYERS.map((layer, i) => (
        <group
          key={layer.id}
          ref={(node) => {
            plates.current[i] = node;
          }}
          position={[0, layer.y, 0]}
        >
          <RoundedBox args={[2.35, 0.14, 1.42]} radius={0.045} smoothness={2}>
            <meshPhysicalMaterial {...chassis} roughnessMap={grain} />
          </RoundedBox>
          <mesh position={[0, 0.078, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[2.18, 1.26]} />
            <meshPhysicalMaterial
              ref={(node) => {
                mats.current[i] = node;
              }}
              map={textures[i]}
              emissiveMap={textures[i]}
              emissive={layer.color}
              emissiveIntensity={0.2}
              metalness={0.35}
              roughness={0.22}
              clearcoat={0.4}
              transparent
              opacity={1}
              toneMapped={false}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}
