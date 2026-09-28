"use client";

import { useLayoutEffect } from "react";
import { useThree, invalidate } from "@react-three/fiber";
import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { useTheme } from "@/lib/theme-context";

export function EnvironmentRig({ mobile }: { mobile: boolean }) {
  const gl = useThree((state) => state.gl);
  const scene = useThree((state) => state.scene);
  const { theme } = useTheme();
  const isLight = theme === "light";

  useLayoutEffect(() => {
    if (mobile) {
      scene.environment = null;
      scene.environmentIntensity = 1;
      return;
    }

    const pmrem = new THREE.PMREMGenerator(gl);
    const room = new RoomEnvironment();
    const envMap = pmrem.fromScene(room, 0.04).texture;
    scene.environment = envMap;
    scene.environmentIntensity = isLight ? 0.75 : 0.48;
    room.dispose();
    invalidate();

    return () => {
      scene.environment = null;
      envMap.dispose();
      pmrem.dispose();
    };
  }, [gl, scene, mobile, isLight]);

  return null;
}
