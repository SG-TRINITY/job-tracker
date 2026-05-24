export interface Status {
  id: string;
  label: string;
  icon: string;
  color: string;
}

export interface JobContact {
  name: string;
  role: string;
  email?: string;
}

export interface TimelineEntry {
  date: string;
  kind: string;
  note: string;
}

export interface PrepItem {
  id: string;
  text: string;
  done: boolean;
}

export interface Attachment {
  name: string;
  size: string;
  kind: string;
}

export interface Job {
  id: string;
  company: string;
  role: string;
  location?: string;
  salary?: string;
  status: string;
  appliedAt: string;
  source: string;
  resume: string;
  priority: number;
  tags: string[];
  link?: string;
  contacts: JobContact[];
  timeline: TimelineEntry[];
  description: string;
  prepChecklist: PrepItem[];
  notes: string;
  pros: string[];
  cons: string[];
  attachments: Attachment[];
}

export const STATUSES: Status[] = [
  { id: 'wishlist',  label: 'Wishlist',     icon: '🌱', color: '#7a9bb8' },
  { id: 'applied',   label: 'Applied',      icon: '📜', color: '#5b7fb8' },
  { id: 'screen',    label: 'Phone Screen', icon: '📞', color: '#a37fc4' },
  { id: 'interview', label: 'Interview',    icon: '⚔️', color: '#d9a13a' },
  { id: 'offer',     label: 'Offer',        icon: '🏆', color: '#5a8a3a' },
  { id: 'rejected',  label: 'Rejected',     icon: '💀', color: '#b85450' },
  { id: 'ghosted',   label: 'Ghosted',      icon: '👻', color: '#8a8076' },
];

export const SOURCES = ['LinkedIn', 'Referral', 'Company Site', 'Indeed', 'Wellfound', 'Hacker News', 'Twitter'];

export const RESUMES = ['v3 — generalist', 'v3 — frontend', 'v4 — design eng', 'v4 — staff', 'v2 — startup'];

export const STATUS_ICONS: Record<string, string> = {
  wishlist:  '/assets/icon-clover.png',
  applied:   '/assets/icon-scroll.png',
  screen:    '/assets/icon-crystal.png',
  interview: '/assets/icon-flame-sword.png',
  offer:     '/assets/icon-chest.png',
  rejected:  '/assets/icon-skull.png',
  ghosted:   '/assets/icon-grave.png',
};

export const INITIAL_JOBS: Job[] = [
  {
    id: 'j1', company: 'Mossvale Studios', role: 'Senior Frontend Engineer',
    location: 'Remote · US', salary: '$165k – $195k', status: 'interview',
    appliedAt: '2026-04-28', source: 'Referral', resume: 'v3 — frontend',
    priority: 4, tags: ['remote', 'react', 'series-b'],
    link: 'https://mossvale.example/careers/3219',
    contacts: [
      { name: 'Iris Hollow',   role: 'Recruiter',      email: 'iris@mossvale.example' },
      { name: 'Bram Petrelli', role: 'Hiring Manager',  email: 'bram@mossvale.example' },
    ],
    timeline: [
      { date: '2026-04-28', kind: 'applied',   note: 'Submitted via referral link from Wren.' },
      { date: '2026-05-02', kind: 'screen',    note: 'Recruiter call — 30 min. Vibes good.' },
      { date: '2026-05-09', kind: 'interview', note: 'Tech screen — pair coded on a calendar widget.' },
      { date: '2026-05-15', kind: 'interview', note: 'Onsite scheduled for May 21.' },
    ],
    description: "We're hiring a Senior Frontend Engineer to shape the look, feel and pace of our authoring tools. You'll partner with design on systems, ship features end-to-end, and own the long-tail polish that makes the product feel alive. We use React, TypeScript, and a homegrown design system on top of Radix primitives.",
    prepChecklist: [
      { id: 'p1', text: 'Reread architecture writeup',        done: true  },
      { id: 'p2', text: 'Practice 3 system design prompts',   done: true  },
      { id: 'p3', text: 'Prepare 5 questions for Bram',       done: false },
      { id: 'p4', text: 'Refresh on TanStack Query internals', done: false },
    ],
    notes: "Bram seems thoughtful — asked great questions about ownership and oncall.\nWren says comp is flexible, push for 185+ base.\nTeam of 4 engineers, lots of room to influence early.",
    pros: ['Real ownership', 'Strong design partner', 'Equity refresh annually', 'Remote-first'],
    cons: ['Series B — runway risk', 'No formal mentorship', 'East coast hours'],
    attachments: [
      { name: 'Resume_v3_Frontend.pdf', size: '184 KB', kind: 'resume' },
      { name: 'Cover_Mossvale.pdf',     size: '92 KB',  kind: 'cover'  },
    ],
  },
  {
    id: 'j2', company: 'Cinder & Cog', role: 'Staff Software Engineer',
    location: 'Brooklyn, NY', salary: '$220k – $260k', status: 'screen',
    appliedAt: '2026-05-04', source: 'LinkedIn', resume: 'v4 — staff',
    priority: 5, tags: ['hybrid', 'infra', 'fintech'],
    link: 'https://cinderandcog.example/jobs/staff-eng',
    contacts: [{ name: 'Odette Marrow', role: 'Sr. Recruiter', email: 'odette@cinder.example' }],
    timeline: [
      { date: '2026-05-04', kind: 'applied', note: 'Cold app via LinkedIn — easy apply.' },
      { date: '2026-05-12', kind: 'screen',  note: 'Recruiter screen booked for May 18.' },
    ],
    description: 'Staff IC role on the platform team. Owns query layer, caching, and the migration off the legacy monolith.',
    prepChecklist: [
      { id: 'p1', text: 'Read recent eng blog posts',          done: true  },
      { id: 'p2', text: 'Practice staff-level scope questions', done: false },
      { id: 'p3', text: "Outline a \"biggest impact\" story",    done: false },
    ],
    notes: 'Salary high but hybrid 3 days in Brooklyn — would need to commute.\nOdette mentioned a recent reorg, ask about it.',
    pros: ['Strong comp band', 'Real platform problems', 'Smart team'],
    cons: ['Hybrid 3 days', 'Recent reorg', 'Long process'],
    attachments: [{ name: 'Resume_v4_Staff.pdf', size: '192 KB', kind: 'resume' }],
  },
  {
    id: 'j3', company: 'Brassbird Studio', role: 'Design Engineer',
    location: 'Remote · Global', salary: '$140k – $170k', status: 'offer',
    appliedAt: '2026-04-12', source: 'Twitter', resume: 'v4 — design eng',
    priority: 5, tags: ['remote', 'design-eng', 'small-team'],
    link: 'https://brassbird.example/work-with-us',
    contacts: [
      { name: 'Linnea Vesper', role: 'Co-founder',    email: 'linnea@brassbird.example' },
      { name: 'Calla Roan',    role: 'Head of Design', email: 'calla@brassbird.example' },
    ],
    timeline: [
      { date: '2026-04-12', kind: 'applied',   note: "Replied to Linnea's tweet with a demo loom." },
      { date: '2026-04-15', kind: 'screen',    note: 'Founder chat — they liked the demo.' },
      { date: '2026-04-22', kind: 'interview', note: 'Take-home: rebuild a settings page. 4 hrs.' },
      { date: '2026-04-29', kind: 'interview', note: 'Onsite x4 — design, eng, product, founder.' },
      { date: '2026-05-08', kind: 'offer',     note: 'Verbal offer! $160k + 0.4% equity.' },
    ],
    description: "We're a tiny studio building tools for independent magazine publishers. You'd be our second design engineer, working closely with Calla on the editor and Linnea on the marketing site.",
    prepChecklist: [
      { id: 'p1', text: 'Negotiate equity refresh',    done: false },
      { id: 'p2', text: 'Ask about benefits + PTO',    done: true  },
      { id: 'p3', text: 'Compare to Mossvale offer',   done: false },
    ],
    notes: 'OFFER CAME IN — $160k + 0.4%.\nNeed to respond by May 26.\nTeam is 6 people total. Linnea is a known design eng — would learn a lot.',
    pros: ['Dream team', 'Pure design eng role', 'Tiny company, big leverage', 'Async-first'],
    cons: ['Lower base than ask', 'No 401k match', 'Comp ceiling'],
    attachments: [
      { name: 'Resume_v4_DesignEng.pdf',  size: '178 KB', kind: 'resume' },
      { name: 'Cover_Brassbird.pdf',       size: '88 KB',  kind: 'cover'  },
      { name: 'Takehome_Settings.zip',     size: '2.1 MB', kind: 'other'  },
    ],
  },
  {
    id: 'j4', company: 'Sprout Systems', role: 'Senior Product Engineer',
    location: 'Remote · US', salary: '$170k – $200k', status: 'applied',
    appliedAt: '2026-05-14', source: 'Hacker News', resume: 'v3 — generalist',
    priority: 3, tags: ['remote', 'gardening-tech', 'b2c'],
    link: 'https://sproutsystems.example/jobs',
    contacts: [], timeline: [{ date: '2026-05-14', kind: 'applied', note: "Cold app from HN Who's Hiring." }],
    description: 'Product eng on the consumer team — building tools for home gardeners. Mostly TypeScript + React Native.',
    prepChecklist: [],
    notes: 'No response yet. Following up in a week if quiet.',
    pros: ['Mission I care about', 'Strong eng blog'],
    cons: ['Lots of applicants', 'B2C engagement metrics'],
    attachments: [{ name: 'Resume_v3_Generalist.pdf', size: '180 KB', kind: 'resume' }],
  },
  {
    id: 'j5', company: 'Velvet Anvil', role: 'Senior Engineer, Tools',
    location: 'San Francisco', salary: '$200k – $240k', status: 'rejected',
    appliedAt: '2026-03-22', source: 'Referral', resume: 'v3 — generalist',
    priority: 2, tags: ['onsite', 'game-tools', 'sf'],
    link: 'https://velvetanvil.example/careers',
    contacts: [{ name: 'Pax Underhill', role: 'Eng Manager', email: 'pax@velvet.example' }],
    timeline: [
      { date: '2026-03-22', kind: 'applied',   note: 'Referral from old coworker Juno.' },
      { date: '2026-03-29', kind: 'screen',    note: 'Phone screen — went OK.' },
      { date: '2026-04-08', kind: 'interview', note: 'Onsite — bombed the systems design.' },
      { date: '2026-04-14', kind: 'rejected',  note: 'Rejected — feedback: scope on systems was too narrow.' },
    ],
    description: 'Tools engineer for an internal game engine. Heavy C++.',
    prepChecklist: [],
    notes: 'Lesson: practice systems design at a wider scope.\nPax was kind in the rejection — said the door is open.',
    pros: [], cons: ['Onsite SF only', 'C++ heavy'],
    attachments: [{ name: 'Resume_v3_Generalist.pdf', size: '180 KB', kind: 'resume' }],
  },
  {
    id: 'j6', company: 'Lichen & Loom', role: 'Frontend Engineer II',
    location: 'Remote · EU', salary: '€95k – €115k', status: 'ghosted',
    appliedAt: '2026-03-04', source: 'LinkedIn', resume: 'v3 — frontend',
    priority: 1, tags: ['remote', 'eu-hours'],
    link: 'https://lichen.example/jobs',
    contacts: [],
    timeline: [
      { date: '2026-03-04', kind: 'applied', note: 'Easy apply.' },
      { date: '2026-03-19', kind: 'applied', note: 'Followed up — no response.' },
    ],
    description: 'Frontend eng on the textile-discovery platform.',
    prepChecklist: [], notes: 'Crickets. Moving on.', pros: [], cons: [],
    attachments: [{ name: 'Resume_v3_Frontend.pdf', size: '184 KB', kind: 'resume' }],
  },
  {
    id: 'j7', company: 'Murmurleaf', role: 'Founding Engineer',
    location: 'Remote · US', salary: '$160k – $190k + 1.5% equity', status: 'interview',
    appliedAt: '2026-05-02', source: 'Wellfound', resume: 'v4 — design eng',
    priority: 4, tags: ['remote', 'founding', 'pre-seed'],
    link: 'https://murmurleaf.example/jobs/founding',
    contacts: [{ name: 'Rho Cantwell', role: 'CEO', email: 'rho@murmurleaf.example' }],
    timeline: [
      { date: '2026-05-02', kind: 'applied',   note: 'Wellfound app.' },
      { date: '2026-05-06', kind: 'screen',    note: 'Founder call w/ Rho — 45 min.' },
      { date: '2026-05-13', kind: 'interview', note: 'Take-home: design a contributor flow.' },
    ],
    description: 'Founding engineer — build the product alongside Rho. Pre-seed, $1.8M raised.',
    prepChecklist: [
      { id: 'p1', text: 'Finish takehome by Friday', done: false },
      { id: 'p2', text: 'Prepare equity questions',  done: false },
    ],
    notes: 'Rho is sharp but VERY ambitious. Watch for scope creep.\nEquity is the real comp here.',
    pros: ['Founding eng equity', 'Build from zero', 'Smart founder'],
    cons: ['Pre-seed risk', 'Probably long hours', 'No team yet'],
    attachments: [{ name: 'Resume_v4_DesignEng.pdf', size: '178 KB', kind: 'resume' }],
  },
  {
    id: 'j8', company: 'Cobblestone Studios', role: 'Senior UI Engineer',
    location: 'Remote · US', salary: '$155k – $180k', status: 'wishlist',
    appliedAt: '2026-05-18', source: 'Company Site', resume: 'v3 — frontend',
    priority: 3, tags: ['remote', 'creative-tools'],
    link: 'https://cobblestone.example/careers',
    contacts: [],
    timeline: [{ date: '2026-05-18', kind: 'wishlist', note: 'Bookmarked — they make creative tools.' }],
    description: 'UI engineer on the canvas team. Heavy WebGL.',
    prepChecklist: [], notes: 'Want to brush up on WebGL before applying.',
    pros: ['Creative tools space', 'Strong design culture'], cons: ['WebGL rusty'],
    attachments: [],
  },
  {
    id: 'j9', company: 'Nettlebrook', role: 'Senior Engineer',
    location: 'Remote · US/CA', salary: '$170k – $200k', status: 'screen',
    appliedAt: '2026-05-08', source: 'Referral', resume: 'v3 — generalist',
    priority: 3, tags: ['remote', 'data-viz'],
    link: 'https://nettlebrook.example/jobs',
    contacts: [{ name: 'Wren Yara', role: 'Eng', email: 'wren@nettlebrook.example' }],
    timeline: [
      { date: '2026-05-08', kind: 'applied', note: 'Wren passed my resume to the recruiter.' },
      { date: '2026-05-16', kind: 'screen',  note: 'Recruiter screen scheduled for May 22.' },
    ],
    description: 'Data viz engineering — interactive dashboards.',
    prepChecklist: [{ id: 'p1', text: 'Refresh on D3 basics', done: false }],
    notes: 'Wren is the referrer — owes them a coffee.',
    pros: ['Data viz is fun', 'Wren is great'], cons: ['Unknown team'],
    attachments: [{ name: 'Resume_v3_Generalist.pdf', size: '180 KB', kind: 'resume' }],
  },
  {
    id: 'j10', company: 'Quill Forge', role: 'Senior Engineer, Editor',
    location: 'Remote · US', salary: '$175k – $210k', status: 'applied',
    appliedAt: '2026-05-11', source: 'LinkedIn', resume: 'v3 — frontend',
    priority: 4, tags: ['remote', 'editor', 'prosemirror'],
    link: 'https://quillforge.example/jobs',
    contacts: [],
    timeline: [{ date: '2026-05-11', kind: 'applied', note: 'Direct application.' }],
    description: 'Build the rich-text editor that powers our docs product. ProseMirror experience a plus.',
    prepChecklist: [], notes: 'Excited about this one — editor work is my favorite.',
    pros: ['Editor work', 'Solid funding'], cons: ['Big team, less ownership'],
    attachments: [{ name: 'Resume_v3_Frontend.pdf', size: '184 KB', kind: 'resume' }],
  },
  {
    id: 'j11', company: 'Reefcurrent', role: 'Product Engineer',
    location: 'Remote · Americas', salary: '$150k – $175k', status: 'rejected',
    appliedAt: '2026-04-04', source: 'LinkedIn', resume: 'v3 — generalist',
    priority: 2, tags: ['remote', 'b2b'],
    contacts: [],
    timeline: [
      { date: '2026-04-04', kind: 'applied',  note: 'Easy apply.' },
      { date: '2026-04-18', kind: 'rejected', note: 'Auto-rejection email — no specifics.' },
    ],
    description: 'Product eng on the integrations team.', prepChecklist: [],
    notes: 'Generic reject. Moving on.', pros: [], cons: [], attachments: [],
  },
  {
    id: 'j12', company: 'Folio & Forge', role: 'Senior Frontend Engineer',
    location: 'Remote · US', salary: '$160k – $185k', status: 'wishlist',
    appliedAt: '2026-05-19', source: 'Twitter', resume: 'v3 — frontend',
    priority: 3, tags: ['remote', 'publishing'],
    contacts: [],
    timeline: [{ date: '2026-05-19', kind: 'wishlist', note: 'Saw their post about typography tooling.' }],
    description: 'Frontend on a publishing platform for indie writers.', prepChecklist: [],
    notes: 'Want to put together a better cover letter for this one.',
    pros: ['Publishing space', 'Type nerds'], cons: ['Smaller comp band'], attachments: [],
  },
  {
    id: 'j13', company: 'Pixelmint', role: 'Engineer, Growth',
    location: 'Remote · US', salary: '$140k – $170k', status: 'interview',
    appliedAt: '2026-04-30', source: 'Indeed', resume: 'v3 — generalist',
    priority: 3, tags: ['remote', 'growth', 'experimentation'],
    contacts: [{ name: 'Saoirse Pell', role: 'Recruiter', email: 'saoirse@pixelmint.example' }],
    timeline: [
      { date: '2026-04-30', kind: 'applied',   note: 'Indeed application.' },
      { date: '2026-05-06', kind: 'screen',    note: 'Recruiter screen.' },
      { date: '2026-05-13', kind: 'interview', note: 'Hiring manager screen.' },
      { date: '2026-05-20', kind: 'interview', note: 'Tech screen scheduled May 23.' },
    ],
    description: 'Growth eng — experimentation platform, dashboards, attribution.', prepChecklist: [],
    notes: 'Not my favorite domain but the team seems solid.',
    pros: ['Quick process', 'Solid team'], cons: ["Growth eng isn't my passion"],
    attachments: [{ name: 'Resume_v3_Generalist.pdf', size: '180 KB', kind: 'resume' }],
  },
  {
    id: 'j14', company: 'Greenleaf Software', role: 'Senior Software Engineer',
    location: 'Remote · US', salary: '$165k – $190k', status: 'applied',
    appliedAt: '2026-05-16', source: 'Hacker News', resume: 'v3 — generalist',
    priority: 3, tags: ['remote', 'devtools'],
    contacts: [],
    timeline: [{ date: '2026-05-16', kind: 'applied', note: "HN Who's Hiring app." }],
    description: 'Devtools eng — CLI + SDK for a build tool.', prepChecklist: [],
    notes: '', pros: ['Devtools'], cons: ['CLI heavy'], attachments: [],
  },
  {
    id: 'j15', company: 'Mistwell Games', role: 'UI Engineer',
    location: 'Vancouver, BC', salary: 'CAD 130k – 160k', status: 'wishlist',
    appliedAt: '2026-05-20', source: 'Company Site', resume: 'v3 — frontend',
    priority: 2, tags: ['hybrid', 'games', 'ca'],
    contacts: [],
    timeline: [{ date: '2026-05-20', kind: 'wishlist', note: 'Cozy game studio, would be a dream.' }],
    description: 'UI engineer on a cozy farming sim.', prepChecklist: [],
    notes: 'Visa would be complicated.',
    pros: ['DREAM company', 'Cozy games'], cons: ['Hybrid Vancouver', 'Visa headache'], attachments: [],
  },
];
