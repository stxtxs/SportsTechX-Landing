'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import Image from 'next/image';
import type { Person } from '@/lib/about';

const LINKEDIN_MASK = { '--m': 'url(/vectors/icon-footer-linkedin.svg)' } as CSSProperties;

/**
 * A person in the About grid, plus their profile behind a modal.
 *
 * This was a <details> disclosure, which kept the page a server component but
 * cost more than it saved: an opening card grew its row, the expanded bio sat
 * at a different width to everything around it, and the LinkedIn mark had
 * nowhere comfortable to sit next to an 11px label. A modal keeps every card
 * the same height whatever is open, and gives the bio a page of its own.
 *
 * Native <dialog>, not a hand-rolled overlay: showModal() renders in the top
 * layer, makes the rest of the page inert, traps focus and closes on Escape.
 * The one thing it does not do is stop the page behind from scrolling.
 *
 * The trade this makes: the bio needs JavaScript now. The copy is still in the
 * markup for crawlers, but a reader without JS cannot open it. The disclosure
 * degraded; this does not.
 *
 * The portrait is the only way in: clicking it opens the profile. The LinkedIn
 * mark rides inline after the role, so it follows the last word if a long
 * role wraps.
 *
 * The card is a three-row subgrid — portrait / name / role — so every card in
 * a row shares those tracks and each block starts on the same line as its
 * neighbours. The dialog is a fourth child but never a fourth track: closed
 * it is display:none, open it is in the top layer and out of flow.
 */
export function PersonCard({ person }: { person: Person }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);

  const show = () => {
    dialog.current?.showModal();
    setOpen(true);
  };
  const hide = () => dialog.current?.close();

  // showModal() makes the page inert but leaves it scrollable behind the
  // backdrop, which reads as the modal drifting.
  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const prev = root.style.overflow;
    root.style.overflow = 'hidden';
    return () => {
      root.style.overflow = prev;
    };
  }, [open]);

  return (
    <article
      data-rise
      className="group grid grid-rows-subgrid row-span-3 justify-items-center gap-0 text-center"
    >
      <button
        type="button"
        onClick={show}
        aria-label={`Read ${person.name}'s profile`}
        className="person-portrait relative size-40 overflow-hidden rounded-full bg-band shadow-md"
      >
        <Image src={person.photo} alt={person.name} fill sizes="160px" className="object-cover" />
      </button>

      <h3 className="tracked mt-5 font-display text-feature leading-[1.2] text-heading uppercase transition-colors duration-200 group-hover:text-accent">
        {person.name}
      </h3>

      {/* text-balance: a role too long for one line splits into two even
          lines rather than leaving the icon alone on the second. */}
      <p className="tracked mt-1 font-mono-alt text-mono-eyebrow text-balance text-accent uppercase">
        {person.role}
        {/* Small enough to sit on the role's line without pushing it taller. */}
        <a
          href={person.linkedin}
          target="_blank"
          rel="noreferrer"
          aria-label={`${person.name} on LinkedIn`}
          className="person-chip person-chip--icon ml-2 !size-[22px] align-middle"
        >
          <span aria-hidden style={LINKEDIN_MASK} className="brand-icon size-[11px]" />
        </a>
      </p>

      <dialog
        ref={dialog}
        onClose={() => setOpen(false)}
        // The backdrop is part of the dialog, so a click that lands on the
        // element itself rather than the card inside it is a click outside.
        onClick={(e) => {
          if (e.target === dialog.current) hide();
        }}
        className="person-modal"
        aria-labelledby={`person-${person.name.replace(/\W+/g, '-')}`}
      >
        <div className="person-modal-card">
          <button type="button" onClick={hide} aria-label="Close" className="person-modal-x">
            <svg viewBox="0 0 24 24" aria-hidden width="18" height="18" fill="none" stroke="currentColor" strokeWidth={1.6}>
              <path d="M6 6 18 18M18 6 6 18" />
            </svg>
          </button>

          <div className="person-modal-photo relative size-48 overflow-hidden rounded-full bg-band">
            <Image src={person.photo} alt={person.name} fill sizes="192px" className="object-cover" />
          </div>

          <h3
            id={`person-${person.name.replace(/\W+/g, '-')}`}
            className="tracked mt-6 font-display text-card-sm leading-[1.1] text-heading uppercase"
          >
            {person.name}
          </h3>
          <p className="tracked mt-2 font-mono-alt text-mono-eyebrow text-accent uppercase">
            {person.role}
          </p>

          <p className="mt-6 text-left font-sans text-body-sm leading-[1.75] text-heading/75 dark:text-heading/60">
            {person.bio}
          </p>

          <p className="mt-6 border-t border-line pt-4 text-left font-mono text-legal text-fg-muted">
            {person.teams}
          </p>

          <a
            href={person.linkedin}
            target="_blank"
            rel="noreferrer"
            className="person-chip tracked mt-6 px-5 font-mono text-legal uppercase"
          >
            <span aria-hidden style={LINKEDIN_MASK} className="brand-icon mr-2 size-[15px]" />
            LinkedIn
          </a>
        </div>
      </dialog>
    </article>
  );
}
