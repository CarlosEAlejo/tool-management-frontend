import { useEffect, useState } from "react";
import { getWorkerApiErrorMessage, sanitizeWorkerPayload } from "../../../entities/worker/model";
import { createWorker, deleteWorker, listWorkers, updateWorker } from "../../../services/api/workersService";
import type { MutationResponse, Worker, WorkerFormValues } from "../../../entities/worker/model";

export const useWorkers = () => {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mutationError, setMutationError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const clearMutationError = () => setMutationError("");

  const refresh = async (search = ""): Promise<void> => {
    setLoading(true);
    setError("");
    try {
      const nextWorkers = await listWorkers(search);
      setWorkers(Array.isArray(nextWorkers) ? nextWorkers : []);
    } catch (err) {
      setError(getWorkerApiErrorMessage(err, "No se pudo cargar el personal"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refresh();
  }, []);

  const create = async (worker: WorkerFormValues): Promise<MutationResponse<Worker>> => {
    setIsSaving(true);
    clearMutationError();
    try {
      const created = await createWorker(sanitizeWorkerPayload(worker));
      setWorkers((prev) => [...prev, created]);
      return { ok: true, data: created };
    } catch (err) {
      const message = getWorkerApiErrorMessage(err, "No se pudo crear el trabajador");
      setMutationError(message);
      return { ok: false, error: message };
    } finally {
      setIsSaving(false);
    }
  };

  const update = async (worker: Worker): Promise<MutationResponse<Worker>> => {
    setIsSaving(true);
    clearMutationError();
    try {
      const updated = await updateWorker(worker.id, sanitizeWorkerPayload(worker));
      setWorkers((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
      return { ok: true, data: updated };
    } catch (err) {
      const message = getWorkerApiErrorMessage(err, "No se pudo actualizar el trabajador");
      setMutationError(message);
      return { ok: false, error: message };
    } finally {
      setIsSaving(false);
    }
  };

  const remove = async (id: string): Promise<MutationResponse<null>> => {
    setIsDeleting(true);
    clearMutationError();
    try {
      await deleteWorker(id);
      setWorkers((prev) => prev.filter((item) => item.id !== id));
      return { ok: true, data: null };
    } catch (err) {
      const message = getWorkerApiErrorMessage(err, "No se pudo eliminar el trabajador");
      setMutationError(message);
      return { ok: false, error: message };
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    workers,
    loading,
    error,
    mutationError,
    isSaving,
    isDeleting,
    refresh,
    create,
    update,
    remove,
    clearMutationError,
  };
};
