import localFont from 'next/font/local';

/* Self-hosted latin woff2s (next/font/local), NOT next/font/google: the Google loader
   downloads from fonts.gstatic.com AT BUILD TIME and that fetch flakes on cold Vercel
   builds, failing the deploy (it broke the Atlas client and admin). Re-download from the
   Google Fonts CSS2 API, latin block, if a face ever needs refreshing. */

/**
 * The design uses four families (counts are text nodes in the .fig):
 *   New Frank  276   body + UI                — commercial, see the note below
 *   CommitMono  98   buttons, pills, labels   — @fontsource/commit-mono, imported in layout.tsx
 *   Bebas Neue  70   all display headlines    — Google Fonts, self-hosted
 *   Space Mono  28   eyebrows, attributions   — Google Fonts, self-hosted
 */

export const bebasNeue = localFont({
  src: './fonts/bebas-neue-400.woff2',
  weight: '400',
  display: 'swap',
  variable: '--font-bebas-neue',
});

export const spaceMono = localFont({
  src: [
    { path: './fonts/space-mono-400.woff2', weight: '400', style: 'normal' },
    { path: './fonts/space-mono-700.woff2', weight: '700', style: 'normal' },
  ],
  display: 'swap',
  variable: '--font-space-mono',
});

/**
 * Body face. The design specifies **New Frank**, which is a commercial typeface
 * (Displaay / Adobe Fonts) — it needs a paid Creative Cloud plan or a purchased
 * webfont licence, and Figma does not embed font binaries in a .fig, so it
 * cannot come out of the design file either.
 *
 * Switzer stands in: a neo-grotesque of very similar proportions and colour,
 * from Fontshare under the ITF Free Font License, which grants use "for personal
 * or commercial purposes, free of charge" and permits self-hosting. The licence
 * ships alongside the files at public/fonts/Switzer-LICENSE.txt.
 *
 * New Frank now comes from the designer's Adobe Fonts kit, linked in
 * app/layout.tsx, and leads the --font-sans stack. Switzer stays behind it as
 * the fallback for a slow or blocked kit.
 */
export const sans = localFont({
  src: [
    { path: '../public/fonts/Switzer-Regular.woff2', weight: '400', style: 'normal' },
    { path: '../public/fonts/Switzer-Medium.woff2', weight: '500', style: 'normal' },
    { path: '../public/fonts/Switzer-Semibold.woff2', weight: '600', style: 'normal' },
    { path: '../public/fonts/Switzer-Bold.woff2', weight: '700', style: 'normal' },
  ],
  display: 'swap',
  variable: '--font-sans-local',
  // Switzer is the fallback now that New Frank comes from Adobe, so it should
  // not be fetched on every visit. Preloading it downloaded four woff2 files
  // the page does not draw a single glyph with. It still resolves instantly if
  // the kit is slow or blocked — the files are self-hosted, just not eager.
  preload: false,
});
