"use client";

import { MeshPhysicalMaterial, RepeatWrapping, SRGBColorSpace, CanvasTexture, LinearFilter } from "three";

export function chassisProps(light: boolean) {
  return {
    color: light ? "#2a3038" : "#151920",
    metalness: light ? 0.48 : 0.58,
    roughness: light ? 0.38 : 0.32,
    clearcoat: 0.62,
    clearcoatRoughness: light ? 0.28 : 0.18,
    envMapIntensity: light ? 1.05 : 1.25,
    reflectivity: 0.7,
  } as const;
}

export function glassProps(light: boolean) {
  return {
    color: light ? "#f4f7fb" : "#0c1418",
    metalness: 0.12,
    roughness: 0.06,
    clearcoat: 1,
    clearcoatRoughness: 0.04,
    transparent: true,
    opacity: light ? 0.42 : 0.55,
    ior: 1.48,
    thickness: 0.35,
    envMapIntensity: 1.55,
    attenuationDistance: 2.4,
    attenuationColor: light ? "#e8eef2" : "#123038",
  } as const;
}

function createGrainTexture(size = 128) {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new CanvasTexture(canvas);
  const img = ctx.createImageData(size, size);
  for (let i = 0; i < img.data.length; i += 4) {
    const n = 118 + Math.random() * 38;
    img.data[i] = n;
    img.data[i + 1] = n;
    img.data[i + 2] = n;
    img.data[i + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);
  const texture = new CanvasTexture(canvas);
  texture.wrapS = RepeatWrapping;
  texture.wrapT = RepeatWrapping;
  texture.repeat.set(2.4, 2.4);
  texture.anisotropy = 4;
  texture.minFilter = LinearFilter;
  texture.magFilter = LinearFilter;
  texture.colorSpace = SRGBColorSpace;
  return texture;
}

let grainSingleton: CanvasTexture | null = null;

export function makeGrainMap() {
  if (!grainSingleton) grainSingleton = createGrainTexture(128);
  return grainSingleton;
}

export { MeshPhysicalMaterial };
