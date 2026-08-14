"use client";

import { useMemo, useRef } from "react";
import { Line } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { HOLE, type Vec3 } from "./hole";

export const BALL_R = 0.15;

export function Ball({ pos, flying }: { pos: Vec3; flying: boolean }) {
  const mesh = useRef<THREE.Mesh>(null);
  const glow = useRef<THREE.Mesh>(null);
  const spin = useRef(0);

  useFrame((_, dt) => {
    if (!mesh.current) return;
    mesh.current.position.set(pos.x, pos.y + BALL_R, pos.z);
    if (glow.current) {
      glow.current.position.set(pos.x, pos.y + 0.02, pos.z);
      glow.current.visible = !flying;
    }
    if (flying) {
      spin.current += dt * 20;
      mesh.current.rotation.x = spin.current;
    }
  });

  return (
    <group>
      <mesh ref={mesh} castShadow>
        <sphereGeometry args={[BALL_R, 28, 28]} />
        <meshStandardMaterial color="#ffffff" roughness={0.25} metalness={0.08} />
      </mesh>
      <mesh ref={glow} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[BALL_R * 1.6, BALL_R * 3.2, 40]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.55} />
      </mesh>
    </group>
  );
}

/** Soft aim beacon over the landing zone — not a Speedy red triangle. */
export function AimBeacon({ aim, show }: { aim: number; show: boolean }) {
  if (!show) return null;
  const bx = THREE.MathUtils.lerp(Math.sin(aim) * 40, HOLE.pin.x, 0.75);
  const bz = THREE.MathUtils.lerp(HOLE.tee.z - 90, HOLE.pin.z, 0.85);

  return (
    <group position={[bx, 8.5, bz]}>
      <mesh>
        <torusGeometry args={[2.8, 0.12, 8, 40]} />
        <meshBasicMaterial color="#ffe08a" transparent opacity={0.85} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.2, 2.8, 40]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.25} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

export function FlightLine({ points }: { points: Vec3[] }) {
  const pts = useMemo(
    () => points.map((p) => [p.x, p.y + BALL_R, p.z] as [number, number, number]),
    [points],
  );
  if (pts.length < 2) return null;
  return (
    <Line
      points={pts}
      color="#ffe9a8"
      lineWidth={2}
      dashed
      dashSize={1.6}
      gapSize={1}
      transparent
      opacity={0.8}
    />
  );
}

/** Minimal tee presence — no blocky avatar. */
export function TeeClub() {
  const { tee } = HOLE;
  return (
    <group position={[tee.x - 1.1, tee.y, tee.z + 0.4]} rotation={[0.15, 0.4, 0.1]}>
      <mesh position={[0, 0.7, 0]} castShadow>
        <cylinderGeometry args={[0.025, 0.03, 1.5, 8]} />
        <meshStandardMaterial color="#2a2a2a" metalness={0.5} roughness={0.4} />
      </mesh>
      <mesh position={[0.05, 0.05, 0.35]} castShadow>
        <boxGeometry args={[0.28, 0.1, 0.18]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.6} roughness={0.35} />
      </mesh>
    </group>
  );
}

export function GameCamera({
  ball,
  flying,
  aiming,
  aim,
}: {
  ball: Vec3;
  flying: boolean;
  aiming: boolean;
  aim: number;
}) {
  const pos = useRef(new THREE.Vector3());
  const look = useRef(new THREE.Vector3());

  useFrame(({ camera }) => {
    const { tee, pin } = HOLE;
    if (aiming && !flying) {
      // Elevated tee overlook — island framed in the distance
      pos.current.set(tee.x + 1.2 + aim * 2, tee.y + 2.4, tee.z + 6.5);
      look.current.set(pin.x + Math.sin(aim) * 18, 2.5, pin.z + 12);
    } else if (flying) {
      pos.current.set(ball.x + 1.5, Math.max(ball.y + 4, 6), ball.z + 8);
      look.current.set(ball.x, ball.y, ball.z - 25);
    } else {
      pos.current.set(tee.x + 1, tee.y + 2.2, tee.z + 6);
      look.current.set(pin.x, 2.2, pin.z + 10);
    }
    camera.position.lerp(pos.current, 0.09);
    camera.lookAt(look.current);
  });

  return null;
}
