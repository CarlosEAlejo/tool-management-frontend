import React from "react";
import { FaPlus } from "react-icons/fa";
import { Button } from "../../../shared/components/Button";

interface WorkersHeaderProps {
  onCreate: () => void;
}

export const WorkersHeader = ({ onCreate }: WorkersHeaderProps) => (
  <header className="ui-panel relative overflow-hidden px-6 py-6">
    <div className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,#0f766e,#22c55e,#14b8a6)]" />
    <div className="relative flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
      <div className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[var(--text-muted)]">Personal</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--text-primary)]">Trabajadores y cargos</h1>
        <p className="mt-3 text-sm leading-7 text-[var(--text-muted)]">
          Administra el personal operativo y usa esta base para asignar responsables de herramientas.
        </p>
      </div>

      <div className="flex flex-wrap gap-3 xl:justify-end">
        <Button onClick={onCreate}>
          <FaPlus className="h-4 w-4" />
          Nuevo trabajador
        </Button>
      </div>
    </div>
  </header>
);
