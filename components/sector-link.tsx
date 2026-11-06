'use client';

import type { AnchorHTMLAttributes } from 'react';

/**
 * An anchor that also sets the Solutions selector on click (the Solutions
 * section listens for `stx:sector`). `sector` is a role id ("founders") or a
 * card id ("playmakers"). Its href names the same id (`/#playmakers`), so the
 * link also works from other pages and sites (Solutions reads the hash). Used
 * by the hero CTAs and the footer's Solutions links; the nav dropdown inlines
 * the same dispatch.
 */
export function SectorLink({
  sector,
  onClick,
  children,
  ...anchor
}: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string; sector: string; [data: `data-${string}`]: unknown }) {
  return (
    <a
      {...anchor}
      onClick={(e) => {
        window.dispatchEvent(new CustomEvent('stx:sector', { detail: sector }));
        onClick?.(e);
      }}
    >
      {children}
    </a>
  );
}
