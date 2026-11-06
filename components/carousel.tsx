'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Horizontal scroller with arrow controls, and an optional continuous drift.
 *
 * Scroll-snap does the work for manual use; the arrows page by roughly one
 * viewport. No carousel dependency — native overflow scrolling already gives
 * touch, trackpad and keyboard behaviour for free.
 *
 * With `autoScroll` the children are rendered twice and the scroll position
 * wraps at the halfway mark, which is what makes the loop seamless. Snap and
 * CSS smooth-scrolling are switched off in that mode: snap would keep yanking
 * the track back to a card edge, and `scroll-behavior: smooth` would animate
 * every one of the ~60 tiny writes a second. Drift pauses on hover and on focus
 * so it can't fight someone reading or tabbing through, and never starts at all
 * under `prefers-reduced-motion`.
 */
/* 50, not 24: at 24 the rail crawls, and a crawl driven by a per-frame
   scrollLeft write is what reads as stutter rather than as motion. Matches
   the Atlas marquee so the three sites drift at the same rate. */
const DRIFT_PX_PER_SEC = 50;

/**
 * The track's cards, in order. Looping copies sit in `display: contents`
 * wrappers, which have no box, so their children are the real flex items; and
 * the 1px hairlines between cards are flex items too, so they are skipped.
 */
function cardItems(track: HTMLElement): HTMLElement[] {
  const items: HTMLElement[] = [];
  for (const child of Array.from(track.children) as HTMLElement[]) {
    if (getComputedStyle(child).display === 'contents') items.push(...(Array.from(child.children) as HTMLElement[]));
    else items.push(child);
  }
  return items.filter((el) => el.offsetWidth > 2);
}

export function Carousel({
  children,
  className,
  trackClassName,
  arrowClassName,
  label,
  autoScroll,
  autoAdvance,
  initialOffset = 0,
  alwaysLoop,
}: {
  children: React.ReactNode;
  className?: string;
  trackClassName?: string;
  arrowClassName?: string;
  label: string;
  /** 'ltr' drifts the cards left-to-right, 'rtl' the other way. */
  autoScroll?: 'ltr' | 'rtl';
  /**
   * Discrete auto-advance instead of a continuous drift: every N ms the rail
   * pages forward by one view (the same move an arrow press makes), smoothly,
   * and loops. Pauses on hover/focus. For the testimonials, which should step
   * one story-pair at a time rather than crawl. Mutually exclusive with
   * `autoScroll`.
   */
  autoAdvance?: number;
  /** Starting scroll position, used for the artboard's staggered second row. */
  initialOffset?: number;
  /**
   * Drift even when the cards already fit the rail.
   *
   * For the built-in placeholder set, which IS the designed full rail. Uploaded
   * cards get the opposite treatment: a short list stays still, because
   * everything is already visible and there is nothing to scroll to.
   */
  alwaysLoop?: boolean;
}) {
  const track = useRef<HTMLDivElement>(null);
  const paused = useRef(false);
  const resumeAt = useRef<number | null>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(true);
  /**
   * One copy of the children already fills the rail.
   *
   * Without this an `autoScroll` rail whose content fits still rendered two
   * copies and still ran the rAF loop — but `scrollLeft` is clamped to 0 when
   * there is no overflow, so the rail sat dead while duplicating every card.
   */
  const [fits, setFits] = useState(false);
  const looping = Boolean(autoScroll || autoAdvance) && (alwaysLoop || !fits);

  useEffect(() => {
    if (!autoScroll && !autoAdvance) return;
    const el = track.current;
    if (!el) return;
    const measure = () => {
      // scrollWidth covers every copy on the track, and clamps up to clientWidth
      // when the content is narrower — which is exactly the stable fixed point
      // we want once the rail has gone static.
      const contentW = el.scrollWidth / (looping ? 2 : 1);
      // "Fits" has to mean there is room for ANOTHER card. A rail left with a
      // sliver of slack still reads as full, and a full rail that refuses to
      // move looks broken. The widest flex item stands in for one card — the
      // hairline rules between cards are a pixel wide, so max() finds the card.
      // (display:contents wrappers have no box, so their children are the items.)
      const items: HTMLElement[] = [];
      for (const child of Array.from(el.children) as HTMLElement[]) {
        if (getComputedStyle(child).display === 'contents') {
          items.push(...(Array.from(child.children) as HTMLElement[]));
        } else {
          items.push(child);
        }
      }
      const cardW = items.reduce((max, i) => Math.max(max, i.offsetWidth), 0);
      setFits(el.clientWidth - contentW >= cardW);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [autoScroll, looping]);

  const sync = useCallback(() => {
    const el = track.current;
    if (!el || looping) return; // a looping track has no start or end
    setAtStart(el.scrollLeft <= 1);
    // 1px of slack: sub-pixel widths otherwise leave the end permanently unreached.
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 1);
  }, [looping]);

  useEffect(() => {
    sync();
    const el = track.current;
    if (!el) return;
    const observer = new ResizeObserver(sync);
    observer.observe(el);
    return () => observer.disconnect();
  }, [sync]);

  useEffect(() => {
    const el = track.current;
    // Continuous drift only — autoAdvance also loops, but it steps on a timer
    // (below) rather than crawling every frame, so it must NOT run here.
    if (!el || !looping || !autoScroll) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    el.scrollLeft = initialOffset || 1;
    const dir = autoScroll === 'ltr' ? -1 : 1;
    let raf = 0;
    let last = performance.now();
    // The position is accumulated here rather than read back from scrollLeft
    // each frame. At 24px/s a frame advances only 0.4px, and the browser rounds
    // the stored scroll offset — so reading it back re-quantised the value to
    // the same integer every frame and the track never moved at all.
    let pos = el.scrollLeft;

    const tick = (now: number) => {
      const dt = Math.min(now - last, 100) / 1000; // clamp after a background tab
      last = now;
      // data-swapping: the theme ripple is snapshotting the page, and scroll
      // writes during that are pure cost — see theme-toggle.tsx.
      if (paused.current || document.documentElement.hasAttribute('data-swapping')) {
        pos = el.scrollLeft; // pick up wherever the arrows or a drag left it
      } else {
        const half = el.scrollWidth / 2;
        pos += dir * DRIFT_PX_PER_SEC * dt;
        if (pos <= 0) pos += half;
        else if (pos >= half) pos -= half;
        el.scrollLeft = pos;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [looping, autoScroll, initialOffset]);

  /**
   * One card per press, smoothly, as on Playmakers. The step is measured from
   * the first two cards rather than assumed, so it is the real pitch including
   * the gap and the hairline, at every breakpoint. Paging by a share of the
   * track width moved several cards at once and lost the reader's place.
   */
  const page = useCallback((dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    // The continuous drift rewrites scrollLeft every frame, so a smooth scroll
    // started here would be overwritten before it travelled — hold the drift
    // while it settles. There is no drift under autoAdvance, so nothing to hold.
    if (autoScroll) {
      paused.current = true;
      if (resumeAt.current) window.clearTimeout(resumeAt.current);
      resumeAt.current = window.setTimeout(() => {
        paused.current = false;
      }, 800);
    }
    const [a, b] = cardItems(el);
    const delta = dir * (a && b ? b.offsetLeft - a.offsetLeft : a ? a.offsetWidth : el.clientWidth);
    if (looping) {
      // The track carries two copies, so jumping by exactly one is invisible.
      // Without this a page near either end just clamped.
      const half = el.scrollWidth / 2;
      if (el.scrollLeft + delta < 0) el.scrollLeft += half;
      else if (el.scrollLeft + delta > el.scrollWidth - el.clientWidth) el.scrollLeft -= half;
    }
    el.scrollBy({ left: delta, behavior: 'smooth' });
  }, [autoScroll, looping]);

  // Discrete auto-advance: page forward one view on a timer (the same move an
  // arrow press makes), pausing on hover/focus and under reduced motion. This is
  // the "step by step, not continuous" testimonial behaviour.
  useEffect(() => {
    if (!autoAdvance || !looping) return;
    const el = track.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (el.scrollLeft <= 0) el.scrollLeft = 1; // seed so the loop can wrap left too
    const id = window.setInterval(() => {
      if (paused.current || document.documentElement.hasAttribute('data-swapping')) return;
      page(1);
    }, autoAdvance);
    return () => window.clearInterval(id);
  }, [autoAdvance, looping, page]);

  // Plain callbacks rather than a curried hold(true) factory: that factory was
  // *called* during render, so react-hooks/refs flagged it as a ref access in
  // the render pass even though the write itself only happens on the event.
  const pause = useCallback(() => {
    paused.current = true;
  }, []);
  const resume = useCallback(() => {
    paused.current = false;
  }, []);

  useEffect(() => () => {
    if (resumeAt.current) window.clearTimeout(resumeAt.current);
  }, []);

  return (
    <div className={cn('relative', className)}>
      <div
        ref={track}
        onScroll={sync}
        onPointerEnter={pause}
        onPointerLeave={resume}
        onFocusCapture={pause}
        onBlurCapture={resume}
        role="group"
        aria-label={label}
        tabIndex={0}
        className={cn(
          'flex overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
          // A continuous drift rewrites scrollLeft every frame, so snap would keep
          // yanking it back. A stepping rail (autoAdvance) moves one view at a time,
          // so it snaps too: a phone swipe lands on a whole card, never half-way.
          // No CSS scroll-smooth while looping: the wrap jump must be instant;
          // page() passes behavior:'smooth' itself.
          looping && autoScroll ? 'overscroll-x-contain'
            : looping ? 'snap-x snap-mandatory overscroll-x-contain'
            : 'snap-x snap-mandatory scroll-smooth',
          // Static but still an auto-scroll rail: everything is visible, so
          // centre it rather than leaving it hugging the left edge.
          autoScroll && !looping && 'justify-center',
          trackClassName
        )}
      >
        {children}
        {/* Second pass makes the wrap seamless; hidden from assistive tech. */}
        {looping && (
          <div className="contents" aria-hidden>
            {children}
          </div>
        )}
      </div>

      {/* Both ends at once means the content already fits, so there is nowhere
          to page — show no affordance rather than two dead arrows. The card
          testimonials hit this whenever the design's two stories both fit. */}
      {!(atStart && atEnd && !looping) && (
        <>
      {/* Each arrow moves the cards the way it points: left slides the rail
          left (on to later cards), right slides it right (back to earlier
          ones). The same on all three sites. */}
      <Arrow side="left" disabled={!looping && atEnd} onClick={() => page(1)} onHold={pause} onRelease={resume} className={arrowClassName} label={`${label}: next`} />
      <Arrow side="right" disabled={!looping && atStart} onClick={() => page(-1)} onHold={pause} onRelease={resume} className={arrowClassName} label={`${label}: previous`} />
        </>
      )}
    </div>
  );
}

function Arrow({
  side,
  disabled,
  onClick,
  onHold,
  onRelease,
  className,
  label,
}: {
  side: 'left' | 'right';
  disabled: boolean;
  onClick: () => void;
  onHold: () => void;
  onRelease: () => void;
  className?: string;
  label: string;
}) {
  const Icon = side === 'left' ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      onClick={onClick}
      onPointerEnter={onHold}
      onPointerLeave={onRelease}
      onFocus={onHold}
      onBlur={onRelease}
      disabled={disabled}
      aria-label={label}
      // The artboard's chevrons are 16x36.7 at 1.5px, set ~35px clear of the
      // row. Sized up to match and pushed off the track; the offset eases back
      // below xl, where the page gutter is too narrow to hold it.
      className={cn(
        'absolute top-1/2 z-10 grid size-12 -translate-y-1/2 place-items-center text-[#606060] dark:text-fg-muted',
        // Interactions board: the chevron fades to 0.5 on hover, then comes
        // back to full and shrinks to 0.85 on press.
        'transition-[opacity,scale] duration-[80ms] ease-out',
        'hover:opacity-50 active:opacity-100 motion-safe:active:scale-[0.85]',
        // A disabled arrow takes no pointer events, so the states above cannot
        // fight this.
        'disabled:pointer-events-none disabled:opacity-25',
        side === 'left' ? '-left-1 lg:-left-[42px] xl:-left-[52px]' : '-right-1 lg:-right-[42px] xl:-right-[52px]',
        className
      )}
    >
      <Icon className="size-12" strokeWidth={1.5} />
    </button>
  );
}
