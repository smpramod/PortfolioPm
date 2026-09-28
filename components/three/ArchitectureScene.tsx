"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useScrollProgress } from "@/lib/scroll-context";
import { ACCENT_HEX, WARM_HEX } from "@/lib/journey";
import {
  architectureEdges,
  architectureNodes,
} from "@/lib/architecture-graph";

const ACCENT = new THREE.Color(ACCENT_HEX);
const WARM = new THREE.Color(WARM_HEX);

export function ArchitectureScene() {
  const scroll = useScrollProgress();
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const linesRef = useRef<THREE.LineSegments>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const color = useMemo(() => new THREE.Color(), []);
  const edges = useMemo(() => architectureEdges(), []);
  const placed = useRef(false);

  const lineGeometry = useMemo(() => {
    const positions = new Float32Array(edges.length * 6);
    edges.forEach(([from, to], i) => {
      const a = architectureNodes[from].position;
      const b = architectureNodes[to].position;
      const o = i * 6;
      positions[o] = a[0];
      positions[o + 1] = a[1];
      positions[o + 2] = a[2];
      positions[o + 3] = b[0];
      positions[o + 4] = b[1];
      positions[o + 5] = b[2];
    });
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const colors = new Float32Array(edges.length * 6);
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    return geo;
  }, [edges]);

  useEffect(() => () => lineGeometry.dispose(), [lineGeometry]);

  useFrame((state) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const t = Number.isFinite(scroll.get()) ? scroll.get() : 0;

    if (!placed.current) {
      architectureNodes.forEach((node, i) => {
        dummy.position.set(node.position[0], node.position[1], node.position[2]);
        dummy.scale.setScalar(node.radius);
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
      });
      mesh.instanceMatrix.needsUpdate = true;
      placed.current = true;
    }

    // Evaluate continuously instead of locking to 5% increments
    const activeZ = state.camera.position.z - 4; // Center the glow a bit in front of the camera
    const reveal = THREE.MathUtils.smoothstep(t, 0.1, 0.2);
    const mix = THREE.MathUtils.smoothstep(t, 0.72, 1);

    architectureNodes.forEach((node, i) => {
      const dist = Math.abs(node.position[2] - activeZ);
      const near = 1 - THREE.MathUtils.smoothstep(2.5, 12, dist);
      const brightness = (0.16 + near * 0.84) * reveal * 0.42;
      color.copy(ACCENT).lerp(WARM, mix);
      color.multiplyScalar(brightness);
      mesh.setColorAt(i, color);
    });
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;

    const lineColor = linesRef.current?.geometry.getAttribute("color");
    if (lineColor) {
      color.copy(ACCENT).lerp(WARM, mix);
      for (let i = 0; i < edges.length; i++) {
        const from = architectureNodes[edges[i][0]];
        const dist = Math.abs(from.position[2] - activeZ);
        const near = (0.08 + (1 - THREE.MathUtils.smoothstep(2.5, 12, dist)) * 0.55) * reveal;
        const o = i * 2;
        lineColor.setXYZ(o, color.r * near, color.g * near, color.b * near);
        lineColor.setXYZ(o + 1, color.r * near, color.g * near, color.b * near);
      }
      lineColor.needsUpdate = true;
    }
  });

  return (
    <group renderOrder={-1}>
      <instancedMesh ref={meshRef} args={[undefined, undefined, architectureNodes.length]} frustumCulled renderOrder={-1}>
        <icosahedronGeometry args={[1, 0]} />
        <meshStandardMaterial roughness={0.28} metalness={0.55} emissive={ACCENT_HEX} emissiveIntensity={0.2} depthWrite={false} />
      </instancedMesh>
      <lineSegments ref={linesRef} geometry={lineGeometry} frustumCulled renderOrder={-1}>
        <lineBasicMaterial vertexColors transparent opacity={0.55} depthWrite={false} />
      </lineSegments>
    </group>
  );
}
