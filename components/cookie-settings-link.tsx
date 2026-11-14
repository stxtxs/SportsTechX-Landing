'use client';

import { openCookieSettings } from '@/lib/consent';

/** Reopens the cookie banner, so a choice can be changed as easily as it was made. */
export function CookieSettingsLink({ className }: { className?: string }) {
  return (
    <button type="button" onClick={openCookieSettings} className={`ph-no-capture ${className ?? ''}`}>
      Cookie Settings
    </button>
  );
}
