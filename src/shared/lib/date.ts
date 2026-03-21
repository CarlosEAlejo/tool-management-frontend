import type { ToolStatus, ToolType } from "../types";

export const formatDate = (dateString: string): string => {
  if (!dateString || dateString === "-") {
    return "-";
  }

  const plainDateMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateString);
  const date = plainDateMatch
    ? new Date(Number(plainDateMatch[1]), Number(plainDateMatch[2]) - 1, Number(plainDateMatch[3]))
    : new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return dateString;
  }

  return date.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export type { ToolStatus, ToolType };
