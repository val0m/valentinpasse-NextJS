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
    sourceCategories: ["Technlology"],
  },
  {
    id: "frontend-architecture",
    label: "Front-end & Architecture",
    supportText: "Interfaces web, structuration technique et choix d'architecture orientés usage.",
    sourceCategories: ["Other"],
  },
  {
    id: "data-cloud",
    label: "Data & Cloud",
    supportText: "Persistance, services cloud et outils pour des solutions prêtes à l'exploitation.",
    sourceCategories: ["Database"],
  },
  {
    id: "delivery-tooling",
    label: "Delivery & Outils",
    supportText: "Environnement de production, collaboration d'équipe et suivi du delivery.",
    sourceCategories: ["Software"],
  },
  {
    id: "environment-collaboration",
    label: "Environnements & Qualités humaines",
    supportText: "Capacité à intervenir dans des contextes variés avec autonomie et esprit d'équipe.",
    sourceCategories: ["OperatingSystem", "Qualification"],
  },
];

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
    const sourceCategory = isNonEmptyString(rawSkill.category) ? rawSkill.category : null;
    if (!sourceCategory) {
      return;
    }

    const targetCategory = CATEGORY_ORDER.find((category) =>
      category.sourceCategories.includes(sourceCategory)
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