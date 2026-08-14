"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { SiteContent } from "@/lib/content";
import type { TabId } from "@/components/HomeClient";
import { HOLE, teeBall, yardsBetween, type Vec3 } from "./hole";
import {
  clampAim,
  flightDuration,
  landedOnGreen,
  lerpPath,
  makeShot,
  sampleFlight,
} from "./physics";
import { GameCanvas } from "./Scene";
import { Controls, type Phase } from "./Controls";

type Props = {
  content: SiteContent;
  onOpenTab: (tab: TabId) => void;
};

function useDial(active: boolean, mode: "power" | "spin", speed = 1.4) {
  const [v, setV] = useState(0);
  const t0 = useRef(0);

  useEffect(() => {
    if (!active) return;
    t0.current = performance.now();
    let id = 0;
    const tick = (now: number) => {
      const t = ((now - t0.current) / 1000) * speed;
      if (mode === "power") {
        const c = t % 2;
        setV(c < 1 ? c : 2 - c);
      } else {
        setV(Math.sin(t * Math.PI));
      }
      id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [active, mode, speed]);

  return v;
}

export function GolfGame({ content, onOpenTab }: Props) {
  const [phase, setPhase] = useState<Phase>("aim");
  const [aim, setAim] = useState(0);
  const [powerLock, setPowerLock] = useState(0.8);
  const [strokes, setStrokes] = useState(0);
  const [ball, setBall] = useState<Vec3>(teeBall);
  const [preview, setPreview] = useState<Vec3[]>([]);
  const [tagline, setTagline] = useState(false);
  const [cta, setCta] = useState(false);
  const [ctaDone, setCtaDone] = useState(false);

  const flying = phase === "fly";
  const livePower = useDial(phase === "power", "power", 1.45);
  const liveSpin = useDial(phase === "spin", "spin", 1.6);
  const anim = useRef<number | null>(null);

  const reset = useCallback(() => {
    setBall(teeBall());
    setPreview([]);
    setPhase("aim");
  }, []);

  const fire = useCallback(
    (power: number, spin: number, aimAngle: number) => {
      const shot = makeShot(aimAngle, power, spin);
      const path = sampleFlight(shot);
      const dur = flightDuration(shot);
      const t0 = performance.now();
      setStrokes((n) => n + 1);
      setPhase("fly");
      setPreview([]);

      const step = (now: number) => {
        const u = Math.min(1, (now - t0) / dur);
        const eased = 1 - Math.pow(1 - u, 1.4);
        setBall(lerpPath(path, eased));
        if (u < 1) {
          anim.current = requestAnimationFrame(step);
        } else {
          if (landedOnGreen(shot) && !tagline) {
            setTagline(true);
            setCta(true);
          }
          setTimeout(reset, 1300);
        }
      };
      anim.current = requestAnimationFrame(step);
    },
    [reset, tagline],
  );

  const onSwing = useCallback(() => {
    if (phase === "aim") {
      setPhase("power");
      return;
    }
    if (phase === "power") {
      setPowerLock(livePower);
      setPhase("spin");
      return;
    }
    if (phase === "spin") {
      fire(powerLock, liveSpin, aim);
    }
  }, [phase, livePower, liveSpin, powerLock, aim, fire]);

  const onAim = useCallback((d: number) => {
    setAim((a) => clampAim(a + d));
  }, []);

  useEffect(() => {
    if (phase !== "aim") {
      setPreview([]);
      return;
    }
    setPreview(sampleFlight(makeShot(aim, 0.88, 0), 28));
  }, [aim, phase]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "ArrowLeft") {
        e.preventDefault();
        if (phase === "aim") onAim(-0.045);
      } else if (e.code === "ArrowRight") {
        e.preventDefault();
        if (phase === "aim") onAim(0.045);
      } else if (e.code === "Space") {
        e.preventDefault();
        onSwing();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, onAim, onSwing]);

  useEffect(
    () => () => {
      if (anim.current) cancelAnimationFrame(anim.current);
    },
    [],
  );

  const yards = yardsBetween(ball, { x: HOLE.pin.x, y: HOLE.pin.y, z: HOLE.pin.z });

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#e8b896] select-none">
      <GameCanvas
        ball={ball}
        flying={flying}
        aiming={phase === "aim" || phase === "power" || phase === "spin"}
        aim={aim}
        preview={preview}
      />

      <div className="pointer-events-none absolute left-3 top-3 z-20 max-w-[200px] rounded-2xl border border-white/15 bg-[#1a1410]/55 px-3 py-2.5 text-[#f5e6d0] shadow-lg backdrop-blur-md">
        <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-[#f5e6d0]/70">
          {HOLE.name}
        </p>
        <p className="text-lg font-semibold leading-tight">
          Par {HOLE.par} · {yards}y
        </p>
        <p className="mt-1 text-xs text-[#f5e6d0]/75">
          Stroke {strokes}
          {!tagline ? "" : strokes <= HOLE.par ? ` · ${strokes === HOLE.par ? "par" : `${HOLE.par - strokes} under`}` : ` · +${strokes - HOLE.par}`}
        </p>
      </div>

      <Controls
        phase={phase}
        power={phase === "power" ? livePower : powerLock}
        spin={liveSpin}
        onAim={onAim}
        onSwing={onSwing}
      />

      <AnimatePresence>
        {tagline && (
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="pointer-events-none absolute left-1/2 top-[26%] z-40 w-[min(92%,360px)] -translate-x-1/2 text-center text-2xl text-cream drop-shadow-lg sm:text-3xl"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            {content.tagline}
          </motion.p>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {cta && !ctaDone && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="scorecard-texture pointer-events-auto absolute bottom-24 left-1/2 z-40 w-[min(92%,340px)] -translate-x-1/2 border-2 border-leather/50 p-4 text-center shadow-xl"
          >
            <p
              className="mb-3 text-sm uppercase tracking-[0.12em] text-leather"
              style={{ fontFamily: "var(--font-oswald), sans-serif" }}
            >
              {content.ctaHeadline}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setCtaDone(true);
                  setCta(false);
                  onOpenTab("services");
                }}
                className="flex-1 rounded-sm bg-fairway px-3 py-2 text-xs uppercase tracking-[0.14em] text-cream"
                style={{ fontFamily: "var(--font-oswald), sans-serif" }}
              >
                {content.ctaServicesLabel}
              </button>
              <button
                type="button"
                onClick={() => {
                  setCtaDone(true);
                  setCta(false);
                  onOpenTab("contact");
                }}
                className="flex-1 rounded-sm border border-leather/50 bg-parchment px-3 py-2 text-xs uppercase tracking-[0.14em] text-leather"
                style={{ fontFamily: "var(--font-oswald), sans-serif" }}
              >
                {content.ctaContactLabel}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
