export type SkillItem = {
  label: string;
  description: string | null;
  position: number;
};

export type SkillCategory = {
  id: string;
  label: string;
  supportText: string;
  sourceCategories: string[];
  skills: SkillItem[];
};

export type SkillsLocale = "fr" | "en";

export type SkillsSectionMetadata = {
  title: string;
  subtitle: string;
  fallback: string;
};

type RawSkill = {
  label?: unknown;
  description?: unknown;
  category?: unknown;
  position?: unknown;
};

const CATEGORY_ORDER: Array<{
  id: string;
  label: Record<SkillsLocale, string>;
  supportText: Record<SkillsLocale, string>;
  sourceCategories: string[];
}> = [
  {
    id: "fullstack-dotnet",
    label: { fr: "Fullstack .NET", en: "Fullstack .NET" },
    supportText: {
      fr: "Le socle principal pour concevoir, livrer et faire evoluer des applications robustes.",
      en: "The core stack used to design, ship, and evolve reliable applications.",
    },
    sourceCategories: ["Technology"],
  },
  {
    id: "frontend-architecture",
    label: { fr: "Front-end & Architecture", en: "Front-end & Architecture" },
    supportText: {
      fr: "Interfaces web, structuration technique et choix d'architecture orientes usage.",
      en: "Web interfaces, technical structure, and architecture choices driven by actual usage.",
    },
    sourceCategories: ["other"],
  },
  {
    id: "data-cloud",
    label: { fr: "Data & Cloud", en: "Data & Cloud" },
    supportText: {
      fr: "Persistance, services cloud et outils pour des solutions pretes a l'exploitation.",
      en: "Persistence, cloud services, and tooling to support production-ready solutions.",
    },
    sourceCategories: ["database"],
  },
  {
    id: "delivery-tooling",
    label: { fr: "Delivery & Outils", en: "Delivery & Tooling" },
    supportText: {
      fr: "Environnement de production, collaboration d'equipe et suivi du delivery.",
      en: "Production environment, team collaboration, and delivery execution tooling.",
    },
    sourceCategories: ["software"],
  },
  {
    id: "environment-collaboration",
    label: { fr: "Environnements & Qualites humaines", en: "Environments & Human qualities" },
    supportText: {
      fr: "Capacite a intervenir dans des contextes varies avec autonomie et esprit d'equipe.",
      en: "Ability to contribute across varied environments with autonomy and strong collaboration.",
    },
    sourceCategories: ["operatingsystem", "qualification"],
  },
];

const SKILL_LABEL_TRANSLATIONS: Record<string, string> = {
  "Bases du Web": "Web fundamentals",
  Javascript: "JavaScript",
  Architectures: "Architectures",
  "Gestion de projet / Equipe": "Project delivery / Team collaboration",
  "Esprit d'équipe": "Team spirit",
  Autodidacte: "Self-taught",
  Dynamique: "Driven",
  "Méthodique": "Methodical",
  Autonome: "Autonomous",
};

const SKILL_DESCRIPTION_TRANSLATIONS: Record<string, string> = {
  "Core / MVC / WebForm": "Core / MVC / WebForm",
  "Service bus / App services / Azure functions / Storage Account / Monitoring / App Insight / ...": "Service bus / App services / Azure Functions / Storage Account / Monitoring / App Insights / ...",
  "SQL Server Integration Services / SQL Server Reporting Services": "SQL Server Integration Services / SQL Server Reporting Services",
  "HTML5 / CSS3": "HTML5 / CSS3",
  "Jquery / VueJS / React / TabAjax": "jQuery / Vue.js / React / TabAjax",
  "Design patterns / CQRS / DDD": "Design patterns / CQRS / DDD",
  "Agile (Scrum) / Cycle en V / Scrum Master / Reviewer": "Agile (Scrum) / V-cycle / Scrum Master / Reviewer",
  "IDE / Code": "IDE / Code",
  "Photoshop / InDesign": "Photoshop / InDesign",
};

const SECTION_METADATA: Record<SkillsLocale, SkillsSectionMetadata> = {
  fr: {
    title: "Compétences",
    subtitle:
      "Une expertise Fullstack .NET complétée par des compétences front-end, cloud, data et delivery pour des projets concrets.",
    fallback: "Les compétences sont en cours de mise à jour.",
  },
  en: {
    title: "Skills",
    subtitle:
      "Fullstack .NET expertise supported by front-end, cloud, data, and delivery capabilities for concrete projects.",
    fallback: "Skills are currently being updated.",
  },
};

export function resolveSkillsSectionMetadata(locale: SkillsLocale): SkillsSectionMetadata {
  return SECTION_METADATA[locale] || SECTION_METADATA.fr;
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function translateValue(value: string, locale: SkillsLocale, translations: Record<string, string>): string {
  if (locale === "fr") {
    return value;
  }

  return translations[value] || value;
}

function toSkillItem(item: RawSkill, locale: SkillsLocale): SkillItem | null {
  if (!isNonEmptyString(item.label)) {
    return null;
  }

  return {
    label: translateValue(item.label, locale, SKILL_LABEL_TRANSLATIONS),
    description: isNonEmptyString(item.description)
      ? translateValue(item.description, locale, SKILL_DESCRIPTION_TRANSLATIONS)
      : null,
    position: typeof item.position === "number" ? item.position : Number.MAX_SAFE_INTEGER,
  };
}

export function normalizeSkills(items: unknown, locale: SkillsLocale = "fr"): SkillCategory[] {
  if (!Array.isArray(items)) {
    return [];
  }

  const grouped = new Map<string, SkillItem[]>();

  CATEGORY_ORDER.forEach((category) => {
    grouped.set(category.id, []);
  });

  items.forEach((item) => {
    if (typeof item !== "object" || item === null) {
      return;
    }

    const rawSkill = item as RawSkill;
    const sourceCategory = isNonEmptyString(rawSkill.category)
      ? rawSkill.category.trim().toLowerCase()
      : null;
    if (!sourceCategory) {
      return;
    }

    const targetCategory = CATEGORY_ORDER.find((category) =>
      category.sourceCategories.some((cat) => cat.toLowerCase() === sourceCategory)
    );
    if (!targetCategory) {
      return;
    }

    const normalizedSkill = toSkillItem(rawSkill, locale);
    if (!normalizedSkill) {
      return;
    }

    const categorySkills = grouped.get(targetCategory.id);
    if (!categorySkills) {
      return;
    }

    const alreadyExists = categorySkills.some(
      (skill) => skill.label.toLowerCase() === normalizedSkill.label.toLowerCase()
    );
    if (alreadyExists) {
      return;
    }

    categorySkills.push(normalizedSkill);
  });

  return CATEGORY_ORDER.map((category) => ({
    id: category.id,
    label: category.label[locale],
    supportText: category.supportText[locale],
    sourceCategories: category.sourceCategories,
    skills: (grouped.get(category.id) || []).sort((left, right) => {
      if (left.position !== right.position) {
        return left.position - right.position;
      }

      return left.label.localeCompare(right.label, "fr");
    }),
  })).filter((category) => category.skills.length > 0);
}