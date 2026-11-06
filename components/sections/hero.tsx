import { Fragment } from 'react';
import Image from 'next/image';
import { HeroOrbits } from '@/components/hero-orbits';
import { SectorLink } from '@/components/sector-link';
import { hero } from '@/lib/content';
import { cn } from '@/lib/utils';

/**
 * The hero fills the viewport. It used to hold the artboard's 1512x1004 ratio,
 * which on a normal 1080p window is taller than the screen — so the motif and
 * the pills, which live in its bottom third, were simply never on screen.
 *
 * Everything inside is placed as a share of the frame, the way the artboard
 * does. The motif circle is 1586 across at (-36, 154) in a 1512x1004 hero, so
 * its centre is (757, 947): horizontally centred, 94.3% down, radius 79% of the
 * frame's height. Sizing it off the height rather than the width is what keeps
 * the composition intact when the frame is wider or shorter than the artboard.
 *
 * Desktop holds a 760px floor. The copy and buttons are a fixed-px stack while
 * the motif scales with the height, so below ~740px the buttons cover the
 * second ring and every orbit falls back a ring (measured at 1280, 1480 and
 * 1920 wide). A short laptop window scrolls a little instead.
 */
export function Hero() {
  return (
    <section id="top" className="hero-frame relative isolate h-[100svh] min-h-[640px] overflow-hidden bg-hero lg:min-h-[760px]">
      {/* Epicentre motif, exported from Figma as a single SVG. Sized off the
          frame's height so the orbits keep their proportions at any viewport. */}
      <div
        aria-hidden
        data-orbit-motif
        className="fade-load pointer-events-none absolute top-[var(--motif-cy)] left-1/2 -z-30 aspect-square h-[calc(var(--motif-r)*2)] -translate-x-1/2 -translate-y-1/2"
      >
        <Image
          src="/icons/epicentre-motif.svg"
          alt=""
          fill
          priority
          className="object-contain dark:opacity-40 dark:invert dark:hue-rotate-180"
        />
        {/* The S logo is its own file on the same 1586 canvas, so it lands in
            exactly the same spot but skips the rings' dark-mode filter: the
            brand pink stays the same in both themes. */}
        <Image src="/icons/epicentre-logo.svg" alt="" fill priority className="object-contain" />
      </div>

      <div // 17%, against the artboard's own 22.3% (224 of the 1004 hero). The
        // design team asked for room under the copy for the orbit to breathe,
        // and this is the half of it that cannot come from the animation: the
        // block is a fixed-px stack (mt-3, mt-26, a 54 button) inside a frame
        // measured in percentages, so it eats a growing share as the viewport
        // shortens. Mobile's 13% already matches its own board (115.8/852).
        // pointer-events-none on the block, back on for its children: the block
        // is full width, and its empty sides must not swallow hovers on pills.
        className="pointer-events-none absolute inset-x-0 top-[13%] flex flex-col items-center px-5 text-center lg:top-[17%] lg:px-0">
        {/* Softens the motif rings behind the copy. */}
        <div aria-hidden className="hero-scrim" />

        {/* data-orbit-avoid: the orbiting pills keep clear of these. */}
        <h1
          data-orbit-avoid
          // max-width in em, not px, so the designed two-line break survives the
          // fluid type scale at every width.
          className="pointer-events-auto rise-load tracked max-w-[11em] font-display text-headline leading-[1.08] text-fg uppercase"
        >
          {/* The ampersand is picked out in brand magenta. */}
          {hero.headline.split('&').map((part, i) => (
            <Fragment key={i}>
              {i > 0 && <span className="text-accent-2">&amp;</span>}
              {part}
            </Fragment>
          ))}
        </h1>

        <p data-orbit-avoid className="pointer-events-auto mt-3 max-w-[648px] font-sans text-body-lg leading-[1.57] font-medium whitespace-pre-line text-fg-2">
          {hero.subhead}
        </p>

        <div className="mt-[26px] flex flex-col items-center gap-5 sm:flex-row sm:gap-[30px] lg:gap-[30px]">
          {hero.ctas.map((cta) => (
            <SectorLink
              key={cta.label}
              href={cta.href}
              sector={cta.sector}
              data-orbit-avoid
              className={cn(
                'pointer-events-auto group tracked inline-flex h-[41px] w-[215px] items-center justify-center rounded-[93px] font-mono text-cta text-white',
                'shadow-cta lg:h-[54px] lg:w-[249px]',
                // Both buttons go black on hover, per the interactions board.
                'hover:bg-black active:bg-black',
                // Tailwind v4 emits scale-* to the `scale` property, not
                // `transform`, so the transition has to name `scale` — naming
                // `transform` leaves the button snapping between sizes.
                'transition-[background-color,scale] duration-200 ease-out',
                // Press is quicker than hover: 80ms against 200ms.
                'active:duration-[80ms]',
                // Only the movement waits on prefers-reduced-motion; the colour
                // change still lands, so the button never stops responding.
                'motion-safe:hover:scale-105 motion-safe:active:scale-95',
                cta.variant === 'primary' ? 'bg-accent-2' : 'bg-slate'
              )}
            >
              {/* The label alone dims on press — the board keeps the background
                  solid black and drops only the text to 0.7. */}
              <span className="transition-opacity duration-[80ms] ease-out group-active:opacity-70">
                {cta.label}
              </span>
            </SectorLink>
          ))}
        </div>
      </div>

      <HeroOrbits pills={hero.pills} />
    </section>
  );
}
