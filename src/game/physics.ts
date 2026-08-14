import { HOLE, groundY, onGreen, type Vec3 } from "./hole";

export type Shot = {
  aim: number;
  power: number;
  spin: number;
  endT: number;
  apex: number;
};

export const AIM_MAX = 0.48;

export function clampAim(a: number) {
  return Math.max(-AIM_MAX, Math.min(AIM_MAX, a));
}

/** Speedy-style shot from aim (rad), power 0–1, spin -1…+1. */
export function makeShot(aim: number, power: number, spin: number): Shot {
  const p = Math.max(0.08, Math.min(1, power));
  const s = Math.max(-1, Math.min(1, spin));
  const roll = s * 0.07; // topspin stretches, backspin shortens
  return {
    aim: clampAim(aim),
    power: p,
    spin: s,
    endT: Math.min(1.1, 0.32 + p * 0.72 + roll),
    apex: 18 + p * 62,
  };
}

/** Sample world-space flight path. */
export function sampleFlight(shot: Shot, steps = 64): Vec3[] {
  const { tee, yardage } = HOLE;
  const dist = yardage * shot.endT;
  const dirX = Math.sin(shot.aim);
  const dirZ = -Math.cos(shot.aim);
  // Curve peak mid-flight from missed sweet-spot spin
  const hook = Math.abs(shot.spin) < 0.1 ? 0 : shot.spin * 9;

  const endX = tee.x + dirX * dist;
  const endZ = tee.z + dirZ * dist;
  const pts: Vec3[] = [];

  for (let i = 0; i <= steps; i++) {
    const u = i / steps;
    const x = tee.x + (endX - tee.x) * u + Math.sin(u * Math.PI) * hook;
    const z = tee.z + (endZ - tee.z) * u;
    const flight = Math.sin(u * Math.PI) * shot.apex * 0.05;
    const hang = shot.spin < 0 ? (1 - u) * 0.2 * -shot.spin : 0;
    const g = groundY(x, z);
    pts.push({ x, y: g + flight + hang + 0.12, z });
  }

  return pts;
}

export function lerpPath(pts: Vec3[], t: number): Vec3 {
  if (pts.length === 0) return { x: 0, y: 0, z: 0 };
  if (pts.length === 1) return pts[0];
  const u = Math.max(0, Math.min(1, t));
  const exact = u * (pts.length - 1);
  const i = Math.min(Math.floor(exact), pts.length - 2);
  const f = exact - i;
  const a = pts[i];
  const b = pts[i + 1];
  return {
    x: a.x + (b.x - a.x) * f,
    y: a.y + (b.y - a.y) * f,
    z: a.z + (b.z - a.z) * f,
  };
}

export function landedOnGreen(shot: Shot) {
  const end = sampleFlight(shot, 2).at(-1);
  if (!end) return false;
  return onGreen(end.x, end.z) && shot.endT >= 0.84 && Math.abs(shot.aim) < 0.22;
}

export function flightDuration(shot: Shot) {
  return 950 + shot.endT * 550;
}
