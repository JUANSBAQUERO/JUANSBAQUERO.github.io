import type {
  AboutContent,
  ContactContent,
  ExperienceContent,
  ProjectsContent,
  SkillsContent,
  StationSection,
} from '../src/domain/entities/Station';

/**
 * Real portfolio content for Juan Sebastián Baquero.
 * Pure data — editing a job, a project, or a skill means editing ONLY this
 * file. No 3D code, no UI code, no build step needs to change.
 */

export const stationLayout: readonly StationSection[] = [
  { key: 'about', color: 0x4cf3ff, position: { x: 0, y: 0, z: -11 } },
  { key: 'experience', color: 0x4cf3ff, position: { x: -14, y: 0, z: -3 } },
  { key: 'projects', color: 0xff4cd6, position: { x: 14, y: 0, z: -3 } },
  { key: 'skills', color: 0x4cf3ff, position: { x: -14, y: 0, z: 10 } },
  { key: 'contact', color: 0xff4cd6, position: { x: 14, y: 0, z: 10 } },
];

export const aboutContent: AboutContent = {
  key: 'about',
  accentHex: '#4CF3FF',
  eyebrow: 'About',
  title: 'Profile',
  paragraphs: [
    'Senior Full Stack Developer with 7+ years of experience building and scaling end-to-end web and mobile solutions. Specialized in crafting high-impact, usable interfaces (React.js, Next.js, Angular, TypeScript) with strong UI/UX design principles, backed by solid backend architecture (NestJS, Node.js, Spring Boot) and cloud infrastructure (AWS, Docker).',
    'Proven track record leading projects for government entities, financial exchanges, and SaaS platforms with AI integration — from fintech wallets and payment gateways to national-scale educational platforms.',
    'Based in Bogotá, Colombia — open to remote opportunities worldwide.',
  ],
};

export const experienceContent: ExperienceContent = {
  key: 'experience',
  accentHex: '#4CF3FF',
  eyebrow: 'Career',
  title: 'Experience',
  jobs: [
    {
      role: 'Full Stack Developer',
      org: 'DATUP',
      period: 'April 2025 – Present',
      summary:
        'Co-creating a SaaS platform focused on inventory optimization with AI — demand forecasting to maximize profitability and prevent stockouts. Building the main web app and backend microservices with scalable architecture and SOLID principles, plus advanced UI/UX.',
      tags: ['React.js', 'TypeScript', 'NestJS', 'AI', 'UI/UX'],
    },
    {
      role: 'Mobile & Full Stack Developer',
      org: 'Payments Way',
      period: 'March 2024 – March 2025',
      summary:
        'Built hybrid and native mobile apps integrated with secure Java (Spring Boot) backends. Technical direction integrating hardware and software with real-time performance optimization — white-label wallet, toll payment tag system, fashion e-commerce.',
      tags: ['Flutter', 'Swift', 'Kotlin', 'React Native', 'Spring Boot'],
    },
    {
      role: 'Full Stack Developer',
      org: 'Rational Software',
      period: '2022 – 2024',
      summary:
        'End-to-end leadership and development of multiple enterprise solutions connecting Spring Boot/NestJS backends with Angular and React frontends — including ICFES (national educational evaluation platform) and Bolsa Mercantil de Colombia.',
      tags: ['Angular', 'React', 'NestJS', 'Spring Boot', 'PostgreSQL'],
    },
    {
      role: 'Full Stack Developer',
      org: 'DigiWorld',
      period: '2019 – 2022',
      summary:
        'Web and backend development with PHP, Express, Node.js and NestJS, alongside ReactJS and AngularJS interfaces. Implementation of a transactional payment gateway with sensitive data handling and secure infrastructure.',
      tags: ['PHP', 'Node.js', 'ReactJS', 'Payment Gateways'],
    },
  ],
};

export const projectsContent: ProjectsContent = {
  key: 'projects',
  accentHex: '#FF4CD6',
  eyebrow: 'Selected Work',
  title: 'Projects',
  projects: [
    {
      org: 'DATUP',
      title: 'AI Inventory Management WebApp',
      summary:
        'SaaS platform using AI-driven demand forecasting to optimize inventory and prevent stockouts/overstock, with a scalable microservices architecture.',
      detail:
        'Co-building the main web app and backend microservices for a SaaS platform that forecasts demand with AI to help businesses avoid stockouts and overstock. Led UI/UX work on the forecasting dashboards while keeping the service layer scalable and SOLID.',
      stack: ['React.js', 'TypeScript', 'NestJS', 'AI', 'Microservices'],
    },
    {
      org: 'Payments Way',
      title: 'White-Label Digital Wallet',
      summary:
        'Customizable digital wallet with intuitive UI/UX and transactional security, built for rapid white-labeling across clients.',
      detail:
        'Built a hybrid/native mobile wallet designed to be re-skinned and re-deployed quickly per client, with secure Java (Spring Boot) backends handling transactional integrity.',
      stack: ['Flutter', 'React Native', 'Spring Boot'],
    },
    {
      org: 'Payments Way',
      title: 'Toll Payment Tag System',
      summary:
        'Hardware + software integration for real-time toll payments, with strict performance optimization requirements.',
      detail:
        'Integrated physical toll-tag hardware with a real-time payment backend, under tight latency requirements — a lane read had to resolve and charge in the time a car takes to pass through.',
      stack: ['Kotlin', 'Swift', 'Spring Boot'],
    },
    {
      org: 'Payments Way',
      title: 'Fashion E-commerce Platform',
      summary:
        'High-volume data management and personalized recommendation algorithms for an online fashion retailer.',
      detail:
        'Built the data layer and recommendation logic for a fashion e-commerce platform handling high catalog/order volume, with personalization driving product discovery.',
      stack: ['React Native', 'Spring Boot', 'PostgreSQL'],
    },
    {
      org: 'Rational Software',
      title: 'ICFES',
      summary:
        'Technology solutions to optimize national-scale educational evaluation processes in Colombia.',
      detail:
        'Part of the team building and operating a national-scale educational evaluation platform for ICFES, connecting Spring Boot/NestJS backends with Angular/React frontends under strict reliability requirements (exam-day traffic spikes, no room for downtime).',
      stack: ['Angular', 'React', 'Spring Boot', 'NestJS'],
    },
    {
      org: 'Rational Software',
      title: 'Bolsa Mercantil de Colombia',
      summary: "Implementation of critical web applications strengthening the exchange's digital services.",
      detail:
        'Delivered critical web applications for a financial exchange, where data accuracy and uptime directly affect trading operations.',
      stack: ['Angular', 'NestJS', 'PostgreSQL'],
    },
    {
      org: 'DigiWorld',
      title: 'Payment Gateway — Payments Way',
      summary: 'Custom transactional gateway handling sensitive data over secure infrastructure.',
      detail:
        'Built a custom transactional payment gateway handling sensitive card/account data, with security and compliance as first-class constraints rather than an afterthought.',
      stack: ['PHP', 'Node.js', 'ReactJS'],
    },
    {
      org: 'DigiWorld',
      title: 'Cámara de Comercio Colombo Ecuatoriana & Rockgota',
      summary: 'Custom software development and problem-solving for complex institutional requirements.',
      detail:
        'Custom software built around specific institutional workflows for a bilateral trade chamber and a separate client, prioritizing fit to their existing process over forcing a generic off-the-shelf tool.',
      stack: ['PHP', 'Node.js'],
    },
    {
      org: 'Personal Project',
      title: 'FinanceOS — Personal Finance Tracker',
      summary:
        'Configurable personal finance SaaS: dashboard, expenses, debts, cash flow, goals and investments, built solo end-to-end.',
      detail:
        'A personal finance tracker built from scratch to learn and apply Clean Architecture on both frontend and backend: feature-first React frontend, Supabase (PostgreSQL + Auth + Row Level Security) backend, offline-first via IndexedDB. Covers dashboard, expense tracking, debt payoff projections, cash flow, goals, and investments.',
      stack: ['React', 'TypeScript', 'Supabase', 'PostgreSQL', 'Zustand', 'TanStack Query'],
      downloadLabel: 'Download the build playbook (Markdown)',
      downloadHref: '/downloads/finance-tracker-playbook.md',
    },
    {
      org: 'Personal Project',
      title: 'Stack Rush — Mobile Game',
      summary: 'Hypercasual block-stacking mobile game built with React Native + Expo for iOS and Android.',
      detail:
        'A hypercasual stacking game where precision drops keep the block at full size and misses shrink it until Game Over. Built as a from-scratch exercise in a framework-free game engine (pure functions, no React in the core loop) driven by a single Zustand store, with full test coverage on the engine logic.',
      stack: ['React Native', 'Expo', 'TypeScript', 'Zustand', 'Reanimated'],
    },
  ],
};

export const skillsContent: SkillsContent = {
  key: 'skills',
  accentHex: '#4CF3FF',
  eyebrow: 'Toolbox',
  title: 'Skills & Stack',
  groups: [
    {
      title: 'Frontend Core & UX/UI',
      skills: ['React.js', 'Next.js', 'Angular', 'TypeScript', 'SASS', 'Tailwind CSS', 'UI/UX Design'],
    },
    {
      title: 'Backend & Architecture',
      skills: ['NestJS', 'Node.js', 'Express', 'Java / Spring Boot', 'PHP', 'REST APIs', 'GraphQL', 'SOAP'],
    },
    {
      title: 'Mobile',
      skills: ['Flutter', 'Swift', 'React Native', 'Kotlin'],
    },
    {
      title: 'Data & Cloud',
      skills: ['PostgreSQL', 'MySQL', 'MongoDB', 'SQL Server', 'AWS', 'Docker', 'DigitalOcean'],
    },
  ],
};

export const contactContent: ContactContent = {
  key: 'contact',
  accentHex: '#FF4CD6',
  eyebrow: 'Get in touch',
  title: 'Contact',
  links: [
    {
      icon: '✉',
      label: 'baqueromorenoj@gmail.com',
      href: 'mailto:baqueromorenoj@gmail.com',
    },
    {
      icon: 'in',
      label: 'linkedin.com/in/juan-sebastian-baquero-moreno-5146191b4',
      href: 'https://www.linkedin.com/in/juan-sebastian-baquero-moreno-5146191b4',
    },
    { icon: '◍', label: 'Bogotá, Colombia — open to remote work worldwide' },
  ],
  note: 'Reach out for full-stack roles, freelance projects, or just to talk shop about React/Node architectures.',
};
