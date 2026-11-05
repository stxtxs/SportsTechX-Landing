/**
 * The most recent SportsTechX report, from the STX backend.
 *
 * GET /api/reports is @Public() and already LATERAL-joins the free version's
 * cover_url — the server treats a cover as public marketing material regardless
 * of caller tier, which is exactly what this card needs. Those covers live in
 * Supabase public storage, already allow-listed in next.config.ts.
 *
 * Same contract as newsletter.ts, youtube.ts and site-content.ts: any error,
 * timeout or non-200 returns null and the card falls back to the static copy.
 */
const REVALIDATE_SEC = 1800;

export type Report = {
  title: string;
  link: string;
  image: string;
};

/** What we read off a row; the endpoint returns a good deal more. */
type Row = {
  slug: string | null;
  title: string | null;
  cover_url: string | null;
  report_year: number | null;
};

/**
 * Sorted by -report_year, NOT the endpoint's default -created_at.
 *
 * Every report was bulk-imported on one day, so created_at carries no editorial
 * meaning — sorting by it returns "North American Sports Tech Report 2021".
 * report_year is the real recency signal.
 *
 * Asking for a handful rather than one because that sort is NULLS FIRST: a
 * report saved without a year would otherwise take the card. We skip those.
 */
const QUERY = 'limit=5&sort=-report_year';

export async function latestReport(): Promise<Report | null> {
  const base = process.env.BACKEND_URL;
  if (!base) return null;
  try {
    const res = await fetch(`${base}/api/reports?${QUERY}`, {
      next: { revalidate: REVALIDATE_SEC },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) {
      console.error(`reports endpoint responded ${res.status}`);
      return null;
    }
    const json = (await res.json()) as { data?: Row[] };
    const row = (json.data ?? []).find((r) => r.report_year && r.title && r.cover_url);
    if (!row) return null;
    return {
      title: row.title!,
      // Atlas, not the retired Intelligence Hub. Atlas asks a signed-out visitor
      // to sign in, then returns them to this report. Slugs are nullable;
      // without one the reports index is still a sane destination.
      link: row.slug
        ? `https://www.atlas.sportstechx.com/reports/${encodeURIComponent(row.slug)}`
        : 'https://www.atlas.sportstechx.com/reports',
      image: row.cover_url!,
    };
  } catch (error) {
    console.error('reports endpoint unavailable', error);
    return null;
  }
}
