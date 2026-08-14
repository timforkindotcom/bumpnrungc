"use client";

import { useMemo } from "react";
import * as THREE from "three";

/** Warm resort palette — not Speedy’s neon arcade green. */
export function useGameMaterials() {
  return useMemo(() => {
    return {
      fairway: new THREE.MeshStandardMaterial({
        color: "#5cb84a",
        roughness: 0.88,
      }),
      green: new THREE.MeshStandardMaterial({
        color: "#6ed45a",
        roughness: 0.65,
      }),
      cliff: new THREE.MeshStandardMaterial({
        color: "#8b7355",
        roughness: 0.95,
        flatShading: true,
      }),
      sand: new THREE.MeshStandardMaterial({
        color: "#e8d4a0",
        roughness: 0.92,
      }),
      water: new THREE.MeshStandardMaterial({
        color: "#1a6a7a",
        roughness: 0.12,
        metalness: 0.25,
        transparent: true,
        opacity: 0.88,
        emissive: "#062028",
        emissiveIntensity: 0.2,
      }),
      foliage: new THREE.MeshStandardMaterial({
        color: "#2d6b3a",
        roughness: 0.85,
        flatShading: true,
      }),
      trunk: new THREE.MeshStandardMaterial({
        color: "#5c4030",
        roughness: 0.9,
      }),
      rock: new THREE.MeshStandardMaterial({
        color: "#6a6560",
        roughness: 1,
        flatShading: true,
      }),
    };
  }, []);
}

export type GameMats = ReturnType<typeof useGameMaterials>;
