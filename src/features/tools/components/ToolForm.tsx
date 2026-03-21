import React from "react";
import type { ChangeEvent } from "react";
import {
  EMPTY_TOOL_FORM,
  TOOL_CREATE_STATUS_OPTIONS,
  TOOL_EDITABLE_STATUS_OPTIONS,
  TOOL_STATUS,
  TOOL_TYPE_OPTIONS,
} from "../../../entities/tool/model";
import { CheckboxField, SelectField, TextField, TextareaField } from "../../../shared/components/form/Field";
import type { ToolFormValues } from "../../../entities/tool/model";

interface ToolFormProps {
  value?: ToolFormValues;
  mode: "create" | "edit";
  onChange: (value: ToolFormValues) => void;
}

export const ToolForm = ({ value = EMPTY_TOOL_FORM, mode, onChange }: ToolFormProps) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value: nextValue, type } = event.target;
    const checked = "checked" in event.target ? event.target.checked : false;
    onChange({
      ...value,
      [name]: type === "checkbox" ? checked : nextValue,
    });
  };

  const statusOptions = mode === "create" ? TOOL_CREATE_STATUS_OPTIONS : TOOL_EDITABLE_STATUS_OPTIONS;
  const requiresAssignment = value.status === TOOL_STATUS.ASSIGNED;
  const requiresMaintenance = value.status === TOOL_STATUS.MAINTENANCE;
  const isDamaged = value.status === TOOL_STATUS.DAMAGED;

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <TextField label="Codigo de Herramienta*" name="code" required value={value.code} onChange={handleChange} />
      <TextField label="Nombre*" name="name" required value={value.name} onChange={handleChange} />
      <SelectField label="Tipo*" name="type" options={TOOL_TYPE_OPTIONS} value={value.type} onChange={handleChange} />
      <SelectField label="Estado*" name="status" options={statusOptions} value={value.status} onChange={handleChange} />

      {requiresAssignment ? (
        <>
          <TextField label="Responsable*" name="responsible" required value={value.responsible} onChange={handleChange} />
          <TextField label="Fecha de Asignacion*" name="assignmentDate" type="date" required value={value.assignmentDate} onChange={handleChange} />
        </>
      ) : null}

      {requiresMaintenance ? (
        <>
          <TextField label="Fecha del Mantenimiento*" name="dateMaintenance" type="date" required value={value.dateMaintenance} onChange={handleChange} />
          <TextField label="Fecha Proximo Mantenimiento*" name="nextMaintenance" type="date" required value={value.nextMaintenance} onChange={handleChange} />
        </>
      ) : null}

      <TextField label="Ubicacion/Almacen*" name="location" required value={value.location} onChange={handleChange} />

      {isDamaged ? <CheckboxField label="Deterioro" name="deterioration" checked={value.deterioration} onChange={handleChange} /> : null}

      <div className="md:col-span-2">
        <TextareaField label="Notas/Comentarios" name="notes" rows={3} value={value.notes} onChange={handleChange} />
      </div>
    </div>
  );
};
