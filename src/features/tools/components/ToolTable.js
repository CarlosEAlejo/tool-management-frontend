import React from 'react';
import { getStatusMeta, getTypeLabel } from '../../../entities/tool/model';
import { formatDate } from '../../../shared/lib/date';
import { ToolRow } from './ToolRow';

export const ToolTable = ({ tools, onView, onEdit, onDelete }) => (
  <section className="space-y-4">
    <div className="flex items-center justify-between gap-3">
      <div>
        <h2 className="text-lg font-semibold text-[var(--text-primary)]">Listado operativo</h2>
        <p className="text-sm text-[var(--text-muted)]">Vista detallada de registros y acciones disponibles.</p>
      </div>
    </div>

    {tools.length > 0 ? (
      <div className="grid gap-4 md:hidden">
        {tools.map((tool) => {
          const status = getStatusMeta(tool.status);
          return (
            <article key={tool.id} className="ui-card">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--text-muted)]">{tool.code}</p>
                  <h3 className="mt-2 text-lg font-semibold text-[var(--text-primary)]">{tool.name}</h3>
                </div>
                <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${status.badgeClassName}`}>{status.label}</span>
              </div>

              <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <dt className="text-[var(--text-muted)]">Tipo</dt>
                  <dd className="mt-1 font-medium text-[var(--text-secondary)]">{getTypeLabel(tool.type)}</dd>
                </div>
                <div>
                  <dt className="text-[var(--text-muted)]">Responsable</dt>
                  <dd className="mt-1 font-medium text-[var(--text-secondary)]">{tool.responsible || '-'}</dd>
                </div>
                <div className="col-span-2">
                  <dt className="text-[var(--text-muted)]">Fecha asignacion</dt>
                  <dd className="mt-1 font-medium text-[var(--text-secondary)]">{formatDate(tool.assignmentDate)}</dd>
                </div>
              </dl>

              <div className="mt-5 grid grid-cols-[1.3fr_1fr_auto] gap-2">
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#2563eb,#0f766e)] px-4 py-2 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(37,99,235,0.2)] transition hover:brightness-105"
                  onClick={() => onView(tool)}
                >
                  Ver detalle
                </button>
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-base)] px-4 py-2 text-sm font-medium text-[var(--text-primary)] transition hover:border-[var(--border-accent)] hover:bg-[var(--surface-accent)]"
                  onClick={() => onEdit(tool)}
                >
                  Editar
                </button>
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-2xl px-3 py-2 text-sm font-medium text-rose-600 transition hover:bg-rose-500/10 dark:text-rose-300"
                  onClick={() => onDelete(tool)}
                >
                  Eliminar
                </button>
              </div>
            </article>
          );
        })}
      </div>
    ) : null}

    <div className="ui-table-shell hidden md:block">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-[var(--border-subtle)]">
          <thead className="bg-[var(--surface-muted)]/70">
            <tr>
              {['Codigo', 'Nombre', 'Tipo', 'Estado', 'Responsable', 'Fecha asignacion', 'Acciones'].map((header) => (
                <th key={header} className="whitespace-nowrap px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-subtle)] bg-transparent">
            {tools.length > 0 ? (
              tools.map((tool) => (
                <ToolRow
                  key={tool.id}
                  tool={tool}
                  onView={() => onView(tool)}
                  onEdit={() => onEdit(tool)}
                  onDelete={() => onDelete(tool)}
                />
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-6 py-14 text-center">
                  <p className="text-base font-medium text-[var(--text-primary)]">No hay herramientas para los filtros seleccionados.</p>
                  <p className="mt-2 text-sm text-[var(--text-muted)]">Ajusta los filtros o registra una nueva herramienta.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>

    {tools.length === 0 ? (
      <div className="ui-card md:hidden">
        <p className="text-base font-medium text-[var(--text-primary)]">No hay herramientas para los filtros seleccionados.</p>
        <p className="mt-2 text-sm text-[var(--text-muted)]">Ajusta los filtros o registra una nueva herramienta.</p>
      </div>
    ) : null}
  </section>
);
