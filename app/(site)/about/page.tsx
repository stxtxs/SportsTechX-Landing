import type { Metadata } from 'next';
import { PersonCard } from '@/components/person-card';
import { SectionIntro } from '@/components/section-intro';
import { about, type Person } from '@/lib/about';

export const metadata: Metadata = {
  // Bare title: the root layout supplies the ' — SportsTechX' template.
  title: 'About',
  description:
    'Based in Berlin, SportsTechX is the leading source for sports technology, innovation and investment intelligence. Meet the team.',
  alternates: { canonical: '/about' },
  // Without its own openGraph this page inherits the home page's, so a shared
  // link is captioned as the homepage.
  openGraph: {
    title: 'About — SportsTechX',
    description:
      'Based in Berlin, SportsTechX is the leading source for sports technology, innovation and investment intelligence. Meet the team.',
    url: '/about',
  },
};

function People({ title, intro, people }: { title: string; intro?: string; people: Person[] }) {
  return (
    <section className="mt-16 lg:mt-24">
      <h2 className="tracked font-display text-card-sm leading-[1.05] text-heading uppercase" data-rise>
        {title}
      </h2>
      {/* A short accent rule under each heading. The page is portraits and grey
          type end to end; this is the one bit of brand colour holding it. */}
      <span aria-hidden className="mt-4 block h-[3px] w-14 rounded-full bg-accent" data-rise />
      {intro && (
        <p
          className="mt-6 max-w-[820px] font-sans text-body leading-[1.78] text-heading/70 dark:text-heading/55"
          data-rise
        >
          {intro}
        </p>
      )}
      {/* grid-rows-subgrid on the cards needs them to span real tracks here, so
          each card claims three rows and siblings share them. */}
      <div className="mt-8 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:mt-12 lg:grid-cols-3 xl:grid-cols-4">
        {people.map((p) => (
          <PersonCard key={p.name} person={p} />
        ))}
      </div>
    </section>
  );
}

export default function AboutPage() {
  return (
    <div className="container-page section-y pt-32 lg:pt-40">
      <div className="max-w-[820px]" data-rise>
        <SectionIntro title="Meet Team SportsTechX" />
        {about.intro.map((p, i) => (
          <p
            key={i}
            className="mt-6 font-sans text-body leading-[1.78] text-heading/70 dark:text-heading/55"
          >
            {p}
          </p>
        ))}
      </div>

      <People title="The team" people={about.team} />
      <People title="Advisors" intro={about.advisorsIntro} people={about.advisors} />
    </div>
  );
}
