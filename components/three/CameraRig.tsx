"use client";

import { useFrame, invalidate } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useScrollProgress } from "@/lib/scroll-context";
import { prefersReducedMotion } from "@/lib/frame";

type Stop = {
  t: number;
  pos: [number, number, number];
  look: [number, number, number];
  fov: number;
};

const STOPS: Stop[] = [
  { t: 0, pos: [-0.85, 0.18, 5.6], look: [-0.1, 0.08, 0.04], fov: 36 },
  { t: 0.07, pos: [0.45, 0.1, 2.45], look: [0.85, 0.05, 0.03], fov: 34 },
  { t: 0.13, pos: [1.55, 0.06, 0.62], look: [1.55, 0.04, -0.55], fov: 32 },
  { t: 0.22, pos: [-0.7, 0.18, -5.2], look: [0.28, 0.1, -8], fov: 36 },
  { t: 0.4, pos: [-0.75, 0.28, -13.0], look: [0.28, 0.1, -16], fov: 36 },
  { t: 0.58, pos: [-0.8, 0.22, -20.85], look: [0.32, 0.14, -24], fov: 36 },
  { t: 0.82, pos: [-0.7, 0.16, -28.25], look: [0.28, 0.12, -31.35], fov: 36 },
  { t: 1, pos: [-0.65, 0.12, -29.45], look: [0.22, 0.06, -32], fov: 38 },
];

const REDUCED_STOPS: Stop[] = [
  { t: 0, pos: [-0.85, 0.18, 5.6], look: [-0.1, 0.08, 0.04], fov: 36 },
  { t: 0.2, pos: [-0.7, 0.18, -5.2], look: [0.28, 0.1, -8], fov: 36 },
  { t: 0.4, pos: [-0.75, 0.28, -13.0], look: [0.28, 0.1, -16], fov: 36 },
  { t: 0.6, pos: [-0.8, 0.22, -20.85], look: [0.32, 0.14, -24], fov: 36 },
  { t: 0.8, pos: [-0.7, 0.16, -28.25], look: [0.28, 0.12, -31.35], fov: 36 },
  { t: 1, pos: [-0.65, 0.12, -29.45], look: [0.22, 0.06, -32], fov: 38 },
];

function sampleStops(stops: Stop[], t: number, outPos: THREE.Vector3, outLook: THREE.Vector3) {
  const x = THREE.MathUtils.clamp(Number.isFinite(t) ? t : 0, 0, 1);
  let i = 0;
  while (i < stops.length - 2 && stops[i + 1].t < x) i += 1;
  const a = stops[i];
  const b = stops[i + 1];
  const span = b.t - a.t;
  // Use linear interpolation instead of smoothstep to avoid dead stops at section boundaries.
  // This ensures the camera moves continuously and strictly proportionally to scroll.
  const u = span === 0 ? 1 : (x - a.t) / span;
  
  outPos.set(
    THREE.MathUtils.lerp(a.pos[0], b.pos[0], u),
    THREE.MathUtils.lerp(a.pos[1], b.pos[1], u),
    THREE.MathUtils.lerp(a.pos[2], b.pos[2], u),
  );
  outLook.set(
    THREE.MathUtils.lerp(a.look[0], b.look[0], u),
    THREE.MathUtils.lerp(a.look[1], b.look[1], u),
    THREE.MathUtils.lerp(a.look[2], b.look[2], u),
  );
  return THREE.MathUtils.lerp(a.fov, b.fov, u);
}

export function CameraRig() {
  const scroll = useScrollProgress();
  const look = useRef(new THREE.Vector3(-0.1, 0.08, 0.05));
  const sampledPos = useMemo(() => new THREE.Vector3(), []);
  const sampledLook = useMemo(() => new THREE.Vector3(), []);
  const lastFov = useRef(36);
  const reduced = useRef(false);
  reduced.current = prefersReducedMotion();

  useFrame((state, delta) => {
    const t = scroll.get();
    const fov = sampleStops(reduced.current ? REDUCED_STOPS : STOPS, t, sampledPos, sampledLook);
    // Constant damping factor so movement is fluid and doesn't stick to sections
    const lambda = reduced.current ? 12 : 3.4;

    const camera = state.camera;
    camera.position.x = THREE.MathUtils.damp(camera.position.x, sampledPos.x, lambda, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, sampledPos.y, lambda, delta);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, sampledPos.z, lambda, delta);

    look.current.x = THREE.MathUtils.damp(look.current.x, sampledLook.x, lambda, delta);
    look.current.y = THREE.MathUtils.damp(look.current.y, sampledLook.y, lambda, delta);
    look.current.z = THREE.MathUtils.damp(look.current.z, sampledLook.z, lambda, delta);
    camera.lookAt(look.current);

    if (camera instanceof THREE.PerspectiveCamera && Math.abs(camera.fov - fov) > 0.04) {
      camera.fov = THREE.MathUtils.damp(camera.fov, fov, 3, delta);
      if (Math.abs(camera.fov - lastFov.current) > 0.05) {
        lastFov.current = camera.fov;
        camera.updateProjectionMatrix();
      }
    }

    if (camera.position.distanceToSquared(sampledPos) > 0.00001) invalidate();
  });

  return null;
}
