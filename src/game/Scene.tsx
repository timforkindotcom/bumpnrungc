"use client";

import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sky } from "@react-three/drei";
import * as THREE from "three";
import { Course } from "./Course";
import { AimBeacon, Ball, FlightLine, GameCamera, TeeClub } from "./Actors";
import type { Vec3 } from "./hole";

export type SceneProps = {
  ball: Vec3;
  flying: boolean;
  aiming: boolean;
  aim: number;
  preview: Vec3[];
};

function WaterShimmer() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const m = ref.current.material as THREE.MeshBasicMaterial;
    m.opacity = 0.04 + Math.sin(clock.elapsedTime * 0.8) * 0.02;
  });
  return (
    <mesh ref={ref} position={[0, 0.35, -80]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[90, 100]} />
      <meshBasicMaterial color="#a8e8ff" transparent opacity={0.05} depthWrite={false} />
    </mesh>
  );
}

function World({ ball, flying, aiming, aim, preview }: SceneProps) {
  const fog = useMemo(() => new THREE.Color("#c4a890"), []);

  return (
    <>
      <color attach="background" args={["#e8b896"]} />
      <fog attach="fog" args={[fog, 70, 240]} />

      <Sky
        distance={450}
        sunPosition={[40, 8, 30]}
        inclination={0.48}
        azimuth={0.22}
        mieCoefficient={0.008}
        mieDirectionalG={0.85}
        rayleigh={1.8}
        turbidity={6}
      />

      <ambientLight intensity={0.45} color="#ffe8d0" />
      <directionalLight
        castShadow
        position={[45, 28, 20]}
        intensity={2.1}
        color="#ffd4a8"
        shadow-mapSize={[1536, 1536]}
        shadow-camera-left={-80}
        shadow-camera-right={80}
        shadow-camera-top={80}
        shadow-camera-bottom={-80}
        shadow-bias={-0.00035}
      />
      <hemisphereLight args={["#ffc8a0", "#2a5a40", 0.55]} />
      <directionalLight position={[-30, 12, -10]} intensity={0.35} color="#8090ff" />

      <Suspense fallback={null}>
        <Course />
        <TeeClub />
        <WaterShimmer />
      </Suspense>

      <Ball pos={ball} flying={flying} />
      <AimBeacon aim={aim} show={aiming && !flying} />
      {preview.length > 1 && aiming && !flying && <FlightLine points={preview} />}
      <GameCamera ball={ball} flying={flying} aiming={aiming} aim={aim} />
    </>
  );
}

export function GameCanvas(props: SceneProps) {
  return (
    <Canvas
      shadows
      dpr={[1, 1.75]}
      gl={{
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.05,
      }}
      camera={{ fov: 40, near: 0.1, far: 500, position: [1, 9, 14] }}
      className="absolute inset-0 touch-none"
      style={{ touchAction: "none" }}
    >
      <World {...props} />
    </Canvas>
  );
}
