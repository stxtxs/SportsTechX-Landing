'use client';

import { useState, useSyncExternalStore } from 'react';
import { BrandLogo } from '@/components/brand-logo';
import { NavMenu } from '@/components/nav-menu';
import { MobileMenuButton, useMobileMenu } from '@/components/mobile-menu';
import { ThemeToggle } from '@/components/theme-toggle';
import { nav } from '@/lib/content';
import { cn } from '@/lib/utils';

/**
 * True once the page has scrolled past the nav's own inset.
 *
 * useSyncExternalStore rather than useState + useEffect for two reasons: it
 * reports the right value on the first client render, so reloading partway down
 * the page shows the bar immediately instead of flashing the transparent state;
 * and it avoids calling setState inside an effect, which the project's lint
 * config rejects (react-hooks/set-state-in-effect).
 */
/** The artboard's 16 gap above the nav, which `top-4` gives when it is fixed. */
const NAV_INSET = 16;

/** The announcement banner's height while it shows (0 once closed), from the var it keeps on <html>. */
const bannerHeight = () => parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--announce-h')) || 0;

const subscribe = (onChange: () => void) => {
  window.addEventListener('scroll', onChange, { passive: true });
  return () => window.removeEventListener('scroll', onChange);
};

/**
 * Desktop (1512): logo 195x54, then a 426x58 pill holding the links plus the
 * night-mode switch, then a 270x58 outlined CTA. Mobile (402): hamburger,
 * centred logo, theme toggle.
 *
 * Rendered once in the root layout, not per page, so it is shared by every
 * route. It is `fixed` rather than `sticky` on purpose: the hero is sized to
 * 100svh, and a nav in normal flow would stack on top of that and push the page
 * past the viewport — the exact problem that hid the hero's lower half before.
 * Fixed also keeps it pinned while scrolling, and because the mobile drawer
 * transforms its shell, the nav still slides with the page when the drawer opens.
 */
export function NavBar() {
  const { open: drawerOpen, lockedY } = useMobileMenu();
  const [menu, setMenu] = useState(false);
  const scrolled = useSyncExternalStore(
    subscribe,
    // Docks once the page has scrolled past the announcement banner too, so the
    // glass band never sits over a banner that is still on screen.
    () => window.scrollY > 16 + bannerHeight(),
    () => false // the server cannot know the scroll position
  );

  return (
    <header
      // While the drawer is out its shell is transformed, which makes the shell
      // the containing block for `fixed` children — a fixed nav would then be
      // pinned to the top of the document and scroll away off-screen, taking
      // the close button with it. Anchor to the captured offset instead.
      // + NAV_INSET because the inline top overrides `top-4`: pinning to the
      // bare offset dropped the 16 gap and the close button jumped up on open,
      // out of line with the drawer's logo. The artboard sits it at 21.62.
      // While the banner is still on screen at that offset, stay below it.
      style={drawerOpen ? { top: lockedY + NAV_INSET + Math.max(0, bannerHeight() - lockedY) } : undefined}
      className={cn(
        'inset-x-0 z-50 transition-[top,padding,background-color,box-shadow] duration-300',
        drawerOpen ? 'absolute' : 'fixed',
        // The docked glass bar is suppressed while the drawer is out: the
        // artboard shows the plain nav there, and leaving it on painted a
        // translucent white strip across the top of the slid page.
        scrolled && !drawerOpen
          // Docked: a full-width glass band. The board gives it a white
          // gradient from 80% to 29% over an 11.6 background blur, and neither
          // a rule nor a shadow — the fade is what ends the band. Its heights
          // (92 band, 58 nav, 54 logo) are deliberately not followed: they were
          // tried and read as too heavy, so the nav keeps its own 52.
          ? 'top-0 bg-linear-to-b from-[var(--nav-scrim-from)] to-[var(--nav-scrim-to)] py-3 backdrop-blur-[11.6px]'
          : // Below the announcement banner while it shows (--announce-h, 0 once closed).
            'top-[calc(var(--announce-h,0px)+1rem)] lg:top-[calc(var(--announce-h,0px)+1.5rem)]'
      )}
    >
      <div className="container-page flex items-center justify-between">
        {/* Mobile-only menu button; the desktop pill carries the links instead. */}
        <MobileMenuButton className="lg:hidden" />

        {/* 174x48 on the 402 artboard, the same 48 as desktop.
            Hidden while the drawer is out: the artboard's 402 board leaves a
            5px sliver of it past the slid page, but the shift is capped at 283
            so a wider phone shows a real chunk of the wordmark instead. */}
        {/* Home, not "#top": from a sub-page (e.g. /about) a hash goes nowhere —
            the logo must land on the homepage from anywhere. */}
        <a href="/" aria-label="SportsTechX home" className="group/logo inline-flex">
          <BrandLogo
            className={cn('h-[48px] transition-[filter,opacity] duration-200 ease-out group-hover/logo:brightness-0 group-active/logo:opacity-70 dark:group-hover/logo:invert', drawerOpen && 'opacity-0 lg:opacity-100')}
            priority
          />
        </a>

        <div className="flex items-center gap-5">
          {/* relative: the drop-down is positioned against the pill's left
              edge, which is where the board aligns it — not against the link. */}
          <nav
            className="relative hidden h-[50px] items-center gap-4 rounded-full border-[1.5px] border-nav-border bg-nav-bg pr-1 pl-[20px] shadow-nav lg:flex xl:gap-9"
            onMouseLeave={() => setMenu(false)}
            onBlur={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget as Node)) setMenu(false);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Escape') setMenu(false);
            }}
          >
            {nav.links.map((link) => {
              const opens = link.label === 'SOLUTIONS';
              return (
                <a
                  key={link.label}
                  href={link.href}
                  {...('newTab' in link && link.newTab ? { target: '_blank', rel: 'noreferrer' } : {})}
                  // Keyboard opens it too, and any other link closes it.
                  onMouseEnter={() => setMenu(opens)}
                  onFocus={() => setMenu(opens)}
                  aria-expanded={opens ? menu : undefined}
                  className={cn(
                    'optical-caps nav-type tracked font-sans font-medium transition-colors duration-[80ms] ease-out hover:text-accent active:opacity-70',
                    // The board holds the trigger pink for as long as the card
                    // is out, not just while the pointer is on the word.
                    opens && menu ? 'text-accent' : 'text-fg'
                  )}
                >
                  {link.label}
                </a>
              );
            })}
            <ThemeToggle />
            <NavMenu open={menu} />
          </nav>

          {/* Opens the newsletter modal (newsletter-modal.tsx listens) rather
              than leaving for the hosted page. */}
          <button
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent('stx:newsletter-open'))}
            className="group/cta tracked hidden h-[50px] items-center justify-center rounded-full border-[1.5px] border-accent-2 bg-accent/5 nav-type px-[15px] font-sans font-medium text-accent-2 transition-[background-color,color,scale] duration-200 ease-out hover:bg-accent hover:text-white active:bg-accent active:text-white active:duration-[80ms] motion-safe:hover:scale-105 motion-safe:active:scale-95 lg:inline-flex dark:bg-accent/[0.13]"
          >
            <span className="optical-caps transition-opacity duration-[80ms] ease-out group-active/cta:opacity-70">{nav.cta.label}</span>
          </button>

          {/* Mobile keeps only the theme toggle — the rest lives in the drawer. */}
          <ThemeToggle
            className={cn(
              'size-[38px] border-[1.5px] border-black/[0.09] bg-surface shadow-[0_0_39.4px_rgb(0_0_0/0.08)] lg:hidden dark:border-white/[0.12]',
              drawerOpen && 'opacity-0'
            )}
          />
        </div>
      </div>
    </header>
  );
}
