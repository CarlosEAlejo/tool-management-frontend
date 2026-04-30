import client from "./client";
import type { MaintenanceEvent, MaintenanceFormValues, Tool } from "../../shared/types";

const RESOURCE = "/mantenimientos";

export interface MaintenanceMutationResponse {
  tool: Tool;
  event: MaintenanceEvent;
}

interface MaintenanceListFilters {
  toolId?: string;
  search?: string;
  from?: string;
  to?: string;
}

const buildQueryParams = (filters: MaintenanceListFilters = {}): Record<string, string> =>
  Object.entries(filters).reduce<Record<string, string>>((acc, [key, value]) => {
    if (value !== undefined && value !== null && String(value).trim() !== "") {
      acc[key] = String(value).trim();
    }
    return acc;
  }, {});

export const listMaintenances = async (filters: MaintenanceListFilters = {}): Promise<MaintenanceEvent[]> => {
  const response = await client.get<MaintenanceEvent[]>(RESOURCE, { params: buildQueryParams(filters) });
  return response.data ?? [];
};

export const createMaintenance = async (payload: MaintenanceFormValues): Promise<MaintenanceMutationResponse> => {
  const response = await client.post<MaintenanceMutationResponse>(RESOURCE, payload);
  return response.data;
};

export const completeMaintenance = async (toolId: string): Promise<MaintenanceMutationResponse> => {
  const response = await client.post<MaintenanceMutationResponse>(`${RESOURCE}/${toolId}/finalizar`);
  return response.data;
};
