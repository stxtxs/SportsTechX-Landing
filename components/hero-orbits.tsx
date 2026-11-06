'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { fitOrbits, placeOnTrack, type Fit, type Rect, type Scene } from '@/lib/orbit-geometry';

export type HeroPill = {
  label: string;
  icon: string;
  /** Glyph size on the artboard; the set is not uniform. */
  w: number;
  h: number;
  /** 1 = Founders/Investors, 2 = sports ecosystem, 3 = commercial. */
  orbit: 1 | 2 | 3;
};

/**
 * Motif ring radii as a share of the motif radius (from epicentre-motif.svg):
 * the Founders ring, the sports ring halfway out, the Media ring, then two
 * faint outer halo rings.
 */
const RING = [133.75, 286.75, 439.75, 580.75, 791.75].map((r) => r / 793);

type OrbitSpec = {
  lg: readonly number[];
  sm: readonly number[];
  /** 1 is clockwise. */
  dir: 1 | -1;
  /** Seconds per revolution. */
  period: number;
  /** Moves in step with this orbit instead of on its own clock. */
  lockedTo?: number;
};

/**
 * The three orbits, in priority order. `lg`/`sm` list motif rings per
 * breakpoint, preferred first, with a backup the fitter can step out to when
 * the preferred ring has no room (a short laptop, a tall tablet). On phones
 * the innermost ring is too tight for two pills round the logo, so the
 * preferred rings start one further out.
 *
 * Media and Corporates ride the third ring and travel with the sports orbit
 * (anticlockwise), spaced so the two never meet; turning the other way at
 * their own speed they would collide at the sides.
 *
 * Periods are the brief's 80s / 110s slowed by 20% (speed x0.8).
 */
/**
 * Founders and Investors' last resort on cramped screens (small phones, short
 * laptops), where the inner ring is too tight round the logo and the next
 * ring runs into the buttons. No ring is drawn here; it is where the motif's
 * second ring used to be.
 */
const INNER_FALLBACK = 225.75 / 793;

const ORBITS: OrbitSpec[] = [
  { lg: [RING[0], RING[1], INNER_FALLBACK], sm: [RING[1], INNER_FALLBACK, RING[2]], dir: 1, period: 100 },
  { lg: [RING[1], RING[2]], sm: [RING[2], RING[3]], dir: -1, period: 137.5 },
  { lg: [RING[2], RING[3], RING[4]], sm: [RING[3], RING[4]], dir: -1, period: 137.5, lockedTo: 1 },
];

/** The orbit whose clock drives this one. */
const leaderOf = (o: number) => ORBITS[o].lockedTo ?? o;

/**
 * Phones can't fit the sports and commercial orbits in full, so there the six
 * grey pills share one rotating orbit instead: two or three slots (as many as
 * fit cleanly) that cycle through all six names. Each time a slot's pill wraps
 * it comes back as the next name in the queue, and the name it showed goes to
 * the back, so every name appears before any repeats.
 *
 * It moves in step with Founders and Investors (locked to their orbit): a
 * phone is too narrow for two independent orbits to pass at the sides, but
 * pills that travel together never meet. Hovering any pill pauses both.
 */
const ROTATING = {
  // Drawn rings first. On small phones (~375 and narrower) nothing fits on
  // them: the stacked buttons block the top and the screen edges the sides, so
  // the last resort is the narrow band just outside Founders and Investors.
  rings: [RING[1], RING[2], RING[3], 0.32, 0.3],
  slots: [3, 2],
  /** The Founders orbit, whose clock and direction the rotating one follows. */
  leader: 0,
};

/** The logo's box in the motif, relative to its centre, as a share of radius. */
const LOGO = { l: -26 / 793, r: 26 / 793, t: -66 / 793, b: 14 / 793 };
/** Clear space around the copy, logo and frame edges, in px. */
const AVOID_MARGIN = 12;
const LOGO_MARGIN = 6;
const EDGE = 8;
/** Keeps pills out from under the fixed nav bar. */
const NAV_CLEAR = 92;

function inflate(r: DOMRect | Rect, by: number, origin: DOMRect): Rect {
  const box = 'left' in r ? { l: r.left - origin.left, t: r.top - origin.top, r: r.right - origin.left, b: r.bottom - origin.top } : r;
  return { l: box.l - by, t: box.t - by, r: box.r + by, b: box.b + by };
}

/** Line boxes for text, the whole box for anything else. */
function avoidRects(el: Element, origin: DOMRect): Rect[] {
  if (el.matches('h1, p')) {
    const range = document.createRange();
    range.selectNodeContents(el);
    return [...range.getClientRects()].map((r) => inflate(r, AVOID_MARGIN, origin));
  }
  return [inflate(el.getBoundingClientRect(), AVOID_MARGIN, origin)];
}

/** `rotating`: the phone fallback, with fit.tracks = [Founders orbit, rotating orbit]. */
type Layout = { scene: Scene; fit: Fit; rotating?: { slots: number } };

function measure(layer: HTMLElement, pills: HTMLElement[], meta: HeroPill[]): Layout | null {
  const section = layer.closest('section');
  const motif = section?.querySelector('[data-orbit-motif]');
  if (!section || !motif) return null;

  const origin = layer.getBoundingClientRect();
  const m = motif.getBoundingClientRect();
  const R = m.width / 2;
  const cx = m.left + R - origin.left;
  const cy = m.top + R - origin.top;

  const logo: Rect = {
    l: cx + LOGO.l * R - LOGO_MARGIN,
    r: cx + LOGO.r * R + LOGO_MARGIN,
    t: cy + LOGO.t * R - LOGO_MARGIN,
    b: cy + LOGO.b * R + LOGO_MARGIN,
  };
  const avoid = [logo, ...[...section.querySelectorAll('[data-orbit-avoid]')].flatMap((el) => avoidRects(el, origin))];
  const scene: Scene = {
    cx,
    cy,
    bounds: { l: EDGE, t: NAV_CLEAR, r: origin.width - EDGE, b: origin.height - EDGE },
    avoid,
  };

  const lg = window.matchMedia('(min-width: 64rem)').matches;
  const sizeOf = (els: HTMLElement[]) => ({
    w: Math.max(...els.map((p) => p.offsetWidth)),
    h: Math.max(...els.map((p) => p.offsetHeight)),
  });
  const orbits = ORBITS.map((spec, o) => {
    const mine = pills.filter((_, i) => meta[i].orbit === o + 1);
    return {
      radii: (lg ? spec.lg : spec.sm).map((share) => share * R),
      count: mine.length,
      lockedTo: spec.lockedTo,
      pill: sizeOf(mine),
    };
  });
  const fit = fitOrbits(scene, orbits);
  if (fit.tracks.every(Boolean)) return { scene, fit };

  // Not every orbit fits (phones): rotate all six grey names through the
  // slots that do, most slots first, so none of them is left out.
  const grey = pills.filter((_, i) => meta[i].orbit !== 1);
  for (const slots of ROTATING.slots) {
    const rotating = fitOrbits(scene, [
      orbits[0],
      {
        radii: ROTATING.rings.map((share) => share * R),
        count: slots,
        pill: sizeOf(grey),
        lockedTo: ROTATING.leader,
      },
    ]);
    if (rotating.tracks[1]) return { scene, fit: rotating, rotating: { slots } };
  }
  return { scene, fit };
}

/**
 * The eight category pills, each on its orbit round the motif. Positions are
 * worked out in lib/orbit-geometry.ts; this component measures the page, runs
 * the clock and moves the pills with transforms.
 */
export function HeroOrbits({ pills }: { pills: HeroPill[] }) {
  const layerRef = useRef<HTMLDivElement>(null);
  const slotRefs = useRef<HTMLSpanElement[]>([]);
  const pillRefs = useRef<HTMLSpanElement[]>([]);
  /** Which orbit the pointer is resting on, if any. */
  const hovered = useRef<number | null>(null);
  /** Whether the phone's rotating layout is in use (every pill shares one clock). */
  const rotatingNow = useRef(false);

  useEffect(() => {
    const layer = layerRef.current;
    if (!layer) return;
    // Drop refs left over from a longer pill list.
    slotRefs.current.length = pills.length;
    pillRefs.current.length = pills.length;
    const slots = slotRefs.current;
    const pillEls = pillRefs.current;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

    // Each pill's orbit, and its index among that orbit's pills.
    const slotOf = pills.map((p, i) => ({
      orbit: p.orbit - 1,
      index: pills.slice(0, i).filter((q) => q.orbit === p.orbit).length,
    }));

    let layout: Layout | null = null;
    // Per-orbit clock in seconds, and how fast it is running (0-1), so a
    // hover can bring an orbit to rest and back without a jump.
    const clock = ORBITS.map(() => 0);
    const speed = ORBITS.map(() => 1);
    let raf = 0;
    let last = 0;
    let onScreen = true;
    let disposed = false;
    /** What the last layout was measured from, to skip identical refits. */
    let measuredFor = '';

    // The rotating orbit's queue: pill indices in content order. `shown[k]` is
    // the pill in slot k, `waiting` the rest in turn, `at[k]` the stretch slot
    // k was last on, so a change means it just wrapped.
    const greyPills = pills.map((p, i) => (p.orbit === 1 ? -1 : i)).filter((i) => i >= 0);
    let rotation: { shown: number[]; waiting: number[]; at: (number | undefined)[] } | null = null;
    const resetRotation = (slots: number) => {
      rotation = { shown: greyPills.slice(0, slots), waiting: greyPills.slice(slots), at: [] };
    };

    const hide = (slot: HTMLElement) => {
      slot.style.opacity = '0';
      slot.style.visibility = 'hidden';
    };
    const show = (slot: HTMLElement, x: number, y: number, scale: number, opacity: number) => {
      slot.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) scale(${scale})`;
      slot.style.opacity = opacity.toFixed(3);
      slot.style.visibility = opacity < 0.02 ? 'hidden' : 'visible';
    };

    const placeRotating = () => {
      if (!layout || !rotation) return;
      const { scene, fit } = layout;
      const still = reduced.matches;
      const track = fit.tracks[1];
      // The grey pills not in a slot right now stay hidden.
      greyPills.forEach((i) => {
        if (!rotation!.shown.includes(i)) hide(slots[i]);
      });
      if (!track) return;
      const spec = ORBITS[ROTATING.leader];
      const leadTrack = fit.tracks[ROTATING.leader];
      const ratio = leadTrack ? track.length / leadTrack.length : 1;
      const travel = still ? 0 : (spec.dir * 360 * clock[ROTATING.leader] * ratio) / spec.period;
      rotation.shown.forEach((_, k) => {
        const { deg, opacity, stretch } = placeOnTrack(track, track.rest + track.offsets[k] + travel);
        // Wrapped onto a new stretch: hand the slot to the next name in the
        // queue and send the one it showed to the back. The pill is faded out
        // at this point, so the swap is never seen.
        const r = rotation!;
        if (!still && r.at[k] !== undefined && r.at[k] !== stretch && r.waiting.length > 0) {
          hide(slots[r.shown[k]]);
          r.waiting.push(r.shown[k]);
          r.shown[k] = r.waiting.shift()!;
        }
        r.at[k] = stretch;
        const x = scene.cx + track.r * Math.cos((deg * Math.PI) / 180);
        const y = scene.cy + track.r * Math.sin((deg * Math.PI) / 180);
        show(slots[r.shown[k]], x, y, fit.scale, opacity);
      });
    };

    const place = () => {
      if (!layout) return;
      const { scene, fit } = layout;
      const still = reduced.matches;
      if (layout.rotating) {
        // Founders and Investors as usual; the grey pills through the queue.
        slots.forEach((slot, i) => {
          if (slotOf[i].orbit !== 0) return;
          const track = fit.tracks[0];
          if (!track) return hide(slot);
          const travel = still ? 0 : (ORBITS[0].dir * 360 * clock[0]) / ORBITS[0].period;
          const { deg, opacity } = placeOnTrack(track, track.rest + track.offsets[slotOf[i].index] + travel);
          show(slot, scene.cx + track.r * Math.cos((deg * Math.PI) / 180), scene.cy + track.r * Math.sin((deg * Math.PI) / 180), fit.scale, opacity);
        });
        placeRotating();
        return;
      }
      slots.forEach((slot, i) => {
        const { orbit, index } = slotOf[i];
        const track = fit.tracks[orbit];
        if (!track) return hide(slot);
        // A locked orbit covers its track in the leader's time, so both wrap
        // together: same clock, scaled by the two track lengths.
        const lead = leaderOf(orbit);
        const leadTrack = fit.tracks[lead];
        const ratio = lead !== orbit && leadTrack ? track.length / leadTrack.length : 1;
        const travel = still ? 0 : (ORBITS[lead].dir * 360 * clock[lead] * ratio) / ORBITS[lead].period;
        const { deg, opacity } = placeOnTrack(track, track.rest + track.offsets[index] + travel);
        const x = scene.cx + track.r * Math.cos((deg * Math.PI) / 180);
        const y = scene.cy + track.r * Math.sin((deg * Math.PI) / 180);
        show(slot, x, y, fit.scale, opacity);
      });
    };

    const frame = (now: number) => {
      // Capped so a stall or a return from a background tab can't fling pills
      // along; 0.1s keeps true speed on devices down to 10fps.
      const dt = last ? Math.min(0.1, (now - last) / 1000) : 0;
      last = now;
      // The theme toggle snapshots the page; nothing may move meanwhile.
      if (!document.documentElement.hasAttribute('data-swapping')) {
        ORBITS.forEach((_, o) => {
          const target = hovered.current === o ? 0 : 1;
          speed[o] += (target - speed[o]) * Math.min(1, dt * 8);
          clock[o] += dt * speed[o];
        });
      }
      place();
      raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (raf || reduced.matches || !onScreen) return;
      last = 0;
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    const relayout = () => {
      if (disposed) return;
      // Mount, the first resize notice and fonts.ready often all see the same
      // page; a fit is not free, so only redo it when something moved.
      const section = layer.closest('section')?.getBoundingClientRect();
      const copy = [...(layer.closest('section')?.querySelectorAll('[data-orbit-avoid]') ?? [])]
        .map((el) => el.getBoundingClientRect())
        .map((r) => `${Math.round(r.left)},${Math.round(r.top)},${Math.round(r.width)},${Math.round(r.height)}`);
      const key = [section?.width, section?.height, ...copy].join('|');
      if (key !== measuredFor || !layout) {
        measuredFor = key;
        layout = measure(layer, pillEls, pills);
        const slotsNow = layout?.rotating?.slots ?? 0;
        if (!slotsNow) rotation = null;
        else if (!rotation || rotation.shown.length !== slotsNow) resetRotation(slotsNow);
        // A pill that just lost its orbit can't receive pointerleave; let go.
        const held = hovered.current;
        const stillShown = layout?.rotating
          ? held === ROTATING.leader
          : layout?.fit.tracks.some((t, o) => t && leaderOf(o) === held);
        rotatingNow.current = Boolean(layout?.rotating);
        if (held !== null && !stillShown) {
          hovered.current = null;
          layer.removeAttribute('data-hover');
          pillEls.forEach((el) => el.removeAttribute('data-active'));
        }
      }
      place();
      layer.dataset.ready = '';
    };

    let debounce = 0;
    const scheduleRelayout = () => {
      window.clearTimeout(debounce);
      debounce = window.setTimeout(relayout, 120);
    };
    const resizeObserver = new ResizeObserver(scheduleRelayout);
    const section = layer.closest('section');
    if (section) resizeObserver.observe(section);
    // Backup for browsers that hold resize observations while a page is
    // hidden; a window resize always arrives.
    window.addEventListener('resize', scheduleRelayout);

    const visibility = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      if (onScreen) start();
      else stop();
    });
    visibility.observe(layer);

    const onMotionChange = () => {
      stop();
      place();
      start();
    };
    reduced.addEventListener('change', onMotionChange);

    relayout();
    start();
    // Web fonts change the copy's line boxes, which the orbits avoid.
    document.fonts?.ready.then(() => relayout());

    return () => {
      disposed = true;
      stop();
      window.clearTimeout(debounce);
      resizeObserver.disconnect();
      window.removeEventListener('resize', scheduleRelayout);
      visibility.disconnect();
      reduced.removeEventListener('change', onMotionChange);
    };
  }, [pills]);

  const enter = (i: number) => {
    // A locked pair pauses together, so hovering either holds both.
    hovered.current = rotatingNow.current ? ROTATING.leader : leaderOf(pills[i].orbit - 1);
    layerRef.current?.setAttribute('data-hover', '');
    pillRefs.current[i]?.setAttribute('data-active', '');
  };
  const leave = (i: number) => {
    hovered.current = null;
    layerRef.current?.removeAttribute('data-hover');
    pillRefs.current[i]?.removeAttribute('data-active');
  };

  return (
    // Faded in once the first layout lands, so pills never flash at 0,0.
    // -z-20 keeps them above the motif and below the copy.
    <div
      ref={layerRef}
      className="group/orbits pointer-events-none absolute inset-0 -z-20 opacity-0 transition-opacity duration-700 data-[ready]:opacity-100"
    >
      {pills.map((pill, i) => {
        const primary = pill.orbit === 1;
        return (
          <span
            key={pill.label}
            ref={(el) => {
              if (el) slotRefs.current[i] = el;
            }}
            className="absolute top-0 left-0 opacity-0 will-change-transform"
          >
            <span
              ref={(el) => {
                if (el) pillRefs.current[i] = el;
              }}
              onPointerEnter={() => enter(i)}
              onPointerLeave={() => leave(i)}
              className={cn(
                // Not a link, so it must not look like one.
                'pointer-events-auto inline-flex cursor-default items-center justify-center rounded-full font-mono whitespace-nowrap select-none',
                'shadow-pill tracking-[0.1em]',
                'transition-[opacity,scale,box-shadow] duration-300 ease-out',
                // Hover: the pill lifts and glows; the rest step back a little.
                'group-data-[hover]/orbits:opacity-60 data-[active]:!opacity-100',
                'motion-safe:data-[active]:scale-[1.08]',
                primary
                  ? 'h-[24px] gap-[7px] border-[1.5px] border-accent bg-white text-[11px] text-accent-2 lg:h-[31px] lg:border-2 lg:text-[14px] dark:bg-surface'
                  : // Grey orbits run ~12% smaller than the magenta pair.
                    'h-[21px] gap-[6px] border-[1.5px] border-pill-border bg-[#d9d9d9]/12 px-[12px] text-[10px] text-pill-fg lg:h-[27px] lg:border-2 lg:px-[15px] lg:text-[12px]',
                primary && (pill.label === 'INVESTORS' ? 'w-[116px] lg:w-[134px]' : 'w-[112px] lg:w-[130px]'),
                primary
                  ? 'data-[active]:shadow-[0_0_0_4px_rgb(237_26_94/0.12),0_6px_16px_rgb(0_0_0/0.12)]'
                  : 'data-[active]:shadow-[0_0_0_4px_rgb(130_130_130/0.12),0_6px_16px_rgb(0_0_0/0.10)]'
              )}
            >
              <Image
                src={pill.icon}
                alt=""
                width={pill.w}
                height={pill.h}
                // Only the grey glyphs flip for dark; inverting the magenta pair
                // would turn it teal.
                className={cn('shrink-0', !primary && 'dark:invert')}
              />
              {pill.label}
            </span>
          </span>
        );
      })}
    </div>
  );
}
