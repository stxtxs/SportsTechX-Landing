/**
 * The About page: who SportsTechX is, and the people behind it.
 *
 * Copy and photographs carried over from sportstechx.com/about. The photos were
 * embedded there as base64 data URIs; they are real files under public/team/ now.
 * The LinkedIn URLs come from the same source — the old site serves this from
 * /api/team-members and /api/advisors, and every profile there has one.
 */

export interface Person {
  name: string;
  role: string;
  bio: string;
  /**
   * Favourite teams or athletes — the personal note the design shows last.
   *
   * Carries its own label because the label is not constant: two people list
   * athletes rather than clubs, and the old site labels those rows differently.
   * Hardcoding "Sports Teams:" in the component would caption Cristiano Ronaldo
   * and Roger Federer as teams.
   */
  teams: string;
  /** Path under public/. */
  photo: string;
  linkedin: string;
}

export const about = {
  intro: [
    'Based in Berlin, SportsTechX is the leading source for sports technology, innovation, and investment intelligence. Since 2018, we\'ve meticulously mapped the fast evolving Sports Tech ecosystem, delivering nuanced analysis of emerging startups, investment patterns, and market dynamics through multi-modal content, proprietary research, consulting, and investment advisory services.',
    'We help sports business leaders make smarter decisions and build future-focused strategies. Here\'s the team that delivers on that promise.',
  ],
  /** The old site opens its Advisors section with this; the rebuild had dropped it. */
  advisorsIntro:
    'Our advisors are seasoned founders, investors, and industry veterans who\'ve built, scaled, and invested in companies at the forefront of Sports Tech.',
  team: [
    {
      name: 'Thomas Preiss',
      role: 'Chief Strategy Officer',
      bio: 'Common Goal Co-Founder | Athlete Community Builder | Venture Investor | Sports, Capital & Innovation for Positive Impact',
      teams: 'Sports Teams: SV Werder Bremen',
      photo: '/team/thomas-preiss.jpg',
      linkedin: 'https://www.linkedin.com/in/preissthomas/',
    },
    {
      name: 'Rohn Malhotra',
      role: 'Co-Founder & CEO',
      bio: 'Rohn is a serial entrepreneur, sports nut and cinephile with 16+ years of experience. He began his career as a Management Consultant with KPMG, successfully exited his last startup in 2017, then entered the SportsTech industry in 2018, making Berlin his home. Is also an Investment Director at Match Ventures, a SportsTech VC fund.',
      teams: 'Sports Teams: Manchester United, Bengaluru FC, Golden State Warriors',
      photo: '/team/rohn-malhotra.jpg',
      linkedin: 'https://www.linkedin.com/in/rohnmalhotra/',
    },
    {
      name: 'Vishnu Dixit',
      role: 'Head of Tech & Infrastructure',
      bio: 'Vishnu is a passionate football enthusiast, enjoys high-altitude trekking and has a keen interest in data science, machine learning and computer vision. With prior experience as a risk investigator at Amazon, he has developed strong analytical skills and is currently pursuing a Masters in Data Science from Liverpool John Moores University.',
      teams: 'Sports Teams: Bengaluru FC, Newcastle United, FC Barcelona, RC Bangalore',
      photo: '/team/vishnu-dixit.jpg',
      linkedin: 'https://www.linkedin.com/in/vishnu-dixit-758344153/',
    },
    {
      name: 'Khyati Choudhary',
      role: 'Head of Communications & Operations',
      bio: 'KC is an amateur footballer, long distance runner and an adventure sports enthusiast. She brings extensive experience in sports media and presenting across multiple sports, backed by an academic foundation in psychology and a Masters in Journalism. Beyond sport, she\'s actively involved in animal welfare and rescue initiatives.',
      // The old site writes this one "Sports Teams/ Athletes:"; normalised to
      // "Sports Teams/Athletes:" to match the rest.
      teams: 'Sports Teams/Athletes: Real Madrid, Cristiano Ronaldo, Aryna Sabalenka, Alex Pereira',
      photo: '/team/khyati-choudhary.jpg',
      linkedin: 'https://www.linkedin.com/in/khyati-choudhary/',
    },
    {
      name: 'Brendon Murzello',
      role: 'Marketing',
      bio: 'Brendon heads up marketing and content at SportsTechX, blending strategic messaging with digital design to elevate our brand. Outside the office, he\'s usually training for his next run, shooting content or on a hike.',
      teams: 'Sports Teams: Manchester United, Red Bull Racing',
      photo: '/team/brendon-murzello.jpg',
      linkedin: 'https://www.linkedin.com/in/brendon-murzello-561b6a311',
    },
    {
      name: 'Umananda Siddha',
      role: 'Software Engineer',
      bio: 'Umananda builds and maintains the website and software architecture of SportsTechX. He plays chess.',
      // The only profile with no clubs to list; he gave "None" rather than
      // leave it blank, and the card always renders this row.
      teams: 'Sports Teams: None',
      photo: '/team/umananda-siddha.jpg',
      linkedin: 'https://www.linkedin.com/in/umananda-siddha-399b95217/',
    },
    {
      name: 'Avdhut Gursale',
      role: 'Research & Data',
      bio: 'Avdhut is a national-level footballer who has played for Rajasthan United FC. He holds an MBA in Sports Management and blends his on-field experience with a passion for digital storytelling and social media. He is passionate about promoting football and creating more opportunities for the sport to grow.',
      teams: 'Sports Teams: Rajasthan United FC, Union Bank of India, Any Indian Contingent!',
      photo: '/team/avdhut-gursale.jpg',
      linkedin: 'https://www.linkedin.com/in/avdhut-gursale-b2a2a0312/',
    },
    {
      name: 'Gaurav Kr. Jha',
      role: 'Research & Data Analyst',
      bio: 'Gaurav holds a B.Tech in Electronics and Communication Engineering. He enjoys working with data and is also into content creation and digital storytelling. A loyal RCB fan, he is always up for learning something new.',
      teams: 'Sports Teams: Royal Challengers Bangalore',
      photo: '/team/gaurav-kr-jha.jpg',
      linkedin: 'https://www.linkedin.com/in/gauravkrjha07',
    },
  ] satisfies Person[],
  advisors: [
    {
      name: 'Mitch Heath',
      role: 'Advisor',
      bio: 'Sports Executive || Coach, Advisor, Investor, Board Member || Co-Founder at Teamworks, The Operating System for Sports (TM)',
      teams: 'Sports Teams: Duke Blue Devils',
      photo: '/team/mitch-heath.jpg',
      linkedin: 'https://www.linkedin.com/in/mitchheath/',
    },
    {
      name: 'Benjamin Penkert',
      role: 'Co-Founder & Advisor',
      bio: 'SportsTechX ｜ Enjoys talking Web3, playing Padel & spending time in Cape Town',
      teams: 'Sports Teams: FC Bayern Munich',
      photo: '/team/benjamin-penkert.jpg',
      linkedin: 'https://www.linkedin.com/in/bpenkert/',
    },
  ] satisfies Person[],
};
