import type { LocaleContent } from '../LocaleContent';

/** English content -- source of truth, mirrors the original portfolio.ts
 *  copy (unchanged) wrapped with the new UiStrings chrome. */
export const en: LocaleContent = {
  ui: {
    nav: {
      about: 'About',
      experience: 'Experience',
      projects: 'Projects',
      lab: 'Lab',
      skills: 'Skills',
      contact: 'Contact',
    },
    cta: 'Get in touch',
    hero: {
      eyebrow: 'Interactive 3D Portfolio',
      availability: '🟢 Open to full-time roles & freelance projects',
      greetingPrefix: "Hi, I'm ",
      name: 'Juan',
      subtitle: 'I build things before I know I wanted to build them.',
      body: "7+ years shipping web & mobile products — fintech wallets, AI-driven SaaS, and whatever new thing catches my attention next. Scroll, there's a character for that.",
      scrollHint: '↓ scroll (he will walk)',
    },
    aboutTag: 'About',
    aboutRole: 'Senior Full Stack Developer',
    experienceTag: 'Career',
    experienceHeading: 'Experience',
    projectsTag: 'Selected',
    projectsHeading: 'Projects',
    labTag: 'Right now',
    labHeading: "What I'm poking at lately",
    skillsTag: 'Toolbox',
    skillsHeading: 'Skills & Stack',
    contactHeading: "Let's build something together.",
    footerLegalLink: 'Privacy & Legal Notice',
    stageLoadingCaption: 'Lacing up his shoes…',
    characterClickHint: 'psst — click him',
    characterReactions: [
      'Hey! I was mid-sprint, literally.',
      'You rang? I was about to refactor my own legs.',
      'Careful, I bill by the click.',
      'Still faster than my last code review.',
      'New experience unlocked: being poked.',
      "I'd shake your hand but I'm 2D-rigged for that.",
    ],
    whatsappLabel: 'Chat on WhatsApp',
    whatsappMessage: "Hi Juan! I saw your portfolio and I'd like to talk.",
  },

  about: {
    key: 'about',
    accentHex: '#F4C95D',
    eyebrow: 'About',
    title: 'Profile',
    paragraphs: [
      'Senior Full Stack Developer with 7+ years of experience building and scaling end-to-end web and mobile solutions. Specialized in crafting high-impact, usable interfaces (React.js, Next.js, Angular, TypeScript) with strong UI/UX design principles, backed by solid backend architecture (NestJS, Node.js, Spring Boot) and cloud infrastructure (AWS, Docker).',
      'Proven track record leading projects for government entities, financial exchanges, and SaaS platforms with AI integration — from fintech wallets and payment gateways to national-scale educational platforms.',
      'Based in Bogotá, Colombia — open to remote opportunities worldwide.',
    ],
  },

  experience: {
    key: 'experience',
    accentHex: '#F4C95D',
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
  },

  projects: {
    key: 'projects',
    accentHex: '#FF5FA2',
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
  },

  skills: {
    key: 'skills',
    accentHex: '#F4C95D',
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
  },

  lab: {
    key: 'lab',
    accentHex: '#FF8A3D',
    eyebrow: 'Right now',
    title: "What I'm poking at lately",
    intro:
      "I get bored fast with doing the same thing twice, so this is the stuff I'm actually messing with this month — not a highlight reel, just the current obsession.",
    entries: [
      {
        date: 'Nov 2026',
        title: 'Running a multi-agent dev pipeline on this exact site',
        summary:
          "Set up a Builder → Auditor → QA pipeline (isolated AI roles reviewing each other, no self-grading allowed) for this portfolio's own repo, with a PR-only git workflow and recorded branch protection. Same discipline I'd want on a team of one.",
      },
      {
        date: 'Oct 2026',
        title: 'Rebuilt this portfolio as a scroll-driven 3D journey',
        summary:
          'Swapped a static layout for a character that walks/runs/crashes/bows across the screen as you scroll, synced to animation clips and a scene-progress state machine — then tore the stage band down to size after my brother told me the character was eating all the screen real estate.',
      },
      {
        date: '2026',
        title: 'FinanceOS — building a finance SaaS to actually understand Clean Architecture',
        summary:
          "Personal finance tracker, built solo to force myself past 'I know the theory' into 'I can defend every layer boundary.' Wrote up the whole build process as a downloadable playbook in the Projects section above.",
      },
    ],
  },

  contact: {
    key: 'contact',
    accentHex: '#FF5FA2',
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
  },

  legal: {
    title: 'Privacy & Legal Notice',
    lastUpdated: 'Last updated: October 2026',
    closeLabel: 'Close',
    sections: [
      {
        heading: 'About this site',
        paragraphs: [
          'This is the personal portfolio of Juan Sebastián Baquero Moreno, a static informational website built to showcase professional experience, projects, and skills. It is not a commercial service and does not sell products, process payments, or require account creation.',
        ],
      },
      {
        heading: 'Information this site collects',
        paragraphs: [
          "This site does not use analytics, tracking pixels, or advertising cookies, and does not collect personal data through any form. The only browser storage used is a single local preference (your chosen display language), saved in your browser's localStorage so it persists between visits -- it is never transmitted anywhere and you can clear it at any time via your browser settings.",
          'If you choose to email the address listed in the Contact section, any information you include in that message is handled the same as any other personal email -- it is not collected or stored by this website itself.',
        ],
      },
      {
        heading: 'Hosting and third-party resources',
        paragraphs: [
          'This site is hosted as a static site on GitHub Pages (GitHub, Inc.) and loads web fonts from Google Fonts. These third-party providers may process standard technical request data (such as IP address and browser user-agent) as part of normal web hosting/CDN operation, under their own respective privacy policies.',
        ],
      },
      {
        heading: 'Content ownership',
        paragraphs: [
          'All text content on this site describes the real professional experience, skills, and projects of Juan Sebastián Baquero Moreno and is his own. The 3D character artwork was generated by the site owner as an original, custom stylized avatar and is not based on, nor intended to represent, any third-party copyrighted character or franchise.',
        ],
      },
      {
        heading: 'Contact',
        paragraphs: [
          'Questions about this notice or about the site can be sent to the email address listed in the Contact section of this page.',
        ],
      },
    ],
  },
};
