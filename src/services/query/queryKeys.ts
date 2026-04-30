export const queryKeys = {
  tools: {
    all: ["tools"] as const,
    list: () => ["tools", "list"] as const,
  },
  workers: {
    all: ["workers"] as const,
    list: () => ["workers", "list"] as const,
  },
  assignments: {
    all: ["assignments"] as const,
    list: (filters: { search?: string; from?: string; to?: string }) => ["assignments", "list", filters] as const,
  },
  maintenances: {
    all: ["maintenances"] as const,
    list: (filters: { search?: string; from?: string; to?: string }) => ["maintenances", "list", filters] as const,
  },
};
