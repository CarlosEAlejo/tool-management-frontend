import type { AxiosError } from "axios";
import type { MutationResponse, Worker, WorkerFormValues } from "../../shared/types";

export const EMPTY_WORKER_FORM: WorkerFormValues = {
  firstName: "",
  lastName: "",
  position: "",
  email: "",
  phone: "",
  notes: "",
};

export const getWorkerFullName = (worker: Pick<Worker, "firstName" | "lastName">): string =>
  `${worker.firstName} ${worker.lastName}`.trim();

export const sanitizeWorkerPayload = (worker: Partial<WorkerFormValues>): WorkerFormValues => ({
  ...EMPTY_WORKER_FORM,
  ...worker,
  firstName: worker.firstName?.trim() ?? "",
  lastName: worker.lastName?.trim() ?? "",
  position: worker.position?.trim() ?? "",
  email: worker.email?.trim().toLowerCase() ?? "",
  phone: worker.phone?.trim() ?? "",
  notes: worker.notes?.trim() ?? "",
});

export const getWorkerApiErrorMessage = (error: unknown, fallbackMessage: string): string => {
  const apiError = error as AxiosError<{ code?: string; message?: string }>;

  if (error instanceof Error) {
    return apiError.response?.data?.message || error.message || fallbackMessage;
  }

  return fallbackMessage;
};

export type { MutationResponse, Worker, WorkerFormValues };
