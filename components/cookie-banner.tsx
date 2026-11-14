'use client';

import { useEffect, useId, useState } from 'react';
import { COOKIE_SETTINGS_EVENT, getConsent, setConsent, type Consent } from '@/lib/consent';

/* Both choices share this one style, so neither is nudged: same size, colour
   and hover. */
const BUTTON =
  'tracked h-9 flex-1 cursor-pointer rounded-full border-[1.5px] border-nav-border font-mono text-legal text-heading uppercase transition-[background-color,border-color,color,scale] duration-200 ease-out hover:border-heading hover:bg-heading hover:text-page active:duration-[80ms] motion-safe:active:scale-95';

/**
 * Cookie consent banner. Shown until the visitor chooses, and again whenever
 * Cookie settings in the footer is used. Not modal: the page stays usable.
 */
export function CookieBanner() {
  const [open, setOpen] = useState(false);
  const titleId = useId();

  useEffect(() => {
    // The cookie only exists in the browser, so this has to run after mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reading a browser-only value
    if (getConsent() === null) setOpen(true);
    const reopen = () => setOpen(true);
    window.addEventListener(COOKIE_SETTINGS_EVENT, reopen);
    return () => window.removeEventListener(COOKIE_SETTINGS_EVENT, reopen);
  }, []);

  if (!open) return null;

  const choose = (consent: Consent) => {
    setConsent(consent);
    setOpen(false);
  };

  return (
    // ph-no-capture: the consent choice itself is never sent to analytics.
    <section
      role="region"
      aria-labelledby={titleId}
      className="ph-no-capture fixed inset-x-3 bottom-3 z-[55] rounded-[18px] border-[1.5px] border-nav-border bg-nav-bg px-4 py-3.5 shadow-nav md:right-5 md:bottom-5 md:left-auto md:w-[436px]"
    >
      <h2 id={titleId} className="tracked font-mono text-legal text-heading/50 uppercase dark:text-heading/45">
        Cookies
      </h2>
      <div className="mt-1.5 font-sans text-[14px] leading-[1.5] text-heading/70 dark:text-heading/55">
        <p className="text-heading">Yes, we use cookies. No, they aren&rsquo;t gluten-free.</p>
        <p className="mt-1.5">
          Essential ones keep the site running. Analytics ones show us how it&rsquo;s used, only if you say yes. Please
          do.{' '}
          <a
            href="/privacy-policy"
            className="whitespace-nowrap underline underline-offset-2 hover:text-black dark:hover:text-white"
          >
            Privacy Policy
          </a>
        </p>
      </div>
      <div className="mt-3 flex gap-2">
        <button type="button" onClick={() => choose('rejected')} className={BUTTON}>
          Decline
        </button>
        <button type="button" onClick={() => choose('accepted')} className={BUTTON}>
          Accept all
        </button>
      </div>
    </section>
  );
}
