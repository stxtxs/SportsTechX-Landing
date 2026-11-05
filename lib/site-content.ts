/**
 * Reads the CMS-managed partner photos and testimonials for this site from the
 * STX backend's admin panel (Site assets → STX landing).
 *
 * Same contract as newsletter.ts and podcast.ts: a dead feed must never blank
 * the page. Any error, timeout or non-200 returns `{}` and every consumer falls
 * back to the content decoded from the .fig. An empty section behaves the same
 * way, and one uploaded card means exactly one card renders — never one plus
 * the eight placeholders.
 */
const REVALIDATE_SEC = 300;

export interface SiteItem {
  url: string | null;
  alt: string;
  logoUrl: string | null;
  logoAlt: string;
  title: string | null;
  subtitle: string | null;
  body: string | null;
}

export interface SiteSections {
  /** The upper partner rail. */
  gallery?: SiteItem[];
  /** The lower partner rail, which drifts the other way. */
  gallery2?: SiteItem[];
  /** Solutions card previews. Positional: [0] Playmakers, [1] Atlas. */
  solutions?: SiteItem[];
  /** Quotes on the Playmakers solution card (landing/testimonials). */
  testimonials?: SiteItem[];
  /** Quotes on the Atlas solution card — its own section (landing/testimonials2). */
  testimonials2?: SiteItem[];
}

export async function siteContent(): Promise<SiteSections> {
  // This site reads its OWN sections only. The Atlas / Playmakers quotes shown
  // on the two solution cards live under landing/testimonials2 + testimonials in
  // the admin CMS (copied from each product site), so they are editable here and
  // nothing fetches cross-site.
  const base = process.env.BACKEND_URL;
  if (!base) return {};
  // A failed fetch must NOT read as "no content": that rendered the built-in
  // default images and the 5-minute page cache then kept that version (seen 5 Nov
  // 2026 after admin edits + API restarts). Throwing instead makes Next keep
  // serving the last good page; a build with the API down fails and the previous
  // deployment stays live. One retry rides out an API restart. A section that is
  // genuinely empty still falls back to the defaults (that's an editorial choice).
  for (let attempt = 1; ; attempt++) {
    try {
      const res = await fetch(`${base}/api/public/site-content?site=landing`, {
      next: { revalidate: REVALIDATE_SEC },
      signal: AbortSignal.timeout(8000),
    });
      if (!res.ok) throw new Error(`site-content (landing) responded ${res.status}`);
      const json = (await res.json()) as { sections?: SiteSections };
      return json.sections ?? {};
    } catch (error) {
      if (attempt >= 2) throw error;
      await new Promise((r) => setTimeout(r, 1500));
    }
  }
}
