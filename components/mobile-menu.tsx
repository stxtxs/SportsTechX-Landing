'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { BrandLogo } from '@/components/brand-logo';
import { mobileMenu } from '@/lib/content';
import { cn } from '@/lib/utils';

type MenuState = {
  open: boolean;
  toggle: () => void;
  close: () => void;
  /**
   * Scroll offset captured when the drawer opened. The shell is translated
   * while the drawer is out, and a transformed ancestor becomes the containing
   * block for `fixed` descendants — so the fixed nav inside it stops resolving
   * against the viewport and lands at the top of the *document*. Anchoring it
   * to this offset instead keeps it at the visible top while it slides with the
   * page, which is what the artboard shows.
   */
  lockedY: number;
};
const MobileMenuContext = createContext<MenuState | null>(null);

export function useMobileMenu() {
  const ctx = useContext(MobileMenuContext);
  if (!ctx) throw new Error('useMobileMenu must be used inside <MobileMenuProvider>');
  return ctx;
}

/**
 * The artboard's menu board is 402 wide: a 351 panel sits behind the page and
 * the page slides 283 to the right, exposing a 41 top-left radius, a 2px
 * #bebebe edge and a shadow cast back to the left. Sizes are capped at those
 * artboard pixels so the drawer does not grow absurdly on a wide phone.
 */
export function MobileMenuProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [lockedY, setLockedY] = useState(0);

  const close = useCallback(() => setOpen(false), []);
  // Captured in the handler, not an effect, so it is read before the body
  // scroll lock takes hold.
  const toggle = useCallback(() => {
    setLockedY(window.scrollY);
    setOpen((v) => !v);
  }, []);

  // Escape closes; body scroll is locked while the drawer is out.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    // The slid page is still full width, so it overhangs the document by the
    // shift. Both elements get clipped: body alone leaves the html element
    // scrollable sideways.
    const prevBody = document.body.style.overflow;
    const prevRoot = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevBody;
      document.documentElement.style.overflow = prevRoot;
      window.removeEventListener('keydown', onKey);
    };
  }, [open, close]);

  const value = useMemo(() => ({ open, toggle, close, lockedY }), [open, toggle, close, lockedY]);
  return <MobileMenuContext.Provider value={value}>{children}</MobileMenuContext.Provider>;
}

/**
 * The nav's round button. The artboard draws it 38x38 at radius 50 with a
 * 1.5px black edge at 9% and a wide soft shadow; open, it turns #343434 with
 * a white cross.
 */
export function MobileMenuButton({ className }: { className?: string }) {
  const { open, toggle } = useMobileMenu();
  return (
    <button
      type="button"
      onClick={toggle}
      aria-expanded={open}
      aria-controls="mobile-menu"
      aria-label={open ? 'Close menu' : 'Open menu'}
      className={cn(
        'grid size-[38px] shrink-0 place-items-center rounded-full border-[1.5px] border-black/[0.09] shadow-[0_0_39.4px_rgb(0_0_0/0.08)] dark:border-white/[0.12]',
        'transition-colors duration-[80ms] ease-out',
        // Pressed reads the same as open on the board — #343434 behind a white
        // glyph — so the two states share their treatment, dark mode included.
        'active:bg-[#343434] active:text-white dark:active:bg-white dark:active:text-[#343434]',
        open ? 'bg-[#343434] text-white dark:bg-white dark:text-[#343434]' : 'bg-surface text-fg',
        className
      )}
    >
      {open ? (
        /* A 12x12 cross centred in the artboard's 24 frame, 1.5 stroke. */
        <svg viewBox="0 0 24 24" aria-hidden className="size-6" fill="none" stroke="currentColor" strokeWidth={1.5}>
          <path d="M6 6 18 18M18 6 6 18" />
        </svg>
      ) : (
        /* Four rules at y 5/10/15/20 — the last is 8 wide, not 18. lucide's
           three even bars were the wrong glyph. */
        <svg viewBox="0 0 24 24" aria-hidden className="size-6" fill="none" stroke="currentColor" strokeWidth={1.5}>
          <path d="M3 5h18M3 10h18M3 15h18M3 20h8" />
        </svg>
      )}
    </button>
  );
}

/** The drawer itself — rendered behind the page, revealed by the slide. */
export function MobileMenuPanel() {
  const { open, close } = useMobileMenu();
  return (
    <>
    <div
      id="mobile-menu"
      aria-hidden={!open}
      className={cn(
        'fixed inset-y-0 left-0 z-10 w-[min(87.3%,351px)] lg:hidden',
        // The page still does the pushing; the panel just travels a short way
        // with it so it arrives rather than being uncovered fully formed.
        // `translate`, not `transform`: Tailwind v4 emits translate-x-* to the
        // translate property, so naming transform here animated nothing and the
        // panel snapped into place.
        'transition-[translate,opacity] duration-[420ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none',
        open ? 'translate-x-0 opacity-100' : 'pointer-events-none -translate-x-8 opacity-0'
      )}
    >
      {/* Grain lives on this inner box: the `noise` utility sets position
          relative, which would undo the fixed panel above it. */}
      <div className="noise h-full overflow-y-auto bg-[#f7f3e9] px-[30px] py-[22px] [--noise-alpha:0.35] dark:bg-[#212634]">
        <BrandLogo className="h-[38px] w-auto self-start" />

        <nav className="mt-[74px] flex w-[211px] flex-col gap-[50px]">
          {mobileMenu.groups.map((group) => (
            <div key={group.title} className="flex flex-col gap-[15px]">
              <p className="tracked font-mono text-[13px] leading-none text-black/[0.48] dark:text-white/[0.48]">
                {group.title}
              </p>
              <ul className="flex flex-col gap-1">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      {...('newTab' in link && link.newTab ? { target: '_blank', rel: 'noreferrer' } : {})}
                      onClick={() => {
                        // Same as the nav dropdown: flips the Solutions selector.
                        if ('sector' in link) window.dispatchEvent(new CustomEvent('stx:sector', { detail: link.sector }));
                        close();
                      }}
                      tabIndex={open ? undefined : -1}
                      className={cn(
                        // The board's other mobile active state: links drop to 0.5 on press.
                        'tracked block py-1 font-sans text-[16px] leading-none font-medium',
                        'transition-opacity duration-[80ms] ease-out hover:opacity-70 active:opacity-50',
                        'accent' in link && link.accent ? 'text-accent-2' : 'text-black dark:text-white'
                      )}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>
    </div>

    {/* The shell's own rounded corner belongs to the top of the *document*, so
        it scrolls out of view and the page reads square once you have moved
        down the page. This repaints the same 41 corner — arc of border and
        all — at the viewport's edge instead. It has to be a sibling of the
        shell: inside it, `fixed` would resolve against the transform. */}
    <span
      aria-hidden
      className={cn(
        'corner-notch pointer-events-none fixed top-0 left-[min(70.4%,283px)] z-30 size-[41px] transition-opacity duration-[420ms] lg:hidden motion-reduce:transition-none',
        open ? 'opacity-100' : 'opacity-0'
      )}
    >
      {/* Same class and same --noise-alpha as the panel, so the grain matches
          exactly instead of being approximated. */}
      <span className="noise block size-full bg-[#f7f3e9] [--noise-alpha:0.35] dark:bg-[#212634]" />
    </span>
    </>
  );
}

/**
 * Wraps the page content and performs the slide.
 *
 * `nav` is taken separately from `children` because the artboard dims and
 * softens the page *behind* the nav bar — its close button stays crisp. Note
 * the transform's side effect too: while it is applied this element becomes
 * the containing block for any `position: fixed` descendant, so NavBar
 * switches to `absolute` at the captured scroll offset while the drawer is out.
 */
export function MobileMenuShell({ nav, children }: { nav: React.ReactNode; children: React.ReactNode }) {
  const { open, close } = useMobileMenu();
  return (
    <div
      className={cn(
        'relative z-20 min-h-dvh bg-page',
        'transition-[translate,border-radius,box-shadow] duration-[420ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none',
        open &&
          'translate-x-[min(70.4%,283px)] overflow-hidden rounded-tl-[41px] border-l-2 border-[#bebebe]/65 shadow-[-11px_0_42.2px_rgb(0_0_0/0.13)] dark:border-[#bebebe]/[0.18]'
      )}
    >
      {nav}

      {/* The artboard puts the page's content at 87%; the softening is the
          "a little blurred" read of that same treatment. */}
      <div
        className={cn(
          'transition-[opacity,filter] duration-[420ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none',
          open && 'opacity-[0.87] blur-[2px]'
        )}
      >
        {children}
      </div>

      {/* "Gradient Mask": 117 of the page's own background fading out to the
          right, which is what softens the edge nearest the drawer. */}
      <span
        aria-hidden
        className={cn(
          'pointer-events-none absolute inset-y-0 left-0 z-30 w-[min(29.1%,117px)] bg-linear-to-r from-surface/90 to-transparent transition-opacity duration-[420ms] motion-reduce:transition-none',
          open ? 'opacity-100' : 'opacity-0'
        )}
      />

      {/* Click-away target, only while the drawer is out. Below the nav so the
          close button stays clickable. */}
      {open && (
        <button
          type="button"
          aria-label="Close menu"
          onClick={close}
          className="absolute inset-0 z-40 cursor-pointer bg-transparent lg:hidden"
        />
      )}
    </div>
  );
}
