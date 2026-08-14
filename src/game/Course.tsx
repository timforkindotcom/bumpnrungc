"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { HOLE, groundY } from "./hole";
import { useGameMaterials, type GameMats } from "./materials";

function buildWorldMesh() {
  const w = 120;
  const d = 200;
  const g = new THREE.PlaneGeometry(w, d, 80, 120);
  const pos = g.attributes.position as THREE.BufferAttribute;
  const colors = new Float32Array(pos.count * 3);
  const cGrass = new THREE.Color("#4aa83c");
  const cGreen = new THREE.Color("#6ee85a");
  const cCliff = new THREE.Color("#9a8060");
  const cDeep = new THREE.Color("#1a4038");

  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const lz = pos.getY(i);
    const z = -lz - 55;
    const y = groundY(x, z);
    pos.setZ(i, y);

    let col = cGrass;
    const { green, tee, water } = HOLE;
    const onIsle =
      ((x - green.x) / green.halfW) ** 2 + ((z - green.z) / green.halfD) ** 2 < 1.1;
    if (onIsle) col = cGreen;
    else if (z > -10 && Math.abs(x) < 16) col = cGrass.clone().lerp(cCliff, 0.25);
    else if (y < water.y + 0.5) col = cDeep;
    else if (Math.abs(x) > 18) col = cGrass.clone().lerp(cCliff, 0.4);

    // subtle variation
    col = col.clone().offsetHSL(0, 0, (Math.sin(x * 0.3 + z * 0.2) * 0.04));

    colors[i * 3] = col.r;
    colors[i * 3 + 1] = col.g;
    colors[i * 3 + 2] = col.b;
  }

  g.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  pos.needsUpdate = true;
  g.computeVertexNormals();
  g.rotateX(-Math.PI / 2);
  g.translate(0, 0, -55);
  return g;
}

function Terrain() {
  const geo = useMemo(() => buildWorldMesh(), []);
  return (
    <mesh geometry={geo} receiveShadow castShadow>
      <meshStandardMaterial vertexColors roughness={0.92} metalness={0} />
    </mesh>
  );
}

function Lake({ mats }: { mats: GameMats }) {
  const { water } = HOLE;
  const depth = water.zNear - water.zFar;
  const z = (water.zNear + water.zFar) / 2;
  return (
    <mesh
      position={[0, water.y + 0.05, z]}
      rotation={[-Math.PI / 2, 0, 0]}
      receiveShadow
      material={mats.water}
    >
      <planeGeometry args={[water.xHalf * 2.2, depth + 4, 1, 1]} />
    </mesh>
  );
}

function IslandGreen({ mats }: { mats: GameMats }) {
  const { green, pin } = HOLE;
  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[green.x, pin.y + 0.08, green.z]}
      scale={[green.halfW, green.halfD, 1]}
      receiveShadow
      material={mats.green}
    >
      <circleGeometry args={[1, 48]} />
    </mesh>
  );
}

function Bunkers({ mats }: { mats: GameMats }) {
  return (
    <>
      {HOLE.bunkers.map((b, i) => (
        <mesh
          key={i}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[b.x, groundY(b.x, b.z) + 0.1, b.z]}
          scale={[b.rx, b.rz, 1]}
          receiveShadow
          material={mats.sand}
        >
          <circleGeometry args={[1, 24]} />
        </mesh>
      ))}
    </>
  );
}

/** Soft rounded canopy trees — not Speedy cones. */
function Grove({ mats }: { mats: GameMats }) {
  const trees = useMemo(() => {
    const list: { x: number; z: number; s: number }[] = [];
    // Behind island only + tee flanks — open water view
    for (let i = 0; i < 16; i++) {
      list.push({
        x: -22 + (i % 8) * 6 + (i % 3) * 0.8,
        z: -148 - Math.floor(i / 8) * 5,
        s: 2.2 + (i % 4) * 0.4,
      });
    }
    list.push({ x: -11, z: 4, s: 2.8 });
    list.push({ x: 12, z: 5, s: 2.5 });
    list.push({ x: -14, z: -2, s: 2.1 });
    return list;
  }, []);

  return (
    <group>
      {trees.map((t, i) => {
        const gy = groundY(t.x, t.z);
        return (
          <group key={i} position={[t.x, gy, t.z]}>
            <mesh position={[0, t.s * 0.45, 0]} castShadow material={mats.trunk}>
              <cylinderGeometry args={[0.18, 0.28, t.s * 0.9, 6]} />
            </mesh>
            <mesh position={[0, t.s * 1.05, 0]} castShadow material={mats.foliage}>
              <sphereGeometry args={[t.s * 0.7, 10, 10]} />
            </mesh>
            <mesh position={[t.s * 0.35, t.s * 0.95, 0.2]} castShadow material={mats.foliage}>
              <sphereGeometry args={[t.s * 0.45, 8, 8]} />
            </mesh>
            <mesh position={[-t.s * 0.3, t.s * 1.0, -0.15]} castShadow material={mats.foliage}>
              <sphereGeometry args={[t.s * 0.4, 8, 8]} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

function Flag() {
  const { pin } = HOLE;
  return (
    <group position={[pin.x, pin.y, pin.z]}>
      <mesh position={[0, 3.8, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 7.6, 8]} />
        <meshStandardMaterial color="#f8f8f4" metalness={0.35} roughness={0.35} />
      </mesh>
      <mesh position={[1.1, 7.0, 0]}>
        <boxGeometry args={[2.1, 1.3, 0.04]} />
        <meshStandardMaterial color="#ff3b3b" emissive="#801010" emissiveIntensity={0.35} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <circleGeometry args={[0.28, 16]} />
        <meshStandardMaterial color="#111" />
      </mesh>
    </group>
  );
}

function TeePad({ mats }: { mats: GameMats }) {
  const { tee } = HOLE;
  return (
    <group position={[tee.x, tee.y, tee.z]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow material={mats.fairway}>
        <circleGeometry args={[5.5, 32]} />
      </mesh>
      <mesh position={[-2.2, 0.04, 0.8]} castShadow material={mats.cliff}>
        <boxGeometry args={[0.35, 0.12, 0.35]} />
      </mesh>
      <mesh position={[2.2, 0.04, 0.8]} castShadow material={mats.cliff}>
        <boxGeometry args={[0.35, 0.12, 0.35]} />
      </mesh>
    </group>
  );
}

function DistantRidges({ mats }: { mats: GameMats }) {
  return (
    <group>
      {[
        [-60, -200, 18, 70],
        [-10, -210, 22, 80],
        [50, -195, 16, 65],
      ].map(([x, z, h, w], i) => (
        <mesh key={i} position={[x, h * 0.25, z]} material={mats.rock} castShadow>
          <sphereGeometry args={[w * 0.35, 7, 5, 0, Math.PI * 2, 0, Math.PI / 2]} />
        </mesh>
      ))}
    </group>
  );
}

export function Course() {
  const mats = useGameMaterials();
  return (
    <group>
      <Terrain />
      <Lake mats={mats} />
      <IslandGreen mats={mats} />
      <Bunkers mats={mats} />
      <Grove mats={mats} />
      <DistantRidges mats={mats} />
      <TeePad mats={mats} />
      <Flag />
    </group>
  );
}
