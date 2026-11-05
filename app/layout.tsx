import type { Metadata, Viewport } from 'next';
import '@fontsource/commit-mono/400.css';
import './globals.css';
import { MobileMenuPanel, MobileMenuProvider, MobileMenuShell } from '@/components/mobile-menu';
import { NewsletterModal } from '@/components/newsletter-modal';
import { NavBar } from '@/components/sections/nav-bar';
import { bebasNeue, sans, spaceMono } from './fonts';
import { Providers } from './providers';

/**
 * One origin constant. It was previously repeated in layout.tsx, sitemap.ts and
 * robots.ts with no shared source.
 */
export const SITE_URL = 'https://www.sportstechx.com';

const TITLE = 'SportsTechX — Your Insider Access to Sports Tech & Venture';
const DESCRIPTION =
  'Connecting the people, intelligence and capital transforming the business of sports. 10,000+ companies tracked, 2,500+ investors mapped, $130B+ deal flow tracked, 20,000+ newsletter subscribers.';
const SHORT_DESCRIPTION =
  'Connecting the people, intelligence and capital transforming the business of sports.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  /* A template so sub-pages export a bare title. Without it every page had to
     repeat the brand by hand, which is how the Atlas pages ended up with it
     twice. */
  title: { default: TITLE, template: '%s — SportsTechX' },
  description: DESCRIPTION,
  applicationName: 'SportsTechX',
  keywords: [
    'sports tech', 'sportstech', 'sports technology', 'sports innovation',
    'sports tech investment', 'sports venture capital', 'sports tech startups',
    'sports tech intelligence', 'SportsTechX',
  ],
  authors: [{ name: 'SportsTechX', url: SITE_URL }],
  creator: 'SportsTechX',
  publisher: 'SportsTechX GmbH',
  category: 'technology',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: 'SportsTechX',
    locale: 'en_US',
    url: '/',
    title: TITLE,
    description: SHORT_DESCRIPTION,
  },
  twitter: { card: 'summary_large_image', title: TITLE, description: SHORT_DESCRIPTION },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
};

/** Organization schema, so search engines can tie the brand together. */
const ORG_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'SportsTechX',
  legalName: 'SportsTechX GmbH',
  url: SITE_URL,
  logo: `${SITE_URL}/icon.png`,
  description: SHORT_DESCRIPTION,
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Liebigstraße 35',
    postalCode: '10247',
    addressLocality: 'Berlin',
    addressCountry: 'DE',
  },
  email: 'hello@sportstechx.com',
  sameAs: ['https://www.linkedin.com/company/sportstechx'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${bebasNeue.variable} ${spaceMono.variable} ${sans.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* New Frank, served by Adobe Fonts from the designer's account. The
            licence travels with the kit, so nothing about the typeface lives in
            this repo. Preconnects because the CSS and the font files come from
            two different hosts, and the second is not discovered until the
            first has parsed. */}
        <link rel="preconnect" href="https://use.typekit.net" crossOrigin="" />
        <link rel="preconnect" href="https://p.typekit.net" crossOrigin="" />
        <link rel="stylesheet" href="https://use.typekit.net/jyx6vei.css" />
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger -- a JSON-LD blob we author
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ORG_JSONLD) }}
        />
      </head>
      <body>
        <Providers>
          {/* Nav and the mobile drawer live here rather than in a page, so they
              are shared by every route and the nav can stay pinned. */}
          <MobileMenuProvider>
            <MobileMenuPanel />
            {/* The nav goes in as its own prop: the drawer dims the page
                behind it, and the close button must stay crisp. */}
            <MobileMenuShell nav={<NavBar />}>{children}</MobileMenuShell>
          </MobileMenuProvider>
          {/* One shared newsletter dialog for the whole site; opened by the
              nav CTA via the stx:newsletter-open event. */}
          <NewsletterModal />
        </Providers>
      </body>
    </html>
  );
}
