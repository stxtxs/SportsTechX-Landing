import { NextResponse } from 'next/server';

/**
 * Early-access requests (the Boardroom card's form), forwarded server-side to
 * the platform API, which stores them and emails the team. Going through this
 * route keeps the browser same-origin, so the API needs no CORS for this site.
 */
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const str = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : undefined) || undefined;

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
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
    headers: { 'Content-Type': 'application/json' },
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

  if (!res || !res.ok) {
    return NextResponse.json(
      { error: 'Something went wrong. Please try again, or email hello@sportstechx.com.' },
      { status: 502 },
    );
  }
  return NextResponse.json({ ok: true });
}
