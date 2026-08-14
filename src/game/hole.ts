/**
 * Island green over water — a carry you can read from the tee.
 * Built for drama and clarity, not a pine-corridor clone.
 */
export const HOLE = {
  number: 1,
  name: "The Carry",
  par: 3,
  yardage: 142,
  tee: { x: 0, y: 6.5, z: 8 },
  pin: { x: -1.2, y: 1.15, z: -118 },
  green: { x: 0, z: -116, halfW: 9, halfD: 10 },
  /** Wide lake between tee shelf and island */
  water: { y: 0.2, zNear: -20, zFar: -145, xHalf: 55 },
  bunkers: [
    { x: -6, z: -110, rx: 3.8, rz: 2.6 },
    { x: 7, z: -112, rx: 4.2, rz: 2.8 },
    { x: 1, z: -125, rx: 3.2, rz: 2.2 },
  ],
} as const;

export type Vec3 = { x: number; y: number; z: number };

export function groundY(x: number, z: number): number {
  const { tee, pin, green, water } = HOLE;

  // Tee shelf
  if (z > -8 && Math.abs(x) < 14) {
    const edge = Math.max(0, Math.abs(x) - 8) / 6;
    return tee.y - edge * 1.2;
  }

  // Island green plateau
  const gx = x - green.x;
  const gz = z - green.z;
  const island = (gx * gx) / (green.halfW * green.halfW) + (gz * gz) / (green.halfD * green.halfD);
  if (island < 1.35) {
    const rim = Math.max(0, island - 0.85);
    return pin.y + rim * 1.8 + Math.sin(x * 0.4) * 0.08;
  }

  // Far bank behind island
  if (z < water.zFar + 8) {
    const bank = clamp01((water.zFar + 8 - z) / 18);
    return lerp(water.y - 0.3, 4.5, bank * bank) + Math.abs(x) * 0.02;
  }

  // Everything else is underwater / lake bed
  if (z < water.zNear && z > water.zFar && Math.abs(x) < water.xHalf) {
    return water.y - 1.8;
  }

  // Near shore drop from tee
  if (z <= -8 && z >= water.zNear) {
    const t = clamp01((-8 - z) / (-8 - water.zNear));
    return lerp(tee.y - 0.5, water.y - 1.5, t);
  }

  return water.y - 1.2;
}

export function onGreen(x: number, z: number) {
  const { green } = HOLE;
  const gx = (x - green.x) / green.halfW;
  const gz = (z - green.z) / green.halfD;
  return gx * gx + gz * gz <= 1;
}

export function inWater(x: number, z: number) {
  const { water } = HOLE;
  return (
    z < water.zNear &&
    z > water.zFar &&
    Math.abs(x) < water.xHalf &&
    groundY(x, z) < water.y + 0.4
  );
}

export function yardsBetween(a: Vec3, b: Vec3) {
  return Math.round(Math.hypot(b.x - a.x, b.z - a.z));
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function clamp01(v: number) {
  return Math.max(0, Math.min(1, v));
}

export const teeBall = (): Vec3 => ({
  x: HOLE.tee.x,
  y: HOLE.tee.y,
  z: HOLE.tee.z,
});
