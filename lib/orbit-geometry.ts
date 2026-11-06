/**
 * Geometry for the hero's orbiting pills.
 *
 * Each orbit is a circle around the motif centre. Only part of it can show a
 * pill: the lower half falls below the hero, and the upper part of the larger
 * rings runs behind the headline and buttons. So for each orbit we work out
 * the stretches ("segments") where a pill fits without leaving the hero or
 * touching anything it must avoid, and join them end to end into one track.
 *
 * A pill moves along that track at the orbit's true angular speed. Reaching the
 * end of one segment, it fades out and fades back in at the start of the next,
 * which is the seamless wrap the brief asks for. Pills on one orbit sit at
 * fixed offsets along the track (see chooseOffsets), so they can never
 * overtake or collide.
 *
 * Angles are degrees in screen space (y down), so increasing angle is
 * clockwise and -90 is the top of the circle. Tracks are read from 90 (the
 * bottom, always hidden) round to 450, so no segment straddles the seam.
 */

export type Rect = { l: number; t: number; r: number; b: number };

export type Size = { w: number; h: number };

export type OrbitInput = {
  /** Candidate radii in px, preferred first. */
  radii: number[];
  /** Largest pill on this orbit, before scaling. */
  pill: Size;
  /** How many pills share the orbit. */
  count: number;
  /**
   * Index of an earlier orbit this one moves in step with. Locked orbits
   * cover their tracks in the same time as the leader, so both wrap together
   * and their spacing repeats exactly; that lets two neighbouring rings that
   * would otherwise cross (opposite directions) never meet.
   */
  lockedTo?: number;
};

export type Track = {
  r: number;
  segments: [number, number][];
  /** Total visible length in degrees. */
  length: number;
};

export type Scene = {
  cx: number;
  cy: number;
  /** Where a pill may sit, fully inside. */
  bounds: Rect;
  /** What a pill must never touch. */
  avoid: Rect[];
};

/** Clear space kept between any two pills, in px. */
export const PILL_GAP = 10;
/** Arc length over which a pill fades at a segment end, in px. */
export const FADE_PX = 28;
/** Pill sizes tried, largest first, before an orbit is dropped. */
export const FIT_SCALES = [1, 0.92, 0.85, 0.8];

const STEP_DEG = 0.5;
const RAD = Math.PI / 180;

/** A pill as placed: its centre and size. Pills are fully rounded capsules. */
export type Placed = { x: number; y: number; w: number; h: number };

export function pillAt(cx: number, cy: number, r: number, deg: number, size: Size): Placed {
  return { x: cx + r * Math.cos(deg * RAD), y: cy + r * Math.sin(deg * RAD), w: size.w, h: size.h };
}

/** True when two capsules come closer than `gap`. Each is a horizontal
 * segment (its straight middle) swept by a circle of radius h/2. */
export function pillsTouch(a: Placed, b: Placed, gap = 0): boolean {
  const ah = Math.max(0, a.w / 2 - a.h / 2);
  const bh = Math.max(0, b.w / 2 - b.h / 2);
  const dx = Math.max(0, a.x - ah - (b.x + bh), b.x - bh - (a.x + ah));
  const dy = Math.abs(a.y - b.y);
  return Math.hypot(dx, dy) < (a.h + b.h) / 2 + gap;
}

/** Clear space between two capsules, in px (negative when they overlap). */
function pillGap(a: Placed, b: Placed): number {
  const ah = Math.max(0, a.w / 2 - a.h / 2);
  const bh = Math.max(0, b.w / 2 - b.h / 2);
  const dx = Math.max(0, a.x - ah - (b.x + bh), b.x - bh - (a.x + ah));
  return Math.hypot(dx, a.y - b.y) - (a.h + b.h) / 2;
}

/** True when a capsule touches a rectangle. */
export function pillTouchesRect(p: Placed, r: Rect): boolean {
  const half = Math.max(0, p.w / 2 - p.h / 2);
  const dx = Math.max(0, r.l - (p.x + half), p.x - half - r.r);
  const dy = Math.max(0, r.t - p.y, p.y - r.b);
  return Math.hypot(dx, dy) < p.h / 2;
}

function inside(p: Placed, box: Rect): boolean {
  return p.x - p.w / 2 >= box.l && p.x + p.w / 2 <= box.r && p.y - p.h / 2 >= box.t && p.y + p.h / 2 <= box.b;
}

/** The fade length in degrees for a ring of radius r. */
export function fadeDeg(r: number): number {
  return (FADE_PX / r) / RAD;
}

/** Finds the stretches of a ring where a pill of this size fits. */
export function buildTrack(scene: Scene, r: number, size: Size): Track {
  const { cx, cy, bounds, avoid } = scene;
  const fits = (deg: number) => {
    const pill = pillAt(cx, cy, r, deg, size);
    return inside(pill, bounds) && !avoid.some((a) => pillTouchesRect(pill, a));
  };

  // A segment shorter than two fades would be all fade and no pill.
  const minLength = 2.5 * fadeDeg(r);
  const segments: [number, number][] = [];
  let start: number | null = null;
  for (let deg = 90; deg <= 450; deg += STEP_DEG) {
    const ok = fits(deg);
    if (ok && start === null) start = deg;
    if ((!ok || deg + STEP_DEG > 450) && start !== null) {
      const end = ok ? deg : deg - STEP_DEG;
      if (end - start >= minLength) segments.push([start, end]);
      start = null;
    }
  }
  // 90 and 450 are the same point (the bottom of the ring). If an arc runs
  // through it, join its two halves so the pill passes straight through.
  if (segments.length > 1 && segments[0][0] <= 90 && segments[segments.length - 1][1] >= 450 - STEP_DEG) {
    const [first] = segments.splice(0, 1);
    segments[segments.length - 1][1] = first[1] + 360;
  }
  const length = segments.reduce((sum, [a, b]) => sum + (b - a), 0);
  return { r, segments, length };
}

/**
 * Where a pill is at track position `pos` (degrees along the track, any value;
 * it wraps). Returns the ring angle, an opacity for the segment-end fade, and
 * `stretch`: which segment it is on, counted across laps, so a caller can tell
 * the moment a pill wraps to a new stretch even if a frame skips the fade.
 */
export function placeOnTrack(track: Track, pos: number): { deg: number; opacity: number; stretch: number } {
  const { segments, length } = track;
  if (length <= 0) return { deg: -90, opacity: 0, stretch: 0 };
  const lap = Math.floor(pos / length) * segments.length;
  let p = pos - Math.floor(pos / length) * length;
  const fade = fadeDeg(track.r);
  for (let i = 0; i < segments.length; i++) {
    const [a, b] = segments[i];
    const span = b - a;
    if (p <= span) {
      const edge = Math.min(p, span - p);
      const t = Math.min(1, edge / fade);
      // smoothstep, so the fade has no hard corner at either end
      return { deg: a + p, opacity: t * t * (3 - 2 * t), stretch: lap + i };
    }
    p -= span;
  }
  const [, last] = segments[segments.length - 1];
  return { deg: last, opacity: 0, stretch: lap + segments.length - 1 };
}

function scaled(size: Size, k: number): Size {
  return { w: size.w * k, h: size.h * k };
}

/** Every place a pill on this track can be, for collision checks. */
function sweep(scene: Scene, track: Track, size: Size): Placed[] {
  const places: Placed[] = [];
  // Steps of at most 4px of travel, so no near-miss slips between samples.
  const step = Math.min(1, 4 / track.r / RAD);
  for (const [a, b] of track.segments) {
    for (let deg = a; deg <= b; deg += step) places.push(pillAt(scene.cx, scene.cy, track.r, deg, size));
  }
  return places;
}

type Placer = (pos: number) => { deg: number; opacity: number };

/** placeOnTrack, cached at quarter-degree steps: the fitter asks a lot. */
function cachedPlacer(track: Track): Placer {
  const perDeg = 4;
  const n = Math.max(1, Math.ceil(track.length * perDeg));
  const cache: ({ deg: number; opacity: number } | undefined)[] = new Array(n);
  return (pos) => {
    const p = ((pos % track.length) + track.length) % track.length;
    const i = Math.min(n - 1, Math.round(p * perDeg));
    return (cache[i] ??= placeOnTrack(track, i / perDeg));
  };
}

/** True when pills at these track offsets never touch one another. */
function keepsApart(scene: Scene, track: Track, size: Size, offsets: number[], at: Placer): boolean {
  for (let pos = 0; pos < track.length; pos += 1) {
    const places = offsets.map((d) => pillAt(scene.cx, scene.cy, track.r, at(pos + d).deg, size));
    for (let i = 0; i < places.length; i++) {
      for (let j = i + 1; j < places.length; j++) if (pillsTouch(places[i], places[j], PILL_GAP)) return false;
    }
  }
  return true;
}

/** How visible a set of pills stays as it travels the whole track. */
function visibility(track: Track, offsets: number[], at: Placer = cachedPlacer(track)): { least: number; mean: number } {
  let least = Infinity;
  let total = 0;
  let samples = 0;
  for (let pos = 0; pos < track.length; pos += 1) {
    let shown = 0;
    for (const d of offsets) {
      const { opacity } = at(pos + d);
      if (opacity >= 0.5) shown++;
      total += opacity;
    }
    least = Math.min(least, shown);
    samples++;
  }
  return { least, mean: total / Math.max(1, samples * offsets.length) };
}

/** Nudges tried on each pill's even spacing, as a share of that spacing. */
const NUDGES = [0, -0.15, 0.15, -0.3, 0.3];

function nudgeSets(count: number): number[][] {
  let sets: number[][] = [[0]];
  for (let k = 1; k < count; k++) sets = sets.flatMap((set) => NUDGES.map((n) => [...set, n]));
  return sets;
}

/**
 * Picks where each pill sits along the track. They start evenly spaced, but
 * when a track is two equal arcs, even spacing makes pills reach their wrap
 * points together and vanish at once. So small fixed nudges are tried, and the
 * set that keeps the most pills showing at every moment wins, preferring the
 * most even. The offsets never change while running, so pills keep a fixed
 * separation and cannot overtake. Null when no set keeps them apart.
 */
function chooseOffsets(scene: Scene, track: Track, size: Size, count: number): number[] | null {
  const spacing = track.length / count;
  const at = cachedPlacer(track);
  const ranked = nudgeSets(count)
    .map((nudges) => {
      const offsets = nudges.map((n, k) => (k + n) * spacing);
      const spread = nudges.reduce((sum, n) => sum + Math.abs(n), 0);
      return { offsets, spread, ...visibility(track, offsets, at) };
    })
    .sort((a, b) => b.least - a.least || a.spread - b.spread || b.mean - a.mean);
  for (const candidate of ranked) {
    if (keepsApart(scene, track, size, candidate.offsets, at)) return candidate.offsets;
  }
  return null;
}

/**
 * The starting shift that shows every pill best: used as the first frame, and
 * as the whole picture under reduced motion.
 */
function restingShift(track: Track, offsets: number[]): number {
  const at = cachedPlacer(track);
  let best = 0;
  let bestScore = -Infinity;
  for (let shift = 0; shift < track.length; shift += 1) {
    const opacities = offsets.map((d) => at(shift + d).opacity);
    const score = Math.min(...opacities) * 10 + opacities.reduce((a, b) => a + b, 0);
    if (score > bestScore) {
      bestScore = score;
      best = shift;
    }
  }
  return best;
}

/** True when no pill on track A can ever touch a pill on track B. */
function neverMeet(a: Placed[], b: Placed[]): boolean {
  for (const pa of a) for (const pb of b) if (pillsTouch(pa, pb, PILL_GAP)) return false;
  return true;
}

/** A track with its pills placed: one offset per pill, and a resting shift. */
export type PlacedTrack = Track & { offsets: number[]; rest: number };

export type Fit = {
  scale: number;
  /** One per orbit input; null where the orbit had to be dropped. */
  tracks: (PlacedTrack | null)[];
};

type Option = { track: PlacedTrack; places: Placed[]; least: number; size: Size } | null;

/**
 * For an orbit locked to a leader: the shift along its own track that keeps
 * every one of its pills clear of every leader pill through a whole cycle,
 * choosing the shift with the most room. Null when no shift stays clear.
 */
function lockedShift(scene: Scene, lead: NonNullable<Option>, mine: NonNullable<Option>): number | null {
  const a = lead.track;
  const b = mine.track;
  const atA = cachedPlacer(a);
  const atB = cachedPlacer(b);
  const steps = Math.ceil(Math.max(a.length, b.length));
  // Leader pill places over one cycle don't depend on the shift: work them out once.
  const leadPlaces = Array.from({ length: steps }, (_, n) =>
    a.offsets.map((d) => {
      const { deg, opacity } = atA(a.rest + d + (n / steps) * a.length);
      return { pill: pillAt(scene.cx, scene.cy, a.r, deg, lead.size), opacity };
    })
  );
  let best: number | null = null;
  let bestRoom = PILL_GAP;
  for (let shift = 0; shift < b.length; shift += 1) {
    let room = Infinity;
    for (let n = 0; n < steps && room >= bestRoom; n++) {
      for (const d of b.offsets) {
        const { deg, opacity } = atB(shift + d + (n / steps) * b.length);
        if (opacity < 0.02) continue;
        const pill = pillAt(scene.cx, scene.cy, b.r, deg, mine.size);
        for (const other of leadPlaces[n]) {
          if (other.opacity >= 0.02) room = Math.min(room, pillGap(pill, other.pill));
        }
      }
    }
    if (room >= bestRoom) {
      bestRoom = room;
      best = shift;
    }
  }
  return best;
}

/** Pills an orbit must always keep showing to pass the strict standard. */
function needShown(count: number): number {
  return count >= 3 ? count - 1 : Math.min(1, count);
}

/** Every choice of one candidate radius per orbit, most preferred first. */
function radiusChoices(orbits: OrbitInput[]): number[][] {
  let choices: number[][] = [[]];
  for (const orbit of orbits) {
    choices = choices.flatMap((c) => orbit.radii.map((_, k) => [...c, k]));
  }
  return choices.sort((a, b) => a.reduce((s, k) => s + k, 0) - b.reduce((s, k) => s + k, 0));
}

/**
 * Fits the orbits into the scene. Orbits come in priority order: the first
 * (Founders and Investors) is never dropped.
 *
 * In order of preference it tries: every orbit showing and meeting the
 * visibility standard, then every orbit showing at all, then the same with
 * the lowest-priority orbit dropped, and so on. Within each, layouts closest
 * to the design come first: one step down in pill size counts as 1, moving an
 * orbit to its backup ring as 1.5. Pills never overlap in any accepted layout.
 */
export function fitOrbits(scene: Scene, orbits: OrbitInput[]): Fit {
  const options = new Map<string, Option>();
  const option = (i: number, k: number, scale: number): Option => {
    const key = `${i}:${k}:${scale}`;
    if (options.has(key)) return options.get(key)!;
    const size = scaled(orbits[i].pill, scale);
    const track = buildTrack(scene, orbits[i].radii[k], size);
    const offsets = track.length > 0 ? chooseOffsets(scene, track, size, orbits[i].count) : null;
    const result: Option = offsets
      ? {
          track: { ...track, offsets, rest: restingShift(track, offsets) },
          places: sweep(scene, track, size),
          least: visibility(track, offsets).least,
          size,
        }
      : null;
    options.set(key, result);
    return result;
  };
  const meets = new Map<string, boolean>();
  const locks = new Map<string, number | null>();
  const apart = (a: string, ta: PlacedTrack, pa: Placed[], b: string, tb: PlacedTrack, pb: Placed[]) => {
    const key = `${a}|${b}`;
    if (!meets.has(key)) {
      // Rings further apart than two pills' reach can never meet: skip the scan.
      const [ea, eb] = [pa[0], pb[0]];
      const reach = ea && eb ? Math.hypot((ea.w + eb.w) / 2, (ea.h + eb.h) / 2) + PILL_GAP : 0;
      meets.set(key, Math.abs(ta.r - tb.r) >= reach || neverMeet(pa, pb));
    }
    return meets.get(key)!;
  };

  const choices = radiusChoices(orbits);
  for (let showing = orbits.length; showing >= 1; showing--) {
    // Choices that differ only in dropped orbits are the same layout.
    const seen = new Set<string>();
    const mine = choices.map((c) => c.slice(0, showing)).filter((c) => !seen.has(c.join()) && seen.add(c.join()));
    const attempts = mine
      .flatMap((choice) => FIT_SCALES.map((scale, step) => ({ choice, scale, cost: step + 1.5 * choice.reduce((a, k) => a + k, 0) })))
      .sort((a, b) => a.cost - b.cost);
    for (const strict of [true, false]) {
      for (const { choice, scale } of attempts) {
        const picked = choice.map((k, i) => option(i, k, scale));
        if (picked.some((o) => !o)) continue;
        const live = picked as NonNullable<Option>[];
        if (strict && live.some((o, i) => o.least < needShown(orbits[i].count))) continue;
        let clear = true;
        const shifts = new Map<number, number>();
        for (let i = 0; i < live.length && clear; i++) {
          for (let j = i + 1; j < live.length && clear; j++) {
            if (orbits[j].lockedTo === i) {
              const key = `lock:${i}:${choice[i]}:${j}:${choice[j]}:${scale}`;
              if (!locks.has(key)) locks.set(key, lockedShift(scene, live[i], live[j]));
              const shift = locks.get(key)!;
              clear = shift !== null;
              if (shift !== null) shifts.set(j, shift);
              continue;
            }
            clear = apart(
              `${i}:${choice[i]}:${scale}`,
              live[i].track,
              live[i].places,
              `${j}:${choice[j]}:${scale}`,
              live[j].track,
              live[j].places
            );
          }
        }
        if (!clear) continue;
        return {
          scale,
          tracks: orbits.map((_, i) => {
            if (i >= showing) return null;
            const shift = shifts.get(i);
            return shift === undefined ? live[i].track : { ...live[i].track, rest: shift };
          }),
        };
      }
    }
  }
  // Nothing fits even Founders and Investors without overlap: show none
  // rather than let them collide.
  return { scale: FIT_SCALES[FIT_SCALES.length - 1], tracks: orbits.map(() => null) };
}
