import React from 'react';
import { FaDownload, FaPlus } from 'react-icons/fa';
import { Button } from '../../../shared/components/Button';

export const ToolsHeader = ({ onCreate, onReport }) => (
  <header className="ui-panel relative overflow-hidden px-6 py-6">
    <div className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,#2563eb,#0f766e,#22c55e)]" />
    <div className="relative flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
      <div className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[var(--text-muted)]">Herramientas</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--text-primary)]">Inventario y movimientos</h1>
        <p className="mt-3 text-sm leading-7 text-[var(--text-muted)]">
          Consulta el estado del inventario, filtra registros activos y ejecuta las acciones principales sin ruido visual.
        </p>
      </div>

      <div className="flex flex-wrap gap-3 xl:justify-end">
        <Button onClick={onCreate}>
          <FaPlus className="h-4 w-4" />
          Nueva herramienta
        </Button>
        <Button variant="success" onClick={onReport}>
          <FaDownload className="h-4 w-4" />
          Generar reporte
        </Button>
      </div>
    </div>
  </header>
);
