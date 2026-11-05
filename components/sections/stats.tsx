import { Fragment } from 'react';
import { CountUp } from '@/components/count-up';
import { stats } from '@/lib/content';
import { cn } from '@/lib/utils';

/**
 * The navy band. On the artboard the section is 1513x308 and the row inside it
 * is 1086x149 laid out as
 *   rule, stat, rule, stat, rule, stat, rule, stat, rule
 * — five zero-width rules with a 50px gap either side, so they land evenly at
 * x = 0, 272, 543, 814, 1086.
 *
 * That structure is reproduced literally here. The previous version put the
 * outer rules on the list's own left/right borders, and because the list
 * stretched to the container the final rule landed at the container edge
 * instead of 50px past the last figure — which is why the last gap was double
 * the others. `w-fit` is what holds the row to its content.
 *
 * Everything is 0.9x the artboard: figure 72 -> 64.8, caption 16 -> 14.4 (both
 * off --scale-stat so the designed 4.5:1 survives), rules 149 -> 134, gap 50 -> 45.
 */
/* Rule height and column gap sit a little above the 0.9x type scale by choice —
 * the band reads better with more air than a strict 0.9 of the artboard's
 * 149/50 gives. The gap is fluid rather than fixed: the row is w-fit, so a flat
 * 56px would make it 1068px wide and overflow the container at the lg
 * breakpoint (1024px, where the column is only ~921px). This tracks from 28px
 * there up to 56px at 1512. */
const RULE = 'hidden w-px shrink-0 bg-white/20 md:block md:h-[133px] lg:h-[158px]';

/**
 * The mobile cross. The artboard draws it as four separate 1px segments at 61%
 * white, not as cell borders: the vertical runs y 40-149 and 177-286 at x=201,
 * the horizontal x 40-187 and 215-364 at y=163. Both leave a 28 gap centred on
 * the intersection, so the two rules never actually touch. Written as shares of
 * the 362x274 grid so they hold at any phone width.
 */
const CROSS = [
  'top-[3.6%] left-1/2 h-[39.8%] w-px -translate-x-1/2',
  'top-[53.6%] left-1/2 h-[39.8%] w-px -translate-x-1/2',
  'top-[48.5%] left-[5.5%] h-px w-[40.6%]',
  'top-[48.5%] left-[53.9%] h-px w-[41.2%]',
];
const GAP = 'md:gap-[clamp(14px,5.74vw-30.8px,56px)]';

export function Stats() {
  return (
    <section data-rise className="noise section-y bg-stats [--noise-alpha:0.6]">
      <div className="container-page">
        <div className="relative">
          {CROSS.map((pos) => (
            <span key={pos} aria-hidden className={cn('absolute bg-white/[0.61] md:hidden', pos)} />
          ))}

        <ul
          className={cn(
            // The artboard's mobile grid is two 156 cells with a 50 gutter in
            // a 362 column, which is what puts the right column's copy clear of
            // the centre rule rather than hard against it.
            'grid grid-cols-2 gap-x-[50px] text-white',
            // Centred, not top- or bottom-aligned. The artboard uses align: MAX
            // against a 149 rule and a 140 block, so its 9px of slack is
            // invisible. Here the rules are 158 against a ~106 block, and
            // parking all 52px of that slack at one end reads as the figure
            // sitting outside its rule — above it when bottom-aligned, below it
            // when top-aligned. Splitting the difference keeps it enclosed.
            'md:mx-auto md:flex md:w-fit md:items-center',
            GAP
          )}
        >
          {stats.map((stat, i) => (
            <Fragment key={stat.value}>
              <li aria-hidden className={RULE} />
              <li
                className={cn(
                  // Both columns read from the left, 20 in from their own cell,
                  // as the artboard has them.
                  // Width follows the figure size (2.65em of it), so a figure
                  // as wide as "20,000+" fits at every breakpoint.
                  'flex flex-col items-start py-5 pl-5 md:w-[calc(var(--text-stat)*2.65)] md:px-0 md:py-0'
                )}
              >
                <div className="flex flex-col gap-[8px] text-left">
                  {/* stat-figure (globals.css) shrinks it slightly on small phones. */}
                  <CountUp value={stat.value} className="stat-figure font-display text-stat leading-[0.94]" />
                  <p className="tracked font-sans text-stat-label leading-[1.3] whitespace-pre-line">
                    {stat.label}
                  </p>
                </div>
              </li>
              {i === stats.length - 1 && <li aria-hidden className={RULE} />}
            </Fragment>
          ))}
        </ul>
        </div>
      </div>
    </section>
  );
}
