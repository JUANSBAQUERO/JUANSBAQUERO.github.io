import type { LocaleContent } from '../LocaleContent';

/** English content -- source of truth, mirrors the original portfolio.ts
 *  copy (unchanged) wrapped with the new UiStrings chrome. */
export const en: LocaleContent = {
  ui: {
    nav: {
      about: 'About',
      experience: 'Experience',
      projects: 'Projects',
      skills: 'Skills',
      contact: 'Contact',
    },
    cta: 'Get in touch',
    hero: {
      eyebrow: 'Interactive 3D Portfolio',
      availability: '🟢 Open to full-time roles & freelance projects',
      greetingPrefix: "Hi, I'm ",
      name: 'Juan',
      subtitle: 'I build full-stack software.',
      body: 'Scroll down to meet me — 7+ years shipping web & mobile products, from fintech wallets to AI-driven SaaS.',
      scrollHint: '↓ scroll',
    },
    aboutTag: 'About',
    aboutRole: 'Senior Full Stack Developer',
    experienceTag: 'Career',
    experienceHeading: 'Experience',
    projectsTag: 'Selected',
    projectsHeading: 'Projects',
    skillsTag: 'Toolbox',
    skillsHeading: 'Skills & Stack',
    contactHeading: "Let's build something together.",
    footerLegalLink: 'Privacy & Legal Notice',
  },

  about: {
    key: 'about',
    accentHex: '#4CF3FF',
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
  },

  projects: {
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
      },
      {
        org: 'Payments Way',
        title: 'White-Label Digital Wallet',
        summary:
          'Customizable digital wallet with intuitive UI/UX and transactional security, built for rapid white-labeling across clients.',
      },
      {
        org: 'Payments Way',
        title: 'Toll Payment Tag System',
        summary:
          'Hardware + software integration for real-time toll payments, with strict performance optimization requirements.',
      },
      {
        org: 'Payments Way',
        title: 'Fashion E-commerce Platform',
        summary:
          'High-volume data management and personalized recommendation algorithms for an online fashion retailer.',
      },
      {
        org: 'Rational Software',
        title: 'ICFES',
        summary:
          'Technology solutions to optimize national-scale educational evaluation processes in Colombia.',
      },
      {
        org: 'Rational Software',
        title: 'Bolsa Mercantil de Colombia',
        summary: "Implementation of critical web applications strengthening the exchange's digital services.",
      },
      {
        org: 'DigiWorld',
        title: 'Payment Gateway — Payments Way',
        summary: 'Custom transactional gateway handling sensitive data over secure infrastructure.',
      },
      {
        org: 'DigiWorld',
        title: 'Cámara de Comercio Colombo Ecuatoriana & Rockgota',
        summary: 'Custom software development and problem-solving for complex institutional requirements.',
      },
    ],
  },

  skills: {
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
  },

  contact: {
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
          'This site does not use analytics, tracking pixels, or advertising cookies, and does not collect personal data through any form. The only browser storage used is a single local preference (your chosen display language), saved in your browser\'s localStorage so it persists between visits -- it is never transmitted anywhere and you can clear it at any time via your browser settings.',
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
