'use client';

import { useEffect, useRef } from 'react';
import { NewsletterForm } from '@/components/newsletter-form';

/**
 * The newsletter sign-up dialog. Opens when anything dispatches
 * `stx:newsletter-open` (the nav CTA does). Native <dialog> gives the focus
 * trap, the backdrop and Escape-to-close for free; the only JS is wiring the
 * open event and dismissing on a backdrop click. The open/close animation and
 * the backdrop blur live in globals.css under `.newsletter-dialog`.
 *
 * Mounted once in the root layout, so every page shares one instance.
 */
/**
 * Companies whose people read the newsletter, shown as a logo row. Files are
 * the public-domain marks from Wikimedia Commons (FIFA logo without slogan,
 * Adidas Logo, F1.svg — the current F1 mark since 2017, Apple logo black,
 * Andreessen Horowitz new logo, Kohlberg Kravis Roberts (logo)). `h` is each mark's height in px, tuned so
 * wide wordmarks and compact marks read at a similar weight.
 */
const TRUSTED_BY: { name: string; logo?: string; h?: number }[] = [
  { name: 'FIFA', logo: '/logos/fifa.svg', h: 16 },
  { name: 'adidas', logo: '/logos/adidas.svg', h: 24 },
  { name: 'Formula 1', logo: '/logos/formula-1.svg', h: 14 },
  { name: 'Apple', logo: '/logos/apple.svg', h: 20 },
  { name: 'a16z', logo: '/logos/a16z.svg', h: 20 },
  { name: 'KKR', logo: '/logos/kkr.svg', h: 13 },
];

export function NewsletterModal() {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const open = () => ref.current?.showModal();
    window.addEventListener('stx:newsletter-open', open);
    return () => window.removeEventListener('stx:newsletter-open', open);
  }, []);

  return (
    <dialog
      ref={ref}
      // Click outside the card (directly on the <dialog> backdrop) closes it.
      onClick={(e) => {
        if (e.target === ref.current) ref.current?.close();
      }}
      className="newsletter-dialog m-auto w-[min(94vw,520px)] overflow-hidden rounded-[24px] border border-white/10 bg-surface p-0 text-fg shadow-panel"
    >
      <div className="relative flex flex-col gap-7 p-8 sm:p-10">
        {/* A soft pink glow bleeding in from the top-left corner, so the card
            reads as branded rather than a plain grey sheet. */}
        <span
          aria-hidden
          className="pointer-events-none absolute -left-24 -top-24 size-56 rounded-full bg-accent-2/20 blur-3xl"
        />

        <button
          type="button"
          onClick={() => ref.current?.close()}
          aria-label="Close"
          className="absolute right-6 top-6 z-10 grid size-9 place-items-center rounded-full border border-white/10 text-heading/60 transition-colors hover:border-white/20 hover:text-heading"
        >
          <svg viewBox="0 0 24 24" aria-hidden className="size-5" fill="none" stroke="currentColor" strokeWidth={1.5}>
            <path d="M6 6 18 18M18 6 6 18" />
          </svg>
        </button>

        <div className="relative flex flex-col gap-3 pr-10">
          <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-accent-2">
            Newsletter
          </span>
          <h2 className="font-display text-[34px] leading-[1.02] text-heading uppercase tracking-[0.02em] sm:text-[40px]">
            Join the inside track
          </h2>
          <p className="max-w-[40ch] font-sans text-body leading-[1.6] text-heading/70">
            The deals, startups and trends shaping sports tech &amp; venture. Expert analysis and insider
            perspectives, delivered every Friday.
          </p>
        </div>

        <div className="relative flex flex-col gap-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-heading/45">
            Trusted by top companies
          </p>
          {/* Greyed so six different brand colours sit quietly together;
              inverted in dark mode so the black marks turn light. A company
              without a `logo` falls back to its name. */}
          <ul className="flex flex-wrap items-center justify-between gap-x-5 gap-y-3">
            {TRUSTED_BY.map((company) => (
              <li key={company.name} className="font-sans text-[17px] font-semibold text-heading/45">
                {company.logo ? (
                  // eslint-disable-next-line @next/next/no-img-element -- small flat brand marks
                  <img
                    src={company.logo}
                    alt={company.name}
                    style={{ height: company.h ?? 20 }}
                    className="w-auto opacity-55 grayscale dark:opacity-70 dark:invert"
                  />
                ) : (
                  company.name
                )}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative flex flex-col gap-3">
          <div>
            <p className="font-sans text-body leading-[1.6] text-heading/70">
              Join 20,000+ founders, investors and sports business leaders.
            </p>
            <p className="font-sans text-body-sm leading-[1.6] text-heading/50 italic">
              Always free, unsubscribe anytime
            </p>
          </div>
          <NewsletterForm tone="modal" autoFocus />
        </div>
      </div>
    </dialog>
  );
}
