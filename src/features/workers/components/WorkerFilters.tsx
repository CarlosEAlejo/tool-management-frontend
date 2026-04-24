import React from "react";
import type { ChangeEvent } from "react";
import { TextField } from "../../../shared/components/form/Field";

interface WorkerFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
}

export const WorkerFilters = ({ search, onSearchChange }: WorkerFiltersProps) => (
  <div className="ui-panel px-5 py-5">
    <div className="mb-5">
      <p className="text-lg font-semibold text-[var(--text-primary)]">Filtros de personal</p>
      <p className="text-sm text-[var(--text-muted)]">Busca por nombre, apellido, cargo o correo.</p>
    </div>

    <div className="grid grid-cols-1 gap-4">
      <TextField
        label="Buscar trabajador"
        name="search-worker"
        placeholder="Nombre, apellido, cargo o correo"
        value={search}
        onChange={(event: ChangeEvent<HTMLInputElement>) => onSearchChange(event.target.value)}
      />
    </div>
  </div>
);
