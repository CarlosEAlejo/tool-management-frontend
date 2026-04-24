import client from "./client";
import type { Worker, WorkerFormValues } from "../../shared/types";

const RESOURCE = "/trabajadores";

export const listWorkers = async (search = ""): Promise<Worker[]> => {
  const response = await client.get<Worker[]>(RESOURCE, {
    params: search.trim() ? { search: search.trim() } : undefined,
  });
  return response.data ?? [];
};

export const getWorkerById = async (id: string): Promise<Worker> => {
  const response = await client.get<Worker>(`${RESOURCE}/${id}`);
  return response.data;
};

export const createWorker = async (payload: WorkerFormValues): Promise<Worker> => {
  const response = await client.post<Worker>(RESOURCE, payload);
  return response.data;
};

export const updateWorker = async (id: string, payload: WorkerFormValues): Promise<Worker> => {
  const response = await client.put<Worker>(`${RESOURCE}/${id}`, payload);
  return response.data;
};

export const deleteWorker = async (id: string): Promise<void> => {
  await client.delete(`${RESOURCE}/${id}`);
};
