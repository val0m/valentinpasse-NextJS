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
  label: string;
  supportText: string;
  sourceCategories: string[];
}> = [
  {
    id: "fullstack-dotnet",
    label: "Fullstack .NET",
    supportText: "Le socle principal pour concevoir, livrer et faire évoluer des applications robustes.",
    sourceCategories: ["Technology", "Technlology"],
  },
  {
    id: "frontend-architecture",
    label: "Front-end & Architecture",
    supportText: "Interfaces web, structuration technique et choix d'architecture orientés usage.",
    sourceCategories: ["other"],
  },
  {
    id: "data-cloud",
    label: "Data & Cloud",
    supportText: "Persistance, services cloud et outils pour des solutions prêtes à l'exploitation.",
    sourceCategories: ["database"],
  },
  {
    id: "delivery-tooling",
    label: "Delivery & Outils",
    supportText: "Environnement de production, collaboration d'équipe et suivi du delivery.",
    sourceCategories: ["software"],
  },
  {
    id: "environment-collaboration",
    label: "Environnements & Qualités humaines",
    supportText: "Capacité à intervenir dans des contextes variés avec autonomie et esprit d'équipe.",
    sourceCategories: ["operatingsystem", "qualification"],
  },
];

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

function toSkillItem(item: RawSkill): SkillItem | null {
  if (!isNonEmptyString(item.label)) {
    return null;
  }

  return {
    label: item.label,
    description: isNonEmptyString(item.description) ? item.description : null,
    position: typeof item.position === "number" ? item.position : Number.MAX_SAFE_INTEGER,
  };
}

export function normalizeSkills(items: unknown): SkillCategory[] {
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

    const normalizedSkill = toSkillItem(rawSkill);
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
    ...category,
    skills: (grouped.get(category.id) || []).sort((left, right) => {
      if (left.position !== right.position) {
        return left.position - right.position;
      }

      return left.label.localeCompare(right.label, "fr");
    }),
  })).filter((category) => category.skills.length > 0);
}