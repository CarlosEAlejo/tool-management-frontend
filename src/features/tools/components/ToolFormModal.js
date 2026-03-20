import React, { useEffect, useState } from 'react';
import { EMPTY_TOOL_FORM } from '../../../entities/tool/model';
import { Button } from '../../../shared/components/Button';
import { ModalShell } from '../../../shared/components/ModalShell';
import { ToolForm } from './ToolForm';

export const ToolFormModal = ({ isOpen, mode, tool, onClose, onSubmit }) => {
  const [formData, setFormData] = useState(EMPTY_TOOL_FORM);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setFormData(tool ? { ...EMPTY_TOOL_FORM, ...tool } : EMPTY_TOOL_FORM);
  }, [isOpen, tool]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    await onSubmit(formData);
    onClose();
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
          <Button type="submit" form="tool-form">
            Guardar Herramienta
          </Button>
        </div>
      }
    >
      <form id="tool-form" onSubmit={handleSubmit}>
        <ToolForm value={formData} mode={mode} onChange={setFormData} />
      </form>
    </ModalShell>
  );
};
