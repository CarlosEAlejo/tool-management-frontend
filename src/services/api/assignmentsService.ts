import client from "./client";
import type { AssignmentEvent, AssignmentFormValues, Tool } from "../../shared/types";

const RESOURCE = "/asignaciones";

export interface AssignmentMutationResponse {
  tool: Tool;
  event: AssignmentEvent;
}

interface AssignmentListFilters {
  toolId?: string;
  workerId?: string;
  search?: string;
  from?: string;
  to?: string;
}

const buildQueryParams = (filters: AssignmentListFilters = {}): Record<string, string> =>
  Object.entries(filters).reduce<Record<string, string>>((acc, [key, value]) => {
    if (value !== undefined && value !== null && String(value).trim() !== "") {
      acc[key] = String(value).trim();
    }
    return acc;
  }, {});

export const listAssignments = async (filters: AssignmentListFilters = {}): Promise<AssignmentEvent[]> => {
  const response = await client.get<AssignmentEvent[]>(RESOURCE, { params: buildQueryParams(filters) });
  return response.data ?? [];
};

export const createAssignment = async (payload: AssignmentFormValues): Promise<AssignmentMutationResponse> => {
  const response = await client.post<AssignmentMutationResponse>(RESOURCE, payload);
  return response.data;
};

export const returnAssignment = async (toolId: string): Promise<AssignmentMutationResponse> => {
  const response = await client.post<AssignmentMutationResponse>(`${RESOURCE}/${toolId}/devolver`);
  return response.data;
};
