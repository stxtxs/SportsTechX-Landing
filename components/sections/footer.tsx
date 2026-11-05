import type { CSSProperties } from 'react';
import { BrandLogo } from '@/components/brand-logo';
import { NewsletterForm } from '@/components/newsletter-form';
import { SectorLink } from '@/components/sector-link';
import { footer, type FooterLink } from '@/lib/content';
import vectors from '@/design/vectors.json';
import { cn } from '@/lib/utils';

/**
 * A logo column, three link columns, and the "Cloud grid" of 2px rules that
 * frames them — two horizontals running 4 units wider than the content column
 * on each side, and a vertical before each link column that overhangs above and
 * below.
 *
 * The artboard drew three link columns and placed its verticals at a hardcoded
 * x=496/791/1085. Those were measurements, not arithmetic: the track boundaries
 * sat at 545/848/1151, so each rule was a different distance (49, 57, 66) to the
 * left of its boundary and a column change meant re-measuring all of them. Each
 * link column now draws its own rule instead, so the count follows the content.
 *
 * The 402 artboard rules it differently: the columns stack, so the grid there is
 * one horizontal above, one per column, and one before the legal rows. The inner
 * ones are the columns' own top borders; see globals.css.
 *
 * Glyphs are the artboard's own vectors, tinted through a CSS mask so they
 * follow the text colour in both themes.
 */
function Icon({ name, className }: { name: string; className?: string }) {
  const art = vectors[`icon-footer-${name}` as keyof typeof vectors];
  return (
    <span
      aria-hidden
      style={
        {
          '--iw': art.w,
          '--ih': art.h,
          '--m': `url(/vectors/icon-footer-${name}.svg)`,
        } as CSSProperties
      }
      className={cn('footer-icon size-4', className)}
    />
  );
}

const LINK =
  'footer-link inline-flex items-center gap-[15px] font-sans text-body leading-[1.78] text-heading/70 dark:text-heading/55 transition-colors duration-[80ms] ease-out hover:text-black active:text-heading/50 dark:hover:text-white';

/** A column's text links. A `sector` link also sets the Solutions selector. */
function LinkList({ links }: { links: FooterLink[] }) {
  return (
    <ul className="flex flex-col">
      {links.map((link) => {
        const inner = (
          <>
            {link.icon && <Icon name={link.icon} />}
            {link.label}
          </>
        );
        return (
          <li key={link.label}>
            {link.sector ? (
              <SectorLink href={link.href} sector={link.sector} className={LINK}>
                {inner}
              </SectorLink>
            ) : (
              <a
                href={link.href}
                {...(link.href.startsWith('http') || link.newTab ? { target: '_blank', rel: 'noreferrer' } : {})}
                className={LINK}
              >
                {inner}
              </a>
            )}
          </li>
        );
      })}
    </ul>
  );
}

export function Footer() {
  return (
    <footer id="about" data-rise className="relative bg-surface">
      {/* The container query box must be the content column, not the footer:
          container-type on the <footer> made 100cqw the viewport and scaled
          every artboard unit by 1.1. */}
      <div className="footer-rig container-page">
        <span aria-hidden className="footer-rule footer-rule-top mt-12 block h-px w-full bg-line/50 dark:bg-line" />

        <div className="footer-details relative mt-12 grid gap-12 lg:grid-cols-4">
          <div className="footer-col-1 flex flex-col gap-[18px]">
            {/* The artboard ships one pink lockup for every placement; black
                here is a brand call from the client, so it is filtered rather
                than a second asset. */}
            <BrandLogo className="footer-logo h-[41px] self-start brightness-0 dark:invert" />

            <p className="footer-desc font-sans text-body leading-[1.78] text-heading/70 dark:text-heading/55">
              {footer.blurb}
            </p>

            {/* Subscribes through /api/newsletter (Beehiiv), falling back to the
                hosted subscribe page when no Beehiiv key is configured. Same
                control as the nav CTA's modal — see newsletter-form.tsx. */}
            <NewsletterForm tone="footer" />
          </div>

          {footer.columns.map((column) => {
            const links = column.links ?? [];
            const labelled = links.filter((l) => !l.iconOnly);
            const glyphs = links.filter((l) => l.iconOnly);
            return (
              <div key={column.title} className="footer-col relative flex flex-col gap-[21px]">
                <h2 className="footer-head tracked font-display text-eyebrow leading-[1.45] text-black uppercase dark:text-white">
                  {column.title}
                </h2>
                {/* Sub-grouped like the nav's Solutions dropdown: a small
                    eyebrow over each group. */}
                {column.groups?.map((group) => (
                  <div key={group.title} className="flex flex-col gap-1">
                    <p className="footer-subhead tracked font-mono text-legal text-heading/50 uppercase dark:text-heading/45">
                      {group.title}
                    </p>
                    <LinkList links={group.links} />
                  </div>
                ))}
                {labelled.length > 0 && <LinkList links={labelled} />}
                {/* Socials sit as bare glyphs on one row. The label is dropped
                    from view but carried as the accessible name — without it
                    the link would announce as nothing. */}
                {glyphs.length > 0 && (
                  <ul className="flex items-center gap-4">
                    {glyphs.map((link) => (
                      <li key={link.label}>
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noreferrer"
                          aria-label={link.label}
                          className="footer-link inline-flex text-heading/70 dark:text-heading/55 transition-colors duration-[80ms] ease-out hover:text-black active:text-heading/50 dark:hover:text-white"
                        >
                          {link.icon && <Icon name={link.icon} />}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>

        <span aria-hidden className="footer-rule footer-rule-bottom mt-12 block h-px w-full bg-line/50 dark:bg-line" />

        <div className="footer-legal mt-6 flex flex-col gap-2 pb-10 font-mono text-legal text-heading/70 lg:flex-row lg:items-center lg:justify-between dark:text-heading/55">
          <p>{footer.legal}</p>
          <p>
            {footer.legalLinks.map((link, i) => (
              <span key={link.label}>
                {i > 0 && <span aria-hidden> · </span>}
                {/* Same-origin now that these pages are ours; only a genuinely
                    external link should steal a tab. Mirrors the column links. */}
                <a
                  href={link.href}
                  {...(link.href.startsWith('http') ? { target: '_blank', rel: 'noreferrer' } : {})}
                  className="transition-colors duration-[80ms] ease-out hover:text-black active:text-heading/50 dark:hover:text-white"
                >
                  {link.label}
                </a>
              </span>
            ))}
          </p>
        </div>
      </div>
    </footer>
  );
}
