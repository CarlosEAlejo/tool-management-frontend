import React from "react";
import { getWorkerFullName } from "../../../entities/worker/model";
import type { Worker } from "../../../entities/worker/model";
import { WorkerRow } from "./WorkerRow";

interface WorkerTableProps {
  workers: Worker[];
  onEdit: (worker: Worker) => void;
  onDelete: (worker: Worker) => void;
}

export const WorkerTable = ({ workers, onEdit, onDelete }: WorkerTableProps) => (
  <section className="space-y-4">
    <div className="flex items-center justify-between gap-3">
      <div>
        <h2 className="text-lg font-semibold text-[var(--text-primary)]">Equipo registrado</h2>
        <p className="text-sm text-[var(--text-muted)]">Listado de trabajadores disponibles para asignaciones.</p>
      </div>
    </div>

    {workers.length > 0 ? (
      <div className="grid gap-4 md:hidden">
        {workers.map((worker) => (
          <article key={worker.id} className="ui-card">
            <div>
              <p className="text-lg font-semibold text-[var(--text-primary)]">{getWorkerFullName(worker)}</p>
              <p className="mt-1 text-sm text-[var(--text-muted)]">{worker.position}</p>
            </div>
            <dl className="mt-4 grid grid-cols-1 gap-2 text-sm">
              <div>
                <dt className="text-[var(--text-muted)]">Correo</dt>
                <dd className="font-medium text-[var(--text-secondary)]">{worker.email || "-"}</dd>
              </div>
              <div>
                <dt className="text-[var(--text-muted)]">Telefono</dt>
                <dd className="font-medium text-[var(--text-secondary)]">{worker.phone || "-"}</dd>
              </div>
            </dl>
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-base)] px-4 py-2 text-sm font-medium text-[var(--text-primary)] transition hover:border-[var(--border-accent)] hover:bg-[var(--surface-accent)]"
                onClick={() => onEdit(worker)}
              >
                Editar
              </button>
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-medium text-rose-600 transition hover:bg-rose-500/10 dark:text-rose-300"
                onClick={() => onDelete(worker)}
              >
                Eliminar
              </button>
            </div>
          </article>
        ))}
      </div>
    ) : null}

    <div className="ui-table-shell hidden md:block">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-[var(--border-subtle)]">
          <thead className="bg-[var(--surface-muted)]/70">
            <tr>
              {["Nombre y apellidos", "Cargo", "Correo", "Telefono", "Acciones"].map((header) => (
                <th
                  key={header}
                  className={`whitespace-nowrap px-6 py-4 align-middle text-xs font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)] ${
                    header === "Acciones" ? "w-28 text-center" : "text-left"
                  }`}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-subtle)] bg-transparent">
            {workers.length > 0 ? (
              workers.map((worker) => (
                <WorkerRow key={worker.id} worker={worker} onEdit={() => onEdit(worker)} onDelete={() => onDelete(worker)} />
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-14 text-center">
                  <p className="text-base font-medium text-[var(--text-primary)]">No hay trabajadores registrados.</p>
                  <p className="mt-2 text-sm text-[var(--text-muted)]">Agrega personal para usarlo en asignaciones.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>

    {workers.length === 0 ? (
      <div className="ui-card md:hidden">
        <p className="text-base font-medium text-[var(--text-primary)]">No hay trabajadores registrados.</p>
        <p className="mt-2 text-sm text-[var(--text-muted)]">Agrega personal para usarlo en asignaciones.</p>
      </div>
    ) : null}
  </section>
);
