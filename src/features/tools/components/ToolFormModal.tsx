import React, { useEffect, useState } from "react";
import type { FormEvent } from "react";
import type { Worker } from "../../../shared/types";
import { EMPTY_TOOL_FORM, TOOL_STATUS } from "../../../entities/tool/model";
import { Button } from "../../../shared/components/Button";
import { ModalShell } from "../../../shared/components/ModalShell";
import { ToolForm } from "./ToolForm";
import type { MutationResponse, Tool, ToolFormValues } from "../../../entities/tool/model";

interface ToolFormModalProps {
  isOpen: boolean;
  mode: "create" | "edit";
  tool?: Tool | null;
  workers: Worker[];
  error: string;
  isSaving: boolean;
  onClose: () => void;
  onSubmit: (tool: ToolFormValues | (Tool & ToolFormValues)) => Promise<MutationResponse<Tool>>;
  onClearError?: () => void;
}

export const ToolFormModal = ({ isOpen, mode, tool, workers, error, isSaving, onClose, onSubmit, onClearError }: ToolFormModalProps) => {
  const [formData, setFormData] = useState<ToolFormValues>(EMPTY_TOOL_FORM);
  const [localError, setLocalError] = useState("");

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setFormData(tool ? { ...EMPTY_TOOL_FORM, ...tool } : EMPTY_TOOL_FORM);
    setLocalError("");
    onClearError?.();
  }, [isOpen, tool, onClearError]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (formData.status === TOOL_STATUS.ASSIGNED && !formData.responsibleId) {
      setLocalError("Debes seleccionar un responsable existente en la lista de trabajadores.");
      return;
    }

    const payload = mode === "edit" && tool ? { ...tool, ...formData } : formData;
    const result = await onSubmit(payload);
    if (result.ok) {
      onClose();
    }
  };

  const visibleError = localError || error;

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={onClose}
      title={mode === "edit" ? "Editar herramienta" : "Agregar nueva herramienta"}
      footer={
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" form="tool-form" disabled={isSaving}>
            {isSaving ? "Guardando..." : "Guardar herramienta"}
          </Button>
        </div>
      }
    >
      {visibleError ? <div className="ui-error mb-5">{visibleError}</div> : null}
      <form id="tool-form" onSubmit={handleSubmit}>
        <ToolForm
          value={formData}
          mode={mode}
          workers={workers}
          onChange={(next) => {
            setLocalError("");
            setFormData(next);
          }}
        />
      </form>
    </ModalShell>
  );
};
