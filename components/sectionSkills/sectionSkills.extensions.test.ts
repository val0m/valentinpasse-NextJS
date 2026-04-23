/**
 * Unit tests for SectionSkills data normalization logic
 * Tests category mapping, deduplication, and robustness to data variations
 */

import { normalizeSkills, SkillCategory, SkillItem } from "./sectionSkills.extensions";

describe("sectionSkills.extensions - normalizeSkills", () => {
  describe("Baseline functionality", () => {
    test("should return empty array for non-array input", () => {
      expect(normalizeSkills(null)).toEqual([]);
      expect(normalizeSkills(undefined)).toEqual([]);
      expect(normalizeSkills("not an array")).toEqual([]);
      expect(normalizeSkills({ not: "array" })).toEqual([]);
    });

    test("should return empty array for empty array", () => {
      expect(normalizeSkills([])).toEqual([]);
    });

    test("should normalize valid skills into categories", () => {
      const input = [
        { label: "C#", category: "Technology", position: 1 },
        { label: "JavaScript", category: "Other", position: 1 },
      ];
      const result = normalizeSkills(input);

      expect(result.length).toBe(2);
      expect(result[0].id).toBe("fullstack-dotnet");
      expect(result[0].skills.some((s) => s.label === "C#")).toBe(true);
      expect(result[1].id).toBe("frontend-architecture");
      expect(result[1].skills.some((s) => s.label === "JavaScript")).toBe(true);
    });
  });

  describe("Robustness: Case-insensitive category matching", () => {
    test("should map 'technology' (lowercase) correctly", () => {
      const input = [{ label: "C#", category: "technology", position: 1 }];
      const result = normalizeSkills(input);
      expect(result[0].id).toBe("fullstack-dotnet");
      expect(result[0].skills[0].label).toBe("C#");
    });

    test("should map 'DATABASE' (uppercase) correctly", () => {
      const input = [{ label: "SQL Server", category: "DATABASE", position: 1 }];
      const result = normalizeSkills(input);
      expect(result[0].id).toBe("data-cloud");
      expect(result[0].skills[0].label).toBe("SQL Server");
    });

    test("should handle mixed case categories", () => {
      const input = [
        { label: "C#", category: "TeChNoLoGy", position: 1 },
        { label: "Windows", category: "OperatingSystem", position: 1 },
      ];
      const result = normalizeSkills(input);
      const fullstackCategory = result.find((c) => c.id === "fullstack-dotnet");
      const envCategory = result.find((c) => c.id === "environment-collaboration");
      expect(fullstackCategory?.skills[0].label).toBe("C#");
      expect(envCategory?.skills.some((s) => s.label === "Windows")).toBe(true);
    });
  });

  describe("Robustness: Whitespace handling", () => {
    test("should trim category names with leading/trailing whitespace", () => {
      const input = [
        { label: "C#", category: "  Technology  ", position: 1 },
        { label: "SQL", category: " Database ", position: 1 },
      ];
      const result = normalizeSkills(input);
      expect(result[0].id).toBe("fullstack-dotnet");
      expect(result[1].id).toBe("data-cloud");
    });

    test("should not fail on empty or whitespace-only categories", () => {
      const input = [
        { label: "C#", category: "Technology", position: 1 },
        { label: "Mystery Skill", category: "   ", position: 2 },
        { label: "Another Mystery", category: "", position: 3 },
      ];
      const result = normalizeSkills(input);
      expect(result.length).toBe(1); // Only Technology category rendered
      expect(result[0].skills.length).toBe(1);
    });
  });

  describe("Deduplication", () => {
    test("should remove duplicate skill labels within same category", () => {
      const input = [
        { label: "C#", category: "Technology", position: 1 },
        { label: "C#", category: "Technology", position: 2 },
        { label: "SQL", category: "Database", position: 1 },
        { label: "sql", category: "Database", position: 2 }, // Different case
      ];
      const result = normalizeSkills(input);
      const techCat = result.find((c) => c.id === "fullstack-dotnet");
      const dataCat = result.find((c) => c.id === "data-cloud");
      expect(techCat?.skills.length).toBe(1);
      expect(dataCat?.skills.length).toBe(1); // Case-insensitive dedup
    });

    test("should preserve order by position field", () => {
      const input = [
        { label: "Z-Skill", category: "Technology", position: 3 },
        { label: "A-Skill", category: "Technology", position: 1 },
        { label: "M-Skill", category: "Technology", position: 2 },
      ];
      const result = normalizeSkills(input);
      const skills = result[0].skills.map((s) => s.label);
      expect(skills).toEqual(["A-Skill", "M-Skill", "Z-Skill"]);
    });

    test("should sort by label alphabetically (French locale) when positions are equal", () => {
      const input = [
        { label: "Zebra", category: "Technology", position: 1 },
        { label: "Apple", category: "Technology", position: 1 },
        { label: "Café", category: "Technology", position: 1 },
      ];
      const result = normalizeSkills(input);
      const skills = result[0].skills.map((s) => s.label);
      expect(skills[0]).toBe("Apple");
      expect(skills[skills.length - 1]).toBe("Zebra");
    });
  });

  describe("Skill item validation and normalization", () => {
    test("should skip items without label", () => {
      const input = [
        { label: "C#", category: "Technology", position: 1 },
        { category: "Technology", position: 2 },
        { label: "", category: "Technology", position: 3 },
        { label: "  ", category: "Technology", position: 4 },
      ];
      const result = normalizeSkills(input);
      expect(result[0].skills.length).toBe(1);
    });

    test("should normalize description field correctly", () => {
      const input = [
        {
          label: ".NET",
          description: "Core / MVC / WebForm",
          category: "Technology",
          position: 1,
        },
        { label: "C#", description: null, category: "Technology", position: 2 },
        { label: "Azure", description: "", category: "Technology", position: 3 },
      ];
      const result = normalizeSkills(input);
      const skills = result[0].skills;
      expect(skills[0].description).toBe("Core / MVC / WebForm");
      expect(skills[1].description).toBeNull();
      expect(skills[2].description).toBeNull(); // Empty string treated as null
    });

    test("should handle missing position field with safe default", () => {
      const input = [
        { label: "C#", category: "Technology", position: 1 },
        { label: "Azure", category: "Technology" },
      ];
      const result = normalizeSkills(input);
      const skills = result[0].skills;
      expect(skills[0].label).toBe("C#");
      expect(skills[1].label).toBe("Azure");
    });
  });

  describe("Empty category filtering", () => {
    test("should not include categories with no matching skills", () => {
      const input = [
        { label: "C#", category: "Technology", position: 1 },
        { label: "JavaScript", category: "Other", position: 1 },
      ];
      const result = normalizeSkills(input);
      // Should not include Database, Software, or OperatingSystem/Qualification
      expect(result.length).toBe(2);
      expect(result.every((c) => c.skills.length > 0)).toBe(true);
    });
  });

  describe("Multiple source categories per canonical category", () => {
    test("should map multiple source categories to single canonical category", () => {
      const input = [
        { label: "Windows", category: "OperatingSystem", position: 1 },
        { label: "Team Spirit", category: "Qualification", position: 1 },
      ];
      const result = normalizeSkills(input);
      // Both should map to 'environment-collaboration'
      const envCat = result.find((c) => c.id === "environment-collaboration");
      expect(envCat?.skills.length).toBe(2);
    });
  });

  describe("Malformed input handling", () => {
    test("should gracefully handle non-object items in array", () => {
      const input: any[] = [
        { label: "C#", category: "Technology", position: 1 },
        "string item",
        null,
        undefined,
        42,
        { label: "Azure", category: "Technology", position: 2 },
      ];
      const result = normalizeSkills(input);
      expect(result[0].skills.length).toBe(2);
    });

    test("should not fail with unknown category values", () => {
      const input = [
        { label: "C#", category: "Technology", position: 1 },
        { label: "Unknown Tech", category: "UnknownCategory", position: 1 },
        { label: "SQL", category: "Database", position: 1 },
      ];
      const result = normalizeSkills(input);
      // Should include Technology and Database but skip UnknownCategory
      expect(result.length).toBe(2);
      const skills = result.flatMap((c) => c.skills);
      expect(skills.some((s) => s.label === "Unknown Tech")).toBe(false);
    });
  });
});
