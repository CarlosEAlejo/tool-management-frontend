import client from "./client";
import type { Tool, ToolFiltersState, ToolFormValues } from "../../entities/tool/model";

const RESOURCE = "/herramientas";

const buildQueryParams = (filters: Partial<ToolFiltersState> = {}): Record<string, string> =>
  Object.entries(filters).reduce<Record<string, string>>((acc, [key, value]) => {
    if (value !== undefined && value !== null && value !== "" && value !== "all") {
      acc[key] = String(value);
    }
    return acc;
  }, {});

export const listTools = async (filters: Partial<ToolFiltersState> = {}): Promise<Tool[]> => {
  const response = await client.get<Tool[]>(RESOURCE, { params: buildQueryParams(filters) });
  return response.data ?? [];
};

export const getToolById = async (id: string): Promise<Tool> => {
  const response = await client.get<Tool>(`${RESOURCE}/${id}`);
  return response.data;
};

export const createTool = async (payload: ToolFormValues): Promise<Tool> => {
  const response = await client.post<Tool>(RESOURCE, payload);
  return response.data;
};

export const updateTool = async (id: string, payload: ToolFormValues): Promise<Tool> => {
  const response = await client.put<Tool>(`${RESOURCE}/${id}`, payload);
  return response.data;
};

export const deleteTool = async (id: string): Promise<void> => {
  await client.delete(`${RESOURCE}/${id}`);
};
