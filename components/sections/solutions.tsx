'use client';

import { useEffect, useState, Fragment, type CSSProperties } from 'react';
import { BlurImage } from '@/components/blur-image';
import { Carousel } from '@/components/carousel';
import { SectionIntro } from '@/components/section-intro';
import { solutions, type SolutionCard, type Testimonial } from '@/lib/content';
import type { SiteItem } from '@/lib/site-content';
import { cn } from '@/lib/utils';
import vectors from '@/design/vectors.json';

/**
 * The heading glyphs, the two wordmarks and the Atlas rings are flattened
 * VECTOR nodes. scripts/fig-extract.mjs now decodes their commandsBlob into
 * real SVG paths under public/vectors, so these are the artboard's own
 * drawings rather than the lucide and type stand-ins that were here before.
 * Sizes come from design/vectors.json so they cannot drift from the export.
 */
const art = (name: string) => vectors[name as keyof typeof vectors];

/**
 * Per-card artboard constants, consumed by the .card-* rules in globals.css.
 * Unitless — each is multiplied by --k, one artboard unit.
 */
const VARS: Record<string, CSSProperties> = {
  playmakers: {
    '--panel-y': 65.47,
    '--panel-h': 478.45,
    '--tag-x': 25,
    '--tag-y': 24.53,
    '--text-b': 99.5,
    '--mark-w': 268.049,
    '--mark-h': 35.0,
    '--headline': 56,
    '--headline-lh': 0.964, // Bebas 56/54
    '--headline-mt': 31,
    '--blurb-mt': 9,
    '--cta-w': 225,
    '--stories-t': 39,
    // Normal bottom now: Playmakers is the LOWER card of the operator pair, so
    // it no longer reserves the overlap strip — the upper card does, via the
    // position-based rule in globals.css (.solution-card:has(+ .solution-card)).
    '--stories-b': 34,
    '--strip-mt': 36,
    '--quote': 24,
    // 402 artboard
    '--m-top': 83,
    '--m-mark': 27,
    '--m-headline-mt': 24,
    '--m-cta-w': 177,
  } as CSSProperties,
  atlas: {
    '--panel-y': 67.29,
    '--panel-h': 491.71,
    '--tag-x': 28,
    '--tag-y': 25.71,
    '--text-b': 75,
    '--mark-w': 251.363,
    '--mark-h': 85.925,
    '--headline': 50,
    '--headline-lh': 1,
    '--headline-mt': 19.36,
    '--blurb-mt': 8,
    '--cta-w': 175,
    '--stories-t': 49,
    '--stories-b': 34,
    '--strip-mt': 40,
    '--quote': 22,
    '--m-top': 65,
    '--m-mark': 48,
    '--m-headline-mt': 21,
    '--m-cta-w': 153,
  } as CSSProperties,
};

export function Solutions({
  testimonials,
  previews,
}: {
  /** CMS quotes per solution card, keyed by card id. */
  testimonials?: Partial<Record<string, Testimonial[]>>;
  /** Card preview panels, POSITIONAL: [0] Playmakers, [1] Atlas. */
  previews?: SiteItem[];
}) {
  const [sector, setSector] = useState(solutions.sectors[0].id);

  // The nav's Solutions dropdown (Atlas/Playmakers/Operators/Investors) sets
  // the toggle as well as scrolling here. Ignore any id the toggle doesn't have.
  useEffect(() => {
    const onSector = (e: Event) => {
      const id = (e as CustomEvent<string>).detail;
      if (solutions.sectors.some((s) => s.id === id)) setSector(id);
    };
    window.addEventListener('stx:sector', onSector);
    return () => window.removeEventListener('stx:sector', onSector);
  }, []);

  return (
    <section id="solutions" data-rise className="section-y bg-surface">
      <div className="container-page">
        <SectionIntro title={solutions.title} tracking="tracking-[0.05em]">
          <div className="mt-1 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-5">
            <p className="font-sans text-[18px] leading-[27px] font-medium text-heading/70 uppercase lg:text-card-title lg:leading-[1.5]">
              {solutions.selectorLabel}
            </p>
            <div className="flex gap-[13px] lg:gap-5">
              {solutions.sectors.map((s) => {
                const active = s.id === sector;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSector(s.id)}
                    aria-pressed={active}
                    className={cn(
                      'tracked inline-flex h-[35px] w-[174px] items-center justify-center gap-2.5 rounded-full font-mono text-[14px] text-white transition-colors lg:h-[42px] lg:w-[160px] lg:text-label',
                      active
                        // Flat pink on mobile; the gradient and the dot are
                        // desktop-only in the artboard.
                        ? 'bg-accent-2 lg:bg-linear-to-r lg:from-[#f21d63] lg:to-[#ed1a5e]'
                        : 'bg-slate hover:brightness-110'
                    )}
                  >
                    {active && <span className="hidden size-[13px] rounded-full bg-white lg:block" />}
                    {s.label}
                  </button>
                );
              })}
            </div>
          </div>
        </SectionIntro>

        {/* solutions-rig is the container --k measures against, and the two
            cards overlap by 116 artboard units inside it. */}
        {/* Full bleed on mobile: the artboard's cards are the full 402 wide,
            which also makes 100cqw the artboard width for --k. */}
        <div className="solutions-rig mx-[calc(var(--gutter)*-1)] mt-[52px] flex flex-col lg:mx-0">
          {solutions.cards
            .filter((card) => card.sectors.includes(sector))
            .map((card) => (
              <SolutionBlock
                key={card.id}
                card={card}
                testimonials={testimonials?.[card.id]}
                // Indexed against the UNFILTERED list: the sector filter can drop
                // the first card, and a filtered index would then hand the Atlas
                // card the Playmakers preview.
                preview={previews?.[solutions.cards.indexOf(card)]}
              />
            ))}
        </div>
      </div>
    </section>
  );
}

function SolutionBlock({
  card,
  testimonials,
  preview,
}: {
  card: SolutionCard;
  testimonials?: Testimonial[];
  preview?: SiteItem;
}) {
  // This card's own CMS quotes, when the admin has uploaded any, otherwise the
  // set in content.ts. Each card reads its own section, so filling one in the
  // admin panel no longer changes the other.
  const quotes = testimonials?.length ? testimonials : card.testimonials;
  // Playmakers is the dark card, Atlas (Raise/Scout) the pale one. Keyed by
  // variant, not id: the two Atlas cards share one wordmark + asset set.
  const dark = card.variant === 'playmakers';
  const mark = art(`wordmark-${card.variant}`);

  return (
    <article
      style={VARS[card.variant]}
      className={cn(
        'solution-card relative overflow-hidden rounded-[20px] shadow-panel',
        dark
          ? 'noise [--noise-alpha:0.5] bg-linear-to-b from-card-dark-from to-card-dark-to'
          : 'bg-card-light'
      )}
    >
      {dark ? <Motif /> : <Rings />}

      {/* ---------- intro ----------
          Desktop: copy bottom-aligned with the panel flush to the right edge.
          Mobile: copy first, then the panel full width beneath it. Both are
          driven from .card-intro in globals.css. */}
      <div className="card-intro relative">
        <div
          className="card-intro-text"
          style={
            {
              '--mark-ow': mark.w,
              '--mark-oh': mark.h,
              '--mark-dx': mark.bleed.x,
              '--mark-dy': mark.bleed.y,
            } as CSSProperties
          }
        >
          <span className="card-wordmark block">
            {/* eslint-disable-next-line @next/next/no-img-element -- a flat
                artboard vector; next/image would only add a request wrapper. */}
            <img src={`/vectors/wordmark-${card.variant}.svg`} alt={card.eyebrow} className="h-full w-auto" />
            {/* Italic product tag over the "s", matching the Atlas dashboard
                sidebar — RAISE / SCOUT in the product colour. */}
            {card.tier && (
              <span className="card-tier" style={{ color: card.tier.color }}>
                {card.tier.label}
              </span>
            )}
          </span>

          <h3
            className={cn(
              'card-headline tracked mt-6 font-display text-card leading-[0.96] whitespace-pre-line',
              dark ? 'text-green dark:text-green-2' : 'text-[#22785b] dark:text-green-2'
            )}
          >
            {card.title}
          </h3>

          <p
            className={cn(
              'card-blurb mt-5 max-w-[514px] font-sans text-body leading-[1.72]',
              dark ? 'text-white/70' : 'text-black/60'
            )}
          >
            {card.blurb}
          </p>

          {/* Primary CTA plus an optional secondary ("Book a call"). A link, not
              a button: it leaves for the product's own site. The card-ctas
              wrapper lays them in a row; .card-cta's own top margin is zeroed
              there (globals.css) since the wrapper supplies the spacing. */}
          <div className="card-ctas mt-8 flex flex-wrap items-center gap-3">
            <a
              href={card.ctaHref}
              {...(card.ctaHref.startsWith('http') ? { target: '_blank', rel: 'noreferrer' } : {})}
              className={cn(
                'card-cta group/cta tracked inline-flex h-[42px] items-center justify-center rounded-full px-6 text-label',
                // Both cards converge on the brand pink with white type — the
                // dark card's label starts black, so colour animates too.
                // bg-accent-2 is #ED1A5E, the value on the board.
                'hover:bg-accent-2 hover:text-white active:bg-accent-2 active:text-white',
                // scale, not transform: Tailwind v4 emits scale-* to the `scale`
                // property, and a transition naming `transform` never fires.
                'transition-[background-color,color,scale] duration-200 ease-out',
                'active:duration-[80ms]',
                // Only the movement waits on prefers-reduced-motion.
                'motion-safe:hover:scale-105 motion-safe:active:scale-95',
                dark ? 'bg-white font-mono text-black' : 'bg-black font-mono-alt text-white'
              )}
            >
              {/* Only the label dims on press; the board keeps the fill solid. */}
              <span className="transition-opacity duration-[80ms] ease-out group-active/cta:opacity-70">
                {card.cta}
              </span>
            </a>

            {card.cta2 && (
              <a
                href={card.cta2.href}
                {...(card.cta2.href.startsWith('http') ? { target: '_blank', rel: 'noreferrer' } : {})}
                className={cn(
                  'card-cta group/cta2 tracked inline-flex h-[42px] items-center justify-center rounded-full border-[1.5px] px-6 text-label',
                  'transition-[background-color,color,scale] duration-200 ease-out active:duration-[80ms]',
                  'motion-safe:hover:scale-105 motion-safe:active:scale-95',
                  // Outline/secondary: the card's ink, filling to solid on hover.
                  dark
                    ? 'border-white/70 font-mono text-white hover:bg-white hover:text-black active:bg-white active:text-black'
                    : 'border-black/60 font-mono-alt text-black hover:bg-black hover:text-white active:bg-black active:text-white'
                )}
              >
                <span className="transition-opacity duration-[80ms] ease-out group-active/cta2:opacity-70">
                  {card.cta2.label}
                </span>
              </a>
            )}
          </div>
        </div>
        <div
          className={cn(
            'card-panel relative border shadow-preview backdrop-blur-[4px]',
            dark
              ? 'border-[#373b49] bg-[#020716]/60'
              : 'border-[#bcecd4] bg-white/85 dark:border-white/50 dark:bg-[#d6dced]'
          )}
        >
          {/* The artboard leaves this panel empty; an uploaded preview fills it.
              Behind the badge, which keeps its own absolute position. */}
          {preview?.url && (
            <BlurImage
              src={preview.url}
              alt={preview.alt || ''}
              fill
              sizes="(min-width: 1024px) 676px, 100vw"
              className="object-cover"
            />
          )}
          <span
            className={cn(
              'card-tag tracked absolute inline-flex items-center border font-mono-alt whitespace-nowrap',
              dark
                ? 'border-accent bg-accent/[0.17] text-white'
                : 'border-accent bg-accent/[0.09] text-accent dark:text-white'
            )}
          >
            {card.badge}
          </span>
        </div>

      </div>

      {/* ---------- green band ---------- */}
      <div className="card-band relative bg-green">
        <div className="card-cases flex flex-col lg:flex-row lg:items-start">
          {card.features.map((feature, i) => {
            const icon = art(`icon-${card.variant}-${i + 1}`);
            return (
              <Fragment key={feature.title}>
                {i > 0 && (
                  <span aria-hidden className="card-case-rule shrink-0 bg-white/40" />
                )}
                <div className="card-col flex flex-col gap-[30px] lg:flex-1">
                  <div className="card-col-head flex items-start gap-[11px]">
                    <span className="card-numbox grid size-[52px] shrink-0 place-items-center rounded-[45px] bg-white">
                      {/* eslint-disable-next-line @next/next/no-img-element -- see above */}
                      <img
                        src={`/vectors/icon-${card.variant}-${i + 1}.svg`}
                        alt=""
                        style={{ '--iw': icon.w, '--ih': icon.h } as CSSProperties}
                        className="card-icon size-6 object-contain"
                      />
                    </span>
                    <h4 className="card-col-title font-sans text-feature leading-[1.25] font-medium whitespace-pre-line text-white">
                      {feature.title}
                    </h4>
                  </div>

                  <ul className="card-uses flex flex-col gap-5">
                    {feature.points.map((point) => (
                      <li key={point} className="card-use flex gap-[18px]">
                        <span
                          aria-hidden
                          className="card-bullet mt-2 size-[10px] shrink-0 border border-white/70"
                        />
                        <span className="font-sans text-body leading-[1.56] font-medium whitespace-pre-line text-white/90">
                          {point}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Fragment>
            );
          })}
        </div>
      </div>

      {/* ---------- testimonials ---------- */}
      <div className="card-stories relative">
        <p
          className={cn(
            'card-stories-label tracked text-center text-label',
            dark ? 'font-mono text-[#e6e6ff]/70' : 'font-mono text-navy/85'
          )}
        >
          {card.testimonialsLabel}
        </p>

        <div className="card-strip relative mt-6">
          <Carousel
            label={card.testimonialsLabel}
            // Two quotes to a view, so a press moves exactly two. Steps forward
            // one view every 6s (not a continuous drift) and loops, so it reads
            // like the arrows firing on a timer; the arrows always work too. No
            // center hairline: it would cut through the stepping cards.
            pageBy={1}
            autoAdvance={6000}
            alwaysLoop
            className="card-carousel"
            trackClassName="gap-0"
            arrowClassName={cn('card-arrow', dark ? 'text-white' : 'text-[#606060]')}
          >
            {quotes.map((t, i) => (
              <figure
                key={i}
                // No side padding on mobile: the artboard gives the quote the
                // full 362, and 32 either side forced it onto a fourth line.
                // justify-between pins the avatar/name chip to the bottom of the
                // (equal-height) card, so it sits at ONE fixed position regardless
                // of quote length — a short quote just leaves a gap above the chip.
                // Below lg the chip follows the quote directly: pinning it to the
                // bottom of an equal-height slide left a big hole under short quotes.
                className="flex w-full shrink-0 snap-start flex-col items-center justify-start text-center lg:w-1/2 lg:justify-between lg:px-8"
              >
                <blockquote
                  className={cn(
                    // Size and line box come from .card-quote, which scales
                    // them off the artboard; a utility here would shadow it.
                    'card-quote font-sans',
                    dark ? 'text-[#eeeeee]' : 'text-[#2e2e2e]'
                  )}
                >
                  {t.quote}
                </blockquote>
                <figcaption className="card-chip mt-6 flex items-center gap-3">
                  {/* NOT placeholder="blur": a CMS avatar is a runtime URL
                      with no blurDataURL, which next/image rejects outright.
                      BlurImage derives the stand-in from a static import when
                      there is one and simply skips it otherwise. */}
                  {t.avatar && (
                    <span className="card-avatar relative size-14 shrink-0 overflow-hidden rounded-full">
                      <BlurImage src={t.avatar} alt="" fill sizes="56px" className="object-cover" />
                    </span>
                  )}
                  <span
                    className={cn('card-chip-text text-left', dark ? 'text-white' : 'text-black')}
                  >
                    <span className="card-chip-name block font-sans font-medium">{t.name}</span>
                    {t.role && (
                      <span className="card-chip-role block font-mono tracking-[-0.03em] opacity-60">
                        {t.role}
                      </span>
                    )}
                  </span>
                </figcaption>
              </figure>
            ))}
          </Carousel>
        </div>
      </div>
    </article>
  );
}

/**
 * "Frame 6" > "Group 5": ten 328.43 squares stepping by (96.58, 60.05) inside
 * a group rotated 15deg. The site drew the steps but dropped the rotation, so
 * the ribbon sat flat instead of raked across the card.
 */
const MOTIF = [
  [0, 0],
  [95.2, 53.72],
  [191.78, 113.76],
  [288.36, 173.81],
  [384.94, 233.85],
  [481.52, 293.89],
  [578.1, 353.93],
  [674.68, 413.98],
  [771.26, 474.02],
  [866.82, 527.67],
  // As shares of the group box: the 402 artboard steps by (52.72, 29.75)
  // inside a 661.94x474.12 group, which is the same figure at 0.554 scale.
].map(([x, y]) => [(x / 1195.25) * 100, (y / 856.1) * 100]);

function Motif() {
  return (
    <div aria-hidden className="card-motif pointer-events-none">
      <div className="card-motif-group">
        {MOTIF.map(([x, y]) => (
          <span
            key={`${x}-${y}`}
            style={{ left: `${x}%`, top: `${y}%` }}
          />
        ))}
      </div>
    </div>
  );
}

/**
 * Atlas "BG Element": a 1046.97 square rotated 45deg that CLIPS a 1776.65
 * ring vector rotated back -45deg. The clip is the whole point — it is what
 * confines the rings to the intro instead of letting them run the height of
 * the card, and the site was drawing them unclipped.
 *
 * The rings themselves are the artboard's own vector, roughly forty tightly
 * spaced circles with a #4baf8e stroke fading in towards the lower right —
 * not the six-ring approximation that was here before.
 */
function Rings() {
  return (
    <div aria-hidden className="card-rings pointer-events-none">
      <div className="card-rings-node">
        {/* eslint-disable-next-line @next/next/no-img-element -- see above */}
        <img src="/vectors/atlas-rings.svg" alt="" />
      </div>
    </div>
  );
}
