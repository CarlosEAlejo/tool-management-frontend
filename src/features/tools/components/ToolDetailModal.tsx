import React from "react";
import type { ReactNode } from "react";
import { getStatusMeta, getTypeLabel } from "../../../entities/tool/model";
import { Button } from "../../../shared/components/Button";
import { ModalShell } from "../../../shared/components/ModalShell";
import { formatDate } from "../../../shared/lib/date";
import type { AssignmentHistoryEntry, MaintenanceRecordEntry, Tool } from "../../../shared/types";

interface ToolDetailModalProps {
  tool: Tool | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
}

interface DetailItemProps {
  label: string;
  value: string;
}

interface HistoryListProps<T> {
  title: string;
  items: T[];
  renderItem: (item: T) => ReactNode;
  emptyMessage: string;
}

export const ToolDetailModal = ({ tool, isOpen, onClose, onEdit }: ToolDetailModalProps) => {
  if (!tool) {
    return null;
  }

  const status = getStatusMeta(tool.status);

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={onClose}
      title="Detalle de herramienta"
      footer={
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose}>
            Cerrar
          </Button>
          <Button onClick={onEdit}>Editar</Button>
        </div>
      }
    >
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <DetailItem label="Codigo" value={tool.code} />
        <DetailItem label="Nombre" value={tool.name} />
        <DetailItem label="Tipo" value={getTypeLabel(tool.type)} />
        <div>
          <h3 className="text-sm font-medium text-[var(--text-muted)]">Estado</h3>
          <span className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${status.badgeClassName}`}>{status.label}</span>
        </div>
        <DetailItem label="Responsable" value={tool.responsible || "-"} />
        <DetailItem label="Fecha asignacion" value={formatDate(tool.assignmentDate)} />
        <DetailItem label="Ultimo mantenimiento" value={formatDate(tool.dateMaintenance)} />
        <DetailItem label="Proximo mantenimiento" value={formatDate(tool.nextMaintenance)} />
        <DetailItem label="Ubicacion/Almacen" value={tool.location || "-"} />
      </div>

      <div className="mt-8 rounded-[1.5rem] border border-[var(--border-subtle)] bg-[var(--surface-muted)]/45 p-5">
        <h3 className="text-sm font-medium text-[var(--text-muted)]">Notas/Comentarios</h3>
        <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">{tool.notes || "-"}</p>
      </div>

      <HistoryList<AssignmentHistoryEntry>
        title="Historial de asignaciones"
        items={tool.assignmentHistory}
        renderItem={(item) => `${item.responsible} - ${formatDate(item.assignmentDate)}`}
        emptyMessage="No hay historial de asignaciones"
      />

      <HistoryList<MaintenanceRecordEntry>
        title="Registro de mantenimiento"
        items={tool.maintenanceRecord}
        renderItem={(item) => `${formatDate(item.dateMaintenance)} -> ${formatDate(item.nextMaintenance)}`}
        emptyMessage="No hay registros de mantenimiento"
      />
    </ModalShell>
  );
};

const DetailItem = ({ label, value }: DetailItemProps) => (
  <div className="rounded-[1.35rem] border border-[var(--border-subtle)] bg-[var(--surface-base)]/80 p-4">
    <h3 className="text-sm font-medium text-[var(--text-muted)]">{label}</h3>
    <p className="mt-2 text-lg font-semibold text-[var(--text-primary)]">{value}</p>
  </div>
);

const HistoryList = <T,>({ title, items, renderItem, emptyMessage }: HistoryListProps<T>) => {
  const safeItems = Array.isArray(items) ? items : [];

  return (
    <div className="mt-8">
      <h3 className="mb-3 text-lg font-semibold text-[var(--text-primary)]">{title}</h3>
      {safeItems.length > 0 ? (
        <ul className="space-y-3">
          {safeItems.map((item, index) => (
            <li key={`${title}-${index}`} className="rounded-[1.25rem] border border-[var(--border-subtle)] bg-[var(--surface-base)]/70 p-4 text-sm text-[var(--text-secondary)]">
              {renderItem(item)}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-[var(--text-muted)]">{emptyMessage}</p>
      )}
    </div>
  );
};
