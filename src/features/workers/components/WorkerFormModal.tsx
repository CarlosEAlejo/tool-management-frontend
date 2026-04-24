import React, { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { EMPTY_WORKER_FORM } from "../../../entities/worker/model";
import type { MutationResponse, Worker, WorkerFormValues } from "../../../entities/worker/model";
import { Button } from "../../../shared/components/Button";
import { ModalShell } from "../../../shared/components/ModalShell";
import { WorkerForm } from "./WorkerForm";

interface WorkerFormModalProps {
  isOpen: boolean;
  mode: "create" | "edit";
  worker?: Worker | null;
  error: string;
  isSaving: boolean;
  onClose: () => void;
  onSubmit: (worker: WorkerFormValues | Worker) => Promise<MutationResponse<Worker>>;
  onClearError?: () => void;
}

export const WorkerFormModal = ({
  isOpen,
  mode,
  worker,
  error,
  isSaving,
  onClose,
  onSubmit,
  onClearError,
}: WorkerFormModalProps) => {
  const [formData, setFormData] = useState<WorkerFormValues>(EMPTY_WORKER_FORM);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setFormData(worker ? { ...EMPTY_WORKER_FORM, ...worker } : EMPTY_WORKER_FORM);
    onClearError?.();
  }, [isOpen, worker, onClearError]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const payload = mode === "edit" && worker ? { ...worker, ...formData } : formData;
    const result = await onSubmit(payload);
    if (result.ok) {
      onClose();
    }
  };

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={onClose}
      title={mode === "edit" ? "Editar trabajador" : "Agregar trabajador"}
      footer={
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" form="worker-form" disabled={isSaving}>
            {isSaving ? "Guardando..." : "Guardar trabajador"}
          </Button>
        </div>
      }
    >
      {error ? <div className="ui-error mb-5">{error}</div> : null}
      <form id="worker-form" onSubmit={handleSubmit}>
        <WorkerForm value={formData} onChange={setFormData} />
      </form>
    </ModalShell>
  );
};
