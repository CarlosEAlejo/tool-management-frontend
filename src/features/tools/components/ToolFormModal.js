import React, { useEffect, useState } from 'react';
import { EMPTY_TOOL_FORM } from '../../../entities/tool/model';
import { Button } from '../../../shared/components/Button';
import { ModalShell } from '../../../shared/components/ModalShell';
import { ToolForm } from './ToolForm';

export const ToolFormModal = ({ isOpen, mode, tool, error, isSaving, onClose, onSubmit, onClearError }) => {
  const [formData, setFormData] = useState(EMPTY_TOOL_FORM);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setFormData(tool ? { ...EMPTY_TOOL_FORM, ...tool } : EMPTY_TOOL_FORM);
    onClearError?.();
  }, [isOpen, tool, onClearError]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const result = await onSubmit(formData);
    if (result?.ok) {
      onClose();
    }
  };

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'edit' ? 'Editar Herramienta' : 'Agregar Nueva Herramienta'}
      footer={
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" form="tool-form" disabled={isSaving}>
            {isSaving ? 'Guardando...' : 'Guardar Herramienta'}
          </Button>
        </div>
      }
    >
      {error ? <div className="mb-4 rounded-lg bg-rose-100 px-4 py-3 text-sm text-rose-700">{error}</div> : null}
      <form id="tool-form" onSubmit={handleSubmit}>
        <ToolForm value={formData} mode={mode} onChange={setFormData} />
      </form>
    </ModalShell>
  );
};
