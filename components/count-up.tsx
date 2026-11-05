'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * A stat figure that counts up to its value the first time it scrolls into view.
 *
 * The values are display strings, not numbers — "20K+", "2,000+" — so the
 * number is split off its decoration and only that part animates. The suffix
 * ("K+", "+") and any thousands separator are put back on every frame, which is
 * why the component takes the formatted string rather than a number: there is
 * no way to reconstruct "20K+" from 20.
 *
 * The final value is what renders on the server, so the figure is correct
 * without JavaScript and the band never reflows. The animation only replaces it
 * once the observer fires, and the section sits well below the fold, so nobody
 * sees it reset.
 */
const DURATION = 1400;
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

/**
 * "2,000+" -> { n: 2000, suffix: "+", grouped: true }
 * "2.5K+"  -> { n: 2.5, suffix: "K+", decimals: 1 } so it climbs to 2.5, not 3
 */
function parse(
  value: string
): { n: number; prefix: string; suffix: string; grouped: boolean; decimals: number } | null {
  const m = value.match(/^(\D*)([\d.,]+)(.*)$/);
  if (!m) return null;
  const [, prefix, digits, suffix] = m;
  const n = Number(digits.replace(/,/g, ''));
  const decimals = digits.split('.')[1]?.length ?? 0;
  return Number.isFinite(n) ? { n, prefix, suffix, grouped: digits.includes(','), decimals } : null;
}

export function CountUp({ value, className }: { value: string; className?: string }) {
  const el = useRef<HTMLParagraphElement>(null);
  const [shown, setShown] = useState(value);

  useEffect(() => {
    const node = el.current;
    const parts = parse(value);
    // Nothing numeric to animate, or the reader asked for less motion: the
    // server-rendered final value already stands.
    if (!node || !parts) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let raf = 0;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        io.disconnect();
        const started = performance.now();
        const frame = (now: number) => {
          const t = Math.min(1, (now - started) / DURATION);
          const at = parts.n * easeOut(t);
          const body = parts.grouped
            ? Math.round(at).toLocaleString('en-US')
            : at.toFixed(parts.decimals);
          setShown(parts.prefix + body + parts.suffix);
          if (t < 1) raf = requestAnimationFrame(frame);
        };
        raf = requestAnimationFrame(frame);
      },
      { threshold: 0.4 },
    );
    io.observe(node);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value]);

  return (
    // tabular-nums so the digits keep one width while they climb; without it
    // the row jitters as 1 gives way to 8 and back.
    <p ref={el} className={className} style={{ fontVariantNumeric: 'tabular-nums' }}>
      {shown}
    </p>
  );
}
