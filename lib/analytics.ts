'use client';

import type { PostHog } from 'posthog-js';
import { CONSENT_CHANGE_EVENT, getConsent } from '@/lib/consent';

/**
 * PostHog (EU Cloud) web analytics, in the same PostHog project as Atlas,
 * gated on the cookie banner (lib/consent.ts, components/cookie-banner.tsx).
 *
 * The rule: analytics loads only after "Accept all".
 *  - No choice yet, or Decline: the PostHog SDK is never downloaded, nothing
 *    is sent and nothing is stored.
 *  - Accept all: the SDK loads and tracks with PostHog's normal cookie +
 *    localStorage persistence, so returning visitors are recognised.
 *  - Accept, then Decline later (Cookie Settings in the footer): capture stops
 *    at once, PostHog drops to memory and its cookie and storage entries are
 *    removed. No reload needed, in either direction. Events captured in the
 *    few seconds before the Decline may still be in PostHog's send queue and
 *    go out with its next batch. Clicks on the banner and on Cookie Settings
 *    are never captured (`ph-no-capture`).
 *
 * Runs on the production hosts only, so previews and localhost send nothing.
 * Set NEXT_PUBLIC_POSTHOG_KEY to test on another host (it then also replaces
 * the key below).
 *
 * Wired today: page views (automatic, client-side navigations included), page
 * leaves, and PostHog's autocapture of clicks. No session replay, no surveys.
 * Filter by host in PostHog to separate this site from Atlas.
 */

/** Public project token (phc_…) of the shared STX project. Not a secret: every page of the Atlas site ships it. */
const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY || 'phc_yZdTpqxXqLt7Y437AqwdMgv9DCCLXc4u4NHACArbkzu9';
const HOSTS = ['sportstechx.com', 'www.sportstechx.com'];

/** Mirrors the visitor's consent. Every event passes through it (before_send). */
let allowed = false;
let client: PostHog | null = null;
let loading = false;
let listening = false;

/** Removes what PostHog stored in this browser for this project. */
function clearStored(): void {
  const prefix = `ph_${POSTHOG_KEY}_`;
  try {
    for (const store of [window.localStorage, window.sessionStorage]) {
      for (const key of Object.keys(store)) {
        if (key.startsWith(prefix)) store.removeItem(key);
      }
    }
  } catch {
    /* storage blocked: nothing was stored there */
  }
  // PostHog's cookie sits on the registrable domain, so clear every level.
  const parts = window.location.hostname.split('.');
  const domains = ['', ...parts.map((_, i) => `.${parts.slice(i).join('.')}`).filter((d) => d.split('.').length > 2)];
  for (const cookie of document.cookie.split(';')) {
    const name = cookie.split('=')[0].trim();
    if (!name.startsWith(prefix)) continue;
    for (const domain of domains) {
      document.cookie = `${name}=; Max-Age=0; path=/${domain ? `; domain=${domain}` : ''}`;
    }
  }
}

function start(): void {
  if (allowed) return;
  allowed = true;
  if (client) {
    // Accepted again after a Decline on this page: pick up where we stopped.
    client.set_config({ persistence: 'localStorage+cookie' });
    client.capture('$pageview');
    return;
  }
  if (loading) return;
  loading = true;
  import('posthog-js')
    .then(({ default: posthog }) => {
      posthog.init(POSTHOG_KEY, {
        api_host: 'https://eu.i.posthog.com',
        ui_host: 'https://eu.posthog.com',
        // Consent was given, so start in memory only if it was withdrawn while the SDK was loading.
        persistence: allowed ? 'localStorage+cookie' : 'memory',
        person_profiles: 'identified_only',
        // Every route, client-side navigations too.
        capture_pageview: 'history_change',
        disable_surveys: true,
        disable_session_recording: true,
        // The last gate: nothing leaves the browser while consent is not "accepted".
        before_send: (event) => (allowed ? event : null),
      });
      client = posthog;
    })
    .catch(() => {
      /* analytics is best-effort; a blocked script must not break the site */
    })
    .finally(() => {
      loading = false;
    });
}

function stop(): void {
  if (!allowed) return;
  allowed = false;
  if (client) {
    client.set_config({ persistence: 'memory' });
    client.reset();
  }
  clearStored();
}

function sync(): void {
  if (getConsent() === 'accepted') start();
  else stop();
}

/** Call once on page load. Follows the consent choice from then on. */
export function initAnalytics(): void {
  if (listening) return;
  if (!process.env.NEXT_PUBLIC_POSTHOG_KEY && !HOSTS.includes(window.location.hostname)) return;
  listening = true;
  window.addEventListener(CONSENT_CHANGE_EVENT, sync);
  sync();
}
