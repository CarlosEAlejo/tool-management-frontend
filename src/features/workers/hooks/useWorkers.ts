import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getWorkerApiErrorMessage, sanitizeWorkerPayload } from "../../../entities/worker/model";
import { createWorker, deleteWorker, listWorkers, updateWorker } from "../../../services/api/workersService";
import { queryKeys } from "../../../services/query/queryKeys";
import type { MutationResponse, Worker, WorkerFormValues } from "../../../entities/worker/model";

export const useWorkers = () => {
  const queryClient = useQueryClient();
  const [mutationError, setMutationError] = useState("");

  const workersQuery = useQuery({
    queryKey: queryKeys.workers.list(),
    queryFn: () => listWorkers(),
  });

  const clearMutationError = () => setMutationError("");

  const createMutation = useMutation({
    mutationFn: async (worker: WorkerFormValues) => createWorker(sanitizeWorkerPayload(worker)),
    onMutate: clearMutationError,
    onSuccess: (created) => {
      queryClient.setQueryData<Worker[]>(queryKeys.workers.list(), (previous = []) => [...previous, created]);
    },
    onError: (error) => {
      setMutationError(getWorkerApiErrorMessage(error, "No se pudo crear el trabajador"));
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (worker: Worker) => updateWorker(worker.id, sanitizeWorkerPayload(worker)),
    onMutate: clearMutationError,
    onSuccess: (updated) => {
      queryClient.setQueryData<Worker[]>(queryKeys.workers.list(), (previous = []) =>
        previous.map((item) => (item.id === updated.id ? updated : item))
      );
    },
    onError: (error) => {
      setMutationError(getWorkerApiErrorMessage(error, "No se pudo actualizar el trabajador"));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await deleteWorker(id);
      return id;
    },
    onMutate: clearMutationError,
    onSuccess: (id) => {
      queryClient.setQueryData<Worker[]>(queryKeys.workers.list(), (previous = []) => previous.filter((item) => item.id !== id));
    },
    onError: (error) => {
      setMutationError(getWorkerApiErrorMessage(error, "No se pudo eliminar el trabajador"));
    },
  });

  const refresh = async (): Promise<void> => {
    await queryClient.invalidateQueries({ queryKey: queryKeys.workers.all });
  };

  const create = async (worker: WorkerFormValues): Promise<MutationResponse<Worker>> => {
    try {
      const created = await createMutation.mutateAsync(worker);
      return { ok: true, data: created };
    } catch {
      return { ok: false, error: mutationError || "No se pudo crear el trabajador" };
    }
  };

  const update = async (worker: Worker): Promise<MutationResponse<Worker>> => {
    try {
      const updated = await updateMutation.mutateAsync(worker);
      return { ok: true, data: updated };
    } catch {
      return { ok: false, error: mutationError || "No se pudo actualizar el trabajador" };
    }
  };

  const remove = async (id: string): Promise<MutationResponse<null>> => {
    try {
      await deleteMutation.mutateAsync(id);
      return { ok: true, data: null };
    } catch {
      return { ok: false, error: mutationError || "No se pudo eliminar el trabajador" };
    }
  };

  return {
    workers: workersQuery.data ?? [],
    loading: workersQuery.isLoading,
    error: workersQuery.error ? getWorkerApiErrorMessage(workersQuery.error, "No se pudo cargar el personal") : "",
    mutationError,
    isSaving: createMutation.isPending || updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    refresh,
    create,
    update,
    remove,
    clearMutationError,
  };
};
