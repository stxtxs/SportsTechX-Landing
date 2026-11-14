'use client';

/**
 * PostHog (EU Cloud) web analytics, in the same PostHog project as Atlas and
 * set up the way Atlas measures signed-out visitors (its lib/analytics.ts).
 *
 * Consent, without a banner: visitors are tracked in MEMORY only. PostHog
 * writes no cookie and nothing to localStorage or sessionStorage, and nothing
 * survives the tab. The cost: a reload or a return visit counts as a new
 * visitor, so unique-visitor numbers run high and there is no "returning"
 * figure. Page views, sources, countries and top pages are unaffected.
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

let initialized = false;

export function initAnalytics(): void {
  if (initialized) return;
  if (!process.env.NEXT_PUBLIC_POSTHOG_KEY && !HOSTS.includes(window.location.hostname)) return;
  initialized = true;
  // Off the critical path: the SDK loads once the browser is idle.
  const load = () => {
    import('posthog-js')
      .then(({ default: posthog }) => {
        posthog.init(POSTHOG_KEY, {
          api_host: 'https://eu.i.posthog.com',
          ui_host: 'https://eu.posthog.com',
          persistence: 'memory',
          person_profiles: 'identified_only',
          // Every route, client-side navigations too.
          capture_pageview: 'history_change',
          disable_surveys: true,
          disable_session_recording: true,
        });
      })
      .catch(() => {
        /* analytics is best-effort; a blocked script must not break the site */
      });
  };
  if ('requestIdleCallback' in window) window.requestIdleCallback(load, { timeout: 4000 });
  else setTimeout(load, 1500);
}
