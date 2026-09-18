// "use client" — harmless in this Vite app, required if this file is copied
// verbatim into the Next.js 16 App Router target (see PORT-SPEC.md). Every
// hook below touches browser-only APIs (matchMedia, ResizeObserver,
// IntersectionObserver, rAF), so this can never be a server component.
"use client";

import { useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from 'react';
import type { CSSProperties } from 'react';

/**
 * SpectraLoader — dependency-free port of the "Shield Bonds" animation.
 *
 * Plain React + requestAnimationFrame + inline styles only. No framer-motion,
 * no three.js, no react-spring — this file is copied verbatim into apps that
 * have none of those available.
 *
 * Per-frame animation values are written directly to DOM nodes held in refs;
 * React state is only used for coarse, infrequent UI transitions (reduced
 * motion, too-small fallback, visibility/intersection pausing, show/exit).
 * See `.knowledge/design/shield-bonds/PORT-SPEC.md` deviation (a).
 */

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export type SpectraLoaderVariant = 'fullscreen' | 'inline';

export interface SpectraLoaderProps {
  /** Controls mount/exit. Defaults to `true`. Flipping to `false` plays a
   *  ~350ms exit (fade + slight scale-up), then unmounts and calls `onExited`. */
  show?: boolean;
  /** `fullscreen` covers the viewport; `inline` fills its parent and seeds
   *  the animation clock at the Break cue so motion is visible immediately.
   *  Defaults to `fullscreen`. */
  variant?: SpectraLoaderVariant;
  /** Accessible label announced via the `aria-live="polite"` status region.
   *  Defaults to `"Loading"`. */
  label?: string;
  /** Called once the exit transition finishes and the component has removed
   *  its own DOM. Never called if `show` starts `false` (nothing to exit). */
  onExited?: () => void;
  /** Explicit pixel size for `variant="inline"` only — ignored for
   *  `fullscreen`. Sets the root's `width`/`height` to `${size}px` instead
   *  of the default fill-parent `100%`/`100%`, so inline call sites (e.g. a
   *  button) don't need a wrapper `div` just to give the loader a resolvable
   *  height. Also seeds the sub-`MIN_FRAGMENT_SIZE_PX` fallback decision
   *  with this same value, so `size` correctly selects `RingFallback` or the
   *  fragment shield immediately, before any `ResizeObserver` report.
   *  Omit to keep the existing fill-parent behaviour. */
  size?: number;
}

/** Below this rendered width (px) the 9-fragment shield is illegible; the
 *  host app's existing CSS ring spinner is rendered instead. */
export const MIN_FRAGMENT_SIZE_PX = 48;

/** Duration of the show=false exit transition, in milliseconds. */
export const EXIT_DURATION_MS = 350;

// ---------------------------------------------------------------------------
// Geometry + timing (ported verbatim from PORT-SPEC.md — do not retime/rescale)
// ---------------------------------------------------------------------------

interface FragGeom {
  x: number;
  y: number;
  w: number;
  h: number;
  cx: number;
  cy: number;
}

const FRAGS: FragGeom[] = [
  { x: 194, y: 41, w: 417, h: 532, cx: 348, cy: 239 },
  { x: 424, y: 147, w: 411, h: 333, cx: 670, cy: 304 },
  { x: 29, y: 173, w: 158, h: 437, cx: 114, cy: 388 },
  { x: 211, y: 323, w: 451, h: 466, cx: 429, cy: 563 }, // center diamond
  { x: 510, y: 373, w: 319, h: 366, cx: 710, cy: 542 },
  { x: 37, y: 553, w: 368, h: 233, cx: 169, cy: 698 },
  { x: 579, y: 648, w: 213, h: 390, cx: 680, cy: 835 },
  { x: 408, y: 672, w: 217, h: 452, cx: 509, cy: 915 },
  { x: 83, y: 804, w: 341, h: 291, cx: 281, cy: 918 },
];

const CX = 432;
const CYC = 575;
const CENTER = 3;

interface FragDerived {
  dx: number;
  dy: number;
  dist: number;
  rot: number;
  dOut: number;
  dBack: number;
  sc: number;
}

const DER: FragDerived[] = FRAGS.map((f, k) => {
  let dx = f.cx - CX;
  let dy = f.cy - CYC;
  const m = Math.hypot(dx, dy);
  if (m < 60) {
    dx = 0.22;
    dy = 0.98;
  } else {
    dx /= m;
    dy /= m;
  }
  return {
    dx,
    dy,
    dist: 155 + ((k * 67) % 85),
    rot: (k % 2 ? -1 : 1) * (8 + ((k * 31) % 13)),
    dOut: 0.045 * ((k * 5) % 9),
    dBack: 0.06 * ((k * 7) % 8),
    sc: k === CENTER ? 0.1 : 0.045,
  };
});

const EDGES: ReadonlyArray<readonly [number, number]> = [
  [3, 0], [3, 1], [3, 2], [3, 4], [3, 5], [3, 6], [3, 7], [3, 8],
  [0, 1], [1, 4], [4, 6], [6, 7], [7, 8], [8, 5], [5, 2], [2, 0],
];

const CYAN = '#35E9FD';
const S = 700 / 1184;
const LX = 960 - (864 * S) / 2;
const LY = 120;
const LCY = LY + 700 * (CYC / 1184);

// Stage authoring space. The original composition stage was 1920x1080 with
// overflow:hidden; deviation (b) scales this whole space to cover the
// measured container box (both axes, not just width) instead of hardcoding
// it into layout.
const STAGE_W = 1920;
const STAGE_H = 1080;

const CUES = { Break: 2.5, Reforge: 4.5 } as const; // Hold (7.5) dropped — only fed the removed wordmark
const AUTHORED_TOTAL = 9.5; // T loops in [0, 9.5)
const INTENSITY = 1.8; // "breakForce" TWEAK_DEFAULTS value, hardcoded (tweaks panel dropped)

// ---------------------------------------------------------------------------
// animate() / Easing — reimplemented (source used an editor-injected helper)
// ---------------------------------------------------------------------------

type EasingFn = (t: number) => number;

const easeOutCubic: EasingFn = (t) => 1 - Math.pow(1 - t, 3);

const easeOutBack: EasingFn = (t) => {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};

const easeInOutQuart: EasingFn = (t) => (t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2);

/** Clamped eased interpolation: `T <= start` -> from, `T >= end` -> to. */
function animate(T: number, from: number, to: number, start: number, end: number, ease: EasingFn): number {
  if (T <= start) return from;
  if (T >= end) return to;
  return from + (to - from) * ease((T - start) / (end - start));
}

// ---------------------------------------------------------------------------
// Per-frame computation (pure) — mirrors the source Piece() render body
// ---------------------------------------------------------------------------

interface FragFrame {
  px: number;
  py: number;
  rot: number;
  sc: number;
  x: number;
  y: number;
}

interface EdgeFrame {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  opacity: number;
}

interface NodeFrame {
  cx: number;
  cy: number;
  opacity: number;
}

interface Frame {
  frags: FragFrame[];
  edges: EdgeFrame[];
  nodes: NodeFrame[];
  bondStrokeWidth: number;
  nodeRadius: number;
  glow: number;
  shakeX: number;
  shakeY: number;
  scale: number;
  floatY: number;
  ring1Scale: number;
  ring1Opacity: number;
  ring2Scale: number;
  ring2Opacity: number;
  flashOpacity: number;
  outerGlowOpacity: number;
}

function computeFrame(T: number): Frame {
  const enter = (from: number, to: number, start: number, end: number) =>
    animate(T, from, to, start, end, easeOutCubic);
  const pop = (from: number, to: number, start: number, end: number) =>
    animate(T, from, to, start, end, easeOutBack);
  const settle = (from: number, to: number, start: number, end: number) =>
    animate(T, from, to, start, end, easeInOutQuart);

  const B = CUES.Break;
  const R = CUES.Reforge;
  const tBlast = B + 0.35;

  const e = settle(1, 0, 0.5, 1.7) + enter(0, 1, R + 2.1, R + 2.9);

  const frags: FragFrame[] = FRAGS.map((f, k) => {
    const d = DER[k];
    const out = pop(0, 1, tBlast + d.dOut, tBlast + d.dOut + 0.75);
    const back = settle(0, 1, R + 0.7 + d.dBack, R + 1.9 + d.dBack);
    const kk = out * (1 - back);
    const bob = Math.sin(T * 1.9 + k * 1.7) * 7 * kk;
    const px = d.dx * d.dist * INTENSITY * kk + (CX - f.cx) * 0.05 * e;
    const py = d.dy * d.dist * INTENSITY * kk + (CYC - f.cy) * 0.05 * e + bob;
    return { px, py, rot: d.rot * kk, sc: 1 + d.sc * kk, x: f.cx + px, y: f.cy + py };
  });

  const gSpike = enter(0, 0.9, B, B + 0.32) * (1 - enter(0, 1, tBlast + 0.05, tBlast + 0.55));
  const flashOpacity =
    enter(0, 1, tBlast - 0.06, tBlast + 0.07) * (1 - enter(0, 1, tBlast + 0.1, tBlast + 0.55));
  const glow = 0.22 + 0.7 * e + gSpike * 0.6;

  const u = (T - tBlast) / 0.6;
  const shk = u > 0 && u < 1 ? Math.pow(1 - u, 2) : 0;
  const shakeX = Math.sin(u * 34) * 15 * shk;
  const shakeY = Math.cos(u * 26) * 9 * shk;

  const cScale = 1 - 0.03 * (enter(0, 1, B, B + 0.33) * (1 - enter(0, 1, tBlast, tBlast + 0.5)));
  const scale = (1 + 0.055 * e) * cScale;
  const floatY = Math.sin((T * 2 * Math.PI * 3) / AUTHORED_TOTAL) * 9;

  const grow = enter(0, 1, R + 0.6, R + 1.5);
  const flare = enter(0, 1, R, R + 0.35) * (1 - enter(0, 1, R + 0.5, R + 1.2));
  const bondFade = 1 - enter(0, 1, R + 1.9, R + 2.5);
  const nodeIn = enter(0, 1, R, R + 0.35);

  const ring1Scale = 0.3 + 1.6 * enter(0, 1, tBlast, tBlast + 0.9);
  const ring1Opacity = 0.8 * (1 - enter(0, 1, tBlast + 0.05, tBlast + 0.85));
  const ring2Scale = 0.35 + 1.25 * enter(0, 1, R + 2.1, R + 3.0);
  const ring2Opacity = 0.7 * (1 - enter(0, 1, R + 2.2, R + 3.0));

  const bondStrokeWidth = 3 + 5 * grow + 2.5 * flare;
  const nodeRadius = 3.5 + 3 * grow + 2 * flare;
  const rawNodeOpacity = nodeIn * bondFade;
  const nodeOpacity = rawNodeOpacity > 0.01 ? 0.9 * rawNodeOpacity : 0;

  const edges: EdgeFrame[] = EDGES.map(([aIdx, bIdx], j) => {
    const p = enter(0, 1, R + 0.05 + j * 0.045, R + 0.45 + j * 0.045);
    const A = frags[aIdx];
    const Z = frags[bIdx];
    const x1 = A.x;
    const y1 = A.y;
    const x2 = A.x + (Z.x - A.x) * p;
    const y2 = A.y + (Z.y - A.y) * p;
    if (p <= 0.001) return { x1, y1, x2, y2, opacity: 0 };
    const rawOp = p * bondFade * (0.5 + 0.28 * Math.sin(T * 3.1 + j * 1.35) + 0.4 * flare);
    const clamped = Math.max(0, Math.min(1, rawOp));
    return { x1, y1, x2, y2, opacity: clamped <= 0.01 ? 0 : clamped };
  });

  const nodes: NodeFrame[] = frags.map((f) => ({ cx: f.x, cy: f.y, opacity: nodeOpacity }));

  const outerGlowOpacity = Math.min(1, 0.3 + 0.75 * e + gSpike);

  return {
    frags,
    edges,
    nodes,
    bondStrokeWidth,
    nodeRadius,
    glow,
    shakeX,
    shakeY,
    scale,
    floatY,
    ring1Scale,
    ring1Opacity,
    ring2Scale,
    ring2Opacity,
    flashOpacity,
    outerGlowOpacity,
  };
}

// T=0 is the canonical resting frame: kk=0 for every fragment (pre-blast,
// so nothing is displaced), e=1 (the entry pull that only settles to 0 by
// T=1.7), and every bond gate (`p`) is still at its pre-start `from` value,
// so bonds are invisible. This is exactly deviation (f)'s "assembled shield,
// e=1, bonds hidden" — computed once since it has no dependency on props.
const STATIC_FRAME: Frame = computeFrame(0);

// ---------------------------------------------------------------------------
// Imperative DOM writer (deviation a — no React state on the hot path)
// ---------------------------------------------------------------------------

interface RefsBundle {
  shakeFloat: HTMLDivElement | null;
  outerGlow: HTMLDivElement | null;
  ring1: HTMLDivElement | null;
  ring2: HTMLDivElement | null;
  stageFilter: HTMLDivElement | null;
  flash: HTMLDivElement | null;
  frags: (HTMLImageElement | null)[];
  lines: (SVGLineElement | null)[];
  nodes: (SVGCircleElement | null)[];
}

function applyFrame(refs: RefsBundle, frame: Frame): void {
  if (refs.shakeFloat) {
    refs.shakeFloat.style.transform =
      `translate(${frame.shakeX}px, ${frame.shakeY + frame.floatY}px) scale(${frame.scale})`;
  }
  if (refs.outerGlow) {
    refs.outerGlow.style.opacity = String(frame.outerGlowOpacity);
  }
  if (refs.ring1) {
    refs.ring1.style.transform = `scale(${frame.ring1Scale})`;
    refs.ring1.style.opacity = String(frame.ring1Opacity);
  }
  if (refs.ring2) {
    refs.ring2.style.transform = `scale(${frame.ring2Scale})`;
    refs.ring2.style.opacity = String(frame.ring2Opacity);
  }
  if (refs.stageFilter) {
    const blur = 18 + 30 * frame.glow;
    const alpha = Math.min(0.85, 0.2 + 0.55 * frame.glow);
    refs.stageFilter.style.filter = `drop-shadow(0 0 ${blur}px rgba(53,233,253,${alpha}))`;
  }
  if (refs.flash) {
    refs.flash.style.opacity = String(frame.flashOpacity);
  }

  for (let k = 0; k < frame.frags.length; k += 1) {
    const el = refs.frags[k];
    if (!el) continue;
    const f = frame.frags[k];
    el.style.transform = `translate(${f.px}px, ${f.py}px) rotate(${f.rot}deg) scale(${f.sc})`;
  }

  for (let j = 0; j < frame.edges.length; j += 1) {
    const el = refs.lines[j];
    if (!el) continue;
    const edge = frame.edges[j];
    el.setAttribute('x1', String(edge.x1));
    el.setAttribute('y1', String(edge.y1));
    el.setAttribute('x2', String(edge.x2));
    el.setAttribute('y2', String(edge.y2));
    el.setAttribute('stroke-width', String(frame.bondStrokeWidth));
    el.style.opacity = String(edge.opacity);
  }

  for (let k = 0; k < frame.nodes.length; k += 1) {
    const el = refs.nodes[k];
    if (!el) continue;
    const node = frame.nodes[k];
    el.setAttribute('cx', String(node.cx));
    el.setAttribute('cy', String(node.cy));
    el.setAttribute('r', String(frame.nodeRadius));
    el.style.opacity = String(node.opacity);
  }
}

/** Cover-scale the 1920x1080 stage against a measured `width`x`height`
 *  container — like CSS `object-fit: cover`, not `contain`: the larger of
 *  the two per-axis ratios wins, so the stage always fully covers the
 *  container (excess clipped by the container's `overflow: hidden`) and
 *  never letterboxes. The shield's visual centre in stage coordinates is
 *  (960, LCY) — not the stage's own centre (960, 540) — so both axes centre
 *  on that point, not on the stage midpoint. Called imperatively (mount,
 *  resize, shield-subtree remount); not part of the rAF hot path. */
function applyStageTransform(el: HTMLDivElement | null, width: number, height: number): void {
  if (!el) return;
  const scale = Math.max(width / STAGE_W, height / STAGE_H);
  el.style.transform = `scale(${scale})`;
  el.style.left = `${width / 2 - 960 * scale}px`;
  el.style.top = `${height / 2 - LCY * scale}px`;
}

// ---------------------------------------------------------------------------
// Static styles (module scope so they aren't reallocated every render)
// ---------------------------------------------------------------------------

const PIECE_STYLE: CSSProperties = {
  position: 'absolute',
  inset: 0,
  background: '#09080C',
  overflow: 'hidden',
  fontFamily: 'Barlow, sans-serif',
};

const BACKDROP_STYLE: CSSProperties = {
  position: 'absolute',
  inset: 0,
  background: 'radial-gradient(ellipse 60% 52% at 50% 44%, rgba(16,37,126,0.38), rgba(9,8,12,0) 70%)',
};

const SHAKE_FLOAT_STYLE: CSSProperties = {
  position: 'absolute',
  inset: 0,
  transformOrigin: `960px ${LCY}px`,
};

const OUTER_GLOW_STYLE: CSSProperties = {
  position: 'absolute',
  left: 960 - 430,
  top: LCY - 430,
  width: 860,
  height: 860,
  borderRadius: '50%',
  background: 'radial-gradient(circle, rgba(53,233,253,0.16), rgba(1,171,255,0.06) 45%, rgba(9,8,12,0) 70%)',
};

const RING_BASE_STYLE: CSSProperties = {
  position: 'absolute',
  left: 960 - 260,
  top: LCY - 260,
  width: 520,
  height: 520,
  borderRadius: '50%',
};

const RING1_STYLE: CSSProperties = {
  ...RING_BASE_STYLE,
  border: '2px solid rgba(53,233,253,0.9)',
  boxShadow: '0 0 40px rgba(53,233,253,0.5)',
};

const RING2_STYLE: CSSProperties = {
  ...RING_BASE_STYLE,
  border: '2px solid rgba(53,233,253,0.8)',
  boxShadow: '0 0 30px rgba(53,233,253,0.4)',
};

const STAGE_FILTER_STYLE: CSSProperties = {
  position: 'absolute',
  left: LX,
  top: LY,
  width: 864,
  height: 1184,
  transform: `scale(${S})`,
  transformOrigin: '0 0',
};

const FLASH_STYLE: CSSProperties = {
  position: 'absolute',
  inset: 0,
  background: `radial-gradient(circle at 50% ${(LCY / 1080) * 100}%, rgba(213,247,255,0.95), rgba(53,233,253,0.4) 30%, rgba(9,8,12,0) 62%)`,
};

const FULLSCREEN_ROOT_STYLE: CSSProperties = {
  position: 'fixed',
  inset: 0,
  width: '100vw',
  height: '100vh',
  zIndex: 9999,
  // The cover-scaled stage below intentionally overhangs its container on
  // one axis (see applyStageTransform) — clip it here.
  overflow: 'hidden',
};

const INLINE_ROOT_STYLE: CSSProperties = {
  position: 'relative',
  width: '100%',
  height: '100%',
  // The cover-scaled stage below intentionally overhangs its container on
  // one axis (see applyStageTransform) — clip it here.
  overflow: 'hidden',
};

// No `aspect-ratio` here (deliberately dropped): that would fit/letterbox
// the stage to a 16:9 box instead of covering the container's real,
// possibly non-16:9, box. `width`/`height: 100%` fill whatever box the root
// above already resolved to; `overflow: hidden` is belt-and-suspenders with
// the root's own `overflow: hidden`, scoped one level tighter.
const STAGE_BOX_STYLE: CSSProperties = {
  position: 'relative',
  width: '100%',
  height: '100%',
  overflow: 'hidden',
};

const SCALED_STAGE_STYLE: CSSProperties = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: STAGE_W,
  height: STAGE_H,
  transformOrigin: 'top left',
};

// ---------------------------------------------------------------------------
// Reduced-motion / SSR helpers
// ---------------------------------------------------------------------------

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

// PORT DEVIATION (Next.js target only — see CLAUDE.md Lesson #065): the
// original Vite source read `window.matchMedia(...).matches` inside a lazy
// `useState` initializer, which runs during render on the client too. Under
// SSR/hydration that lets the client's *first* render disagree with the
// server-rendered markup whenever the visitor's OS actually has reduced
// motion enabled (server always renders the `false` default) — the `glow`/
// `transition` inline styles read `reducedMotion` unconditionally on every
// render, not just post-mount, so this was a real hydration mismatch, not a
// theoretical one. Swapped for `useSyncExternalStore(subscribe, getSnapshot,
// getServerSnapshot)`, this app's existing SSR-safe primitive (see
// `src/components/ui/MotionGate.tsx`): `getServerSnapshot` pins the SSR/first
// hydration pass to `false`, and the store's subscription picks up the real
// value plus live changes immediately after.
function subscribeReducedMotion(callback: () => void): () => void {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return () => {};
  const mql = window.matchMedia(REDUCED_MOTION_QUERY);
  if (typeof mql.addEventListener === 'function') {
    mql.addEventListener('change', callback);
    return () => mql.removeEventListener('change', callback);
  }
  // Legacy Safari < 14.
  type LegacyMediaQueryList = MediaQueryList & {
    addListener: (listener: (e: MediaQueryListEvent) => void) => void;
    removeListener: (listener: (e: MediaQueryListEvent) => void) => void;
  };
  const legacyMql = mql as LegacyMediaQueryList;
  legacyMql.addListener(callback);
  return () => legacyMql.removeListener(callback);
}

function getReducedMotionSnapshot(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false;
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

function getReducedMotionServerSnapshot(): boolean {
  return false;
}

// useLayoutEffect warns ("does nothing on the server") when this file is
// rendered by the Next.js target during SSR — fall back to useEffect there.
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

// ---------------------------------------------------------------------------
// Ring fallback (deviation e) — matches this app's existing spinner styling
// ---------------------------------------------------------------------------

// The ring's colours are driven by inline `style`, not Tailwind colour
// utilities. `border-muted` / `border-t-primary` only resolve when the
// *consuming app's* tailwind.config aliases `muted`/`primary` to
// `hsl(var(--muted))` / `hsl(var(--primary))` (the shadcn pattern) — one of
// this file's three target apps (`Frontend/Target BC`) does neither
// (`primary` there is a bare 50…900 shade scale with no `DEFAULT` key, and
// there is no `muted` key at all), so Tailwind's JIT never generates those
// classes there and the ring rendered with no border colour.
//
// `--muted` / `--primary` themselves ARE plain CSS custom properties,
// already defined in every target app's global stylesheet — but, per the
// shadcn convention (see this file's own app's `src/index.css`, e.g.
// `--primary: 200 100% 50%;`), each holds an *unwrapped* "H S L" triplet
// that's only a valid colour once wrapped as `hsl(var(--primary))`. They're
// read the same way here, with an "H S L" fallback rather than a bare hex
// string: a var() fallback is only substituted when the referenced custom
// property is itself undefined. `--muted`/`--primary` ARE defined in all
// three target apps, so if the fallback were a bare hex nested inside
// `hsl(...)` (i.e. `hsl(var(--primary, #35E9FD))`), the *defined* triplet
// would substitute in instead of the fallback, `hsl(200 100% 50%)` would
// still resolve fine, but a genuinely undefined token would produce
// `hsl(#35E9FD)` — invalid at computed-value time, which reverts to the
// property's initial value rather than to the hex fallback. Keeping the
// fallback in the same "H S L" shape sidesteps that footgun while still
// preferring each host's live theme (light/dark mode included) when present.
const RING_TRACK_COLOR = 'hsl(var(--muted, 0 0% 100%) / 0.14)'; // fallback: low-alpha white, reads on the dark stage
const RING_ACTIVE_COLOR = 'hsl(var(--primary, 186 98% 60%))'; // fallback: #35E9FD brand cyan

function RingFallback() {
  return (
    <div
      data-testid="spectra-loader-ring"
      style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      <div
        className="animate-spin rounded-full border-2"
        style={{
          width: 'min(100%, 32px)',
          height: 'min(100%, 32px)',
          // Four explicit longhands rather than `borderColor` + a
          // `borderTopColor` override — mixing the `border-color` shorthand
          // with a longhand override, both holding `var(...)` values, is
          // fine per spec but is unreliable across at least one real CSSOM
          // implementation (jsdom's `cssstyle`, used by this repo's own test
          // suite, silently drops one of the two declarations). Longhands
          // only avoids relying on shorthand/longhand merge behaviour at all.
          borderTopColor: RING_ACTIVE_COLOR,
          borderRightColor: RING_TRACK_COLOR,
          borderBottomColor: RING_TRACK_COLOR,
          borderLeftColor: RING_TRACK_COLOR,
        }}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

type Phase = 'mounted' | 'exiting' | 'unmounted';

export function SpectraLoader({
  show = true,
  variant = 'fullscreen',
  label = 'Loading',
  onExited,
  size,
}: SpectraLoaderProps) {
  // `size` only applies to the inline variant — a stray `size` alongside
  // `variant="fullscreen"` must have zero effect (not even on the
  // tooSmall/lastSize seeding below).
  const inlineSize = variant === 'inline' ? size : undefined;

  const rootRef = useRef<HTMLDivElement | null>(null);
  const scaledStageRef = useRef<HTMLDivElement | null>(null);
  // Cover-scale needs both axes (not just width) — see applyStageTransform.
  // Seeded from `inlineSize` on both axes (the inline root is square when
  // `size` is given) so the very first paint, before ResizeObserver's first
  // report, already covers correctly instead of flashing scale 0.
  const lastSizeRef = useRef<{ width: number; height: number }>({
    width: inlineSize ?? 0,
    height: inlineSize ?? 0,
  });
  const domRefs = useRef<RefsBundle>({
    shakeFloat: null,
    outerGlow: null,
    ring1: null,
    ring2: null,
    stageFilter: null,
    flash: null,
    frags: new Array<HTMLImageElement | null>(FRAGS.length).fill(null),
    lines: new Array<SVGLineElement | null>(EDGES.length).fill(null),
    nodes: new Array<SVGCircleElement | null>(FRAGS.length).fill(null),
  });

  // See the PORT DEVIATION comment above `subscribeReducedMotion` — this
  // replaces the source's lazy-`useState` + manual-listener `useEffect` pair
  // with `useSyncExternalStore` so SSR/first hydration always resolve `false`.
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot,
  );
  // Seeded from `inlineSize` (when given) so an explicit `size` feeds the
  // same tooSmall/shield-vs-ring decision as the ResizeObserver path,
  // synchronously — no flash of the wrong branch before the observer's
  // first report. `ResizeObserver` (below) remains the source of truth once
  // it fires, for both the fill-parent case and any subsequent resize.
  const [tooSmall, setTooSmall] = useState<boolean>(() =>
    inlineSize !== undefined ? inlineSize < MIN_FRAGMENT_SIZE_PX : false,
  );
  const [docHidden, setDocHidden] = useState<boolean>(() =>
    typeof document !== 'undefined' ? document.hidden : false,
  );
  const [intersecting, setIntersecting] = useState<boolean>(true);

  // show / exit state machine (deviation c)
  const [phase, setPhase] = useState<Phase>(() => (show ? 'mounted' : 'unmounted'));
  const exitTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const onExitedRef = useRef(onExited);

  useEffect(() => {
    onExitedRef.current = onExited;
  }, [onExited]);

  useEffect(() => {
    if (show) {
      if (exitTimerRef.current !== undefined) {
        clearTimeout(exitTimerRef.current);
        exitTimerRef.current = undefined;
      }
      // PORT DEVIATION (Next.js target only): this app's `eslint-plugin-react-hooks`
      // (v7, the React Compiler-aligned "set-state-in-effect" rule) flags any
      // synchronous `setState` in an effect body as a possible cascading
      // render. Here it's a false positive, not a bug: `phase` is already
      // seeded to `'mounted'` by the lazy `useState` initializer above for
      // the common case, so this call is a same-value no-op React bails out
      // of (Object.is). It only does real work re-entering `'mounted'` after
      // an in-flight exit — i.e. `show` flips false -> true again — which
      // also requires the imperative `clearTimeout` right above it, so this
      // can't be pushed into render (a pure function can't cancel a pending
      // timer as a side effect). Restructuring the state machine to satisfy
      // the rule would risk changing the exit-timing behaviour of a file
      // that's shared verbatim across three apps; scoping the suppression to
      // this one call is the smaller, safer change.
      setPhase('mounted');
      return;
    }
    setPhase((prev) => (prev === 'unmounted' ? prev : 'exiting'));
  }, [show]);

  useEffect(() => {
    if (phase !== 'exiting') return;
    const duration = reducedMotion ? 0 : EXIT_DURATION_MS;
    exitTimerRef.current = setTimeout(() => {
      setPhase('unmounted');
      onExitedRef.current?.();
    }, duration);
    return () => {
      if (exitTimerRef.current !== undefined) clearTimeout(exitTimerRef.current);
    };
  }, [phase, reducedMotion]);

  const isPresent = phase !== 'unmounted';

  // prefers-reduced-motion (deviation f) — now sourced from the
  // `useSyncExternalStore` call above; no separate effect needed here.

  // document.visibilitychange pause (deviation g)
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const handleVisibility = () => setDocHidden(document.hidden);
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  // IntersectionObserver pause (deviation g)
  useEffect(() => {
    if (!isPresent) return;
    const root = rootRef.current;
    if (!root || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0];
      if (entry) setIntersecting(entry.isIntersecting);
    });
    observer.observe(root);
    return () => observer.disconnect();
  }, [isPresent]);

  // Container-relative cover-scaling + sub-48px fallback (deviations b, e)
  useEffect(() => {
    if (!isPresent) return;
    const root = rootRef.current;
    if (!root || typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const { width, height } = entry.contentRect;
      lastSizeRef.current = { width, height };
      // Keyed off the smaller axis — the container is no longer guaranteed
      // to be wider than it is tall now that the stage cover-scales.
      setTooSmall(Math.min(width, height) < MIN_FRAGMENT_SIZE_PX);
      applyStageTransform(scaledStageRef.current, width, height);
    });
    observer.observe(root);
    return () => observer.disconnect();
  }, [isPresent]);

  // Re-apply the last known cover-scale transform whenever the shield
  // subtree (re)mounts — ResizeObserver only fires on an actual size
  // change, not on this remount.
  useIsomorphicLayoutEffect(() => {
    if (tooSmall) return;
    applyStageTransform(scaledStageRef.current, lastSizeRef.current.width, lastSizeRef.current.height);
  }, [tooSmall]);

  // Paint the canonical resting frame synchronously before first browser
  // paint — correct immediately under reduced motion, and a safe default for
  // the ~16ms before the rAF loop's first tick otherwise.
  useIsomorphicLayoutEffect(() => {
    if (tooSmall) return;
    applyFrame(domRefs.current, STATIC_FRAME);
  }, [tooSmall, reducedMotion]);

  // The rAF loop itself (deviation a). Never scheduled under reduced motion,
  // the sub-48px fallback, a hidden document, or an off-screen container.
  const shouldAnimate = isPresent && !reducedMotion && !tooSmall && !docHidden && intersecting;

  useEffect(() => {
    if (!shouldAnimate) return;
    let frameId = 0;
    const seedSeconds = variant === 'inline' ? CUES.Break : 0;
    const startTime = performance.now() - seedSeconds * 1000;
    const tick = (now: number) => {
      const elapsed = (now - startTime) / 1000;
      const T = ((elapsed % AUTHORED_TOTAL) + AUTHORED_TOTAL) % AUTHORED_TOTAL;
      applyFrame(domRefs.current, computeFrame(T));
      frameId = requestAnimationFrame(tick);
    };
    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [shouldAnimate, variant]);

  if (!isPresent) return null;

  const exiting = phase === 'exiting';
  const exitDuration = reducedMotion ? 0 : EXIT_DURATION_MS;

  const rootStyle: CSSProperties =
    variant === 'fullscreen'
      ? FULLSCREEN_ROOT_STYLE
      : inlineSize !== undefined
        ? { ...INLINE_ROOT_STYLE, width: inlineSize, height: inlineSize }
        : INLINE_ROOT_STYLE;

  return (
    <div
      ref={rootRef}
      role="status"
      aria-live="polite"
      data-testid="spectra-loader"
      style={rootStyle}
    >
      <span className="sr-only">{label}</span>
      {tooSmall ? (
        <RingFallback />
      ) : (
        <div
          style={{
            width: '100%',
            height: '100%',
            opacity: exiting ? 0 : 1,
            transform: exiting ? 'scale(1.06)' : 'scale(1)',
            transition: exitDuration
              ? `opacity ${exitDuration}ms ease, transform ${exitDuration}ms ease`
              : 'none',
          }}
        >
          <div style={STAGE_BOX_STYLE}>
            <div ref={scaledStageRef} style={SCALED_STAGE_STYLE}>
              <div data-testid="spectra-loader-shield" style={PIECE_STYLE}>
                <div style={BACKDROP_STYLE} />
                <div ref={(el) => { domRefs.current.shakeFloat = el; }} style={SHAKE_FLOAT_STYLE}>
                  <div ref={(el) => { domRefs.current.outerGlow = el; }} style={OUTER_GLOW_STYLE} />
                  <div ref={(el) => { domRefs.current.ring1 = el; }} style={RING1_STYLE} />
                  <div ref={(el) => { domRefs.current.ring2 = el; }} style={RING2_STYLE} />
                  <div ref={(el) => { domRefs.current.stageFilter = el; }} style={STAGE_FILTER_STYLE}>
                    {FRAGS.map((f, k) => (
                      <img
                        key={k}
                        ref={(el) => { domRefs.current.frags[k] = el; }}
                        src={`/shield-bonds/frag_${k}.webp`}
                        alt=""
                        style={{
                          position: 'absolute',
                          left: f.x,
                          top: f.y,
                          width: f.w,
                          height: f.h,
                          willChange: 'transform',
                        }}
                      />
                    ))}
                    <svg
                      viewBox="0 0 864 1184"
                      width={864}
                      height={1184}
                      aria-hidden="true"
                      style={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        overflow: 'visible',
                        filter: 'drop-shadow(0 0 7px rgba(53,233,253,0.85))',
                      }}
                    >
                      {EDGES.map(([aIdx, bIdx], j) => (
                        <line
                          key={j}
                          ref={(el) => { domRefs.current.lines[j] = el; }}
                          stroke={CYAN}
                          strokeLinecap="round"
                          x1={FRAGS[aIdx].cx}
                          y1={FRAGS[aIdx].cy}
                          x2={FRAGS[bIdx].cx}
                          y2={FRAGS[bIdx].cy}
                          opacity={0}
                        />
                      ))}
                      {FRAGS.map((f, k) => (
                        <circle
                          key={k}
                          ref={(el) => { domRefs.current.nodes[k] = el; }}
                          cx={f.cx}
                          cy={f.cy}
                          r={0}
                          fill={CYAN}
                          opacity={0}
                        />
                      ))}
                    </svg>
                  </div>
                </div>
                <div ref={(el) => { domRefs.current.flash = el; }} style={FLASH_STYLE} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SpectraLoader;
