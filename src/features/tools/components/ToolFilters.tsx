import React from "react";
import type { ChangeEvent } from "react";
import { TOOL_STATUS_OPTIONS } from "../../../entities/tool/model";
import { SearchableSelectField, SelectField, TextField } from "../../../shared/components/form/Field";
import type { ToolFilterStatus } from "../../../shared/types";

interface ToolFiltersProps {
  search: string;
  status: ToolFilterStatus;
  responsible: string;
  responsibleOptions: string[];
  onSearchChange: (value: string) => void;
  onStatusChange: (value: ToolFilterStatus) => void;
  onResponsibleChange: (value: string) => void;
}

export const ToolFilters = ({
  search,
  status,
  responsible,
  responsibleOptions,
  onSearchChange,
  onStatusChange,
  onResponsibleChange,
}: ToolFiltersProps) => (
  <div className="ui-panel px-5 py-5">
    <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
      <div>
        <p className="text-lg font-semibold text-[var(--text-primary)]">Filtros operativos</p>
        <p className="text-sm text-[var(--text-muted)]">Refina la tabla por nombre, estado o responsable activo.</p>
      </div>
    </div>

    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <TextField
        label="Buscar herramienta"
        name="search"
        placeholder="Nombre o codigo..."
        value={search}
        onChange={(event: ChangeEvent<HTMLInputElement>) => onSearchChange(event.target.value)}
      />
      <SelectField
        label="Estado"
        name="status"
        options={TOOL_STATUS_OPTIONS}
        value={status}
        onChange={(event: ChangeEvent<HTMLSelectElement>) => onStatusChange(event.target.value as ToolFilterStatus)}
      />
      <SearchableSelectField
        label="Responsable"
        name="responsible-filter"
        value={responsible}
        placeholder="Filtrar por trabajador"
        options={responsibleOptions.map((item) => ({ value: item, label: item }))}
        onValueChange={onResponsibleChange}
      />
    </div>
  </div>
);

