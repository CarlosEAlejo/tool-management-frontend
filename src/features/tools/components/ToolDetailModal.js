import React from 'react';
import { getStatusMeta, getTypeLabel } from '../../../entities/tool/model';
import { Button } from '../../../shared/components/Button';
import { ModalShell } from '../../../shared/components/ModalShell';
import { formatDate } from '../../../shared/lib/date';

export const ToolDetailModal = ({ tool, isOpen, onClose, onEdit }) => {
  if (!tool) {
    return null;
  }

  const status = getStatusMeta(tool.status);

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={onClose}
      title="Detalle de Herramienta"
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
          <h3 className="text-sm font-medium text-slate-500">Estado</h3>
          <span className={`mt-1 inline-flex rounded-full px-2 py-1 text-xs font-semibold ${status.badgeClassName}`}>{status.label}</span>
        </div>
        <DetailItem label="Responsable" value={tool.responsible || '-'} />
        <DetailItem label="Fecha Asignacion" value={formatDate(tool.assignmentDate)} />
        <DetailItem label="Ultimo Mantenimiento" value={formatDate(tool.dateMaintenance)} />
        <DetailItem label="Proximo Mantenimiento" value={formatDate(tool.nextMaintenance)} />
        <DetailItem label="Ubicacion/Almacen" value={tool.location || '-'} />
      </div>

      <div className="mt-6">
        <h3 className="text-sm font-medium text-slate-500">Notas/Comentarios</h3>
        <p className="mt-1 text-slate-700">{tool.notes || '-'}</p>
      </div>

      <HistoryList
        title="Historial de Asignaciones"
        items={tool.assignmentHistory}
        renderItem={(item) => `${item.responsible} - ${formatDate(item.assignmentDate)}`}
        emptyMessage="No hay historial de asignaciones"
      />

      <HistoryList
        title="Registro de Mantenimiento"
        items={tool.maintenanceRecord}
        renderItem={(item) => `${formatDate(item.dateMaintenance)} -> ${formatDate(item.nextMaintenance)}`}
        emptyMessage="No hay registros de mantenimiento"
      />
    </ModalShell>
  );
};

const DetailItem = ({ label, value }) => (
  <div>
    <h3 className="text-sm font-medium text-slate-500">{label}</h3>
    <p className="mt-1 text-lg font-medium text-slate-900">{value}</p>
  </div>
);

const HistoryList = ({ title, items, renderItem, emptyMessage }) => {
  const safeItems = Array.isArray(items) ? items : [];

  return (
    <div className="mt-6">
      <h3 className="mb-2 text-lg font-semibold text-slate-800">{title}</h3>
      {safeItems.length > 0 ? (
        <ul className="space-y-2">
          {safeItems.map((item, index) => (
            <li key={`${title}-${index}`} className="rounded-lg border border-slate-200 p-3 text-sm text-slate-700">
              {renderItem(item)}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-slate-500">{emptyMessage}</p>
      )}
    </div>
  );
};
