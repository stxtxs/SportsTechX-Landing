'use client';

import { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { announcement } from '@/lib/content';

/** Where a closed announcement is remembered: the id of the one closed. */
export const ANNOUNCE_KEY = 'stx-announcement-closed';
/** Set on <html> while no banner shows; the CSS keys off it (globals.css). */
export const ANNOUNCE_OFF = 'data-announce-off';

/**
 * Runs in <head> before the page paints: a visitor who already closed this
 * announcement never sees it flash in. Storage blocked means the banner shows,
 * which is the safe direction.
 */
export const ANNOUNCE_PREPAINT = announcement
  ? `(function(){try{if(localStorage.getItem(${JSON.stringify(ANNOUNCE_KEY)})===${JSON.stringify(announcement.id)})document.documentElement.setAttribute(${JSON.stringify(ANNOUNCE_OFF)},'')}catch(e){}})();`
  : `document.documentElement.setAttribute(${JSON.stringify(ANNOUNCE_OFF)},'');`;

/**
 * The banner across the top of every page until the visitor closes it
 * (content in lib/content.ts `announcement`).
 *
 * It sits in the page's normal flow, so it scrolls away with the page. The nav
 * is `fixed`, so it is offset below the banner by `--announce-h` on <html>,
 * which this keeps equal to the banner's real height (it wraps to two lines on
 * a phone). Closing it stores the id, sets the attribute that hides it, and
 * zeroes the offset, so the nav moves back up.
 */
export function AnnouncementBar() {
  const ref = useRef<HTMLDivElement>(null);
  const [closed, setClosed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const root = document.documentElement;
    const sync = () => root.style.setProperty('--announce-h', `${root.hasAttribute(ANNOUNCE_OFF) ? 0 : el.offsetHeight}px`);
    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(el);
    return () => ro.disconnect();
  }, [closed]);

  if (!announcement || closed) return null;
  const { id } = announcement;

  const close = () => {
    try {
      localStorage.setItem(ANNOUNCE_KEY, id);
    } catch {
      /* storage blocked: closed for this page view only */
    }
    const root = document.documentElement;
    root.setAttribute(ANNOUNCE_OFF, '');
    root.style.setProperty('--announce-h', '0px');
    // The nav docks on scroll position; tell it the top just moved.
    window.dispatchEvent(new Event('scroll'));
    setClosed(true);
  };

  return (
    <div
      ref={ref}
      role="region"
      aria-label="Announcement"
      className="announce relative z-40 bg-[#091539] text-white"
    >
      <div className="container-page flex min-h-[44px] items-center justify-center gap-x-4 gap-y-1.5 py-2 pr-12 max-sm:flex-wrap sm:pr-14">
        <p className="m-0 text-center font-sans text-[13px] leading-[1.4] sm:text-[14px]">
          <strong className="font-medium text-[#ff5c8a]">{announcement.label}</strong>{' '}
          {announcement.text}
        </p>
        <a
          href={announcement.href}
          target="_blank"
          rel="noreferrer"
          className="tracked inline-flex h-[30px] shrink-0 items-center rounded-full bg-white px-4 font-mono text-[12px] text-[#091539] transition-[background-color,color,scale] duration-200 ease-out hover:bg-accent-2 hover:text-white motion-safe:hover:scale-105 motion-safe:active:scale-95"
        >
          {announcement.cta}
        </a>
      </div>
      <button
        type="button"
        onClick={close}
        aria-label="Close announcement"
        className="absolute top-1/2 right-[max(4px,calc(var(--gutter)-12px))] grid size-11 -translate-y-1/2 place-items-center rounded-full text-white/80 transition-colors hover:text-white"
      >
        <X size={18} aria-hidden />
      </button>
    </div>
  );
}
