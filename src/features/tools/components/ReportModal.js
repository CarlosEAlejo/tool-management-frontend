import React, { useMemo, useState } from 'react';
import { TOOL_STATUS_OPTIONS, filterTools, getResponsibleOptions, mapToolsToReportRows } from '../../../entities/tool/model';
import { Button } from '../../../shared/components/Button';
import { SelectField, TextField } from '../../../shared/components/form/Field';
import { ModalShell } from '../../../shared/components/ModalShell';
import { formatDate } from '../../../shared/lib/date';
import { exportRowsToExcel } from '../../../shared/lib/exportToExcel';

export const ReportModal = ({ isOpen, onClose, tools, stats }) => {
  const [name, setName] = useState('');
  const [status, setStatus] = useState('all');
  const [responsible, setResponsible] = useState('all');

  const filteredTools = useMemo(
    () =>
      filterTools(tools, {
        search: '',
        status,
        responsible,
      }),
    [tools, status, responsible]
  );

  const handleExport = () => {
    const fileName = `${name || 'reporte-herramientas'}-${new Date().toISOString().slice(0, 10)}`;
    exportRowsToExcel({
      rows: mapToolsToReportRows(filteredTools),
      fileName,
    });
    onClose();
  };

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={onClose}
      title="Reporte de Inventario"
      maxWidth="max-w-4xl"
      footer={
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose}>
            Cerrar
          </Button>
          <Button variant="success" onClick={handleExport}>
            Exportar a Excel
          </Button>
        </div>
      }
    >
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row">
        <div>
          <h3 className="text-lg font-medium text-slate-900">Empresa Constructora Almendrica</h3>
          <p className="text-slate-600">Fecha del reporte: {formatDate(new Date().toISOString())}</p>
        </div>
        <div className="text-right text-sm text-slate-600">
          <p>Total herramientas: {stats.total}</p>
          <p>Herramientas perdidas/danadas: {stats.lostOrDamaged}</p>
        </div>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-4">
        <SummaryCard label="Disponibles" value={stats.active} color="border-emerald-500" />
        <SummaryCard label="Asignadas" value={stats.assigned} color="border-blue-500" />
        <SummaryCard label="Mantenimiento" value={stats.maintenance} color="border-amber-500" />
        <SummaryCard label="Perdidas/Danadas" value={stats.lostOrDamaged} color="border-rose-500" />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <TextField label="Nombre del reporte" name="reportName" value={name} onChange={(event) => setName(event.target.value)} />
        <SelectField label="Estado" name="reportStatus" options={TOOL_STATUS_OPTIONS} value={status} onChange={(event) => setStatus(event.target.value)} />
        <SelectField
          label="Responsable"
          name="reportResponsible"
          options={[
            { value: 'all', label: 'Todos' },
            ...getResponsibleOptions(tools).map((item) => ({ value: item, label: item })),
          ]}
          value={responsible}
          onChange={(event) => setResponsible(event.target.value)}
        />
      </div>
    </ModalShell>
  );
};

const SummaryCard = ({ label, value, color }) => (
  <div className={`rounded-lg border-l-4 bg-white p-4 shadow ${color}`}>
    <p className="text-sm text-slate-500">{label}</p>
    <p className="text-xl font-bold text-slate-800">{value}</p>
  </div>
);
