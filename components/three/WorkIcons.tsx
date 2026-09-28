"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { useScrollProgress } from "@/lib/scroll-context";
import { useTheme } from "@/lib/theme-context";
import { ACCENT_HEX, WARM_HEX, chapterGate } from "@/lib/journey";
import { chassisProps, makeGrainMap } from "@/lib/pbr";

function screenTexture(title: string, bars: number[]) {
  const canvas = document.createElement("canvas");
  canvas.width = 768;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);
  ctx.fillStyle = "#071016";
  ctx.fillRect(0, 0, 768, 512);
  ctx.fillStyle = ACCENT_HEX;
  ctx.font = "600 36px 'JetBrains Mono', monospace";
  ctx.fillText(title, 40, 64);
  bars.forEach((h, i) => {
    const x = 56 + i * 90;
    ctx.fillStyle = i === 0 ? ACCENT_HEX : i === 1 ? WARM_HEX : "#3a6a68";
    ctx.fillRect(x, 430 - h, 54, h);
  });
  ctx.strokeStyle = "rgba(62,207,192,0.35)";
  ctx.strokeRect(24, 24, 720, 464);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

function labelTexture(text: string) {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 128;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);
  ctx.fillStyle = "transparent";
  ctx.clearRect(0, 0, 512, 128);
  ctx.fillStyle = "#e8f4f2";
  ctx.font = "600 48px 'JetBrains Mono', monospace";
  ctx.fillText(text, 24, 80);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function ErpMonitor({ map, chassis }: { map: THREE.Texture; chassis: ReturnType<typeof chassisProps> }) {
  return (
    <group>
      <RoundedBox args={[1.72, 1.12, 0.1]} radius={0.04} smoothness={2}>
        <meshPhysicalMaterial {...chassis} />
      </RoundedBox>
      <mesh position={[0, 0.02, 0.058]}>
        <planeGeometry args={[1.52, 0.92]} />
        <meshPhysicalMaterial
          map={map}
          emissiveMap={map}
          emissive="#ffffff"
          emissiveIntensity={0.7}
          roughness={0.18}
          metalness={0.08}
          toneMapped={false}
        />
      </mesh>
      <mesh position={[0, -0.72, 0.02]}>
        <boxGeometry args={[0.28, 0.28, 0.08]} />
        <meshPhysicalMaterial {...chassis} />
      </mesh>
      <mesh position={[0, -0.9, 0.12]} rotation={[-0.18, 0, 0]}>
        <boxGeometry args={[0.72, 0.05, 0.36]} />
        <meshPhysicalMaterial {...chassis} />
      </mesh>
    </group>
  );
}

function ParkingBeacon({ chassis }: { chassis: ReturnType<typeof chassisProps> }) {
  return (
    <group>
      <mesh>
        <cylinderGeometry args={[0.42, 0.48, 0.08, 32]} />
        <meshPhysicalMaterial {...chassis} />
      </mesh>
      <mesh position={[0, 0.08, 0]}>
        <torusGeometry args={[0.34, 0.025, 12, 48]} />
        <meshPhysicalMaterial color={ACCENT_HEX} emissive={ACCENT_HEX} emissiveIntensity={0.7} metalness={0.4} roughness={0.2} />
      </mesh>
      <mesh position={[0, 0.42, 0]}>
        <sphereGeometry args={[0.28, 32, 32]} />
        <meshPhysicalMaterial
          color={ACCENT_HEX}
          metalness={0.55}
          roughness={0.16}
          clearcoat={0.8}
          emissive={ACCENT_HEX}
          emissiveIntensity={0.45}
        />
      </mesh>
      <mesh position={[0, 0.08, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.2, 0.42, 16]} />
        <meshPhysicalMaterial color={ACCENT_HEX} metalness={0.5} roughness={0.22} />
      </mesh>
    </group>
  );
}

function DiplomaPhone({ chassis }: { chassis: ReturnType<typeof chassisProps> }) {
  return (
    <group rotation={[-0.18, 0.35, 0.08]}>
      <RoundedBox args={[0.62, 1.22, 0.09]} radius={0.06} smoothness={5}>
        <meshPhysicalMaterial {...chassis} />
      </RoundedBox>
      <mesh position={[0, 0.02, 0.05]}>
        <planeGeometry args={[0.52, 1.02]} />
        <meshPhysicalMaterial
          color={ACCENT_HEX}
          emissive={ACCENT_HEX}
          emissiveIntensity={0.55}
          roughness={0.12}
          metalness={0.1}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

export function WorkIcons() {
  const scroll = useScrollProgress();
  const { theme } = useTheme();
  const light = theme === "light";
  const group = useRef<THREE.Group>(null);
  const items = useRef<(THREE.Group | null)[]>([]);
  const chassis = chassisProps(light);
  const grain = useMemo(() => makeGrainMap(), []);
  const erpMap = useMemo(() => screenTexture("ERP  /  LIVE", [220, 160, 190, 110, 240, 150, 180]), []);
  const labels = useMemo(() => [labelTexture("ERP"), labelTexture("PARK-O"), labelTexture("DIPLOMA")], []);

  useEffect(
    () => () => {
      erpMap.dispose();
      labels.forEach((label) => label.dispose());
    },
    [erpMap, labels],
  );

  useFrame((state, delta) => {
    const root = group.current;
    if (!root) return;
    const t = scroll.get();
    const visible = chapterGate(t, 0.48, 0.56, 0.74, 0.84);
    root.visible = visible > 0.03;
    if (!root.visible) return;
    root.rotation.y = -0.16;

    const targets = [0.22, 0.08, 0.18];
    items.current.forEach((item, i) => {
      if (!item) return;
      const stagger = chapterGate(t, 0.48 + i * 0.025, 0.57 + i * 0.02, 0.74, 0.84);
      const s = Math.max(0.001, stagger);
      item.scale.setScalar(THREE.MathUtils.damp(item.scale.x || 1, s, 6, delta));
      item.position.y = THREE.MathUtils.damp(
        item.position.y,
        targets[i] + Math.sin(state.clock.elapsedTime * 0.7 + i) * 0.045,
        4,
        delta,
      );
    });
  });

  return (
    <group ref={group} position={[1.68, -0.15, -24]}>
      <RoundedBox args={[3.15, 0.1, 1.55]} radius={0.04} smoothness={2} position={[0.15, -0.72, 0]}>
        <meshPhysicalMaterial {...chassis} roughnessMap={grain} />
      </RoundedBox>

      <group
        ref={(node) => {
          items.current[0] = node;
        }}
        position={[-0.95, 0.22, 0.05]}
        scale={0.001}
      >
        <ErpMonitor map={erpMap} chassis={chassis} />
        <mesh position={[0, -1.12, 0.2]}>
          <planeGeometry args={[0.7, 0.16]} />
          <meshBasicMaterial map={labels[0]} transparent toneMapped={false} />
        </mesh>
      </group>

      <group
        ref={(node) => {
          items.current[1] = node;
        }}
        position={[0.35, 0.08, 0.1]}
        scale={0.001}
      >
        <ParkingBeacon chassis={chassis} />
        <mesh position={[0, -0.95, 0.2]}>
          <planeGeometry args={[0.85, 0.16]} />
          <meshBasicMaterial map={labels[1]} transparent toneMapped={false} />
        </mesh>
      </group>

      <group
        ref={(node) => {
          items.current[2] = node;
        }}
        position={[1.25, 0.18, 0.08]}
        scale={0.001}
      >
        <DiplomaPhone chassis={chassis} />
        <mesh position={[0, -1.05, 0.28]}>
          <planeGeometry args={[1.05, 0.16]} />
          <meshBasicMaterial map={labels[2]} transparent toneMapped={false} />
        </mesh>
      </group>
    </group>
  );
}
