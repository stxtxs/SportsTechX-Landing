/**
 * Cookie consent, kept in a first-party cookie so a server could read it too.
 *
 * Nothing on the site is gated on it yet: today it sets no analytics or
 * marketing cookies. When analytics is added, load it only when
 * `getConsent() === 'accepted'`, and listen for CONSENT_CHANGE_EVENT so a
 * change made in Cookie settings takes effect without a reload.
 */
export type Consent = 'accepted' | 'rejected';

const COOKIE = 'stx_consent';
/** Six months, then ask again. */
const MAX_AGE_SEC = 60 * 60 * 24 * 182;

/** Fired on window after the visitor saves a choice; detail is the Consent. */
export const CONSENT_CHANGE_EVENT = 'stx:consent-change';
/** Fired to reopen the banner, e.g. from the footer's Cookie settings link. */
export const COOKIE_SETTINGS_EVENT = 'stx:cookie-settings';

export function getConsent(): Consent | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(/(?:^|;\s*)stx_consent=(accepted|rejected)(?:;|$)/);
  return match ? (match[1] as Consent) : null;
}

export function setConsent(consent: Consent): void {
  const secure = location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${COOKIE}=${consent}; Max-Age=${MAX_AGE_SEC}; Path=/; SameSite=Lax${secure}`;
  window.dispatchEvent(new CustomEvent<Consent>(CONSENT_CHANGE_EVENT, { detail: consent }));
}

export function openCookieSettings(): void {
  window.dispatchEvent(new Event(COOKIE_SETTINGS_EVENT));
}
