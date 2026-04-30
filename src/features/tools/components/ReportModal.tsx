import React, { useEffect, useMemo, useState } from "react";
import type { ChangeEvent } from "react";
import {
  TOOL_STATUS_OPTIONS,
  filterTools,
  getResponsibleOptions,
  mapToolAssignmentHistoryRows,
  mapToolMaintenanceHistoryRows,
  mapToolSummaryRows,
  mapToolsToReportRows,
} from "../../../entities/tool/model";
import { Button } from "../../../shared/components/Button";
import { SelectField, TextField } from "../../../shared/components/form/Field";
import { ModalShell } from "../../../shared/components/ModalShell";
import { formatDate } from "../../../shared/lib/date";
import { exportWorkbookToExcel } from "../../../shared/lib/exportToExcel";
import type { Tool, ToolStats } from "../../../entities/tool/model";

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  tools: Tool[];
  stats: ToolStats;
}

interface SummaryCardProps {
  label: string;
  value: number;
  color: string;
}

export const ReportModal = ({ isOpen, onClose, tools, stats }: ReportModalProps) => {
  const [name, setName] = useState("");
  const [status, setStatus] = useState<typeof TOOL_STATUS_OPTIONS[number]["value"]>("all");
  const [responsible, setResponsible] = useState("all");
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setName("");
      setStatus("all");
      setResponsible("all");
      setIsExporting(false);
    }
  }, [isOpen]);

  const responsibleOptions = useMemo(
    () => [{ value: "all", label: "Todos" }, ...getResponsibleOptions(tools).map((item) => ({ value: item, label: item }))],
    [tools]
  );

  const filteredTools = useMemo(
    () =>
      filterTools(tools, {
        search: "",
        status,
        responsible,
      }),
    [tools, status, responsible]
  );

  const handleExport = async () => {
    const fileName = `${name || "reporte-herramientas-completo"}-${new Date().toISOString().slice(0, 10)}`;
    setIsExporting(true);

    try {
      await exportWorkbookToExcel({
        fileName,
        sheets: [
          { name: "Resumen", rows: mapToolSummaryRows(filteredTools, stats) },
          { name: "Inventario", rows: mapToolsToReportRows(filteredTools) },
          { name: "HistorialAsignaciones", rows: mapToolAssignmentHistoryRows(filteredTools) },
          { name: "HistorialMantenimientos", rows: mapToolMaintenanceHistoryRows(filteredTools) },
        ],
      });
      onClose();
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={onClose}
      title="Reporte de inventario"
      maxWidth="max-w-4xl"
      footer={
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose} disabled={isExporting}>
            Cerrar
          </Button>
          <Button variant="success" onClick={() => void handleExport()} disabled={isExporting}>
            {isExporting ? "Generando..." : "Exportar a Excel"}
          </Button>
        </div>
      }
    >
      <div className="mb-6 flex flex-col gap-4 rounded-[1.5rem] border border-[var(--border-subtle)] bg-[var(--surface-muted)]/45 p-5 md:flex-row md:items-start md:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">Empresa Constructora Almendrica</h3>
          <p className="mt-1 text-sm text-[var(--text-muted)]">Fecha del reporte: {formatDate(new Date().toISOString())}</p>
        </div>
        <div className="text-sm text-[var(--text-muted)] md:text-right">
          <p>Total herramientas general: {stats.total}</p>
          <p>Total herramientas filtradas: {filteredTools.length}</p>
          <p>Herramientas perdidas/danadas: {stats.lostOrDamaged}</p>
        </div>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-4">
        <SummaryCard label="Disponibles" value={stats.active} color="border-emerald-500/30" />
        <SummaryCard label="Asignadas" value={stats.assigned} color="border-sky-500/30" />
        <SummaryCard label="Mantenimiento" value={stats.maintenance} color="border-amber-500/30" />
        <SummaryCard label="Perdidas/Danadas" value={stats.lostOrDamaged} color="border-rose-500/30" />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <TextField label="Nombre del reporte" name="reportName" value={name} onChange={(event: ChangeEvent<HTMLInputElement>) => setName(event.target.value)} />
        <SelectField label="Estado" name="reportStatus" options={TOOL_STATUS_OPTIONS} value={status} onChange={(event: ChangeEvent<HTMLSelectElement>) => setStatus(event.target.value as typeof status)} />
        <SelectField label="Responsable" name="reportResponsible" options={responsibleOptions} value={responsible} onChange={(event: ChangeEvent<HTMLSelectElement>) => setResponsible(event.target.value)} />
      </div>
    </ModalShell>
  );
};

const SummaryCard = ({ label, value, color }: SummaryCardProps) => (
  <div className={`rounded-[1.25rem] border bg-[var(--surface-base)]/80 p-4 ${color}`}>
    <p className="text-sm text-[var(--text-muted)]">{label}</p>
    <p className="mt-2 text-xl font-semibold text-[var(--text-primary)]">{value}</p>
  </div>
);
