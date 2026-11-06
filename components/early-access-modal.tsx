'use client';

import { useEffect, useId, useRef, useState, type FormEvent } from 'react';
import { cn } from '@/lib/utils';

/** Products with an early-access list. Matches the API's enum. */
export type EarlyAccessProduct = 'boardroom';

const COPY: Record<EarlyAccessProduct, { kicker: string; title: string; lead: string }> = {
  boardroom: {
    kicker: 'Boardroom',
    title: 'Request early access',
    lead: "A private network for sports tech's leading investors, launching with 20 founding members. Leave your details and the team will be in touch.",
  },
};

/** Open the dialog from anywhere: `openEarlyAccess('boardroom')`. */
export const openEarlyAccess = (product: EarlyAccessProduct) =>
  window.dispatchEvent(new CustomEvent('stx:early-access-open', { detail: product }));

type Status = { kind: 'idle' | 'loading' | 'done' | 'error'; message?: string };

const FIELD =
  'h-12 w-full rounded-full border-[1.5px] border-nav-border bg-nav-bg px-5 font-sans text-base text-heading outline-none placeholder:text-fg-muted focus-visible:border-accent-2';

/**
 * The early-access dialog (first: the Boardroom card's "REQUEST EARLY ACCESS").
 * Same shell as the newsletter dialog: native <dialog> for the focus trap,
 * backdrop and Escape; mounted once in the root layout.
 *
 * Posts to this site's /api/early-access, which forwards to the platform API:
 * the request is stored and the team inbox gets an email.
 */
export function EarlyAccessModal() {
  const ref = useRef<HTMLDialogElement>(null);
  const [product, setProduct] = useState<EarlyAccessProduct>('boardroom');
  const [status, setStatus] = useState<Status>({ kind: 'idle' });
  const id = useId();

  useEffect(() => {
    const open = (e: Event) => {
      const p = (e as CustomEvent<EarlyAccessProduct>).detail;
      if (p in COPY) setProduct(p);
      setStatus({ kind: 'idle' });
      ref.current?.showModal();
      requestAnimationFrame(() => ref.current?.querySelector<HTMLInputElement>('input[name="email"]')?.focus());
    };
    window.addEventListener('stx:early-access-open', open);
    return () => window.removeEventListener('stx:early-access-open', open);
  }, []);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setStatus({ kind: 'loading' });
    const res = await fetch('/api/early-access', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        product,
        email: form.get('email'),
        name: form.get('name'),
        company: form.get('company'),
        website: form.get('website'),
      }),
    }).catch(() => null);
    if (res?.ok) {
      setStatus({ kind: 'done' });
      return;
    }
    const msg = res ? ((await res.json().catch(() => null)) as { error?: string } | null)?.error : null;
    setStatus({
      kind: 'error',
      message: msg ?? 'Something went wrong. Please try again, or email hello@sportstechx.com.',
    });
  };

  const copy = COPY[product];

  return (
    <dialog
      ref={ref}
      aria-labelledby={`${id}-title`}
      onClick={(e) => {
        if (e.target === ref.current) ref.current?.close();
      }}
      className="newsletter-dialog m-auto w-[min(94vw,520px)] overflow-hidden rounded-[24px] border border-white/10 bg-surface p-0 text-fg shadow-panel"
    >
      <div className="relative flex flex-col gap-7 p-8 sm:p-10">
        <span
          aria-hidden
          className="pointer-events-none absolute -left-24 -top-24 size-56 rounded-full bg-accent-2/20 blur-3xl"
        />

        <button
          type="button"
          onClick={() => ref.current?.close()}
          aria-label="Close"
          className="absolute right-6 top-6 z-10 grid size-9 place-items-center rounded-full border border-black/10 dark:border-white/10 text-heading/60 transition-colors hover:border-white/20 hover:text-heading"
        >
          <svg viewBox="0 0 24 24" aria-hidden className="size-5" fill="none" stroke="currentColor" strokeWidth={1.5}>
            <path d="M6 6 18 18M18 6 6 18" />
          </svg>
        </button>

        <div className="relative flex flex-col gap-3 pr-10">
          <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-accent-2">{copy.kicker}</span>
          <h2 id={`${id}-title`} className="font-display text-[34px] leading-[1.02] text-heading uppercase tracking-[0.02em] sm:text-[40px]">
            {status.kind === 'done' ? "You're on the list" : copy.title}
          </h2>
          <p role="status" className="max-w-[42ch] font-sans text-body leading-[1.6] text-heading/70">
            {status.kind === 'done'
              ? "Thanks — we've got your request and the team will be in touch soon."
              : copy.lead}
          </p>
        </div>

        {status.kind === 'done' ? (
          <button
            type="button"
            autoFocus
            onClick={() => ref.current?.close()}
            className="tracked relative h-12 self-start rounded-full bg-accent-2 px-7 font-mono text-cta text-white shadow-cta transition-colors hover:bg-black"
          >
            CLOSE
          </button>
        ) : (
          <form onSubmit={onSubmit} className="relative flex flex-col gap-3">
            <label htmlFor={`${id}-email`} className="sr-only">Email address</label>
            <input id={`${id}-email`} name="email" type="email" required autoComplete="email" autoFocus placeholder="Email address *" maxLength={320} className={FIELD} />
            <label htmlFor={`${id}-name`} className="sr-only">Name</label>
            <input id={`${id}-name`} name="name" autoComplete="name" placeholder="Name" maxLength={200} className={FIELD} />
            <label htmlFor={`${id}-company`} className="sr-only">Firm</label>
            <input id={`${id}-company`} name="company" autoComplete="organization" placeholder="Firm" maxLength={200} className={FIELD} />
            {/* Honeypot: invisible to people, filled by bots. */}
            <input name="website" tabIndex={-1} autoComplete="off" aria-hidden className="absolute -left-[9999px] size-px opacity-0" />
            <button
              type="submit"
              disabled={status.kind === 'loading'}
              className={cn(
                'group tracked mt-1 h-12 rounded-full bg-accent-2 px-7 font-mono text-cta text-white shadow-cta',
                'hover:bg-black active:bg-black disabled:opacity-60',
                'transition-[background-color,scale] duration-200 ease-out active:duration-[80ms]',
                'motion-safe:hover:scale-[1.02] motion-safe:active:scale-95'
              )}
            >
              {status.kind === 'loading' ? 'SENDING…' : 'REQUEST EARLY ACCESS'}
            </button>
            {status.kind === 'error' && (
              <p role="alert" className="px-5 font-sans text-body-sm text-accent-2">{status.message}</p>
            )}
          </form>
        )}
      </div>
    </dialog>
  );
}
