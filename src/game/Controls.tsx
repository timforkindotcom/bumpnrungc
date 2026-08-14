"use client";

import { useEffect, useRef } from "react";

export type Phase = "aim" | "power" | "spin" | "fly";

type Props = {
  phase: Phase;
  power: number;
  spin: number;
  onAim: (delta: number) => void;
  onSwing: () => void;
};

function Meter({
  label,
  value,
  kind,
}: {
  label: string;
  value: number;
  kind: "power" | "spin";
}) {
  const pct = kind === "power" ? value * 100 : (value + 1) * 50;
  return (
    <div className="pointer-events-none absolute left-1/2 top-[36%] z-30 w-[min(84vw,300px)] -translate-x-1/2">
      <div className="rounded-full border border-white/20 bg-[#1a1410]/70 px-5 py-4 shadow-2xl backdrop-blur-xl">
        <div className="mb-2 flex items-center justify-between text-[11px] font-medium uppercase tracking-[0.16em] text-[#f5e6d0]/90">
          <span>{label}</span>
          <span className="tabular-nums text-[#f5e6d0]">
            {kind === "power"
              ? `${Math.round(value * 100)}%`
              : value < -0.12
                ? "Backspin"
                : value > 0.12
                  ? "Topspin"
                  : "Pure"}
          </span>
        </div>
        <div className="relative h-3 overflow-hidden rounded-full bg-white/10">
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-[#6dcf6a] via-[#f0d060] to-[#e85a4a]"
            style={{ width: `${Math.max(4, pct)}%` }}
          />
          {kind === "spin" && (
            <div className="absolute inset-y-0 left-1/2 w-1 -translate-x-1/2 bg-[#6dcf6a]/90" />
          )}
        </div>
        <p className="mt-2 text-center text-[11px] text-[#f5e6d0]/65">Tap hit again</p>
      </div>
    </div>
  );
}

export function Controls({ phase, power, spin, onAim, onSwing }: Props) {
  const hold = useRef<ReturnType<typeof setInterval> | null>(null);
  const canAim = phase === "aim";

  const start = (dir: -1 | 1) => {
    if (!canAim) return;
    onAim(dir * 0.038);
    hold.current = setInterval(() => onAim(dir * 0.03), 36);
  };
  const stop = () => {
    if (hold.current) clearInterval(hold.current);
    hold.current = null;
  };

  useEffect(() => () => stop(), []);

  return (
    <>
      {phase === "power" && <Meter label="Power" value={power} kind="power" />}
      {phase === "spin" && <Meter label="Spin" value={spin} kind="spin" />}

      <div className="absolute inset-x-0 bottom-0 z-30 bg-gradient-to-t from-[#1a1410]/90 via-[#1a1410]/50 to-transparent pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-16">
        <div className="mx-auto flex w-full max-w-md items-center justify-center gap-3 px-4">
          <button
            type="button"
            disabled={!canAim}
            aria-label="Aim left"
            onPointerDown={(e) => {
              e.preventDefault();
              start(-1);
            }}
            onPointerUp={stop}
            onPointerLeave={stop}
            onPointerCancel={stop}
            className="flex h-14 w-14 items-center justify-center rounded-full border border-white/15 bg-white/10 text-2xl text-[#f5e6d0] backdrop-blur-md disabled:opacity-30"
          >
            ‹
          </button>

          <button
            type="button"
            disabled={phase === "fly"}
            onClick={onSwing}
            className="flex h-16 min-w-[160px] items-center justify-center rounded-full bg-[#f5e6d0] px-10 text-lg font-semibold tracking-wide text-[#1a1410] shadow-lg active:scale-[0.98] disabled:opacity-40"
          >
            {phase === "aim" ? "Hit" : phase === "power" ? "Set power" : phase === "spin" ? "Set spin" : "…"}
          </button>

          <button
            type="button"
            disabled={!canAim}
            aria-label="Aim right"
            onPointerDown={(e) => {
              e.preventDefault();
              start(1);
            }}
            onPointerUp={stop}
            onPointerLeave={stop}
            onPointerCancel={stop}
            className="flex h-14 w-14 items-center justify-center rounded-full border border-white/15 bg-white/10 text-2xl text-[#f5e6d0] backdrop-blur-md disabled:opacity-30"
          >
            ›
          </button>
        </div>
        {phase === "aim" && (
          <p className="mt-2 text-center text-[11px] text-[#f5e6d0]/55">
            Aim · then hit three times for power & spin
          </p>
        )}
      </div>
    </>
  );
}
