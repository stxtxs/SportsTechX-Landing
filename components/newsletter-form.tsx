'use client';

import { useId, useState } from 'react';
import { footer } from '@/lib/content';
import { cn } from '@/lib/utils';

type Status = { kind: 'idle' | 'loading' | 'ok' | 'error'; message?: string };

/**
 * Email pill that subscribes to the Beehiiv newsletter through /api/newsletter.
 * If the API isn't configured (no Beehiiv key) or fails, it opens the hosted
 * Beehiiv subscribe page with the address carried over — so it always works.
 *
 * Shared by the footer and the nav's newsletter modal; `tone` only sizes it.
 */
export function NewsletterForm({ tone = 'footer', autoFocus }: { tone?: 'footer' | 'modal'; autoFocus?: boolean }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>({ kind: 'idle' });
  const id = useId();

  const openHosted = () => {
    const url = `${footer.newsletterAction}?email=${encodeURIComponent(email)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus({ kind: 'loading' });
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setStatus({ kind: 'ok', message: "You're on the list — check your inbox." });
        setEmail('');
      } else if (data.fallback) {
        openHosted();
        setStatus({ kind: 'ok', message: 'Opening the subscribe page…' });
      } else {
        setStatus({ kind: 'error', message: data.error || 'Something went wrong. Try again.' });
      }
    } catch {
      openHosted();
      setStatus({ kind: 'ok', message: 'Opening the subscribe page…' });
    }
  }

  return (
    <div className="flex w-full flex-col gap-2">
      <form
        onSubmit={onSubmit}
        className={cn(
          'footer-join flex w-full items-center rounded-full border-[1.5px] border-nav-border bg-nav-bg p-[5px] shadow-nav',
          tone === 'modal' && 'p-[6px]'
        )}
      >
        <label htmlFor={id} className="sr-only">
          Email address
        </label>
        <input
          id={id}
          type="email"
          name="email"
          required
          autoComplete="email"
          autoFocus={autoFocus}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email address"
          className={cn(
            'footer-join-input min-w-0 flex-1 bg-transparent px-[18px] font-sans text-heading outline-none placeholder:text-fg-muted',
            tone === 'modal' ? 'h-12 text-base' : 'text-body-sm'
          )}
        />
        <button
          type="submit"
          disabled={status.kind === 'loading'}
          className={cn(
            'footer-join-btn group tracked shrink-0 rounded-full bg-accent-2 px-[26px] font-mono text-cta text-white shadow-cta',
            'hover:bg-black active:bg-black disabled:opacity-60',
            'transition-[background-color,scale] duration-200 ease-out active:duration-[80ms]',
            'motion-safe:hover:scale-105 motion-safe:active:scale-95',
            tone === 'modal' && 'h-11'
          )}
        >
          <span className="transition-opacity duration-[80ms] ease-out group-active:opacity-70">
            {status.kind === 'loading' ? '…' : 'SUBSCRIBE'}
          </span>
        </button>
      </form>
      {status.message && (
        <p
          aria-live="polite"
          className={cn(
            'px-[18px] font-sans text-body-sm',
            status.kind === 'error' ? 'text-accent-2' : 'text-heading/70'
          )}
        >
          {status.message}
        </p>
      )}
    </div>
  );
}
