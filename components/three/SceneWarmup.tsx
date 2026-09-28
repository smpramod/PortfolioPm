"use client";

import { useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";

/**
 * Forces eager GPU shader compilation and texture upload for every material
 * currently in the R3F scene, eliminating the JIT-compile spike that causes
 * first-scroll jank.
 *
 * Must be placed inside <Canvas>. Runs once per mount, after two rAF ticks
 * so that all sibling scene components have had time to mount and add their
 * objects/materials to the scene graph.
 *
 * Compatible with: @react-three/fiber v9, three.js r182
 */
export function SceneWarmup() {
  const { gl, scene, camera } = useThree();
  const compiled = useRef(false);

  useEffect(() => {
    if (compiled.current) return;
    compiled.current = true;

    // Two nested rAFs:
    //   rAF1 - fires after the current commit/paint frame
    //   rAF2 - fires on the next frame, after all sibling useEffects have run
    //          and their Three.js objects are attached to the scene graph
    let raf1: number;
    let raf2: number;

    raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        try {
          // THREE r182: WebGLRenderer.compile(scene, camera)
          // - Walks the scene graph and compiles all uncompiled GLSL programs
          // - Uploads all pending textures via gl.texImage2D / gl.texImage3D
          // - Uploads all pending geometry buffers via gl.bufferData
          // This is synchronous from the CPU perspective and runs during
          // an otherwise-idle frame, not on the first scroll tick.
          gl.compile(scene, camera);
        } catch (e) {
          if (process.env.NODE_ENV === "development") {
            console.warn("[SceneWarmup] renderer.compile() failed:", e);
          }
        }
      });
    });

    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, [gl, scene, camera]);

  return null;
}
