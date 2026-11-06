/**
 * Every string here was decoded out of STX-Figma.fig. Nothing is invented.
 * To re-check a value:  node scripts/fig-inspect.mjs --text "<frame name>"
 */

import type { StaticImageData } from 'next/image';
import type { HeroPill } from '@/components/hero-orbits';
import type { EarlyAccessProduct } from '@/components/early-access-modal';

/**
 * Images are either a build-time static import (everything decoded from the
 * .fig) or a runtime URL from the CMS (admin panel -> Site assets). Consumers
 * pass both to next/image, which accepts either.
 */
export type Img = StaticImageData | string;

export interface Partner {
  name: string;
  role: string;
  /** Fallback wordmark drawn as text when no logo image is set. */
  logo: string;
  /** A real company mark from the CMS, drawn over the photo instead. */
  logoSrc: Img | null;
  photo: Img;
}

export interface Testimonial {
  quote: string;
  name: string;
  /**
   * Both optional: the Playmakers quotes below arrived as quote + name only.
   * Inventing a job title or reusing a stock face for a real, named person is
   * worse than leaving the line out, so the card renders whichever it has.
   */
  role?: string;
  avatar?: Img;
}
import img17495777b6f3 from '@/public/images/17495777b6f3.jpg';
import imgb3d04779161b from '@/public/images/b3d04779161b.jpg';
import img389d48c3df5e from '@/public/images/389d48c3df5e.jpg';
import img94ce770cf9e8 from '@/public/images/94ce770cf9e8.jpg';
import imgd9507786c8d8 from '@/public/images/d9507786c8d8.jpg';
import img75683fd57261 from '@/public/images/75683fd57261.jpg';
import img68e925ea570d from '@/public/images/68e925ea570d.jpg';
import img4b66197f9eb7 from '@/public/images/4b66197f9eb7.jpg';
import imgf342d6ba5294 from '@/public/images/f342d6ba5294.png';
import img6552cb5eb340 from '@/public/images/6552cb5eb340.webp';
import imgb8758def93ad from '@/public/images/b8758def93ad.webp';
import img198f122078d1 from '@/public/images/198f122078d1.webp';
import imgdd889ac2c460 from '@/public/images/dd889ac2c460.webp';

export const nav = {
  links: [
    { label: 'SOLUTIONS', href: '/#solutions' },
    { label: 'MEDIA', href: '/#media' },
  ],
  cta: { label: 'SUBSCRIBE', href: 'https://newsletter.sportstechx.com' },
};

export const hero = {
  headline: 'Your Insider Access To Sports Tech & Venture',
  subhead: 'Connecting the people, intelligence and\ncapital transforming the business of sports.',
  ctas: [
    // `sector` preselects that role in the Solutions selector on the way down.
    { label: 'FOR FOUNDERS', href: '/#solutions', sector: 'founders', variant: 'primary' as const },
    { label: 'FOR INVESTORS', href: '/#solutions', sector: 'investors', variant: 'secondary' as const },
  ],
  /**
   * Orbiting category pills, grouped by orbit (see components/hero-orbits.tsx).
   * Icons are the design's own vectors, exported from Figma, except ATHLETES,
   * FANS and CORPORATES, drawn to match. `w`/`h` are each glyph's size and must stay
   * explicit — the set is not uniform. Order within an orbit is the order the
   * pills follow one another round it.
   */
  pills: [
    // Orbit 1, innermost: core audiences.
    { label: 'FOUNDERS', icon: '/icons/pill-founders.svg', w: 12, h: 12, orbit: 1 },
    { label: 'INVESTORS', icon: '/icons/pill-investors.svg', w: 14, h: 8, orbit: 1 },
    // Orbit 2, middle: sports ecosystem.
    { label: 'TEAMS', icon: '/icons/pill-teams.svg', w: 10, h: 11, orbit: 2 },
    { label: 'LEAGUES', icon: '/icons/pill-leagues.svg', w: 14.375, h: 14.5, orbit: 2 },
    { label: 'ATHLETES', icon: '/icons/pill-athletes.svg', w: 11, h: 13, orbit: 2 },
    { label: 'FANS', icon: '/icons/pill-fans.svg', w: 13, h: 11, orbit: 2 },
    // Orbit 3, outermost: commercial ecosystem.
    { label: 'MEDIA', icon: '/icons/pill-media.svg', w: 10, h: 10, orbit: 3 },
    { label: 'CORPORATES', icon: '/icons/pill-corporates.svg', w: 11, h: 12, orbit: 3 },
  ] satisfies HeroPill[],
};

export const stats = [
  { value: '10,000+', label: 'Companies\nTracked' },
  { value: '2,500+', label: 'Investors\nMapped' },
  { value: '$130B+', label: 'Deal Flow\nTracked' },
  { value: '20,000+', label: 'Newsletter\nSubscribers' },
];

export const trustedBy = {
  title: 'TRUSTED BY',
  subtitle: 'founders, investors, sports organisations',
  /**
   * Eight partner headshots extracted from the design, used only until an
   * admin fills Site assets -> STX landing -> Carousel gallery. `logo` is the
   * white wordmark the artboard overlays on each photo; a CMS card supplies a
   * real logo image instead.
   */
  partners: [
    { name: 'Alexander Janssen', role: 'CEO, Dutch SportsTech Fund', logo: 'BCG', logoSrc: null, photo: img17495777b6f3 },
    { name: 'Alexander Janssen', role: 'CEO, Dutch SportsTech Fund', logo: 'BCG', logoSrc: null, photo: imgb3d04779161b },
    { name: 'Alexander Janssen', role: 'CEO, Dutch SportsTech Fund', logo: 'BCG', logoSrc: null, photo: img389d48c3df5e },
    { name: 'Alexander Janssen', role: 'CEO, Dutch SportsTech Fund', logo: 'BCG', logoSrc: null, photo: img94ce770cf9e8 },
    { name: 'Alexander Janssen', role: 'CEO, Dutch SportsTech Fund', logo: 'BCG', logoSrc: null, photo: imgd9507786c8d8 },
    { name: 'Alexander Janssen', role: 'CEO, Dutch SportsTech Fund', logo: 'BCG', logoSrc: null, photo: img75683fd57261 },
    { name: 'Alexander Janssen', role: 'CEO, Dutch SportsTech Fund', logo: 'BCG', logoSrc: null, photo: img68e925ea570d },
    { name: 'Alexander Janssen', role: 'CEO, Dutch SportsTech Fund', logo: 'BCG', logoSrc: null, photo: img4b66197f9eb7 },
  ] as Partner[],
};

export const testimonial: Testimonial = {
  quote: '“We walked into our raise knowing the market cold. That confidence changed every conversation.”',
  name: 'Alexander Janssen',
  role: 'CEO, Dutch SportsTech Fund',
  avatar: imgf342d6ba5294,
};

/**
 * The real Playmakers quotes, from the team's "Solution Preview" copy.
 *
 * These replace four copies of a placeholder attributed to a person who does
 * not exist. Roles are set from the Solution Preview copy; no photos came with
 * them, so avatars stay unset — see the note on Testimonial. The admin panel
 * can still override the whole set.
 */
export const playmakersTestimonials: Testimonial[] = [
  {
    quote:
      '“I’ve built two companies without outside funding, so I know how much depends on the people around you. Playmakers gives me a circle of founders who understand the pressure without me having to explain it. When I ask for help, I get real answers and useful introductions, usually within hours.”',
    name: 'Sowbhagya Shetty',
    role: 'Co-Founder & CEO, Data Sports Group',
  },
  {
    quote:
      '“The connections I’ve made through Playmakers have already paid off in a very concrete way. They’ve led to a new partnership with NVIDIA, and we’ve started working on a joint go-to-market approach with another member whose technology and customer base complement ours.”',
    name: 'Valtteri Salomaki',
    role: 'Co-Founder & CEO, EDGE Sound Research',
  },
  {
    quote:
      '“Within just a few months, we’ve already seen concrete collaborations emerge with other Playmakers members. There’s so much high-quality innovation within the group, and we’re now bringing some of those solutions into how we operate at Füchse Berlin. That’s when you know a network is really working.”',
    name: 'Christopher Jahns',
    role: 'Co-Founder & CEO, XU Group',
  },
  {
    quote:
      '“Being part of Playmakers has helped me build valuable new connections with peers who are at a similar stage and navigating many of the same challenges. There’s a real sense of camaraderie, with people genuinely willing to share their experiences and help each other out.”',
    name: 'Harrison Brown',
    role: 'Co-Founder & CEO, HeadCheck Health',
  },
];

export type SolutionCard = {
  id: string;
  /**
   * Visual style + which /vectors assets the card uses: 'atlas' (light card,
   * rings, Atlas wordmark + feature icons) or 'playmakers' (dark card, motif).
   * Two cards can share a variant — Atlas Raise and Atlas Scout are both 'atlas'.
   */
  variant: 'atlas' | 'playmakers';
  eyebrow: string;
  /**
   * Text stand-in for the wordmark, for a product with no vector yet
   * (Boardroom). When set, it replaces /vectors/wordmark-{variant}.svg.
   */
  wordmarkText?: string;
  /** Colour of the text wordmark (default white). */
  wordmarkColor?: string;
  /** Small outlined label beside the wordmark, e.g. COMING SOON. */
  badge?: string;
  /** Label pinned to the photo panel's top-left corner. */
  panelTag?: string;
  /** Built-in photo for the panel, used until a CMS preview is uploaded. */
  panelImage?: string;
  /** Icon set for the green band, /vectors/icon-{icons}-{1..3}.svg (default: the variant's). */
  icons?: string;
  /** Which CMS card preview (Site assets) fills the photo panel, if any. */
  previewSlot?: number;
  title: string;
  blurb: string;
  cta: string;
  /** Where the CTA goes — the product's own site. */
  ctaHref: string;
  /** Optional secondary CTA beside the primary one (e.g. "Book a call"). */
  cta2?: { label: string; href: string };
  /** The CTA opens the early-access form for this product; ctaHref stays as
   *  the no-JavaScript fallback. */
  earlyAccess?: EarlyAccessProduct;
  features: { title: string; points: string[] }[];
  /** Quotes under the band. Every card has them: the cards share one template. */
  testimonials: Testimonial[];
  /**
   * Italic product tag on the wordmark, matching the Atlas dashboard sidebar
   * (AtlasLogo): RAISE blue #4580EC, SCOUT green #0FB86A. Omitted for Playmakers.
   */
  tier?: { label: string; color: string };
};

/**
 * The card that drops from SOLUTIONS. Two columns on the board — 503x163, the
 * rows 28 tall with a 28 circular badge and the label 38 in. The role glyphs
 * are the same 12x12 and 14x8 vectors the hero pills use; the product rows show
 * their initial, as the board draws them.
 */
export const navMenu = [
  {
    label: 'BY ROLE',
    items: [
      // sector: which Solutions toggle to activate on click (founders=OPERATOR,
      // investors=INVESTOR). Operator shows Atlas Raise + Playmakers; Investor
      // shows Atlas Scout.
      { label: 'FOR FOUNDERS', href: '/#solutions', icon: '/icons/pill-founders.svg', w: 12, h: 12, sector: 'founders' },
      { label: 'FOR INVESTORS', href: '/#solutions', icon: '/icons/pill-investors.svg', w: 14, h: 8, sector: 'investors' },
    ],
  },
  {
    label: 'BY PRODUCT',
    items: [
      // `sector` may also name a card: the Solutions selector then opens the
      // role and need that show it. Atlas opens Atlas Raise (founder view).
      { label: 'ATLAS', href: '/#solutions', initial: 'A', sector: 'atlas-raise' },
      { label: 'PLAYMAKERS', href: '/#solutions', initial: 'P', sector: 'playmakers' },
      { label: 'BOARDROOM', href: '/#solutions', initial: 'B', sector: 'boardroom' },
    ],
  },
];

export const solutions = {
  title: 'SOLUTIONS',
  selectorLabel: 'I am a sports tech',
  needLabel: 'Looking for',
  testimonialsLabel: 'TESTIMONIALS',
  /**
   * The stage selector: pick a role, then what you need; each need shows one
   * card. Ids are what nav and footer links send (see SectorLink).
   */
  sectors: [
    {
      id: 'founders',
      label: 'FOUNDER',
      needs: [
        { label: 'FUNDRAISING & INTELLIGENCE', card: 'atlas-raise' },
        { label: 'SCALING & NETWORKING', card: 'playmakers' },
      ],
    },
    {
      id: 'investors',
      label: 'INVESTOR',
      needs: [
        { label: 'DEAL FLOW & INTELLIGENCE', card: 'atlas-scout' },
        { label: 'CO-INVESTORS & PEER NETWORKING', card: 'boardroom' },
      ],
    },
  ],
  cards: [
    {
      id: 'playmakers',
      variant: 'playmakers',
      eyebrow: 'PLAYMAKERS',
      previewSlot: 0,
      // This card shipped with Atlas's feature copy pasted into it — all nine
      // points were about pitch decks and investor pipelines. Replaced with the
      // Playmakers copy the team supplied. Sentence case and the ALL-CAPS CTA
      // follow the Atlas card beside it; neither has a text-transform, so the
      // casing here is what renders.
      // Three lines: the copy grew past the two the card was drawn for, and the
      // breaks are explicit so it does not wrap mid-phrase.
      // "best" moved to line 2 (feedback #5) — a taller headline opens up the
      // space between it and the card's preview image.
      title: "Where sports tech's\nbest build smarter, faster,\ntogether.",
      blurb:
        'The private peer advisory network for high-growth sports tech founders and CEOs.',
      cta: 'EXPLORE MEMBERSHIP',
      // TEMPORARY host, like the STX one — restore https://joinplaymakers.co
      // when Playmakers is back on its own domain.
      ctaHref: 'https://www.playmakers.sportstechx.com/',
      testimonials: playmakersTestimonials,
      features: [
        {
          title: 'Your personal board\nof peer advisors',
          points: [
            'Skip costly mistakes. Learn from founders who’ve been there.',
            'Scale faster with leaders who’ve navigated hypergrowth.',
            'Stay resilient with peers who understand your journey.',
          ],
        },
        {
          title: 'Insider sports\nindustry network',
          points: [
            'Turn peers into collaborators at exclusive member events.',
            'Get curated intros to the top leaders in sports.',
            'Unlock partners, markets and capital to grow faster.',
          ],
        },
        {
          title: 'Insider sports\ntech intelligence',
          points: [
            'Tap the best knowledge in sports tech, anytime.',
            'Sharpen your strategy with world-class market data.',
            'Stay ahead of emerging trends, companies and deals.',
          ],
        },
      ],
    },
    {
      id: 'atlas-raise',
      variant: 'atlas',
      eyebrow: 'atlas',
      previewSlot: 1,
      title: 'Raising your next round?',
      blurb:
        'Find the right investors, benchmark your company and sharpen your pitch with the SportsTechX intelligence layer.',
      cta: 'TRY ATLAS RAISE',
      ctaHref: 'https://www.atlas.sportstechx.com',
      cta2: { label: 'BOOK A CALL', href: 'https://cal.com/khyati/sportstechx' },
      testimonials: [testimonial, testimonial, testimonial, testimonial],
      tier: { label: 'RAISE', color: '#4580EC' },
      features: [
        {
          title: 'Build your case',
          points: [
            'Analyse your pitch deck to assess your investor readiness',
            'Perform competitor benchmarking and market sizing',
            'Improve your pitch with expert feedback and iterative refinement',
          ],
        },
        {
          title: 'Identify the right investors',
          points: [
            'Access detailed profiles of 2,500+ verified sports tech investors',
            'Get matched with investors most likely to fund your startup',
            'Create a custom investor pipeline and manage your outreach',
          ],
        },
        {
          title: 'Close the deal',
          points: [
            'Build and maintain a due\ndiligence-ready data room',
            'Access essential model documents for early-stage investments',
            'Monitor fundraising progress and keep your raise on track',
          ],
        },
      ],
    },
    {
      id: 'atlas-scout',
      variant: 'atlas',
      // Investor > Deal flow & intelligence. Copy from the "STX WEBSITE
      // INVESTOR TOGGLE CONTENT" feedback (2026-10-21); final copy TBC.
      eyebrow: 'atlas',
      previewSlot: 2,
      title: 'Sourcing your next deal?',
      blurb:
        'Find relevant deals, assess companies and strengthen your due diligence with SportsTechX market data and analysis.',
      cta: 'TRY ATLAS SCOUT',
      ctaHref: 'https://www.atlas.sportstechx.com/',
      cta2: { label: 'BOOK A CALL', href: 'https://cal.com/khyati/sportstechx' },
      testimonials: [testimonial, testimonial, testimonial, testimonial],
      tier: { label: 'SCOUT', color: '#0FB86A' },
      features: [
        {
          title: 'Source the right deals',
          points: [
            'Search sports tech companies by sector, stage and geography',
            'Get recommendations matched to your investment thesis',
            'Discover verified raises and opportunities from the SportsTechX network',
          ],
        },
        {
          title: 'Strengthen your due diligence',
          points: [
            'Review company traction, teams and funding history',
            'Assess opportunities using market data and funding trends',
            'Access round details and available fundraising documents',
          ],
        },
        {
          title: 'Manage your deal flow',
          points: [
            'Build watchlists and track companies through investment stages',
            'Monitor funding, growth and partnership signals',
            'Request introductions to founders through SportsTechX',
          ],
        },
      ],
    },
    {
      // Investor > Co-investors & peer networking. Copy from the Boardroom
      // card mockup (2026-11-06). Same dark template as Playmakers, plus a
      // COMING SOON badge, an orange text wordmark and its own band icons.
      id: 'boardroom',
      variant: 'playmakers',
      eyebrow: 'BOARDROOM',
      wordmarkText: 'BOARDROOM',
      wordmarkColor: '#f29a4a',
      badge: 'COMING SOON',
      // A fourth Site assets preview replaces the built-in photo (from the
      // Boardroom deck) once one is uploaded.
      previewSlot: 3,
      panelImage: '/images/boardroom-card.jpg',
      panelTag: 'FOR SPORTS TECH INVESTORS',
      title: "Where sports tech's\nbest investments\ntake shape.",
      blurb: "A private network for sports tech's leading investors.\nLaunching with 20 founding members.",
      cta: 'REQUEST EARLY ACCESS',
      // Opens the early-access form (stored + emailed to the team by the
      // platform API). The mailto is only the no-JavaScript fallback.
      earlyAccess: 'boardroom',
      ctaHref: 'mailto:hello@sportstechx.com?subject=Boardroom%20early%20access',
      icons: 'boardroom',
      // Coming soon: no quotes yet, so the card ends at the band.
      testimonials: [],
      features: [
        {
          title: 'Early access to Playmakers founders',
          points: [
            'Meet pre-vetted, high-growth founders before they raise.',
            'Get priority seats at joint Boardroom × Playmakers events.',
            'Build conviction by seeing founders operate up close.',
          ],
        },
        {
          title: 'Deal flow from trusted peers',
          points: [
            'See opportunities vetted by SportsTechX and fellow members.',
            'Get intros to founders that match your thesis.',
            'Swap notes on live deals, off the record.',
          ],
        },
        {
          title: 'Co-invest with less risk',
          points: [
            'Find co-investors and build syndicates.',
            'Pressure-test your thesis with peers.',
            'Back every deal with Atlas Scout data.',
          ],
        },
      ],
    },
  ] satisfies SolutionCard[],
};

export type MediaItem = {
  category: string;
  action: string;
  /** Extra destinations shown as brand icons beside the category word. */
  links?: { label: string; href: string; icon: string; color: string }[];
  title: string;
  /** Static stand-in. Three of the four cards replace this at render time. */
  image: Img;
  href: string;
};

export const media = {
  title: 'MEDIA',
  subtitle: 'What the insiders read and listen to',
  items: ([
    {
      category: 'NEWSLETTER',
      action: 'SUBSCRIBE',
      title: "#191 🤝 IG Group's $2.15B\nBet on Underdog",
      image: img6552cb5eb340,
      // Replaced at render time by the latest issue from the Beehiiv feed.
      href: 'https://newsletter.sportstechx.com',
    },
    {
      category: 'PODCAST',
      action: 'LISTEN',
      // Replaced at render time by the latest video on the YouTube playlist.
      title: 'From M&A Advisory to Early Stage Sports Tech Investor - Uday Khanna',
      image: imgb8758def93ad,
      // Spotify is the default destination for the card itself.
      href: 'https://open.spotify.com/show/2IWyvvtC2fAeRAyt55TmtF',
      links: [
        {
          label: 'Spotify',
          href: 'https://open.spotify.com/show/2IWyvvtC2fAeRAyt55TmtF',
          icon: 'spotify',
          color: '#1DB954',
        },
        {
          label: 'YouTube',
          href: 'https://www.youtube.com/playlist?list=PLptEoomboUFS422kldem0tLkXJjDbHjfx',
          icon: 'footer-youtube',
          color: '#FF0000',
        },
      ],
    },
    {
      category: 'REPORTS',
      action: 'READ',
      // Replaced at render time by the newest report on the hub. The artboard
      // read "Football Tech Report 2006" — a typo for the 2025 edition.
      title: 'Football Tech Report 2025',
      image: img198f122078d1,
      href: 'https://www.atlas.sportstechx.com/reports',
    },
    {
      category: 'EVENTS',
      action: 'ATTEND',
      title: 'The NextGen Sportstech\nSummit 2026',
      image: imgdd889ac2c460,
      // Atlas events page. This was '/#events', an anchor that does not
      // exist on this page, so the card went nowhere.
      href: 'https://www.atlas.sportstechx.com/events',
    },
  ] as MediaItem[]),
};

/** A footer link. `icon` draws a glyph; with `iconOnly` the label is the a11y name. */
export interface FooterLink {
  label: string;
  href: string;
  icon?: string;
  iconOnly?: boolean;
  /** Flips the Solutions sector toggle on click (see SectorLink). */
  sector?: string;
  /** Open in a new tab even though it's on-site (http links always do). */
  newTab?: boolean;
}

export interface FooterColumn {
  title: string;
  /** Plain list of links (Media, Company). */
  links?: FooterLink[];
  /** Or sub-grouped under small eyebrows, like the nav dropdown (Solutions). */
  groups?: { title: string; links: FooterLink[] }[];
}

export const footer = {
  blurb:
    'SportsTechX is the insider network for sports tech, connecting the people, intelligence and capital transforming the business of sports through curated access, market insights and deal flow support.',
  email: 'hello@sportstechx.com',
  /** Where the brand column\'s signup hands off. There is no /api/subscribe in
   * this app; every newsletter CTA on the site is a link to this host, and the
   * form is a GET so the address arrives as ?email= rather than being posted
   * somewhere that would need a secret. */
  newsletterAction: 'https://newsletter.sportstechx.com/subscribe',
  columns: [
    {
      // Organised like the nav's Solutions dropdown. `sector` sets the
      // Solutions selector on click as well as scrolling there: a role id
      // opens that role, a card id opens that product's card.
      title: 'Solutions',
      groups: [
        {
          title: 'By role',
          links: [
            { label: 'For Founders', href: '/#solutions', sector: 'founders' },
            { label: 'For Investors', href: '/#solutions', sector: 'investors' },
          ],
        },
        {
          title: 'By product',
          links: [
            { label: 'Atlas', href: '/#solutions', sector: 'atlas-raise' },
            { label: 'Playmakers', href: '/#solutions', sector: 'playmakers' },
            { label: 'Boardroom', href: '/#solutions', sector: 'boardroom' },
          ],
        },
      ],
    },
    {
      title: 'Media',
      links: [
        { label: 'Newsletter', href: 'https://newsletter.sportstechx.com' },
        { label: 'Podcast', href: 'https://creators.spotify.com/pod/profile/sportstechx/' },
        { label: 'Reports', href: 'https://www.atlas.sportstechx.com/reports' },
        { label: 'Events', href: 'https://www.atlas.sportstechx.com/events' },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'About', href: '/about', newTab: true },
        { label: 'Contact', href: 'mailto:hello@sportstechx.com', newTab: true },
        { label: 'LinkedIn', href: 'https://www.linkedin.com/company/sportstechx/', icon: 'linkedin', iconOnly: true },
        { label: 'YouTube', href: 'https://www.youtube.com/@SportsTechX', icon: 'youtube', iconOnly: true },
      ],
    },
  ] as FooterColumn[],
  legal: '© 2026 SportsTechX GmbH · Berlin, Germany',
  legalLinks: [
    { label: 'Privacy Policy', href: '/privacy-policy' },
    { label: 'Terms of Service', href: '/terms-of-service' },
    // The Playmakers site's own terms. This used to point at /terms-of-service,
    // which is SportsTechX's terms, not the membership ones.
    { label: 'Playmakers Membership Terms', href: 'https://www.playmakers.sportstechx.com/terms' },
    { label: 'Imprint', href: '/imprint' },
  ],
};

export const mobileMenu = {
  groups: [
    { title: 'SOLUTIONS', links: [{ label: 'FOR FOUNDERS', href: '/#solutions', sector: 'founders' }, { label: 'FOR INVESTORS', href: '/#solutions', sector: 'investors' }] },
    { title: 'MENU', links: [{ label: 'MEDIA', href: '/#media' }] },
    {
      title: 'CONNECT',
      links: [
        { label: 'SUBSCRIBE', href: 'https://newsletter.sportstechx.com', accent: true },
        { label: 'LINKEDIN', href: 'https://www.linkedin.com/company/sportstechx/' },
        { label: 'YOUTUBE', href: 'https://www.youtube.com/@SportsTechX' },
      ],
    },
  ],
};
