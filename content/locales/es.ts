import type { LocaleContent } from '../LocaleContent';

/** Spanish content -- same real portfolio data as en.ts, translated. */
export const es: LocaleContent = {
  ui: {
    nav: {
      about: 'Sobre mí',
      experience: 'Experiencia',
      projects: 'Proyectos',
      lab: 'Laboratorio',
      skills: 'Habilidades',
      contact: 'Contacto',
    },
    cta: 'Contáctame',
    hero: {
      eyebrow: 'Portafolio 3D Interactivo',
      availability: '🟢 Abierto a empleo full-time y proyectos freelance',
      greetingPrefix: 'Hola, soy ',
      name: 'Juan',
      subtitle: 'Construyo cosas antes de saber que las quería construir.',
      body: 'Más de 7 años desarrollando productos web y móviles — billeteras fintech, SaaS con IA, y lo que sea que me llame la atención después. Desplázate, hay un personaje para eso.',
      scrollHint: '↓ desplázate (él va a caminar)',
    },
    aboutTag: 'Sobre mí',
    aboutRole: 'Desarrollador Full Stack Senior',
    experienceTag: 'Trayectoria',
    experienceHeading: 'Experiencia',
    projectsTag: 'Destacados',
    projectsHeading: 'Proyectos',
    labTag: 'Ahora mismo',
    labHeading: 'En qué ando metido últimamente',
    skillsTag: 'Herramientas',
    skillsHeading: 'Habilidades y Stack',
    contactHeading: 'Construyamos algo juntos.',
    footerLegalLink: 'Aviso de Privacidad y Legal',
    stageLoadingCaption: 'Amarrándose los zapatos…',
    characterClickHint: 'psst — dale click',
    characterReactions: [
      'Oye, estaba a mitad de un sprint, literal.',
      '¿Me llamaste? Iba a refactorizar mis propias piernas.',
      'Cuidado, cobro por click.',
      'Sigo siendo más rápido que mi último code review.',
      'Nueva experiencia desbloqueada: que me pinchen.',
      'Te daría la mano pero no tengo rig para eso.',
    ],
  },

  about: {
    key: 'about',
    accentHex: '#F4C95D',
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
    accentHex: '#F4C95D',
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
    accentHex: '#FF5FA2',
    eyebrow: 'Trabajo Destacado',
    title: 'Proyectos',
    projects: [
      {
        org: 'DATUP',
        title: 'WebApp de Gestión de Inventario con IA',
        summary:
          'Plataforma SaaS con pronóstico de demanda impulsado por IA para optimizar inventario y prevenir desabastecimientos/sobrestock, con arquitectura de microservicios escalable.',
        detail:
          'Co-creación de la aplicación web principal y microservicios backend de una plataforma SaaS que pronostica demanda con IA para ayudar a negocios a evitar desabastecimientos y sobrestock. Liderazgo del UI/UX en los dashboards de pronóstico, manteniendo la capa de servicios escalable y SOLID.',
        stack: ['React.js', 'TypeScript', 'NestJS', 'IA', 'Microservicios'],
      },
      {
        org: 'Payments Way',
        title: 'Billetera Digital White-Label',
        summary:
          'Billetera digital personalizable con UI/UX intuitiva y seguridad transaccional, construida para white-labeling rápido entre clientes.',
        detail:
          'Billetera móvil híbrida/nativa diseñada para ser re-marcada y re-desplegada rápidamente por cliente, con backends seguros en Java (Spring Boot) manejando la integridad transaccional.',
        stack: ['Flutter', 'React Native', 'Spring Boot'],
      },
      {
        org: 'Payments Way',
        title: 'Sistema de Tag para Pago de Peajes',
        summary:
          'Integración de hardware y software para pagos de peaje en tiempo real, con estrictos requisitos de optimización de rendimiento.',
        detail:
          'Integración de hardware físico de tags de peaje con un backend de pagos en tiempo real, bajo requisitos estrictos de latencia — una lectura de carril debía resolverse y cobrar en el tiempo que toma un vehículo en pasar.',
        stack: ['Kotlin', 'Swift', 'Spring Boot'],
      },
      {
        org: 'Payments Way',
        title: 'Plataforma de E-commerce de Moda',
        summary:
          'Gestión de datos de alto volumen y algoritmos de recomendación personalizados para una tienda de moda en línea.',
        detail:
          'Construcción de la capa de datos y la lógica de recomendación de una plataforma de e-commerce de moda con alto volumen de catálogo/órdenes, con personalización como motor de descubrimiento de productos.',
        stack: ['React Native', 'Spring Boot', 'PostgreSQL'],
      },
      {
        org: 'Rational Software',
        title: 'ICFES',
        summary:
          'Soluciones tecnológicas para optimizar procesos de evaluación educativa a escala nacional en Colombia.',
        detail:
          'Parte del equipo que construyó y operó una plataforma nacional de evaluación educativa para el ICFES, conectando backends Spring Boot/NestJS con frontends Angular/React bajo requisitos estrictos de confiabilidad (picos de tráfico el día del examen, sin margen para caídas).',
        stack: ['Angular', 'React', 'Spring Boot', 'NestJS'],
      },
      {
        org: 'Rational Software',
        title: 'Bolsa Mercantil de Colombia',
        summary:
          'Implementación de aplicaciones web críticas que fortalecen los servicios digitales de la bolsa.',
        detail:
          'Entrega de aplicaciones web críticas para una bolsa financiera, donde la precisión de los datos y el uptime impactan directamente las operaciones de trading.',
        stack: ['Angular', 'NestJS', 'PostgreSQL'],
      },
      {
        org: 'DigiWorld',
        title: 'Pasarela de Pagos — Payments Way',
        summary: 'Pasarela transaccional a medida manejando datos sensibles sobre infraestructura segura.',
        detail:
          'Pasarela de pagos transaccional a medida manejando datos sensibles de tarjeta/cuenta, con la seguridad y el cumplimiento como restricciones de primer nivel, no como un añadido.',
        stack: ['PHP', 'Node.js', 'ReactJS'],
      },
      {
        org: 'DigiWorld',
        title: 'Cámara de Comercio Colombo Ecuatoriana & Rockgota',
        summary:
          'Desarrollo de software a medida y resolución de problemas para requerimientos institucionales complejos.',
        detail:
          'Software a medida construido alrededor de flujos institucionales específicos para una cámara de comercio binacional y un cliente adicional, priorizando el ajuste a su proceso existente en vez de forzar una herramienta genérica.',
        stack: ['PHP', 'Node.js'],
      },
      {
        org: 'Proyecto Personal',
        title: 'FinanceOS — Control de Finanzas Personales',
        summary:
          'SaaS de finanzas personales configurable: dashboard, gastos, deudas, flujo de caja, metas e inversiones, construido en solitario de principio a fin.',
        detail:
          'Un tracker de finanzas personales construido desde cero para aplicar Clean Architecture tanto en frontend como en backend: frontend React feature-first, backend en Supabase (PostgreSQL + Auth + Row Level Security), offline-first vía IndexedDB. Cubre dashboard, registro de gastos, proyección de pago de deudas, flujo de caja, metas e inversiones.',
        stack: ['React', 'TypeScript', 'Supabase', 'PostgreSQL', 'Zustand', 'TanStack Query'],
        downloadLabel: 'Descargar el playbook de construcción (Markdown)',
        downloadHref: '/downloads/finance-tracker-playbook.md',
      },
      {
        org: 'Proyecto Personal',
        title: 'Stack Rush — Juego Móvil',
        summary:
          'Juego móvil hipercasual de apilar bloques construido con React Native + Expo para iOS y Android.',
        detail:
          'Un juego hipercasual de apilado donde las colocaciones precisas mantienen el bloque en su tamaño completo y los fallos lo reducen hasta el Game Over. Construido como ejercicio de un motor de juego libre de framework (funciones puras, sin React en el loop principal) impulsado por un único store de Zustand, con cobertura de tests completa en la lógica del motor.',
        stack: ['React Native', 'Expo', 'TypeScript', 'Zustand', 'Reanimated'],
      },
    ],
  },

  skills: {
    key: 'skills',
    accentHex: '#F4C95D',
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

  lab: {
    key: 'lab',
    accentHex: '#FF8A3D',
    eyebrow: 'Ahora mismo',
    title: 'En qué ando metido últimamente',
    intro:
      'Me aburro rápido de hacer lo mismo dos veces, así que esto es en lo que estoy metido este mes de verdad — no un highlight reel, solo la obsesión actual.',
    entries: [
      {
        date: 'Nov 2026',
        title: 'Corriendo un pipeline multi-agente en este mismo sitio',
        summary:
          'Armé un pipeline Builder → Auditor → QA (roles de IA aislados revisándose entre sí, nadie se autoevalúa) para el repo de este portafolio, con flujo de git solo-por-PR y branch protection ya configurada. La misma disciplina que querría en un equipo, aplicada a un equipo de uno.',
      },
      {
        date: 'Oct 2026',
        title: 'Reconstruí este portafolio como un recorrido 3D guiado por scroll',
        summary:
          'Cambié un layout estático por un personaje que camina/corre/se cae/hace reverencia mientras haces scroll, sincronizado con clips de animación y una máquina de estados de progreso — y después achiqué la banda del escenario cuando mi hermano me dijo que el personaje se estaba comiendo toda la pantalla.',
      },
      {
        date: '2026',
        title: 'FinanceOS — construir un SaaS de finanzas para entender Clean Architecture de verdad',
        summary:
          'Tracker de finanzas personales, construido en solitario para forzarme a pasar de "entiendo la teoría" a "puedo defender cada límite de capa". Escribí todo el proceso de construcción como un playbook descargable en la sección de Proyectos arriba.',
      },
    ],
  },

  contact: {
    key: 'contact',
    accentHex: '#FF5FA2',
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
        label: 'linkedin.com/in/juan-sebastian-baquero-moreno-5146191b4',
        href: 'https://www.linkedin.com/in/juan-sebastian-baquero-moreno-5146191b4',
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
