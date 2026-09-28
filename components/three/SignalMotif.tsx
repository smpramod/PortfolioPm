"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { useScrollProgress } from "@/lib/scroll-context";
import { useTheme } from "@/lib/theme-context";
import { ACCENT_HEX, WARM_HEX, chapterGate } from "@/lib/journey";
import { chassisProps, makeGrainMap } from "@/lib/pbr";
import { frameDt } from "@/lib/frame";

export function SignalMotif() {
  const group = useRef<THREE.Group>(null);
  const plane = useRef<THREE.Group>(null);
  const rings = useRef<THREE.Group>(null);
  const scroll = useScrollProgress();
  const { theme } = useTheme();
  const light = theme === "light";
  const chassis = chassisProps(light);
  const grain = useMemo(() => makeGrainMap(), []);

  useFrame((state, delta) => {
    const mesh = group.current;
    if (!mesh) return;
    const t = scroll.get();
    const visible = chapterGate(t, 0.7, 0.8, 0.99, 1.05);
    mesh.visible = visible > 0.03;
    if (!mesh.visible) return;
    mesh.scale.setScalar(THREE.MathUtils.damp(mesh.scale.x || 1, Math.max(0.001, visible), 5, delta));

    if (plane.current) {
      const arrive = THREE.MathUtils.smoothstep(t, 0.78, 0.96);
      plane.current.position.x = THREE.MathUtils.damp(plane.current.position.x, THREE.MathUtils.lerp(1.15, 0.55, arrive), 3, delta);
      plane.current.position.y = 0.95 + Math.sin(state.clock.elapsedTime * 1.8) * 0.06;
      plane.current.position.z = THREE.MathUtils.damp(plane.current.position.z, THREE.MathUtils.lerp(0.8, 0.15, arrive), 3, delta);
      plane.current.rotation.y += frameDt(delta) * 0.9;
      plane.current.rotation.z = THREE.MathUtils.damp(plane.current.rotation.z, THREE.MathUtils.lerp(0.55, 0.08, arrive), 3, delta);
    }
    if (rings.current) {
      rings.current.rotation.y = state.clock.elapsedTime * 0.45;
      rings.current.children.forEach((child, i) => {
        child.rotation.x = state.clock.elapsedTime * (0.3 + i * 0.12);
      });
    }
  });

  return (
    <group ref={group} position={[1.52, -0.05, -31.4]} scale={0.001}>
      <RoundedBox args={[1.35, 1.55, 0.12]} radius={0.05} smoothness={2}>
        <meshPhysicalMaterial {...chassis} roughnessMap={grain} />
      </RoundedBox>
      <mesh position={[0, 0.12, 0.072]}>
        <planeGeometry args={[1.12, 1.22]} />
        <meshPhysicalMaterial
          color="#071014"
          emissive={WARM_HEX}
          emissiveIntensity={0.35}
          metalness={0.15}
          roughness={0.2}
          toneMapped={false}
        />
      </mesh>
      <mesh position={[0, -0.92, 0]}>
        <cylinderGeometry args={[0.22, 0.34, 0.28, 24]} />
        <meshPhysicalMaterial {...chassis} />
      </mesh>

      <group ref={rings} position={[0, 0.15, 0.2]}>
        <mesh>
          <torusGeometry args={[0.72, 0.018, 12, 64]} />
          <meshPhysicalMaterial color={ACCENT_HEX} emissive={ACCENT_HEX} emissiveIntensity={0.8} roughness={0.18} metalness={0.45} />
        </mesh>
        <mesh rotation={[Math.PI / 2.4, 0.4, 0]}>
          <torusGeometry args={[0.92, 0.014, 12, 64]} />
          <meshPhysicalMaterial color={WARM_HEX} emissive={WARM_HEX} emissiveIntensity={0.55} roughness={0.2} metalness={0.4} />
        </mesh>
      </group>

      <group ref={plane} position={[1.15, 0.95, 0.8]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <coneGeometry args={[0.16, 0.55, 3]} />
          <meshPhysicalMaterial
            color={WARM_HEX}
            emissive={WARM_HEX}
            emissiveIntensity={0.65}
            metalness={0.35}
            roughness={0.22}
            clearcoat={0.5}
          />
        </mesh>
        <mesh position={[-0.12, 0, 0]} rotation={[0, 0, 0.4]}>
          <boxGeometry args={[0.28, 0.02, 0.16]} />
          <meshPhysicalMaterial color={WARM_HEX} metalness={0.3} roughness={0.28} />
        </mesh>
      </group>
    </group>
  );
}
