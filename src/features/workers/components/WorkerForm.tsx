import React from "react";
import type { ChangeEvent } from "react";
import { TextField, TextareaField } from "../../../shared/components/form/Field";
import { EMPTY_WORKER_FORM } from "../../../entities/worker/model";
import type { WorkerFormValues } from "../../../entities/worker/model";

interface WorkerFormProps {
  value?: WorkerFormValues;
  onChange: (value: WorkerFormValues) => void;
}

export const WorkerForm = ({ value = EMPTY_WORKER_FORM, onChange }: WorkerFormProps) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value: nextValue } = event.target;
    onChange({
      ...value,
      [name]: nextValue,
    });
  };

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <TextField label="Nombre*" name="firstName" required value={value.firstName} onChange={handleChange} />
      <TextField label="Apellidos*" name="lastName" required value={value.lastName} onChange={handleChange} />
      <TextField label="Cargo*" name="position" required value={value.position} onChange={handleChange} />
      <TextField label="Correo" name="email" type="email" value={value.email} onChange={handleChange} />
      <TextField label="Telefono" name="phone" value={value.phone} onChange={handleChange} />
      <div className="md:col-span-2">
        <TextareaField label="Notas" name="notes" rows={3} value={value.notes} onChange={handleChange} />
      </div>
    </div>
  );
};
