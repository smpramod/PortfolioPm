"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useScrollProgress } from "@/lib/scroll-context";
import { chassisProps, makeGrainMap } from "@/lib/pbr";
import { useTheme } from "@/lib/theme-context";
import { prefersReducedMotion, frameDt } from "@/lib/frame";

const KEY = "#7ee8dc";
const STR = "#e6e0d4";
const MUTED = "#6d7c86";
const PLAIN = "#d7e2e8";
const PINK = "#d4a4ff";

type Token = { text: string; color: string };

const CODE_LINES: Token[][] = [
  [{ text: "// journey.ts — architecture dive", color: MUTED }],
  [
    { text: "export ", color: PINK },
    { text: "function ", color: PINK },
    { text: "Page", color: KEY },
    { text: "() {", color: PLAIN },
  ],
  [
    { text: "  const ", color: PINK },
    { text: "progress ", color: PLAIN },
    { text: "= ", color: PLAIN },
    { text: "useScroll", color: KEY },
    { text: "()", color: PLAIN },
  ],
  [
    { text: "  return ", color: PINK },
    { text: "(", color: PLAIN },
  ],
  [
    { text: "    <", color: PLAIN },
    { text: "Canvas", color: KEY },
    { text: " frameloop=", color: PLAIN },
    { text: '"demand"', color: STR },
    { text: ">", color: PLAIN },
  ],
  [
    { text: "      <", color: PLAIN },
    { text: "DeviceShell", color: KEY },
    { text: " />", color: PLAIN },
  ],
  [
    { text: "      <", color: PLAIN },
    { text: "Architecture", color: KEY },
    { text: " />", color: PLAIN },
  ],
  [{ text: "    </Canvas>", color: PLAIN }],
  [{ text: "  )", color: PLAIN }],
  [{ text: "}", color: PLAIN }],
  [{ text: "", color: PLAIN }],
  [
    { text: "const ", color: PINK },
    { text: "camera ", color: PLAIN },
    { text: "= ", color: PLAIN },
    { text: "curve", color: KEY },
    { text: ".getPointAt(", color: PLAIN },
    { text: "progress", color: PLAIN },
    { text: ")", color: PLAIN },
  ],
  [
    { text: "scene.fog.color.lerp(", color: PLAIN },
    { text: "warm", color: KEY },
    { text: ", t)", color: PLAIN },
  ],
];

function drawCodeBlock(ctx: CanvasRenderingContext2D, originY: number) {
  ctx.font = "500 22px 'JetBrains Mono', ui-monospace, monospace";
  ctx.textBaseline = "top";
  const lineHeight = 32;
  const gutterX = 28;
  const codeX = 72;

  CODE_LINES.forEach((tokens, index) => {
    const y = originY + index * lineHeight;
    ctx.fillStyle = MUTED;
    ctx.fillText(String(index + 1).padStart(2, " "), gutterX, y);
    let x = codeX;
    tokens.forEach((token) => {
      ctx.fillStyle = token.color;
      ctx.fillText(token.text, x, y);
      x += ctx.measureText(token.text).width;
    });
  });
}

function createCodeTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  ctx.fillStyle = "#071014";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#0c181c";
  ctx.fillRect(0, 0, 58, canvas.height);

  drawCodeBlock(ctx, 36);
  drawCodeBlock(ctx, 36 + CODE_LINES.length * 32 + 24);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  return texture;
}

export function DeviceShell() {
  const scroll = useScrollProgress();
  const { theme } = useTheme();
  const chassis = chassisProps(theme === "light");
  const group = useRef<THREE.Group>(null);
  const screenMat = useRef<THREE.MeshBasicMaterial>(null);
  const bezelMat = useRef<THREE.MeshPhysicalMaterial>(null);
  const texture = useMemo(() => createCodeTexture(), []);
  const grain = useMemo(() => makeGrainMap(), []);
  const reduced = useRef(false);
  reduced.current = prefersReducedMotion();

  useEffect(() => () => texture.dispose(), [texture]);

  useFrame((state, delta) => {
    const mesh = group.current;
    const screen = screenMat.current;
    if (!mesh || !screen) return;

    const raw = scroll.get();
    const t = Number.isFinite(raw) ? THREE.MathUtils.clamp(raw, 0, 1) : 0;
    if (t > 0.2) {
      mesh.visible = false;
      return;
    }
    mesh.visible = true;

    const dive = THREE.MathUtils.smoothstep(t, 0.03, 0.16);
    const targetOpacity = 1 - dive;
    const targetScale = 1 - dive * 0.15;
    const hover = reduced.current ? 0 : Math.sin(state.clock.elapsedTime * 0.7) * 0.04 * (1 - dive);

    mesh.position.x = 1.55;
    mesh.position.y = THREE.MathUtils.damp(mesh.position.y, hover, 4, delta);
    mesh.position.z = 0;
    const scale = THREE.MathUtils.damp(mesh.scale.x, Math.max(0.01, targetScale), 3.4, delta);
    mesh.scale.setScalar(scale);
    mesh.rotation.y = THREE.MathUtils.damp(mesh.rotation.y, (1 - dive) * -0.12, 3, delta);

    screen.opacity = THREE.MathUtils.damp(screen.opacity, Math.max(0, targetOpacity), 5, delta);
    if (texture && t < 0.2 && !reduced.current) {
      texture.offset.y = (texture.offset.y + frameDt(delta) * 0.018) % 1;
    }
    if (bezelMat.current) {
      bezelMat.current.opacity = THREE.MathUtils.damp(
        bezelMat.current.opacity,
        Math.max(0, targetOpacity * (1 - dive * 0.4)),
        5,
        delta,
      );
    }

    const crossing = 1 - Math.min(1, Math.abs(t - 0.11) / 0.04);
    if (crossing > 0) {
      mesh.scale.z = 1 + crossing * 0.18;
    }
  });

  return (
    <group ref={group} position={[1.55, 0.06, 0]} rotation={[0, -0.12, 0]}>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[2.35, 1.48, 0.08]} />
        <meshPhysicalMaterial
          ref={bezelMat}
          {...chassis}
          roughnessMap={grain}
          transparent
          opacity={1}
          fog={false}
        />
      </mesh>
      <mesh position={[0, 0, 0.05]}>
        <planeGeometry args={[2.08, 1.22]} />
        <meshBasicMaterial
          ref={screenMat}
          map={texture}
          toneMapped={false}
          fog={false}
          transparent
          opacity={1}
        />
      </mesh>
      <mesh position={[0, -0.92, 0.02]}>
        <boxGeometry args={[0.42, 0.34, 0.06]} />
        <meshPhysicalMaterial {...chassis} roughnessMap={grain} />
      </mesh>
      <mesh position={[0, -1.12, 0.08]} rotation={[-0.12, 0, 0]}>
        <boxGeometry args={[0.95, 0.04, 0.42]} />
        <meshPhysicalMaterial {...chassis} roughnessMap={grain} />
      </mesh>
    </group>
  );
}
