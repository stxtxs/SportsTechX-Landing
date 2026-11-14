import { CountUp } from '@/components/count-up';
import { stats } from '@/lib/content';
import { cn } from '@/lib/utils';

/**
 * The navy stats band: four equal columns, each figure and its label centred
 * in its own column, with hairlines only BETWEEN the stats (none at the outer
 * edges).
 *
 * Twin of the Atlas landing's counter row (SportsTechX-Client,
 * components/landing/intro-hero.tsx + `.lp-hero-stats` in landing.css). The two
 * sites are separate apps, so they cannot share one component file; this one
 * copies its structure and measurements one for one, and a change to either
 * should be made to both:
 *   - a description list, label (dt) first in the markup, figure (dd) shown
 *     above it via `order`;
 *   - columns padded 8px 24px (6px 14px on phones), figure-to-label gap 6px;
 *   - divider 1px white at 12%, on every column but the first;
 *   - label New Frank 14px (12px on phones), tracked 0.08em, uppercase, white
 *     at 70%, on one line (a phone may wrap NEWSLETTER SUBSCRIBERS, which the
 *     Atlas labels are short enough never to need);
 *   - four columns above 1100px, two below (the divider then only between the
 *     two columns of each row, 24px between the rows).
 *
 * The figures keep this site's own type (Bebas at the stat size, counting up).
 */
export function Stats() {
  return (
    <section data-rise className="noise section-y bg-stats [--noise-alpha:0.6]">
      <div className="container-page">
        <dl className="grid grid-cols-2 gap-y-6 text-white min-[1101px]:grid-cols-4 min-[1101px]:gap-y-0">
          {stats.map((stat, i) => (
            <div
              key={stat.value}
              className={cn(
                'flex flex-col items-center px-[14px] py-[6px] text-center min-[761px]:px-6 min-[761px]:py-2',
                // Hairlines between stats only: the second column of each row
                // on two columns, every column but the first on four.
                i % 2 === 1 ? 'border-l border-white/12' : i > 0 && 'min-[1101px]:border-l min-[1101px]:border-white/12'
              )}
            >
              {/* One line from tablet width up. On a phone the column is ~170px,
                  narrower than NEWSLETTER SUBSCRIBERS, so a label that doesn't
                  fit there wraps (balanced) rather than run past its column. */}
              <dt className="mt-[6px] font-sans text-[12px] tracking-[0.08em] text-balance text-white/70 uppercase min-[761px]:text-[14px] min-[761px]:whitespace-nowrap">
                {stat.label}
              </dt>
              <dd className="order-first m-0">
                {/* stat-figure (globals.css) shrinks it slightly on small phones. */}
                <CountUp value={stat.value} className="stat-figure font-display text-stat leading-[0.94]" />
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
