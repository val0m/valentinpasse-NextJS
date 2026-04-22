export type ServiceOffer = {
  title: string;
  clientProblem: string;
  businessOutcome: string;
  capabilities: string[];
  ctaTarget: string;
};

export function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export function sanitizeServices(items: unknown): ServiceOffer[] {
  if (!Array.isArray(items)) {
    return [];
  }

  return items
    .filter(
      (item): item is Record<string, unknown> =>
        typeof item === "object" && item !== null
    )
    .map((item) => {
      const capabilities = Array.isArray(item.capabilities)
        ? item.capabilities.filter(isNonEmptyString)
        : [];

      return {
        title: item.title,
        clientProblem: item.clientProblem,
        businessOutcome: item.businessOutcome,
        capabilities,
        ctaTarget: item.ctaTarget,
      };
    })
    .filter(
      (item): item is ServiceOffer =>
        isNonEmptyString(item.title) &&
        isNonEmptyString(item.clientProblem) &&
        isNonEmptyString(item.businessOutcome) &&
        isNonEmptyString(item.ctaTarget) &&
        item.capabilities.length >= 2
    );
}
