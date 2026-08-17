"use client";

import { useEffect, useRef, useState } from "react";
import { isPhoneLike } from "@/lib/device";

type UnityInstance = {
  Quit: () => Promise<void>;
};

type UnityCreateConfig = {
  dataUrl: string;
  frameworkUrl: string;
  codeUrl: string;
  streamingAssetsUrl?: string;
  companyName?: string;
  productName?: string;
  productVersion?: string;
  matchWebGLToCanvasSize?: boolean;
  devicePixelRatio?: number;
  autoSyncPersistentDataPath?: boolean;
  webglContextAttributes?: {
    preserveDrawingBuffer?: boolean;
    powerPreference?: number | string;
    antialias?: boolean;
    alpha?: boolean;
    premultipliedAlpha?: boolean;
  };
  showBanner?: (msg: string, type: string) => void;
};

type BuildManifest = {
  prefix: string;
  loader: string;
  /** ".unityweb" | ".gz" | "" (uncompressed) */
  assetExt?: string;
  gzip?: boolean;
  /** Cache-bust token from the Unity build step */
  v?: string;
  /** Approx download size for the loading copy */
  sizeMb?: number;
};

function resolveAssetExt(man: BuildManifest): string {
  if (typeof man.assetExt === "string") return man.assetExt;
  // Older manifests
  return man.gzip === false ? "" : ".gz";
}

function assetUrls(base: string, ext: string) {
  if (ext === ".unityweb") {
    return {
      dataUrl: `${base}.data.unityweb`,
      frameworkUrl: `${base}.framework.js.unityweb`,
      codeUrl: `${base}.wasm.unityweb`,
    };
  }
  if (ext === ".gz") {
    return {
      dataUrl: `${base}.data.gz`,
      frameworkUrl: `${base}.framework.js.gz`,
      codeUrl: `${base}.wasm.gz`,
    };
  }
  return {
    dataUrl: `${base}.data`,
    frameworkUrl: `${base}.framework.js`,
    codeUrl: `${base}.wasm`,
  };
}

type CreateUnityInstanceFn = (
  canvas: HTMLCanvasElement,
  config: UnityCreateConfig,
  onProgress?: (progress: number) => void,
) => Promise<UnityInstance>;

declare global {
  interface Window {
    createUnityInstance?: CreateUnityInstanceFn;
    __bnrKeyPatch?: boolean;
    __bnrOrigAdd?: typeof EventTarget.prototype.addEventListener;
    __bnrOrigRemove?: typeof EventTarget.prototype.removeEventListener;
  }
}

const UNITY_BASE = "/unity";

/**
 * Unity WebGL, by default, swallows every key on the page. That blocks the
 * Contact form. Skip Unity's keyboard listeners when the user is in an input.
 */
function patchKeyboardForHtmlForms() {
  if (typeof window === "undefined") return;
  if (window.__bnrKeyPatch) return;
  window.__bnrKeyPatch = true;

  const orig = EventTarget.prototype.addEventListener;
  window.__bnrOrigAdd = orig;
  window.__bnrOrigRemove = EventTarget.prototype.removeEventListener;

  EventTarget.prototype.addEventListener = function (
    this: EventTarget,
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions,
  ) {
    if (
      (type === "keydown" || type === "keypress" || type === "keyup") &&
      typeof listener === "function"
    ) {
      const wrapped: EventListener = (event) => {
        const t = event.target;
        if (t instanceof HTMLElement) {
          const tag = t.tagName;
          if (
            tag === "INPUT" ||
            tag === "TEXTAREA" ||
            tag === "SELECT" ||
            t.isContentEditable
          ) {
            return;
          }
        }
        listener.call(this, event);
      };
      orig.call(this, type, wrapped, options);
      return;
    }
    orig.call(this, type, listener, options);
  };
}

patchKeyboardForHtmlForms();

/** Survives React Strict Mode remounts — only one Unity boot at a time. */
type SharedBoot = {
  key: string;
  promise: Promise<UnityInstance> | null;
  instance: UnityInstance | null;
  progress: number;
  listeners: Set<(p: number) => void>;
};

const shared: SharedBoot = {
  key: "",
  promise: null,
  instance: null,
  progress: 0,
  listeners: new Set(),
};

/** One canvas for the whole page. React remounts must not create a second Unity. */
let persistentCanvas: HTMLCanvasElement | null = null;

function getPersistentCanvas(): HTMLCanvasElement {
  if (persistentCanvas) return persistentCanvas;
  const c = document.createElement("canvas");
  c.id = "unity-canvas";
  c.className = "absolute left-0 top-0 touch-none";
  c.tabIndex = -1;
  persistentCanvas = c;
  return c;
}

function getCreateUnityInstance(): CreateUnityInstanceFn | undefined {
  if (typeof window === "undefined") return undefined;
  const w = window as Window & {
    createUnityInstance?: CreateUnityInstanceFn;
  };
  return w.createUnityInstance ?? (globalThis as unknown as typeof w).createUnityInstance;
}

function pinCreateUnityInstance(): void {
  if (getCreateUnityInstance()) return;
  const bridge = document.createElement("script");
  bridge.textContent =
    "if (typeof createUnityInstance === 'function') { window.createUnityInstance = createUnityInstance; }";
  document.body.appendChild(bridge);
  bridge.remove();
}

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const finish = () => {
      pinCreateUnityInstance();
      resolve();
    };

    const existing = document.querySelector<HTMLScriptElement>(
      `script[data-unity-loader="1"]`,
    );
    if (existing) {
      pinCreateUnityInstance();
      if (getCreateUnityInstance()) {
        resolve();
        return;
      }
      existing.addEventListener("load", finish, { once: true });
      existing.addEventListener(
        "error",
        () => reject(new Error("Could not load Unity loader script")),
        { once: true },
      );
      const started = Date.now();
      const poll = window.setInterval(() => {
        pinCreateUnityInstance();
        if (getCreateUnityInstance()) {
          window.clearInterval(poll);
          resolve();
        } else if (Date.now() - started > 15000) {
          window.clearInterval(poll);
          reject(new Error("Unity loader is not ready"));
        }
      }, 50);
      return;
    }

    const s = document.createElement("script");
    s.src = src;
    s.async = true;
    s.dataset.unityLoader = "1";
    s.onload = finish;
    s.onerror = () => reject(new Error("Could not load Unity loader script"));
    document.body.appendChild(s);
  });
}

async function waitForCreateUnityInstance(
  timeoutMs = 15000,
): Promise<CreateUnityInstanceFn> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const fn = getCreateUnityInstance();
    if (fn) return fn;
    await new Promise((r) => setTimeout(r, 50));
  }
  throw new Error("Unity loader is not ready");
}

const CANVAS_DPR_CAP = 2;

function lockedDpr(): number {
  return Math.min(window.devicePixelRatio || 1, CANVAS_DPR_CAP);
}

function fitCanvasToHost(
  canvas: HTMLCanvasElement,
  host: HTMLElement,
  opts?: { force?: boolean },
) {
  const locked = canvas.dataset.sizeLocked === "1";
  // Once locked, never resize from Safari chrome / URL-bar / flex jitter.
  // Only orientationchange calls with { force: true } may change size.
  if (locked && !opts?.force) return;

  const w = Math.max(1, Math.round(host.clientWidth));
  const h = Math.max(1, Math.round(host.clientHeight));
  const prevW = Number(canvas.dataset.fitW || 0);
  const prevH = Number(canvas.dataset.fitH || 0);

  // Ignore tiny Safari chrome / subpixel flips (pre-lock only).
  if (
    !opts?.force &&
    prevW > 0 &&
    prevH > 0 &&
    Math.abs(w - prevW) < 8 &&
    Math.abs(h - prevH) < 12
  ) {
    return;
  }

  const dpr = lockedDpr();
  const bufW = Math.max(1, Math.round(w * dpr));
  const bufH = Math.max(1, Math.round(h * dpr));

  canvas.dataset.fitW = String(w);
  canvas.dataset.fitH = String(h);
  canvas.dataset.bufW = String(bufW);
  canvas.dataset.bufH = String(bufH);
  canvas.style.width = `${w}px`;
  canvas.style.height = `${h}px`;
  canvas.style.display = "block";
  if (canvas.width !== bufW) canvas.width = bufW;
  if (canvas.height !== bufH) canvas.height = bufH;
}

function freezeCanvasClientMetrics(canvas: HTMLCanvasElement) {
  const w = Number(canvas.dataset.fitW || canvas.clientWidth || 1);
  const h = Number(canvas.dataset.fitH || canvas.clientHeight || 1);
  try {
    Object.defineProperty(canvas, "clientWidth", {
      configurable: true,
      get: () => w,
    });
    Object.defineProperty(canvas, "clientHeight", {
      configurable: true,
      get: () => h,
    });
  } catch {
    /* Safari may reject redefine — style lock is still enough */
  }
}

function lockCanvasSize(canvas: HTMLCanvasElement) {
  // Desktop must keep following the window. The lock is only for phone Safari.
  if (!isPhoneLike()) return;
  // Never freeze a tiny leftover size — that makes the whole 3D view blocky.
  if (canvas.width < 320 || canvas.height < 320) return;
  canvas.dataset.sizeLocked = "1";
  freezeCanvasClientMetrics(canvas);
}

function unlockCanvasSize(canvas: HTMLCanvasElement) {
  canvas.dataset.sizeLocked = "0";
}

function withBust(url: string, v: string): string {
  if (!v) return url;
  return `${url}${url.includes("?") ? "&" : "?"}v=${encodeURIComponent(v)}`;
}

function statusForProgress(p: number): string {
  if (p < 0.05) return "Warming up the coffee…";
  if (p < 0.9) return "Checking the grip stock…";
  return "Almost ready for you…";
}

async function clearUnityBrowserCaches(): Promise<void> {
  try {
    if ("caches" in window) {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((k) => /unity|wasm|webgl/i.test(k))
          .map((k) => caches.delete(k)),
      );
    }
  } catch {
    /* ignore */
  }
  try {
    const dbs = await indexedDB.databases?.();
    if (dbs) {
      for (const db of dbs) {
        if (db.name && /unity|UnityCache/i.test(db.name)) {
          indexedDB.deleteDatabase(db.name);
        }
      }
    }
  } catch {
    /* ignore — not all browsers expose databases() */
  }
}

/**
 * Loads Unity WebGL from public/unity (Bump N Run → Build WebGL For Site).
 * Built to survive React remounts and ~60MB first downloads.
 */
export function UnityGame() {
  const hostRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(shared.progress);
  const [status, setStatus] = useState("Preparing…");
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(!!shared.instance);
  const [missing, setMissing] = useState(false);
  const [stalled, setStalled] = useState(false);
  const [retryKey, setRetryKey] = useState(0);
  /** Phones wait for a tap so a text-message browser doesn’t download 78MB and crash. */
  const [canBoot, setCanBoot] = useState(!!shared.instance);
  const [showPlayGate, setShowPlayGate] = useState(false);

  useEffect(() => {
    if (!canBoot && !ready) return;
    const host = hostRef.current;
    if (!host) return;
    const canvas = getPersistentCanvas();
    if (canvas.parentNode !== host) host.appendChild(canvas);

    let resizeTimer: ReturnType<typeof setTimeout> | undefined;
    const phone = isPhoneLike();
    const sync = (force = false) => fitCanvasToHost(canvas, host, { force });
    const relayout = () => {
      unlockCanvasSize(canvas);
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        sync(true);
        if (phone) {
          resizeTimer = setTimeout(() => lockCanvasSize(canvas), 400);
        }
      }, phone ? 200 : 80);
    };
    sync(true);
    if (phone && ready) lockCanvasSize(canvas);

    window.addEventListener("orientationchange", relayout);
    if (phone) {
      return () => {
        if (resizeTimer) clearTimeout(resizeTimer);
        window.removeEventListener("orientationchange", relayout);
      };
    }

    window.addEventListener("resize", relayout);
    const ro = new ResizeObserver(() => relayout());
    ro.observe(host);
    return () => {
      if (resizeTimer) clearTimeout(resizeTimer);
      window.removeEventListener("orientationchange", relayout);
      window.removeEventListener("resize", relayout);
      ro.disconnect();
    };
  }, [ready, canBoot]);

  useEffect(() => {
    if (shared.instance) {
      setCanBoot(true);
      setShowPlayGate(false);
      return;
    }
    if (isPhoneLike()) {
      setShowPlayGate(true);
      return;
    }
    setCanBoot(true);
  }, []);

  // While the Play button is on screen, pull the tiny loader (~40KB) so Play
  // can start the big download right away. Do not fetch the hole itself.
  useEffect(() => {
    if (!showPlayGate) return;
    let cancelled = false;
    (async () => {
      try {
        const manRes = await fetch(`${UNITY_BASE}/build.json?ts=${Date.now()}`, {
          cache: "no-store",
        });
        if (!manRes.ok || cancelled) return;
        const man = (await manRes.json()) as BuildManifest;
        if (!man.loader || cancelled) return;
        const bust = man.v || String(Date.now());
        const loaderPath = man.loader.startsWith("/")
          ? man.loader
          : `${UNITY_BASE}/${man.loader}`;
        await loadScript(withBust(loaderPath, bust));
      } catch {
        /* boot() loads the script again if this fails */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [showPlayGate]);

  useEffect(() => {
    if (!canBoot) return;

    let alive = true;
    let stallTimer: ReturnType<typeof setInterval> | undefined;
    let lastProgress = shared.progress;
    let lastBump = Date.now();

    const onProgress = (p: number) => {
      shared.progress = p;
      if (alive) {
        setProgress(p);
        setStatus(statusForProgress(p));
      }
      if (p > lastProgress + 0.002) {
        lastProgress = p;
        lastBump = Date.now();
        if (alive) setStalled(false);
      }
    };
    shared.listeners.add(onProgress);

    async function boot() {
      setError(null);
      setMissing(false);
      setStalled(false);
      if (!shared.instance) {
        setReady(false);
        setProgress(shared.progress);
        setStatus("Warming up the coffee…");
      }

      const manRes = await fetch(`${UNITY_BASE}/build.json?ts=${Date.now()}`, {
        cache: "no-store",
      }).catch(() => null);
      if (!manRes || !manRes.ok) {
        if (alive) setMissing(true);
        return;
      }

      const man = (await manRes.json()) as BuildManifest;
      if (!man.prefix || !man.loader) {
        if (alive) setMissing(true);
        return;
      }

      const bust = man.v || String(Date.now());

      // Already running this build — just attach UI.
      const bootKey = `${man.prefix}:${bust}:${retryKey}`;
      if (shared.instance && shared.key === bootKey) {
        if (alive) {
          setReady(true);
          setProgress(1);
          setStatus("Ready");
        }
        return;
      }

      const loaderPath = man.loader.startsWith("/")
        ? man.loader
        : `${UNITY_BASE}/${man.loader}`;
      await loadScript(withBust(loaderPath, bust));
      if (!alive) return;

      const createUnityInstance = await waitForCreateUnityInstance();
      if (!alive) return;

      const canvas = getPersistentCanvas();
      const host = hostRef.current;
      if (!host) throw new Error("Game canvas is missing");
      if (canvas.parentNode !== host) host.appendChild(canvas);
      fitCanvasToHost(canvas, host);

      const base = `${UNITY_BASE}/Build/${man.prefix}`;
      const ext = resolveAssetExt(man);
      const urls = assetUrls(base, ext);

      const config: UnityCreateConfig = {
        dataUrl: withBust(urls.dataUrl, bust),
        frameworkUrl: withBust(urls.frameworkUrl, bust),
        codeUrl: withBust(urls.codeUrl, bust),
        streamingAssetsUrl: `${UNITY_BASE}/StreamingAssets`,
        companyName: "BumpNRun",
        productName: "Bump N Run Game",
        productVersion: man.v || "0.1.0",
        // CRITICAL for iOS: Unity must NOT resize the drawing buffer every frame.
        // We set canvas.width/height ourselves in fitCanvasToHost and then lock them.
        matchWebGLToCanvasSize: false,
        devicePixelRatio: lockedDpr(),
        autoSyncPersistentDataPath: true,
        // Cheaper backbuffer so iPhone Safari is less likely to shrink it
        // while the camera moves (that shrink/grow is the bounce).
        webglContextAttributes: {
          preserveDrawingBuffer: false,
          powerPreference: 0,
          antialias: false,
          alpha: false,
          premultipliedAlpha: true,
        },
        showBanner: (msg, type) => {
          if (type === "error" && alive) setError(msg);
          else console[type === "warning" ? "warn" : "log"]("[Unity]", msg);
        },
      };

      // .unityweb downloads often sit at 0% until nearly done (~60MB). Surface that early.
      stallTimer = setInterval(() => {
        if (!alive || shared.instance) return;
        const waited = Date.now() - lastBump;
        if (waited > 8000 && shared.progress < 0.05 && alive) {
          setStatus("Big download on phones — bar may sit at 0% for a minute…");
        }
        if (waited > 90000) setStalled(true);
      }, 2000);

      const notify = (p: number) => {
        shared.progress = p;
        shared.listeners.forEach((fn) => fn(p));
      };

      // Single-flight: if a boot is already downloading, join it.
      if (!shared.promise || shared.key !== bootKey) {
        shared.key = bootKey;
        shared.progress = 0;
        notify(0);

        shared.promise = createUnityInstance(canvas, config, notify);
      }

      const instance = await shared.promise;
      shared.instance = instance;
      if (!alive) return;

      fitCanvasToHost(canvas, host, { force: true });
      lockCanvasSize(canvas);
      setReady(true);
      setProgress(1);
      setStatus("Ready");
      setStalled(false);

      // Phones: resume WebAudio on the first tap anywhere on the game.
      const unlockAudio = () => {
        try {
          const w = window as Window & {
            WEBAudio?: { audioContext?: { state: string; resume: () => void } };
          };
          const ctx = w.WEBAudio?.audioContext;
          if (ctx && ctx.state !== "running") void ctx.resume();
        } catch {
          /* ignore */
        }
        host.removeEventListener("pointerdown", unlockAudio);
        host.removeEventListener("touchstart", unlockAudio);
      };
      host.addEventListener("pointerdown", unlockAudio, { once: true });
      host.addEventListener("touchstart", unlockAudio, { once: true, passive: true });
    }

    boot().catch(async (e) => {
      shared.promise = null;
      shared.instance = null;
      if (!alive) return;
      const msg = e instanceof Error ? e.message : "Failed to load game";
      setError(msg);
      setStatus("Failed");
    });

    return () => {
      alive = false;
      shared.listeners.delete(onProgress);
      if (stallTimer) clearInterval(stallTimer);
      // Do NOT Quit here — React Strict Mode remounts in dev and would kill a
      // half-finished 60MB download. Quit on real page leave instead.
    };
  }, [retryKey, canBoot]);

  useEffect(() => {
    const quit = (event: PageTransitionEvent) => {
      // iPhone Safari fires pagehide when you switch apps or hide the URL bar.
      // Quitting there looks like the site “kicked you out.”
      if (isPhoneLike()) return;
      if (event.persisted) return;
      const inst = shared.instance;
      shared.instance = null;
      shared.promise = null;
      shared.key = "";
      if (inst) void inst.Quit().catch(() => undefined);
    };
    window.addEventListener("pagehide", quit);
    return () => window.removeEventListener("pagehide", quit);
  }, []);

  const onRetry = async () => {
    shared.instance = null;
    shared.promise = null;
    shared.key = "";
    shared.progress = 0;
    await clearUnityBrowserCaches();
    setError(null);
    setReady(false);
    setProgress(0);
    setRetryKey((k) => k + 1);
  };

  const pct = Math.round(progress * 100);

  const onStartPlay = () => {
    setShowPlayGate(false);
    setCanBoot(true);
  };

  return (
    <div ref={hostRef} className="absolute inset-0 overflow-hidden bg-black">
      {showPlayGate && !ready && !error && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-forest">
          <button
            type="button"
            onClick={onStartPlay}
            className="font-label rounded-md bg-[#f2c94c] px-8 py-3 text-xs font-bold uppercase text-ink shadow-[0_2px_0_rgba(0,0,0,0.25)]"
          >
            Play
          </button>
        </div>
      )}
      {!ready && !missing && !error && canBoot && (
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-3 bg-forest/92 px-6">
          <p className="font-label text-base uppercase text-cream/85">
            One moment…
          </p>
          <div className="h-1.5 w-[min(280px,70vw)] overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full bg-fairway-light transition-[width] duration-150"
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="text-sm text-cream/50">{pct}%</p>
          <p className="max-w-sm text-center text-base leading-relaxed text-cream/60">
            {status}
          </p>
          {stalled && (
            <div className="pointer-events-auto mt-2 flex flex-col items-center gap-2">
              <p className="max-w-sm text-center text-xs text-cream/70">
                Still setting up — hang tight…
              </p>
              <button
                type="button"
                onClick={() => void onRetry()}
                className="font-label rounded-sm border border-cream/30 px-4 py-1.5 text-[11px] uppercase tracking-[0.16em] text-cream"
              >
                Try again
              </button>
            </div>
          )}
        </div>
      )}

      {missing && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-forest px-6 text-center">
          <p className="font-label text-lg text-cream">Almost ready</p>
          <p className="max-w-md text-lg leading-relaxed text-cream/70">
            In Unity, click{" "}
            <span className="text-cream">Bump N Run → Build WebGL For Site</span>, wait for
            it to finish, then refresh this page.
          </p>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-forest px-6 text-center">
          <p className="text-sm text-red-200">Something went sideways</p>
          <p className="max-w-md text-xs text-cream/60">{error}</p>
          <button
            type="button"
            onClick={() => void onRetry()}
            className="font-label rounded-sm border border-cream/30 px-4 py-1.5 text-[11px] uppercase tracking-[0.16em] text-cream"
          >
            Try again
          </button>
        </div>
      )}
    </div>
  );
}
