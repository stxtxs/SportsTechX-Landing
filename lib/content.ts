/**
 * Every string here was decoded out of STX-Figma.fig. Nothing is invented.
 * To re-check a value:  node scripts/fig-inspect.mjs --text "<frame name>"
 */

import type { StaticImageData } from 'next/image';

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
    { label: 'ABOUT', href: '/about', newTab: true },
  ],
  cta: { label: 'JOIN THE NEWSLETTER', href: 'https://newsletter.sportstechx.com' },
};

export const hero = {
  headline: 'Your Insider Access To Sports Tech & Venture',
  subhead: 'The leading people, deepest insights and\nactive capital shaping the future of sports',
  ctas: [
    { label: 'FOR FOUNDERS', href: '/#solutions', variant: 'primary' as const },
    { label: 'FOR INVESTORS', href: '/#solutions', variant: 'secondary' as const },
  ],
  /**
   * Orbiting category pills. Icons are the design's own vectors, exported from
   * Figma; `w`/`h` are each glyph's leaf size on the artboard and must stay
   * explicit — the six are not a uniform set.
   */
  pills: [
    { label: 'LEAGUES', icon: '/icons/pill-leagues.svg', w: 14.375, h: 14.5, primary: false },
    { label: 'TEAMS', icon: '/icons/pill-teams.svg', w: 10, h: 11, primary: false },
    { label: 'MEDIA', icon: '/icons/pill-media.svg', w: 10, h: 10, primary: false },
    { label: 'ATHLETES', icon: '/icons/pill-media.svg', w: 10, h: 10, primary: false },
    { label: 'FOUNDERS', icon: '/icons/pill-founders.svg', w: 12, h: 12, primary: true },
    { label: 'INVESTORS', icon: '/icons/pill-investors.svg', w: 14, h: 8, primary: true },
  ],
};

export const stats = [
  { value: '20K+', label: 'Community\nmembers' },
  { value: '2,000+', label: 'Investors\ntracked' },
  { value: '1,500+', label: 'Companies\nmapped' },
  { value: '40+', label: 'Countries\nrepresented' },
];

export const trustedBy = {
  title: 'TRUSTED BY',
  subtitle: 'founders, investors, sports organizations',
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
    role: 'Co-founder & CEO, Data Sports Group',
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
    role: 'Co-founder & CEO, XU Group',
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
  /** Which of the sector buttons show this card. */
  sectors: string[];
  eyebrow: string;
  badge: string;
  title: string;
  blurb: string;
  cta: string;
  /** Where the CTA goes — the product's own site. */
  ctaHref: string;
  /** Optional secondary CTA beside the primary one (e.g. "Book a call"). */
  cta2?: { label: string; href: string };
  features: { title: string; points: string[] }[];
  testimonialsLabel: string;
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
      // Atlas spans both toggles (Raise on operator, Scout on investor); the
      // generic link opens the operator view. Playmakers is an operator card.
      { label: 'ATLAS', href: '/#solutions', initial: 'A', sector: 'founders' },
      { label: 'PLAYMAKERS', href: '/#solutions', initial: 'P', sector: 'founders' },
    ],
  },
];

export const solutions = {
  title: 'SOLUTIONS',
  selectorLabel: 'I am a sports tech',
  // Singular: the label above now reads into them — "I am a sports tech
  // OPERATOR". The ids stay as they were; they key the cards' `sectors`.
  sectors: [
    { id: 'founders', label: 'FOUNDER' },
    { id: 'investors', label: 'INVESTOR' },
  ],
  // Toggle: OPERATOR shows Playmakers + Atlas Raise; INVESTOR shows Atlas Scout.
  // Cards render in array order, so Playmakers sits above Atlas Raise on the
  // operator view (its original position). Atlas Raise and Atlas Scout share the
  // 'atlas' variant (same wordmark + feature icons + light styling); their
  // RAISE/SCOUT tag and copy set them apart, matching the dashboard branding.
  cards: [
    {
      id: 'playmakers',
      variant: 'playmakers',
      // An OPERATOR card, on top of Atlas Raise.
      sectors: ['founders'],
      eyebrow: 'PLAYMAKERS',
      badge: 'FOR SCALE-UP FOUNDERS',
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
      testimonialsLabel: 'PLAYMAKERS TESTIMONIALS',
      testimonials: playmakersTestimonials,
      features: [
        {
          title: 'Your personal board\nof peer advisors',
          points: [
            "Skip costly trial-and-error by learning from other founders who've been there",
            'Scale faster with advice from leaders who have navigated complex growth',
            'Stay mentally resilient with a circle that understands your journey',
          ],
        },
        {
          title: 'Insider sports\nindustry network',
          points: [
            'Join private membership events turning your peers into collaborators',
            'Receive introductions that expand your network among top leaders in sports',
            'Access new partners, markets and investment to accelerate business growth',
          ],
        },
        {
          title: 'Insider tech\nbusiness intelligence',
          points: [
            'Build with anytime / anywhere access to the best knowledge in sports tech',
            'Inform your strategy with world-class sports tech market data and research',
            'Leverage insider expertise to obtain a competitive advantage',
          ],
        },
      ],
    },
    {
      id: 'atlas-raise',
      variant: 'atlas',
      // An OPERATOR card, below Playmakers.
      sectors: ['founders'],
      eyebrow: 'atlas',
      badge: 'FOR EARLY-STAGE FOUNDERS',
      title: 'Raising your next round?',
      blurb:
        'Find the right investors, benchmark your company and sharpen your pitch with the SportsTechX intelligence layer.',
      cta: 'TRY ATLAS RAISE',
      ctaHref: 'https://www.atlas.sportstechx.com',
      cta2: { label: 'BOOK A CALL', href: 'https://cal.com/khyati/sportstechx' },
      testimonialsLabel: 'ATLAS TESTIMONIALS',
      testimonials: [testimonial, testimonial, testimonial, testimonial],
      tier: { label: 'RAISE', color: '#4580EC' },
      features: [
        {
          title: 'Build your case',
          points: [
            'Analyze your pitch deck to assess your investor readiness',
            'Perform competitor benchmarking and market sizing',
            'Improve your pitch with expert feedback and iterative refinement',
          ],
        },
        {
          title: 'Identify the right investors',
          points: [
            'Access detailed profiles of 2+ verified sports tech investors',
            'Get matched with investors most likely to fund your startup',
            'Create a custom investor pipeline and manage your outreach',
          ],
        },
        {
          title: 'Close the deal',
          points: [
            'Build and maintain a due\ndiligence-ready data room',
            'Access essential model documents for early stage investments',
            'Monitor fundraising progress and keep your raise on track',
          ],
        },
      ],
    },
    {
      id: 'atlas-scout',
      variant: 'atlas',
      // The INVESTOR card. Copy from the "STX WEBSITE INVESTOR TOGGLE CONTENT"
      // feedback (Website Feedback Tracker, 2026-10-21).
      sectors: ['investors'],
      eyebrow: 'atlas',
      badge: 'INVESTORS',
      title: 'Sourcing your next investment?',
      blurb:
        'Find relevant deals, assess companies and strengthen your due diligence with SportsTechX market data and analysis.',
      cta: 'TRY ATLAS SCOUT',
      ctaHref: 'https://www.atlas.sportstechx.com/',
      cta2: { label: 'BOOK A CALL', href: 'https://cal.com/khyati/sportstechx' },
      testimonialsLabel: 'ATLAS TESTIMONIALS',
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
  links: FooterLink[];
}

export const footer = {
  blurb:
    'SportsTechX is the insider network for sports tech — connecting founders and investors through curated access, market data and practical fundraising support.',
  email: 'hello@sportstechx.com',
  /** Where the brand column\'s signup hands off. There is no /api/subscribe in
   * this app; every newsletter CTA on the site is a link to this host, and the
   * form is a GET so the address arrives as ?email= rather than being posted
   * somewhere that would need a secret. */
  newsletterAction: 'https://newsletter.sportstechx.com/subscribe',
  columns: [
    {
      title: 'Solutions',
      links: [
        // sector flips the Solutions toggle on click as well as scrolling there.
        { label: 'For Founders', href: '/#solutions', sector: 'founders' },
        { label: 'For Investors', href: '/#solutions', sector: 'investors' },
      ],
    },
    {
      title: 'Products',
      links: [
        { label: 'Playmakers', href: 'https://www.playmakers.sportstechx.com/' },
        // The Investors Circle membership page, distinct from the Playmakers
        // landing above.
        { label: 'Investors Circle', href: 'https://joinplaymakers.co' },
        { label: 'Atlas', href: 'https://www.atlas.sportstechx.com' },
      ],
    },
    {
      title: 'Media',
      links: [
        { label: 'Newsletter', href: 'https://newsletter.sportstechx.com' },
        { label: 'Podcast', href: 'https://creators.spotify.com/pod/profile/sportstechx/' },
        // The hub, not atlas.sportstechx.com/reports — that redirects to /login.
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
    { title: 'SOLUTIONS', links: [{ label: 'FOR FOUNDERS', href: '/#solutions' }, { label: 'FOR INVESTORS', href: '/#solutions' }] },
    { title: 'MENU', links: [{ label: 'MEDIA', href: '/#media' }, { label: 'ABOUT', href: '/about', newTab: true }] },
    {
      title: 'CONNECT',
      links: [
        { label: 'JOIN THE NEWSLETTER', href: 'https://newsletter.sportstechx.com', accent: true },
        { label: 'LINKEDIN', href: 'https://www.linkedin.com/company/sportstechx/' },
        { label: 'YOUTUBE', href: 'https://www.youtube.com/@SportsTechX' },
      ],
    },
  ],
};
