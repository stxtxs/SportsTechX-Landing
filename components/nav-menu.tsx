import { Fragment } from 'react';
import Image from 'next/image';
import { navMenu } from '@/lib/content';
import { cn } from '@/lib/utils';

/**
 * The card that drops from SOLUTIONS, per the interactions board: 503x163,
 * radius 16, a 9% hairline and a 39px shadow at 8%, right-aligned with the nav
 * pill and 28 clear of it.
 *
 * It fades up rather than merely appearing — opacity 0 to 1 from 48px below,
 * 320ms ease-out after a 40ms delay. The closed state is the resting state and
 * the motion is layered on top, so a reader who has asked for less of it gets
 * the card without the travel rather than an invisible one.
 *
 * The wrapper's padding covers the 28px gap: without it the pointer leaves the
 * nav on its way to the card and the hover drops.
 */
export function NavMenu({ open }: { open: boolean }) {
  return (
    <div
      className={cn(
        // Right-aligned with the nav pill: the pill is narrower than the card
        // now (two links), so a left-aligned card ran off the screen's edge.
        'absolute top-full right-0 z-10 pt-[28px]',
        open ? 'visible' : 'invisible delay-200'
      )}
    >
      <div
        className={cn(
          'w-[503px] rounded-[16px] border border-black/[0.09] bg-white px-[34px] py-[23px]',
          'shadow-[0_0_39px_rgb(0_0_0/0.08)] dark:border-white/[0.12] dark:bg-[#12141b]',
          'motion-safe:transition-[opacity,translate] motion-safe:duration-[320ms] motion-safe:ease-out',
          open
            ? 'opacity-100 translate-y-0 motion-safe:delay-[40ms]'
            : 'opacity-0 translate-y-[48px] motion-reduce:opacity-0'
        )}
      >
        {/* The board rules the two columns apart, centred in their 74 gap. */}
        <div className="flex gap-[37px]">
          {navMenu.map((column, i) => (
            <Fragment key={column.label}>
              {i > 0 && (
                <span aria-hidden className="w-px self-stretch bg-black/[0.09] dark:bg-white/[0.12]" />
              )}
            <div>
              <p className="tracked font-mono text-[10px] leading-none text-[#909090]">
                {column.label}
              </p>
              <ul className="mt-[14px] flex flex-col gap-[32px]">
                {column.items.map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      // Also flips the Solutions sector toggle; the href still
                      // scrolls the section into view. Solutions listens for this.
                      onClick={() =>
                        window.dispatchEvent(
                          new CustomEvent('stx:sector', { detail: item.sector })
                        )
                      }
                      className="group/row flex h-[28px] items-center gap-[10px] text-fg transition-colors duration-[80ms] ease-out hover:text-accent active:opacity-70"
                    >
                      <span
                        className={cn(
                          'grid size-[28px] shrink-0 place-items-center rounded-full bg-current',
                          'transition-colors duration-[80ms] ease-out'
                        )}
                      >
                        {'icon' in item ? (
                          <Image
                            src={item.icon}
                            alt=""
                            width={item.w}
                            height={item.h}
                            // The glyph is punched out of the badge, so it takes
                            // the page background rather than a fixed white.
                            className="brightness-0 invert dark:invert-0"
                          />
                        ) : (
                          <span className="font-display text-[14px] leading-none text-white dark:text-black">
                            {item.initial}
                          </span>
                        )}
                      </span>
                      <span className="optical-caps tracked font-sans text-[16px] leading-none font-medium">
                        {item.label}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
