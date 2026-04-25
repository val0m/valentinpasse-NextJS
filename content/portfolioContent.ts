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
  };
  about: {
    title: string;
    lead: string;
    paragraphs: string[];
    highlights: AboutHighlight[];
    principles: string[];
    primaryAction: ActionLink;
    secondaryAction: ActionLink;
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

const NAV_IDS: Array<{ id: string; fr: string; en: string }> = [
  { id: "hero", fr: "Accueil", en: "Home" },
  { id: "about", fr: "A propos", en: "About" },
  { id: "services", fr: "Services", en: "Services" },
  { id: "skills", fr: "Competences", en: "Skills" },
  { id: "experience", fr: "Experience", en: "Experience" },
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
        "Portfolio one-page de Valentin PASSE, freelance Fullstack .NET a Nice. Delivery produit, architecture applicative et integration IA pragmatique.",
    },
    navigation: {
      items: NAV_IDS.map((item) => ({ id: item.id, label: item.fr })),
      ctaLabel: "Parler de votre projet",
      localeSwitcherLabel: "Basculer la langue du portfolio",
    },
    hero: {
      eyebrow: "Freelance Fullstack .NET | Nice, remote, hybride, sur site",
      name: "Valentin Passe",
      tagline: "Je conçois des produits web fiables, lisibles et rapides a faire evoluer.",
      promise:
        "J'interviens sur le cadrage, le developpement fullstack .NET, la qualite de delivery et l'integration IA utile pour accelerer les equipes sans ajouter de dette inutile.",
      proofPoints: [
        "Double experience CDI et freelance pour arbitrer vite entre vision produit et contraintes de livraison.",
        "Expertise .NET, Blazor, architecture applicative et contextes metier exigeants.",
        "Approche directe, orientee resultat, avec attention forte a la lisibilite du code et a l'usage final.",
      ],
      metrics: [
        { value: "10+", label: "ans de delivery logiciel" },
        { value: "2", label: "missions freelance en parallele depuis 2023" },
        { value: ".NET", label: "socle principal pour construire et faire evoluer" },
      ],
      primaryAction: { label: "Discuter de votre besoin", href: "#contact" },
      secondaryAction: { label: "Voir les projets", href: "#projects" },
    },
    about: {
      title: "A propos",
      lead:
        "Ingenieur Fullstack .NET freelance, j'aide les entreprises a transformer un besoin metier en produit web robuste et exploitable.",
      paragraphs: [
        "J'interviens sur toute la chaine de valeur: cadrage, architecture, implementation, qualite et mise en production. Mon objectif est simple: livrer vite, proprement, et sans sacrifier la maintenabilite.",
        "Mon positionnement combine rigueur technique, vision produit et integration IA pragmatique. J'aime les solutions claires, utiles et compréhensibles par l'equipe qui devra ensuite les faire vivre.",
      ],
      highlights: [
        {
          title: "Execution end-to-end",
          description: "Du besoin initial a la livraison, je garde un cap de resultat et une vision d'ensemble sur le produit.",
        },
        {
          title: "Fullstack .NET assume",
          description: "Back-end, API, front Blazor et architecture applicative pour eviter les zones mortes entre couches.",
        },
        {
          title: "Pragmatique sur l'IA",
          description: "J'integre l'IA quand elle simplifie vraiment un workflow, pas pour ajouter une couche de complexite de plus.",
        },
      ],
      principles: ["Concevoir", "Livrer", "Fiabiliser", "Faire evoluer"],
      primaryAction: { label: "Explorer les projets", href: "#projects" },
      secondaryAction: { label: "Me contacter", href: "#contact" },
    },
    services: {
      title: "Services",
      subtitle:
        "Trois modes d'intervention pour structurer une roadmap, renforcer un produit existant ou accelerer des gains concrets avec l'IA.",
      items: [
        {
          title: "Cadrage et trajectoire technique",
          clientProblem:
            "Le besoin est clair cote metier, mais la solution manque encore de structure technique pour demarrer sans dispersion.",
          businessOutcome:
            "Vous obtenez des choix d'architecture argumentes, un decoupage livrable et une trajectoire de delivery credible.",
          capabilities: ["Ateliers de cadrage", "Architecture .NET", "Roadmap priorisee"],
          ctaTarget: "#contact",
        },
        {
          title: "Developpement Fullstack .NET",
          clientProblem:
            "Le produit doit evoluer vite sans degrader la lisibilite du code, la performance ou la capacite a maintenir dans le temps.",
          businessOutcome:
            "Vous accelerez la mise en production avec une implementation robuste, comprehensible et alignee sur les usages terrain.",
          capabilities: ["API et back-end .NET", "Interfaces Blazor", "Qualite et performance"],
          ctaTarget: "#contact",
        },
        {
          title: "Automatisation et IA utile",
          clientProblem:
            "Les equipes perdent du temps sur des operations repetitives et cherchent des gains rapides sans projet usine a gaz.",
          businessOutcome:
            "Vous ciblez des automatisations a fort effet utile avec une integration IA sobre, mesurable et adaptee au contexte.",
          capabilities: ["Audit de workflows", "Automatisations ciblees", "Accompagnement a l'adoption"],
          ctaTarget: "#contact",
        },
      ],
    },
    experience: {
      title: "Experience",
      subtitle:
        "Des missions menees dans la duree, avec des environnements operationnels exigeants et une attention constante a la valeur livree.",
      entries: [
        {
          roleTitle: "Ingenieur Developpement Fullstack .NET",
          organizationLabel: "SMEG, Monaco",
          period: "Nov. 2023 - Aujourd'hui",
          context:
            "Solution de gestion des appels d'astreinte, urgences et interventions pour des usages bureau et mobile.",
          valueDelivered:
            "Conception et livraison d'un systeme fiable pour des situations critiques, avec une meilleure reactivite terrain.",
          tech: [".NET 7", "C#", "ABP", "DDD", "Azure", "Docker", "RabbitMQ", "Redis", "MongoDB"],
        },
        {
          roleTitle: "Ingenieur Developpement Fullstack .NET",
          organizationLabel: "Groupe C8G",
          period: "Juin 2023 - Aujourd'hui",
          context:
            "Developpement de solutions web metier pour soutenir les usages internes et la rapidite d'execution des equipes.",
          valueDelivered:
            "Mise en production de fonctionnalites fullstack qui fluidifient le delivery et la maintenabilite des produits.",
          tech: [".NET", "Blazor", "Entity Framework", "Azure", "Vue.js"],
        },
        {
          roleTitle: "Developpeur Back-end .NET",
          organizationLabel: "TidyUp Technologies",
          period: "Juin 2023 - Oct. 2023",
          context:
            "Plateforme de classement et recherche de contenus numeriques avec composante IA.",
          valueDelivered:
            "Construction d'un socle backend durable pour accompagner l'evolution produit et la fiabilite des traitements.",
          tech: [".NET MVC", ".NET Core", "C#", "Xamarin Forms", "SQL"],
        },
        {
          roleTitle: "Developpeur Back-end .NET",
          organizationLabel: "UBALDI.com",
          period: "Avr. 2021 - Juin 2023",
          context:
            "Contribution a plusieurs projets internes avec des enjeux de continuite de service et de performance applicative.",
          valueDelivered:
            "Fiabilisation du delivery backend et amelioration continue des processus techniques internes.",
          tech: [".NET", "C#", "API", "SQL Server"],
        },
        {
          roleTitle: "Developpeur Fullstack .NET",
          organizationLabel: "Regie Eau d'Azur",
          period: "Sept. 2015 - Avr. 2021",
          context:
            "Realisation de solutions applicatives internes sur un cycle long dans des contextes metier varies.",
          valueDelivered:
            "Industrialisation progressive des applications et renforcement de la qualite de service pour les utilisateurs finaux.",
          tech: [".NET", "C#", "SQL", "Architecture applicative"],
        },
      ],
      educationCta: "Voir le parcours de formation",
    },
    education: {
      title: "Formation",
      subtitle:
        "Un socle academique solide, complete par une veille continue et une montee en competences pilotee par les besoins terrain.",
      entries: [
        {
          period: "2014 - 2015",
          title: "Licence Professionnelle IDSE",
          institution: "IUT Nice Sophia Antipolis",
          description:
            "Specialisation en ingenierie logicielle et systemes informatiques, avec une orientation forte vers le developpement applicatif.",
        },
        {
          period: "2012 - 2014",
          title: "BTS SIO",
          institution: "Lycee Honore d'Estienne d'Orves",
          description:
            "Formation structurante en developpement, bases de donnees et culture projet, ensuite appliquee sur des contextes metier varies.",
        },
      ],
      continuousLearningTitle: "Apprentissage continu",
      continuousLearningText:
        "Au-dela du cursus initial, je maintiens une veille active sur l'ecosysteme .NET, l'architecture applicative, le cloud Microsoft et l'integration pragmatique de l'IA.",
    },
    projects: {
      title: "Projets",
      subtitle:
        "Quelques cas concrets pour montrer comment je transforme un contexte technique ou metier en resultat exploitable.",
      items: [
        {
          title: "Astreinte et interventions",
          summary:
            "Solution metier pour piloter appels d'astreinte, urgences et interventions sur usages bureau et mobile.",
          context:
            "Environnement operationnel exigeant, avec fortes contraintes de disponibilite et qualite de service continue.",
          contribution:
            "Conception et developpement Fullstack sur socle .NET 7 et ABP, avec architecture orientee domaine.",
          outcome:
            "Digitalisation des processus terrain et meilleure reactivite des equipes dans les situations critiques.",
          tags: [".NET", "C#", "ABP", "DDD", "Azure", "MongoDB"],
        },
        {
          title: "Plateforme backend avec composante IA",
          summary:
            "Base applicative pour le rangement, le classement et la recherche de contenus numeriques a forte valeur.",
          context:
            "Besoin d'une fondation backend solide pour accompagner dans le temps les evolutions produit et les usages IA.",
          contribution:
            "Developpement backend en .NET MVC et .NET Core, structuration des flux techniques et de la persistance.",
          outcome:
            "Socle technique durable facilitant la montee en capacite produit et la fiabilite des traitements.",
          tags: [".NET MVC", ".NET Core", "C#", "SQL", "Architecture"],
        },
        {
          title: "Applications internes d'entreprise",
          summary:
            "Plusieurs projets internes menes sur des cycles longs pour soutenir les besoins metiers quotidiens.",
          context:
            "Contexte multi-applications avec enjeux de maintenabilite, performance et evolution progressive.",
          contribution:
            "Developpement backend/fullstack, maintenance evolutive et amelioration continue de la qualite de delivery.",
          outcome:
            "Fiabilisation des processus internes et meilleure continuite de service pour les utilisateurs metiers.",
          tags: [".NET", "Blazor", "Entity Framework", "SQL Server", "Delivery"],
          publicLink: "https://c8g.fr",
        },
      ],
      primaryAction: { label: "Discuter de votre projet", href: "#contact" },
      secondaryAction: { label: "Demander un echange", href: "#contact" },
    },
    contact: {
      title: "Contact",
      description:
        "Parlez-moi de ce que vous souhaitez livrer. Je reviens rapidement avec un regard concret sur le besoin, les contraintes et la meilleure trajectoire de mise en oeuvre.",
      inquiryTypes: [
        "Creation ou refonte d'application web .NET",
        "Renfort Fullstack sur produit existant",
        "Audit technique, cadrage ou acceleration de delivery",
      ],
      primaryActionLabel: "Me contacter",
      copyActionLabel: "Copier l'adresse e-mail",
      copySuccess: "Adresse e-mail copiee.",
      copyUnavailable: "Copie non disponible. Utilisez l'adresse e-mail affichee ci-dessous.",
      copyError: "Impossible de copier l'adresse automatiquement. Copiez-la manuellement.",
      emailLabel: "Email direct",
      meta: "Nice, Provence-Alpes-Cote d'Azur | Remote, hybride et sur site",
      responsePromise: "Reponse rapide, echange simple et pas de tunnel inutile.",
    },
    footer: {
      baseline: "Freelance Fullstack .NET pour des produits web fiables, lisibles et utiles.",
      availability: "Disponible pour des missions structurelles, des renforts ciblés et des interventions a fort impact.",
      navigationTitle: "Navigation",
      links: [
        { label: "Accueil", href: "#hero" },
        { label: "Services", href: "#services" },
        { label: "Projets", href: "#projects" },
        { label: "Contact", href: "#contact" },
      ],
      contactTitle: "Contact",
      rights: "© 2026 Valentin PASSE. Tous droits reserves.",
    },
  },
  en: {
    localeName: "EN",
    switchLocaleLabel: "FR",
    meta: {
      title: "Valentin PASSE | Fullstack .NET Freelancer",
      description:
        "One-page portfolio of Valentin PASSE, Fullstack .NET freelancer based in Nice. Product delivery, application architecture, and pragmatic AI integration.",
    },
    navigation: {
      items: NAV_IDS.map((item) => ({ id: item.id, label: item.en })),
      ctaLabel: "Discuss your project",
      localeSwitcherLabel: "Switch portfolio language",
    },
    hero: {
      eyebrow: "Fullstack .NET freelancer | Nice, remote, hybrid, on-site",
      name: "Valentin Passe",
      tagline: "I design reliable web products that stay readable and easy to evolve.",
      promise:
        "I work across scoping, fullstack .NET development, delivery quality, and useful AI integration to help teams move faster without creating unnecessary technical debt.",
      proofPoints: [
        "A mix of employee and freelance experience to balance product direction with delivery constraints.",
        "Hands-on expertise in .NET, Blazor, application architecture, and demanding business environments.",
        "Direct, outcome-driven execution with strong focus on code clarity and end-user value.",
      ],
      metrics: [
        { value: "10+", label: "years of software delivery" },
        { value: "2", label: "parallel freelance engagements since 2023" },
        { value: ".NET", label: "core stack to build and scale with confidence" },
      ],
      primaryAction: { label: "Discuss your needs", href: "#contact" },
      secondaryAction: { label: "View projects", href: "#projects" },
    },
    about: {
      title: "About",
      lead:
        "As a freelance Fullstack .NET engineer, I help companies turn business needs into robust and usable web products.",
      paragraphs: [
        "I work across the whole value chain: scoping, architecture, implementation, quality, and production delivery. The objective is straightforward: ship quickly, cleanly, and without sacrificing maintainability.",
        "My positioning combines technical rigor, product thinking, and pragmatic AI integration. I value solutions that remain clear, useful, and understandable for the team that will evolve them afterwards.",
      ],
      highlights: [
        {
          title: "End-to-end execution",
          description: "From early needs to release, I keep a result-oriented mindset and a clear product overview.",
        },
        {
          title: "Strong fullstack .NET focus",
          description: "Back-end, APIs, Blazor front-end, and application architecture to avoid dead zones between layers.",
        },
        {
          title: "Pragmatic AI integration",
          description: "I use AI when it genuinely simplifies a workflow, not as a decorative layer that adds complexity.",
        },
      ],
      principles: ["Design", "Ship", "Stabilize", "Evolve"],
      primaryAction: { label: "Explore projects", href: "#projects" },
      secondaryAction: { label: "Get in touch", href: "#contact" },
    },
    services: {
      title: "Services",
      subtitle:
        "Three intervention modes to structure a roadmap, strengthen an existing product, or unlock practical AI-driven gains.",
      items: [
        {
          title: "Scoping and technical direction",
          clientProblem:
            "The business need is clear, but the solution still lacks enough technical structure to start with confidence.",
          businessOutcome:
            "You get clear architecture decisions, a deliverable rollout plan, and a realistic delivery path.",
          capabilities: ["Scoping workshops", ".NET architecture", "Prioritized roadmap"],
          ctaTarget: "#contact",
        },
        {
          title: "Fullstack .NET delivery",
          clientProblem:
            "Your product must evolve quickly without hurting code clarity, performance, or long-term maintainability.",
          businessOutcome:
            "You speed up production delivery with an implementation that is robust, readable, and aligned with real usage.",
          capabilities: [".NET APIs and back-end", "Blazor interfaces", "Quality and performance"],
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
        "Long-running delivery work in demanding environments, with constant attention to reliability, readability, and business value.",
      entries: [
        {
          roleTitle: "Fullstack .NET Development Engineer",
          organizationLabel: "SMEG, Monaco",
          period: "Nov. 2023 - Present",
          context:
            "On-call management, emergency, and intervention platform for office and mobile usage.",
          valueDelivered:
            "Designed and delivered a reliable system for critical operations with stronger field responsiveness.",
          tech: [".NET 7", "C#", "ABP", "DDD", "Azure", "Docker", "RabbitMQ", "Redis", "MongoDB"],
        },
        {
          roleTitle: "Fullstack .NET Development Engineer",
          organizationLabel: "Groupe C8G",
          period: "Jun. 2023 - Present",
          context:
            "Business-oriented web solutions supporting internal operations and daily team efficiency.",
          valueDelivered:
            "Delivered fullstack features that improved release speed and long-term product maintainability.",
          tech: [".NET", "Blazor", "Entity Framework", "Azure", "Vue.js"],
        },
        {
          roleTitle: "Back-end .NET Developer",
          organizationLabel: "TidyUp Technologies",
          period: "Jun. 2023 - Oct. 2023",
          context:
            "Content organization and search platform with an AI component.",
          valueDelivered:
            "Built a durable back-end foundation to support product evolution and processing reliability.",
          tech: [".NET MVC", ".NET Core", "C#", "Xamarin Forms", "SQL"],
        },
        {
          roleTitle: "Back-end .NET Developer",
          organizationLabel: "UBALDI.com",
          period: "Apr. 2021 - Jun. 2023",
          context:
            "Contributed to several internal projects with service continuity and performance constraints.",
          valueDelivered:
            "Strengthened back-end delivery and continuously improved internal engineering processes.",
          tech: [".NET", "C#", "API", "SQL Server"],
        },
        {
          roleTitle: "Fullstack .NET Developer",
          organizationLabel: "Regie Eau d'Azur",
          period: "Sep. 2015 - Apr. 2021",
          context:
            "Built internal business applications over a long cycle across varied operational contexts.",
          valueDelivered:
            "Gradually industrialized applications and improved service quality for end users.",
          tech: [".NET", "C#", "SQL", "Application architecture"],
        },
      ],
      educationCta: "View education",
    },
    education: {
      title: "Education",
      subtitle:
        "A solid academic foundation, complemented by continuous learning and skill growth shaped by real delivery work.",
      entries: [
        {
          period: "2014 - 2015",
          title: "Professional Bachelor's Degree in IDSE",
          institution: "IUT Nice Sophia Antipolis",
          description:
            "Specialized in software engineering and information systems, with a strong focus on application development.",
        },
        {
          period: "2012 - 2014",
          title: "BTS SIO",
          institution: "Lycee Honore d'Estienne d'Orves",
          description:
            "A structured training path in software development, databases, and project culture applied later in varied business contexts.",
        },
      ],
      continuousLearningTitle: "Continuous learning",
      continuousLearningText:
        "Beyond formal education, I actively keep up with the .NET ecosystem, application architecture, Microsoft cloud services, and pragmatic AI integration.",
    },
    projects: {
      title: "Projects",
      subtitle:
        "A selection of concrete delivery contexts showing how I turn business or technical constraints into usable outcomes.",
      items: [
        {
          title: "On-call and intervention platform",
          summary:
            "Business solution to manage on-call operations, emergencies, and interventions across office and mobile workflows.",
          context:
            "Demanding operational environment with high expectations around availability and continuity of service.",
          contribution:
            "Designed and developed the product fullstack on a .NET 7 and ABP foundation with domain-oriented architecture.",
          outcome:
            "Digitized field processes and improved responsiveness in critical situations.",
          tags: [".NET", "C#", "ABP", "DDD", "Azure", "MongoDB"],
        },
        {
          title: "Back-end platform with AI component",
          summary:
            "Application foundation for organizing, classifying, and searching valuable digital content.",
          context:
            "A product context that required a strong back-end basis to support future AI-enabled evolutions.",
          contribution:
            "Developed the back-end in .NET MVC and .NET Core while structuring technical flows and persistence.",
          outcome:
            "Built a durable technical base supporting product scalability and reliable processing.",
          tags: [".NET MVC", ".NET Core", "C#", "SQL", "Architecture"],
        },
        {
          title: "Internal business applications",
          summary:
            "Several long-cycle internal projects built to support day-to-day business operations.",
          context:
            "A multi-application environment with ongoing maintainability, performance, and evolution challenges.",
          contribution:
            "Worked on back-end and fullstack delivery, iterative maintenance, and overall delivery quality.",
          outcome:
            "Improved internal process reliability and service continuity for business users.",
          tags: [".NET", "Blazor", "Entity Framework", "SQL Server", "Delivery"],
          publicLink: "https://c8g.fr",
        },
      ],
      primaryAction: { label: "Discuss your project", href: "#contact" },
      secondaryAction: { label: "Book an intro call", href: "#contact" },
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
      meta: "Nice, Provence-Alpes-Cote d'Azur | Remote, hybrid, and on-site",
      responsePromise: "Fast reply, direct conversation, no unnecessary funnel.",
    },
    footer: {
      baseline: "Fullstack .NET freelancer for reliable, readable, and useful web products.",
      availability: "Available for structural projects, focused reinforcement, and high-impact interventions.",
      navigationTitle: "Navigation",
      links: [
        { label: "Home", href: "#hero" },
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