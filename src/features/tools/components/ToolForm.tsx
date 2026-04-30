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

    if (name === "price") {
      const parsedPrice = Number(nextValue);
      onChange({
        ...value,
        price: Number.isFinite(parsedPrice) && parsedPrice >= 0 ? parsedPrice : 0,
      });
      return;
    }

    onChange({
      ...value,
      [name]: type === "checkbox" ? checked : nextValue,
    });
  };

  const editableStatusOptions = TOOL_EDITABLE_STATUS_OPTIONS.filter(
    (option) => option.value !== TOOL_STATUS.ASSIGNED && option.value !== TOOL_STATUS.MAINTENANCE
  );

  const statusOptions =
    mode === "create"
      ? TOOL_CREATE_STATUS_OPTIONS
      : value.status === TOOL_STATUS.ASSIGNED
        ? [{ value: TOOL_STATUS.ASSIGNED, label: "Asignada (gestionada en Asignaciones)" }]
        : value.status === TOOL_STATUS.MAINTENANCE
          ? [{ value: TOOL_STATUS.MAINTENANCE, label: "Mantenimiento (gestionado en Mantenimiento)" }]
          : editableStatusOptions;

  const statusDisabled = mode === "edit" && (value.status === TOOL_STATUS.ASSIGNED || value.status === TOOL_STATUS.MAINTENANCE);
  const isDamaged = value.status === TOOL_STATUS.DAMAGED;

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <TextField label="Codigo de Herramienta*" name="code" required value={value.code} onChange={handleChange} />
      <TextField label="Nombre*" name="name" required value={value.name} onChange={handleChange} />
      <SelectField label="Tipo*" name="type" options={TOOL_TYPE_OPTIONS} value={value.type} onChange={handleChange} />
      <SelectField label="Estado*" name="status" options={statusOptions} value={value.status} onChange={handleChange} disabled={statusDisabled} />

      <TextField label="Fecha de compra" name="purchaseDate" type="date" value={value.purchaseDate} onChange={handleChange} />
      <TextField label="Precio" name="price" type="number" min={0} step="0.01" value={String(value.price)} onChange={handleChange} />
      <TextField label="Ubicacion/Almacen*" name="location" required value={value.location} onChange={handleChange} />

      {isDamaged ? <CheckboxField label="Deterioro" name="deterioration" checked={value.deterioration} onChange={handleChange} /> : null}

      <div className="md:col-span-2">
        <TextareaField label="Notas/Comentarios" name="notes" rows={3} value={value.notes} onChange={handleChange} />
      </div>
    </div>
  );
};
