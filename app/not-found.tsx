import type { Metadata } from 'next';
import Link from 'next/link';
import { Footer } from '@/components/sections/footer';
import { Rise } from '@/components/rise';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Page not found',
  robots: { index: false, follow: true },
};

/** The hero's pill buttons (sizes, shadow, hover/press motion), as on the home page. */
const pill = cn(
  'group tracked inline-flex h-[41px] w-[215px] items-center justify-center rounded-[93px] font-mono text-cta text-white',
  'shadow-cta lg:h-[54px] lg:w-[249px]',
  'hover:bg-black active:bg-black transition-[background-color,scale] duration-200 ease-out active:duration-[80ms]',
  'motion-safe:hover:scale-105 motion-safe:active:scale-95',
);

/**
 * 404 in the STX website look: the section title (Bebas, uppercase) over the
 * hero's sub-head and pill buttons, then the footer. The nav, fonts and theme
 * (light/dark) come from the root layout. Next serves it with a real 404.
 */
export default function NotFound() {
  return (
    <>
      <main className="bg-page">
        <div className="container-page section-y flex min-h-[70vh] flex-col items-center justify-center pt-32 text-center lg:pt-40">
          <p className="tracked font-mono text-cta text-fg-2 uppercase">Error 404</p>
          <h1 className="tracked mt-3 font-display text-section leading-[1.1] text-heading uppercase">Page not found</h1>
          <p className="mt-3 max-w-[560px] font-sans text-body-lg leading-[1.57] font-medium text-fg-2">
            The page you&apos;re looking for doesn&apos;t exist or has moved. Start again from the home page, or go straight to Atlas, our sports tech intelligence platform.
          </p>
          <div className="mt-[26px] flex flex-col items-center gap-5 sm:flex-row sm:gap-[30px]">
            <Link href="/" className={cn(pill, 'bg-accent-2')}>
              <span className="transition-opacity duration-[80ms] ease-out group-active:opacity-70">Back to home</span>
            </Link>
            <a href="https://www.atlas.sportstechx.com" className={cn(pill, 'bg-slate')}>
              <span className="transition-opacity duration-[80ms] ease-out group-active:opacity-70">Explore Atlas</span>
            </a>
          </div>
        </div>
      </main>
      <Footer />
      <Rise />
    </>
  );
}
