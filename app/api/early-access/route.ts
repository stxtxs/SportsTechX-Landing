import { NextResponse } from 'next/server';

/**
 * Early-access requests (the Boardroom card's form), forwarded server-side to
 * the platform API, which stores them and emails the team. Going through this
 * route keeps the browser same-origin, so the API needs no CORS for this site.
 *
 * Abuse guards: a browser request from another site is refused (Origin), and
 * PROXY_SECRET (server-only env, same value on the API) proves to the API that
 * the call came from here, so nobody can write to it directly. With it we also
 * pass the visitor's IP (Vercel sets x-real-ip; clients can't forge it), so the
 * API rate-limits each visitor rather than everyone sharing this server's IP.
 */
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const str = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : undefined) || undefined;

export async function POST(req: Request) {
  const origin = req.headers.get('origin');
  const host = req.headers.get('x-forwarded-host') ?? req.headers.get('host');
  if (origin && host && origin.replace(/^https?:\/\//, '') !== host) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  }
  const raw: unknown = await req.json().catch(() => null);
  const body = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;
  const email = str(body.email, 320);
  if (!email || !EMAIL.test(email)) {
    return NextResponse.json({ error: 'Enter a valid email address.' }, { status: 400 });
  }
  const base = process.env.BACKEND_URL;
  if (!base) {
    return NextResponse.json({ error: 'Requests are unavailable right now. Please email hello@sportstechx.com.' }, { status: 503 });
  }

  const res = await fetch(`${base}/api/public/early-access`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(process.env.PROXY_SECRET ? {
        'x-proxy-secret': process.env.PROXY_SECRET,
        'x-visitor-ip': req.headers.get('x-real-ip') ?? '',
      } : {}),
    },
    body: JSON.stringify({
      product: 'boardroom', // the only early-access list so far
      email,
      name: str(body.name, 200),
      company: str(body.company, 200),
      source: 'sportstechx.com / Boardroom card',
      website: str(body.website, 500),
    }),
    signal: AbortSignal.timeout(10_000),
  }).catch(() => null);

  // The API validates more strictly than the regex above (e.g. `a@b.c`).
  if (res?.status === 400) {
    return NextResponse.json({ error: 'Enter a valid email address.' }, { status: 400 });
  }
  if (res?.status === 429) {
    return NextResponse.json({ error: 'Too many requests right now. Please try again in a minute.' }, { status: 429 });
  }
  if (!res || !res.ok) {
    return NextResponse.json(
      { error: 'Something went wrong. Please try again, or email hello@sportstechx.com.' },
      { status: 502 },
    );
  }
  return NextResponse.json({ ok: true });
}
