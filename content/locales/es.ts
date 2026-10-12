import type { LocaleContent } from '../LocaleContent';

/** Spanish content -- same real portfolio data as en.ts, translated. */
export const es: LocaleContent = {
  ui: {
    nav: {
      about: 'Sobre mí',
      experience: 'Experiencia',
      projects: 'Proyectos',
      skills: 'Habilidades',
      contact: 'Contacto',
    },
    cta: 'Contáctame',
    hero: {
      eyebrow: 'Portafolio 3D Interactivo',
      availability: '🟢 Abierto a empleo full-time y proyectos freelance',
      greetingPrefix: 'Hola, soy ',
      name: 'Juan',
      subtitle: 'Construyo software full-stack.',
      body: 'Desplázate para conocerme — más de 7 años desarrollando productos web y móviles, desde billeteras fintech hasta SaaS con IA.',
      scrollHint: '↓ desplázate',
    },
    aboutTag: 'Sobre mí',
    aboutRole: 'Desarrollador Full Stack Senior',
    experienceTag: 'Trayectoria',
    experienceHeading: 'Experiencia',
    projectsTag: 'Destacados',
    projectsHeading: 'Proyectos',
    skillsTag: 'Herramientas',
    skillsHeading: 'Habilidades y Stack',
    contactHeading: 'Construyamos algo juntos.',
    footerLegalLink: 'Aviso de Privacidad y Legal',
  },

  about: {
    key: 'about',
    accentHex: '#4CF3FF',
    eyebrow: 'Sobre mí',
    title: 'Perfil',
    paragraphs: [
      'Desarrollador Full Stack Senior con más de 7 años de experiencia construyendo y escalando soluciones web y móviles de principio a fin. Especializado en crear interfaces de alto impacto y usabilidad (React.js, Next.js, Angular, TypeScript) con sólidos principios de diseño UI/UX, respaldadas por una arquitectura backend robusta (NestJS, Node.js, Spring Boot) e infraestructura en la nube (AWS, Docker).',
      'Trayectoria comprobada liderando proyectos para entidades gubernamentales, bolsas financieras y plataformas SaaS con integración de IA — desde billeteras fintech y pasarelas de pago hasta plataformas educativas de alcance nacional.',
      'Basado en Bogotá, Colombia — abierto a oportunidades remotas en cualquier parte del mundo.',
    ],
  },

  experience: {
    key: 'experience',
    accentHex: '#4CF3FF',
    eyebrow: 'Trayectoria',
    title: 'Experiencia',
    jobs: [
      {
        role: 'Desarrollador Full Stack',
        org: 'DATUP',
        period: 'Abril 2025 – Presente',
        summary:
          'Co-creación de una plataforma SaaS enfocada en optimización de inventario con IA — pronóstico de demanda para maximizar la rentabilidad y prevenir desabastecimientos. Desarrollo de la aplicación web principal y microservicios backend con arquitectura escalable y principios SOLID, además de UI/UX avanzado.',
        tags: ['React.js', 'TypeScript', 'NestJS', 'IA', 'UI/UX'],
      },
      {
        role: 'Desarrollador Móvil y Full Stack',
        org: 'Payments Way',
        period: 'Marzo 2024 – Marzo 2025',
        summary:
          'Desarrollo de aplicaciones móviles híbridas y nativas integradas con backends seguros en Java (Spring Boot). Dirección técnica integrando hardware y software con optimización de rendimiento en tiempo real — billetera white-label, sistema de tag para pago de peajes, e-commerce de moda.',
        tags: ['Flutter', 'Swift', 'Kotlin', 'React Native', 'Spring Boot'],
      },
      {
        role: 'Desarrollador Full Stack',
        org: 'Rational Software',
        period: '2022 – 2024',
        summary:
          'Liderazgo y desarrollo integral de múltiples soluciones empresariales conectando backends Spring Boot/NestJS con frontends en Angular y React — incluyendo ICFES (plataforma nacional de evaluación educativa) y la Bolsa Mercantil de Colombia.',
        tags: ['Angular', 'React', 'NestJS', 'Spring Boot', 'PostgreSQL'],
      },
      {
        role: 'Desarrollador Full Stack',
        org: 'DigiWorld',
        period: '2019 – 2022',
        summary:
          'Desarrollo web y backend con PHP, Express, Node.js y NestJS, junto con interfaces en ReactJS y AngularJS. Implementación de una pasarela de pagos transaccional con manejo de datos sensibles e infraestructura segura.',
        tags: ['PHP', 'Node.js', 'ReactJS', 'Pasarelas de pago'],
      },
    ],
  },

  projects: {
    key: 'projects',
    accentHex: '#FF4CD6',
    eyebrow: 'Trabajo Destacado',
    title: 'Proyectos',
    projects: [
      {
        org: 'DATUP',
        title: 'WebApp de Gestión de Inventario con IA',
        summary:
          'Plataforma SaaS con pronóstico de demanda impulsado por IA para optimizar inventario y prevenir desabastecimientos/sobrestock, con arquitectura de microservicios escalable.',
      },
      {
        org: 'Payments Way',
        title: 'Billetera Digital White-Label',
        summary:
          'Billetera digital personalizable con UI/UX intuitiva y seguridad transaccional, construida para white-labeling rápido entre clientes.',
      },
      {
        org: 'Payments Way',
        title: 'Sistema de Tag para Pago de Peajes',
        summary:
          'Integración de hardware y software para pagos de peaje en tiempo real, con estrictos requisitos de optimización de rendimiento.',
      },
      {
        org: 'Payments Way',
        title: 'Plataforma de E-commerce de Moda',
        summary:
          'Gestión de datos de alto volumen y algoritmos de recomendación personalizados para una tienda de moda en línea.',
      },
      {
        org: 'Rational Software',
        title: 'ICFES',
        summary:
          'Soluciones tecnológicas para optimizar procesos de evaluación educativa a escala nacional en Colombia.',
      },
      {
        org: 'Rational Software',
        title: 'Bolsa Mercantil de Colombia',
        summary: 'Implementación de aplicaciones web críticas que fortalecen los servicios digitales de la bolsa.',
      },
      {
        org: 'DigiWorld',
        title: 'Pasarela de Pagos — Payments Way',
        summary: 'Pasarela transaccional a medida manejando datos sensibles sobre infraestructura segura.',
      },
      {
        org: 'DigiWorld',
        title: 'Cámara de Comercio Colombo Ecuatoriana & Rockgota',
        summary: 'Desarrollo de software a medida y resolución de problemas para requerimientos institucionales complejos.',
      },
    ],
  },

  skills: {
    key: 'skills',
    accentHex: '#4CF3FF',
    eyebrow: 'Herramientas',
    title: 'Habilidades y Stack',
    groups: [
      {
        title: 'Frontend y UX/UI',
        skills: ['React.js', 'Next.js', 'Angular', 'TypeScript', 'SASS', 'Tailwind CSS', 'Diseño UI/UX'],
      },
      {
        title: 'Backend y Arquitectura',
        skills: ['NestJS', 'Node.js', 'Express', 'Java / Spring Boot', 'PHP', 'REST APIs', 'GraphQL', 'SOAP'],
      },
      {
        title: 'Móvil',
        skills: ['Flutter', 'Swift', 'React Native', 'Kotlin'],
      },
      {
        title: 'Datos y Nube',
        skills: ['PostgreSQL', 'MySQL', 'MongoDB', 'SQL Server', 'AWS', 'Docker', 'DigitalOcean'],
      },
    ],
  },

  contact: {
    key: 'contact',
    accentHex: '#FF4CD6',
    eyebrow: 'Contáctame',
    title: 'Contacto',
    links: [
      {
        icon: '✉',
        label: 'baqueromorenoj@gmail.com',
        href: 'mailto:baqueromorenoj@gmail.com',
      },
      {
        icon: 'in',
        label: 'linkedin.com/in/juan-sebastian',
        href: 'https://linkedin.com/in/juan-sebastian',
      },
      { icon: '◍', label: 'Bogotá, Colombia — abierto a trabajo remoto en cualquier lugar' },
    ],
    note: 'Escríbeme para roles full-stack, proyectos freelance, o simplemente para hablar de arquitecturas React/Node.',
  },

  legal: {
    title: 'Aviso de Privacidad y Legal',
    lastUpdated: 'Última actualización: octubre de 2026',
    closeLabel: 'Cerrar',
    sections: [
      {
        heading: 'Sobre este sitio',
        paragraphs: [
          'Este es el portafolio personal de Juan Sebastián Baquero Moreno, un sitio web informativo estático construido para mostrar experiencia profesional, proyectos y habilidades. No es un servicio comercial y no vende productos, procesa pagos ni requiere creación de cuentas.',
        ],
      },
      {
        heading: 'Información que recopila este sitio',
        paragraphs: [
          'Este sitio no utiliza analítica, píxeles de rastreo ni cookies publicitarias, y no recopila datos personales a través de ningún formulario. El único almacenamiento del navegador utilizado es una preferencia local (el idioma de visualización elegido), guardada en el localStorage de tu navegador para que persista entre visitas — nunca se transmite a ningún lado y puedes borrarla en cualquier momento desde la configuración de tu navegador.',
          'Si decides escribir al correo indicado en la sección de Contacto, cualquier información que incluyas en ese mensaje se maneja igual que cualquier otro correo personal — no es recopilada ni almacenada por este sitio web.',
        ],
      },
      {
        heading: 'Hosting y recursos de terceros',
        paragraphs: [
          'Este sitio está alojado como sitio estático en GitHub Pages (GitHub, Inc.) y carga fuentes web desde Google Fonts. Estos proveedores externos pueden procesar datos técnicos estándar de solicitud (como dirección IP y user-agent del navegador) como parte de la operación normal de hosting/CDN, bajo sus propias políticas de privacidad.',
        ],
      },
      {
        heading: 'Propiedad del contenido',
        paragraphs: [
          'Todo el contenido textual de este sitio describe la experiencia profesional, habilidades y proyectos reales de Juan Sebastián Baquero Moreno y es de su autoría. El personaje 3D fue generado por el propietario del sitio como un avatar estilizado original y personalizado, y no está basado en, ni pretende representar, ningún personaje o franquicia con derechos de autor de terceros.',
        ],
      },
      {
        heading: 'Contacto',
        paragraphs: [
          'Preguntas sobre este aviso o sobre el sitio pueden enviarse al correo electrónico indicado en la sección de Contacto de esta página.',
        ],
      },
    ],
  },
};
