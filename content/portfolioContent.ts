export type PortfolioLocale = "fr" | "en";

type NavigationItem = {
  id: string;
  label: string;
};

type HeroMetric = {
  value: string;
  label: string;
};

type ActionLink = {
  label: string;
  href: string;
};

type AboutHighlight = {
  title: string;
  description: string;
};

type ServiceOffer = {
  title: string;
  clientProblem: string;
  businessOutcome: string;
  capabilities: string[];
  ctaTarget: string;
};

type ExperienceEntry = {
  roleTitle: string;
  organizationLabel: string;
  period: string;
  context: string;
  valueDelivered: string;
  tech: string[];
};

type EducationEntry = {
  period: string;
  title: string;
  institution: string;
  description: string;
};

type ProjectEntry = {
  title: string;
  summary: string;
  context: string;
  contribution: string;
  outcome: string;
  tags: string[];
  publicLink?: string;
};

type FooterLink = {
  label: string;
  href: string;
};

export type PortfolioContent = {
  localeName: string;
  switchLocaleLabel: string;
  meta: {
    title: string;
    description: string;
  };
  navigation: {
    items: NavigationItem[];
    ctaLabel: string;
    localeSwitcherLabel: string;
    mainNavAriaLabel: string;
  };
  hero: {
    eyebrow: string;
    name: string;
    tagline: string;
    promise: string;
    proofPoints: string[];
    metrics: HeroMetric[];
    primaryAction: ActionLink;
    secondaryAction: ActionLink;
    sectionAriaLabel: string;
    proofPointsAriaLabel: string;
    actionsAriaLabel: string;
    floatingLabel: string;
    floatingValue: string;
  };
  about: {
    title: string;
    lead: string;
    paragraphs: string[];
    highlights: AboutHighlight[];
    principles: string[];
    primaryAction: ActionLink;
    secondaryAction: ActionLink;
    principlesAriaLabel: string;
  };
  services: {
    title: string;
    subtitle: string;
    items: ServiceOffer[];
  };
  experience: {
    title: string;
    subtitle: string;
    entries: ExperienceEntry[];
    educationCta: string;
    contextLabel: string;
    valueDeliveredLabel: string;
    techListAriaLabel: string;
  };
  education: {
    title: string;
    subtitle: string;
    entries: EducationEntry[];
    continuousLearningTitle: string;
    continuousLearningText: string;
  };
  projects: {
    title: string;
    subtitle: string;
    items: ProjectEntry[];
    primaryAction: ActionLink;
    secondaryAction: ActionLink;
    contextLabel: string;
    contributionLabel: string;
    outcomeLabel: string;
    tagsAriaLabel: string;
    externalLinkAriaTemplate: string;
    externalLinkLabel: string;
  };
  contact: {
    title: string;
    description: string;
    inquiryTypes: string[];
    primaryActionLabel: string;
    copyActionLabel: string;
    copySuccess: string;
    copyUnavailable: string;
    copyError: string;
    emailLabel: string;
    meta: string;
    responsePromise: string;
    inquiriesAriaLabel: string;
    sendEmailAriaLabel: string;
    copyEmailAriaLabel: string;
  };
  footer: {
    baseline: string;
    availability: string;
    navigationTitle: string;
    links: FooterLink[];
    contactTitle: string;
    rights: string;
  };
};

// The `educations` section is intentionally excluded from NAV_IDS to keep the
// nav bar at 7 items (avoids mobile overflow). The section is still reachable
// via the "View education" CTA at the bottom of SectionWorkExperiences. As a
// side-effect, the IntersectionObserver in HeaderCustom does not highlight any
// nav item while the user is scrolled into the Education section - accepted
// trade-off.
const NAV_IDS: Array<{ id: string; fr: string; en: string }> = [
  { id: "hero", fr: "Accueil", en: "Home" },
  { id: "about", fr: "À propos", en: "About" },
  { id: "services", fr: "Services", en: "Services" },
  { id: "skills", fr: "Compétences", en: "Skills" },
  { id: "experience", fr: "Expérience", en: "Experience" },
  { id: "projects", fr: "Projets", en: "Projects" },
  { id: "contact", fr: "Contact", en: "Contact" },
];

const EMAIL = "passe.valentin@gmail.com";

export const portfolioContent: Record<PortfolioLocale, PortfolioContent> = {
  fr: {
    localeName: "FR",
    switchLocaleLabel: "EN",
    meta: {
      title: "Valentin PASSE | Freelance Fullstack .NET",
      description:
        "Portfolio one-page de Valentin PASSE, freelance Fullstack .NET à Nice. 10+ ans de livraison logicielle, architecture applicative et intégration IA pragmatique.",
    },
    navigation: {
      items: NAV_IDS.map((item) => ({ id: item.id, label: item.fr })),
      ctaLabel: "Parler de votre projet",
      localeSwitcherLabel: "Basculer la langue du portfolio",
      mainNavAriaLabel: "Navigation principale",
    },
    hero: {
      eyebrow: "Freelance Fullstack .NET · Nice · Remote, hybride, sur site",
      name: "Valentin Passe",
      tagline: "Je conçois des produits web fiables, lisibles et rapides à faire évoluer.",
      promise:
        "Autodidacte avec 10+ ans de développement logiciel, j'interviens du cadrage à la mise en production : architecture applicative, développement fullstack et intégration IA utile pour accélérer les équipes sans dette inutile.",
      proofPoints: [
        "10+ ans d'expérience en développement web et applicatif, alternant CDI et freelance.",
        "Expertise .NET (Core, MVC, Blazor, MAUI), architecture Clean / DDD / CQRS et cloud Azure.",
        "Veille active sur l'IA et intégration concrète des outils dans le quotidien de développement.",
      ],
      metrics: [
        { value: "10+", label: "ans de développement logiciel" },
        { value: "Fullstack", label: "Back-end, API, web Blazor et mobile MAUI sur le socle .NET" },
        { value: ".NET", label: "socle principal, du legacy au .NET 10" },
      ],
      primaryAction: { label: "Discuter de votre besoin", href: "#contact" },
      secondaryAction: { label: "Voir les projets", href: "#projects" },
      sectionAriaLabel: "Présentation",
      proofPointsAriaLabel: "Points clés",
      actionsAriaLabel: "Actions principales",
      floatingLabel: "Focus livraison",
      floatingValue: "Architecture .NET, Blazor, IA utile",
    },
    about: {
      title: "À propos",
      lead:
        "Ingénieur Fullstack .NET freelance, j'aide les entreprises à transformer un besoin métier en produit web robuste, lisible et exploitable dans la durée.",
      paragraphs: [
        "J'interviens sur toute la chaîne de valeur : cadrage, architecture, implémentation, qualité et mise en production. L'objectif est simple - livrer vite, proprement, sans sacrifier la maintenabilité.",
        "Autodidacte de formation et de tempérament, j'allie autonomie, rigueur et travail collaboratif. Ma passion pour les nouvelles technologies - et en particulier l'IA - me pousse à intégrer en continu les outils qui apportent une valeur concrète aux équipes.",
      ],
      highlights: [
        {
          title: "Exécution end-to-end",
          description:
            "Du cahier des charges à la mise en production, je garde un cap de résultat et une vision d'ensemble sur le produit.",
        },
        {
          title: "Fullstack .NET assumé",
          description:
            "Back-end, API, front Blazor, mobile MAUI et architecture applicative pour éviter les zones mortes entre couches.",
        },
        {
          title: "Pragmatique sur l'IA",
          description:
            "J'intègre l'IA quand elle simplifie vraiment un workflow, pas pour ajouter une couche de complexité de plus.",
        },
      ],
      principles: ["Concevoir", "Livrer", "Fiabiliser", "Faire évoluer"],
      primaryAction: { label: "Explorer les projets", href: "#projects" },
      secondaryAction: { label: "Me contacter", href: "#contact" },
      principlesAriaLabel: "Principes de travail",
    },
    services: {
      title: "Services",
      subtitle:
        "Trois modes d'intervention pour structurer une roadmap, renforcer un produit existant ou accélérer des gains concrets avec l'IA.",
      items: [
        {
          title: "Cadrage et trajectoire technique",
          clientProblem:
            "Le besoin est clair côté métier, mais la solution manque encore de structure technique pour démarrer sans dispersion.",
          businessOutcome:
            "Vous obtenez des choix d'architecture argumentés, un découpage livrable et une trajectoire de livraison crédible.",
          capabilities: ["Ateliers de cadrage", "Architecture .NET / Clean", "Roadmap priorisée"],
          ctaTarget: "#contact",
        },
        {
          title: "Développement Fullstack .NET",
          clientProblem:
            "Le produit doit évoluer vite sans dégrader la lisibilité du code, la performance ou la capacité à maintenir dans le temps.",
          businessOutcome:
            "Vous accélérez la mise en production avec une implémentation robuste, compréhensible et alignée sur les usages terrain.",
          capabilities: ["API et back-end .NET", "Interfaces Blazor / MAUI", "Qualité et performance"],
          ctaTarget: "#contact",
        },
        {
          title: "Automatisation et IA utile",
          clientProblem:
            "Les équipes perdent du temps sur des opérations répétitives et cherchent des gains rapides sans projet usine à gaz.",
          businessOutcome:
            "Vous ciblez des automatisations à fort effet utile avec une intégration IA sobre, mesurable et adaptée au contexte.",
          capabilities: ["Audit de workflows", "Automatisations ciblées", "Accompagnement à l'adoption"],
          ctaTarget: "#contact",
        },
      ],
    },
    experience: {
      title: "Expérience",
      subtitle:
        "Plus de 10 ans de livraison, du stage initial aux missions freelance actuelles - en CDI comme en indépendant, sur des contextes opérationnels exigeants.",
      entries: [
        {
          roleTitle: "Développeur Full-Stack .NET",
          organizationLabel: "SMEG · Monaco · Freelance",
          period: "Nov. 2023 - Aujourd'hui",
          context:
            "Solution de gestion des appels d'astreinte, d'urgence et d'interventions (bureau et mobile). Mission d'architecture et de refonte du socle applicatif, avec définition d'une cible modulaire et d'un template projet réutilisable. POC mobile MAUI pour valider le socle et formaliser les contraintes terrain. Conception du portail client Nexio (particuliers et professionnels).",
          valueDelivered:
            "Socle technique modulaire livré, POC mobile validé, portail client mis en service. Réactivité accrue des équipes sur les situations critiques.",
          tech: [
            ".NET 8/9/10",
            "C#",
            "Clean Architecture",
            "DDD",
            "MAUI",
            "AWS",
            "Docker",
            "Azure DevOps",
            "PostgreSQL",
          ],
        },
        {
          roleTitle: "Développeur Back-end .NET",
          organizationLabel: "TidyUp Technologies · Valbonne · Freelance",
          period: "Juin 2023 - Oct. 2023",
          context:
            "Conception et développement d'une solution innovante de rangement, classement et recherche de contenus numériques avec composante IA (back-end).",
          valueDelivered:
            "Socle backend durable structuré pour accompagner l'évolution produit et la fiabilité des traitements à fort volume.",
          tech: [
            ".NET 7",
            "C#",
            "ABP Framework",
            "DDD",
            "Azure",
            "Docker",
            "RabbitMQ",
            "Redis",
            "MongoDB",
            "PostgreSQL",
          ],
        },
        {
          roleTitle: "Développeur Back-end .NET",
          organizationLabel: "Ubaldi · Carros · CDI",
          period: "Avr. 2021 - Juin 2023",
          context:
            "Conception et développement de plusieurs projets internes côté back-end. Participation à la migration de plusieurs applications vers le Cloud Azure et à la mise en place d'une approche DDD pour accompagner la croissance.",
          valueDelivered:
            "Fiabilisation de la livraison backend, montée en maturité architecture (DDD) et garantie de la qualité via les revues de code en équipe Agile.",
          tech: [
            ".NET 6 et antérieurs",
            "C#",
            "Blazor",
            "Entity Framework",
            "Azure Cloud",
            "Vue.js",
            "Bootstrap",
            "Azure DevOps",
            "SQL Server",
          ],
        },
        {
          roleTitle: "Développeur Fullstack .NET",
          organizationLabel: "Régie Eau d'Azur · Nice · CDI",
          period: "Sept. 2015 - Avr. 2021",
          context:
            "Développement de multiples solutions applicatives internes .NET, prises en charge de bout en bout : cahier des charges, documentation technique, estimations, développement BDD et applications, recettes techniques et métiers, démos. Développement d'une bibliothèque JavaScript allégée pour améliorer l'ergonomie des applications.",
          valueDelivered:
            "Industrialisation progressive du parc applicatif, montée en qualité de service utilisateurs et capitalisation via une bibliothèque JS interne réutilisable.",
          tech: [
            ".NET MVC 4.7",
            ".NET Core 3.1/5",
            "C#",
            "Blazor",
            "Xamarin Forms",
            "Entity Framework",
            "SCSS",
            "jQuery",
            "SSIS",
            "SQL Server",
            "TFS",
          ],
        },
        {
          roleTitle: "Développeur Fullstack .NET",
          organizationLabel: "Beyond IT (B-Network) · Cannes · Apprentissage",
          period: "Sept. 2014 - Sept. 2015",
          context:
            "Conception de plusieurs applications web .NET (WebForm) : analyse des besoins, rédaction du cahier des charges, développement, tests, déploiement et démo.",
          valueDelivered:
            "Première expérience long format en alternance - autonomie sur le cycle complet de petites applications WebForm en environnement professionnel.",
          tech: [
            "ASP.NET WebForm",
            "C#",
            "Entity Framework",
            "HTML/CSS",
            "JavaScript",
            "jQuery",
            "Ajax",
            "Bootstrap",
          ],
        },
        {
          roleTitle: "Développeur Back-end PHP",
          organizationLabel: "Pascal Coste (siège) · Nice · Stage",
          period: "Janv. 2014 - Mars 2014",
          context:
            "Conception d'un site web de partage de fichiers statistiques (back-end). Rédaction d'un cahier des charges fonctionnel pour une solution ERP. Participation à plusieurs audits.",
          valueDelivered:
            "Première confrontation au cycle complet d'un projet web et à l'analyse fonctionnelle côté éditeur.",
          tech: ["PHP", "HTML/CSS", "JavaScript", "jQuery", "Ajax", "Bootstrap", "MVC"],
        },
      ],
      educationCta: "Voir le parcours de formation",
      contextLabel: "Contexte",
      valueDeliveredLabel: "Valeur livrée",
      techListAriaLabel: "Technologies",
    },
    education: {
      title: "Formation",
      subtitle:
        "Un socle académique en alternance, complété par une veille continue et une montée en compétences pilotée par les besoins terrain.",
      entries: [
        {
          period: "2014 - 2015",
          title: "Licence Professionnelle SIL - IDSE (Alternance)",
          institution: "IUT Nice Sophia Antipolis",
          description:
            "Systèmes Informatiques et Logiciels, spécialité Informatique Distribuée et Systèmes d'Information pour l'Entreprise. Année réalisée en apprentissage chez Beyond IT.",
        },
        {
          period: "2012 - 2014",
          title: "BTS SIO - SLAM",
          institution: "Lycée Honoré d'Estienne d'Orves, Nice",
          description:
            "Services Informatiques aux Organisations, option Solutions Logicielles et Applications Métiers - socle structurant en développement, bases de données et culture projet.",
        },
        {
          period: "2008 - 2011",
          title: "Baccalauréat",
          institution: "Lycée Jules Ferry, Cannes",
          description: "Diplôme du secondaire, point de départ d'un parcours autodidacte continu autour du développement logiciel.",
        },
      ],
      continuousLearningTitle: "Apprentissage continu",
      continuousLearningText:
        "Au-delà du cursus initial, je maintiens une veille active sur l'écosystème .NET, l'architecture applicative, le cloud Azure et l'intégration pragmatique de l'IA dans les outils de développement.",
    },
    projects: {
      title: "Projets",
      subtitle:
        "Quelques cas concrets pour illustrer comment je transforme un contexte technique ou métier en résultat exploitable.",
      items: [
        {
          title: "Astreinte temps réel - bureau et mobile",
          summary:
            "Solution métier pour piloter appels d'astreinte, urgences et interventions sur usages bureau et mobile MAUI.",
          context:
            "Environnement opérationnel exigeant chez SMEG Monaco, avec fortes contraintes de disponibilité, qualité de service continue et contraintes mobiles (réseau, mises à jour, synchro données).",
          contribution:
            "Architecture cible modulaire, template projet réutilisable, POC mobile MAUI pour valider le socle et formalisation des contraintes terrain.",
          outcome:
            "Digitalisation des processus d'astreinte et meilleure réactivité des équipes dans les situations critiques.",
          tags: [".NET 10", "C#", "MAUI", "Clean Architecture", "DDD", "PostgreSQL"],
        },
        {
          title: "Nexio - Portail client particuliers et pros",
          summary:
            "Portail web de gestion des demandes et du suivi client pour particuliers et professionnels SMEG.",
          context:
            "Refonte d'un parcours client multi-cibles avec besoin de cohérence d'expérience entre profils particuliers et professionnels.",
          contribution:
            "Conception et développement fullstack du portail, analyses fonctionnelles, documentation technique et coordination des évolutions.",
          outcome:
            "Portail client unifié en production, autonomisant les clients dans le suivi de leurs demandes.",
          tags: [".NET", "C#", "Blazor", "Azure DevOps", "PostgreSQL"],
        },
        {
          title: "Plateforme IA - gestion de contenus numériques",
          summary:
            "Socle backend d'une solution innovante de rangement, classement et recherche de contenus numériques avec composante IA.",
          context:
            "Besoin d'une fondation backend solide pour accompagner dans le temps les évolutions produit et les traitements IA sur des volumes croissants.",
          contribution:
            "Développement backend en .NET 7 sur framework ABP, structuration des flux techniques (RabbitMQ, Redis, MongoDB) et de la persistance.",
          outcome:
            "Socle technique durable facilitant la montée en capacité produit et la fiabilité des traitements IA.",
          tags: [".NET 7", "ABP", "DDD", "Azure", "Docker", "RabbitMQ", "MongoDB"],
        },
      ],
      primaryAction: { label: "Discuter de votre projet", href: "#contact" },
      secondaryAction: { label: "Demander un échange", href: "#contact" },
      contextLabel: "Contexte",
      contributionLabel: "Contribution",
      outcomeLabel: "Résultat",
      tagsAriaLabel: "Technologies et compétences projet",
      externalLinkAriaTemplate: "Voir le site de {title} (lien externe)",
      externalLinkLabel: "Voir un lien public",
    },
    contact: {
      title: "Contact",
      description:
        "Parlez-moi de ce que vous souhaitez livrer. Je reviens rapidement avec un regard concret sur le besoin, les contraintes et la meilleure trajectoire de mise en œuvre.",
      inquiryTypes: [
        "Création ou refonte d'application web .NET",
        "Renfort Fullstack sur produit existant",
        "Audit technique, cadrage ou accélération de la livraison",
      ],
      primaryActionLabel: "Me contacter",
      copyActionLabel: "Copier l'adresse e-mail",
      copySuccess: "Adresse e-mail copiée.",
      copyUnavailable: "Copie non disponible. Utilisez l'adresse e-mail affichée ci-dessous.",
      copyError: "Impossible de copier l'adresse automatiquement. Copiez-la manuellement.",
      emailLabel: "Email direct",
      meta: "Nice (06200), Provence-Alpes-Côte d'Azur · Remote, hybride et sur site",
      responsePromise: "Réponse rapide, échange simple et pas de tunnel inutile.",
      inquiriesAriaLabel: "Types de demandes",
      sendEmailAriaLabel: "Envoyer un e-mail à Valentin Passe",
      copyEmailAriaLabel: "Copier l'adresse e-mail",
    },
    footer: {
      baseline: "Freelance Fullstack .NET pour des produits web fiables, lisibles et utiles.",
      availability:
        "Disponible pour des missions structurantes, des renforts ciblés et des interventions à fort impact.",
      navigationTitle: "Navigation",
      links: [
        { label: "Accueil", href: "#hero" },
        { label: "À propos", href: "#about" },
        { label: "Services", href: "#services" },
        { label: "Projets", href: "#projects" },
        { label: "Contact", href: "#contact" },
      ],
      contactTitle: "Contact",
      rights: "© 2026 Valentin PASSE. Tous droits réservés.",
    },
  },
  en: {
    localeName: "EN",
    switchLocaleLabel: "FR",
    meta: {
      title: "Valentin PASSE | Fullstack .NET Freelancer",
      description:
        "One-page portfolio of Valentin PASSE, Fullstack .NET freelancer based in Nice. 10+ years of software delivery, application architecture, and pragmatic AI integration.",
    },
    navigation: {
      items: NAV_IDS.map((item) => ({ id: item.id, label: item.en })),
      ctaLabel: "Discuss your project",
      localeSwitcherLabel: "Switch portfolio language",
      mainNavAriaLabel: "Main navigation",
    },
    hero: {
      eyebrow: "Fullstack .NET freelancer · Nice · Remote, hybrid, on-site",
      name: "Valentin Passe",
      tagline: "I design reliable web products that stay readable and easy to evolve.",
      promise:
        "Self-taught engineer with 10+ years of .NET delivery, I work across scoping, application architecture, fullstack development, and useful AI integration to help teams move faster without creating unnecessary debt.",
      proofPoints: [
        "10+ years of web and application development experience, alternating employee and freelance positions.",
        "Hands-on expertise in .NET (Core, MVC, Blazor, MAUI), Clean / DDD / CQRS architecture, and Azure cloud.",
        "Active watch on AI tooling and concrete integration into day-to-day development practice.",
      ],
      metrics: [
        { value: "10+", label: "years of software development" },
        { value: "Fullstack", label: "Back-end, APIs, Blazor web and MAUI mobile on the .NET stack" },
        { value: ".NET", label: "core stack, from legacy to .NET 10" },
      ],
      primaryAction: { label: "Discuss your needs", href: "#contact" },
      secondaryAction: { label: "View projects", href: "#projects" },
      sectionAriaLabel: "Introduction",
      proofPointsAriaLabel: "Key proof points",
      actionsAriaLabel: "Main actions",
      floatingLabel: "Delivery focus",
      floatingValue: "Architecture .NET, Blazor, useful AI",
    },
    about: {
      title: "About",
      lead:
        "As a freelance Fullstack .NET engineer, I help companies turn business needs into robust, readable and long-lasting web products.",
      paragraphs: [
        "I work across the whole value chain: scoping, architecture, implementation, quality, and production delivery. The objective is simple - ship quickly, cleanly, and without sacrificing maintainability.",
        "Self-taught by training and temperament, I combine autonomy, rigor, and collaborative work. My passion for new technologies - especially AI - pushes me to continuously integrate the tools that bring real value to the teams I work with.",
      ],
      highlights: [
        {
          title: "End-to-end execution",
          description:
            "From early scoping to production release, I keep a result-oriented mindset and a clear product overview.",
        },
        {
          title: "Strong fullstack .NET focus",
          description:
            "Back-end, APIs, Blazor front-end, MAUI mobile, and application architecture to avoid dead zones between layers.",
        },
        {
          title: "Pragmatic AI integration",
          description:
            "I use AI when it genuinely simplifies a workflow, not as a decorative layer that adds complexity.",
        },
      ],
      principles: ["Design", "Ship", "Stabilize", "Evolve"],
      primaryAction: { label: "Explore projects", href: "#projects" },
      secondaryAction: { label: "Get in touch", href: "#contact" },
      principlesAriaLabel: "Working principles",
    },
    services: {
      title: "Services",
      subtitle:
        "Three intervention modes to structure a roadmap, strengthen an existing product, or unlock practical AI-driven gains.",
      items: [
        {
          title: "Scoping and technical direction",
          clientProblem:
            "The business need is clear, but the solution still lacks the technical structure required to start with confidence.",
          businessOutcome:
            "You get clear architecture decisions, a deliverable rollout plan, and a realistic delivery path.",
          capabilities: ["Scoping workshops", ".NET / Clean architecture", "Prioritized roadmap"],
          ctaTarget: "#contact",
        },
        {
          title: "Fullstack .NET delivery",
          clientProblem:
            "Your product must evolve quickly without hurting code clarity, performance, or long-term maintainability.",
          businessOutcome:
            "You speed up production delivery with an implementation that is robust, readable, and aligned with real usage.",
          capabilities: [".NET APIs and back-end", "Blazor / MAUI interfaces", "Quality and performance"],
          ctaTarget: "#contact",
        },
        {
          title: "Useful automation and AI",
          clientProblem:
            "Teams lose time on repetitive operations and need practical gains without launching an oversized transformation program.",
          businessOutcome:
            "You identify high-value automations with restrained AI integration adapted to the business context.",
          capabilities: ["Workflow audit", "Targeted automation", "Adoption support"],
          ctaTarget: "#contact",
        },
      ],
    },
    experience: {
      title: "Experience",
      subtitle:
        "Over 10 years of delivery, from initial internship to current freelance engagements - alternating employee and freelance positions in demanding operational environments.",
      entries: [
        {
          roleTitle: "Full-Stack .NET Developer",
          organizationLabel: "SMEG · Monaco · Freelance",
          period: "Nov. 2023 - Present",
          context:
            "On-call, emergency and intervention management platform (desktop and mobile). Architecture mission: analysis and rebuild of the existing foundation, definition of a modular target architecture and a reusable project template. Mobile POC in MAUI to validate the foundation and formalize the field constraints. Design of the Nexio customer portal (individuals and businesses).",
          valueDelivered:
            "Modular technical foundation delivered, mobile POC validated, customer portal in production. Higher field responsiveness in critical situations.",
          tech: [
            ".NET 8/9/10",
            "C#",
            "Clean Architecture",
            "DDD",
            "MAUI",
            "AWS",
            "Docker",
            "Azure DevOps",
            "PostgreSQL",
          ],
        },
        {
          roleTitle: "Back-end .NET Developer",
          organizationLabel: "TidyUp Technologies · Valbonne · Freelance",
          period: "Jun. 2023 - Oct. 2023",
          context:
            "Design and development of an innovative content organization, classification, and search solution with an AI component (back-end).",
          valueDelivered:
            "Durable back-end foundation structured to support product evolution and processing reliability at scale.",
          tech: [
            ".NET 7",
            "C#",
            "ABP Framework",
            "DDD",
            "Azure",
            "Docker",
            "RabbitMQ",
            "Redis",
            "MongoDB",
            "PostgreSQL",
          ],
        },
        {
          roleTitle: "Back-end .NET Developer",
          organizationLabel: "Ubaldi · Carros · Full-time",
          period: "Apr. 2021 - Jun. 2023",
          context:
            "Design and development of multiple internal back-end projects. Active contributor to the migration of several applications to Azure Cloud, and to the introduction of a DDD approach to support company growth.",
          valueDelivered:
            "Strengthened back-end delivery, raised the architecture maturity (DDD), and guaranteed quality through code reviews in an Agile team.",
          tech: [
            ".NET 6 and earlier",
            "C#",
            "Blazor",
            "Entity Framework",
            "Azure Cloud",
            "Vue.js",
            "Bootstrap",
            "Azure DevOps",
            "SQL Server",
          ],
        },
        {
          roleTitle: "Fullstack .NET Developer",
          organizationLabel: "Régie Eau d'Azur · Nice · Full-time",
          period: "Sep. 2015 - Apr. 2021",
          context:
            "Development of multiple internal .NET applications, handled end-to-end: requirements, technical documentation, estimation, database and application development, technical and business testing, demos. Development of a lightweight JavaScript library to improve application ergonomics.",
          valueDelivered:
            "Progressive industrialization of the application portfolio, higher service quality for end users, and capitalization via a reusable internal JS library.",
          tech: [
            ".NET MVC 4.7",
            ".NET Core 3.1/5",
            "C#",
            "Blazor",
            "Xamarin Forms",
            "Entity Framework",
            "SCSS",
            "jQuery",
            "SSIS",
            "SQL Server",
            "TFS",
          ],
        },
        {
          roleTitle: "Fullstack .NET Developer",
          organizationLabel: "Beyond IT (B-Network) · Cannes · Apprenticeship",
          period: "Sep. 2014 - Sep. 2015",
          context:
            "Design of several .NET WebForm web applications: requirements analysis, scope definition, development, testing, deployment, and demo.",
          valueDelivered:
            "First long-form professional experience - full ownership of the lifecycle of small WebForm applications in a real-world environment.",
          tech: [
            "ASP.NET WebForm",
            "C#",
            "Entity Framework",
            "HTML/CSS",
            "JavaScript",
            "jQuery",
            "Ajax",
            "Bootstrap",
          ],
        },
        {
          roleTitle: "Back-end PHP Developer",
          organizationLabel: "Pascal Coste (headquarters) · Nice · Internship",
          period: "Jan. 2014 - Mar. 2014",
          context:
            "Design of a statistics file-sharing back-end. Drafting of functional requirements for an ERP solution. Participation in several audits.",
          valueDelivered:
            "First hands-on exposure to a full web project lifecycle and to functional analysis on the editor side.",
          tech: ["PHP", "HTML/CSS", "JavaScript", "jQuery", "Ajax", "Bootstrap", "MVC"],
        },
      ],
      educationCta: "View education",
      contextLabel: "Context",
      valueDeliveredLabel: "Value delivered",
      techListAriaLabel: "Technologies",
    },
    education: {
      title: "Education",
      subtitle:
        "An academic foundation built via apprenticeship, complemented by continuous learning and skill growth shaped by real delivery work.",
      entries: [
        {
          period: "2014 - 2015",
          title: "Professional Bachelor's Degree - SIL / IDSE (Apprenticeship)",
          institution: "IUT Nice Sophia Antipolis",
          description:
            "Software and Computing Systems, specializing in Distributed Computing and Enterprise Information Systems. Year completed in apprenticeship at Beyond IT.",
        },
        {
          period: "2012 - 2014",
          title: "BTS SIO - SLAM",
          institution: "Lycée Honoré d'Estienne d'Orves, Nice",
          description:
            "IT Services for Organizations, Software Solutions and Business Applications track - a structured foundation in development, databases, and project culture.",
        },
        {
          period: "2008 - 2011",
          title: "French High School Diploma (Baccalauréat)",
          institution: "Lycée Jules Ferry, Cannes",
          description: "Secondary school degree, starting point of a continuous self-taught journey in software development.",
        },
      ],
      continuousLearningTitle: "Continuous learning",
      continuousLearningText:
        "Beyond formal education, I actively keep up with the .NET ecosystem, application architecture, Azure cloud services, and pragmatic AI integration in developer tooling.",
    },
    projects: {
      title: "Projects",
      subtitle:
        "A selection of concrete delivery contexts showing how I turn business or technical constraints into usable outcomes.",
      items: [
        {
          title: "Real-time on-call - desktop and mobile",
          summary:
            "Business solution to manage on-call operations, emergencies, and interventions across desktop and MAUI mobile workflows.",
          context:
            "Demanding operational environment at SMEG Monaco with high expectations around availability, continuity of service, and mobile constraints (network, updates, data sync).",
          contribution:
            "Modular target architecture, reusable project template, MAUI mobile POC to validate the foundation, and formalization of the field constraints.",
          outcome:
            "Digitized on-call processes and improved responsiveness in critical situations.",
          tags: [".NET 10", "C#", "MAUI", "Clean Architecture", "DDD", "PostgreSQL"],
        },
        {
          title: "Nexio - customer portal for individuals and businesses",
          summary:
            "Web portal for SMEG customer request management and follow-up, serving both individual and business profiles.",
          context:
            "Redesign of a multi-target customer journey requiring a consistent experience across individuals and businesses.",
          contribution:
            "Fullstack design and development of the portal, functional analysis, technical documentation, and coordination of incremental releases.",
          outcome:
            "Unified customer portal in production, empowering customers to self-track their requests.",
          tags: [".NET", "C#", "Blazor", "Azure DevOps", "PostgreSQL"],
        },
        {
          title: "AI platform - digital content management",
          summary:
            "Back-end foundation of an innovative solution for organizing, classifying, and searching digital content with an AI component.",
          context:
            "Need for a strong back-end foundation to support long-term product evolution and AI processing on growing data volumes.",
          contribution:
            "Back-end development on .NET 7 with the ABP framework, structuring technical flows (RabbitMQ, Redis, MongoDB) and persistence.",
          outcome:
            "Durable technical base supporting product scale-up and AI processing reliability.",
          tags: [".NET 7", "ABP", "DDD", "Azure", "Docker", "RabbitMQ", "MongoDB"],
        },
      ],
      primaryAction: { label: "Discuss your project", href: "#contact" },
      secondaryAction: { label: "Book an intro call", href: "#contact" },
      contextLabel: "Context",
      contributionLabel: "Contribution",
      outcomeLabel: "Outcome",
      tagsAriaLabel: "Project technologies and skills",
      externalLinkAriaTemplate: "View the {title} website (external link)",
      externalLinkLabel: "View public link",
    },
    contact: {
      title: "Contact",
      description:
        "Tell me what you want to ship. I will get back to you quickly with a concrete view of the need, the constraints, and the most relevant delivery path.",
      inquiryTypes: [
        "New or redesigned .NET web application",
        "Fullstack reinforcement on an existing product",
        "Technical review, scoping, or delivery acceleration",
      ],
      primaryActionLabel: "Get in touch",
      copyActionLabel: "Copy email address",
      copySuccess: "Email address copied.",
      copyUnavailable: "Copy is unavailable. Please use the email address displayed below.",
      copyError: "The address could not be copied automatically. Please copy it manually.",
      emailLabel: "Direct email",
      meta: "Nice (06200), Provence-Alpes-Côte d'Azur · Remote, hybrid, and on-site",
      responsePromise: "Fast reply, direct conversation, no unnecessary funnel.",
      inquiriesAriaLabel: "Inquiry types",
      sendEmailAriaLabel: "Send an email to Valentin Passe",
      copyEmailAriaLabel: "Copy email address",
    },
    footer: {
      baseline: "Fullstack .NET freelancer for reliable, readable, and useful web products.",
      availability:
        "Available for structural projects, focused reinforcement, and high-impact interventions.",
      navigationTitle: "Navigation",
      links: [
        { label: "Home", href: "#hero" },
        { label: "About", href: "#about" },
        { label: "Services", href: "#services" },
        { label: "Projects", href: "#projects" },
        { label: "Contact", href: "#contact" },
      ],
      contactTitle: "Contact",
      rights: "© 2026 Valentin PASSE. All rights reserved.",
    },
  },
};

export function getPortfolioContent(locale: PortfolioLocale): PortfolioContent {
  return portfolioContent[locale] || portfolioContent.fr;
}

export const portfolioEmail = EMAIL;
