import * as THREE from "https://unpkg.com/three@0.165.0/build/three.module.js";

export { THREE };

export function createThreeMaterials() {
  return {
    floor: new THREE.MeshStandardMaterial({
      color: 0x252829,
      roughness: 0.95,
      metalness: 0,
    }),
    wall: new THREE.MeshStandardMaterial({
      color: 0x3b4448,
      roughness: 0.9,
      metalness: 0,
    }),
    entityFallback: new THREE.MeshStandardMaterial({
      color: 0xd9d2b6,
      roughness: 0.65,
      metalness: 0,
    }),
    transparentPlayer: new THREE.MeshStandardMaterial({
      color: 0xd9d2b6,
      transparent: true,
      opacity: 0.22,
      depthWrite: false,
      roughness: 0.65,
      metalness: 0,
    }),
  };
}

export function createEntityMaterial(color) {
  return new THREE.MeshStandardMaterial({
    color: normalizeRenderableColor(color),
    roughness: 0.65,
    metalness: 0,
  });
}

function normalizeRenderableColor(color) {
  if (typeof color === "string" && color.trim()) {
    return color;
  }

  return 0xd9d2b6;
}
