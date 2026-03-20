import React from 'react';
import { TOOL_STATUS_OPTIONS } from '../../../entities/tool/model';
import { SelectField, TextField } from '../../../shared/components/form/Field';

export const ToolFilters = ({
  search,
  status,
  responsible,
  responsibles,
  onSearchChange,
  onStatusChange,
  onResponsibleChange,
}) => (
  <div className="mb-6 rounded-xl bg-white p-4 shadow">
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <TextField
        label="Buscar Herramienta"
        name="search"
        placeholder="Nombre o codigo..."
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
      />
      <SelectField
        label="Estado"
        name="status"
        options={TOOL_STATUS_OPTIONS}
        value={status}
        onChange={(event) => onStatusChange(event.target.value)}
      />
      <SelectField
        label="Responsable"
        name="responsible"
        options={[
          { value: 'all', label: 'Todos' },
          ...responsibles.map((item) => ({ value: item, label: item })),
        ]}
        value={responsible}
        onChange={(event) => onResponsibleChange(event.target.value)}
      />
    </div>
  </div>
);
