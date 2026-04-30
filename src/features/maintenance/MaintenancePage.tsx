import React, { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getApiErrorMessage, getStatusMeta } from "../../entities/tool/model";
import type { MaintenanceFormValues, Tool } from "../../shared/types";
import { SearchableSelectField, TextField } from "../../shared/components/form/Field";
import { Loader } from "../../shared/components/Loader";
import { formatDate } from "../../shared/lib/date";
import { Button } from "../../shared/components/Button";
import { listTools } from "../../services/api/toolsService";
import { completeMaintenance, createMaintenance, listMaintenances } from "../../services/api/maintenancesService";
import { queryKeys } from "../../services/query/queryKeys";
import { useDebouncedValue } from "../../shared/hooks/useDebouncedValue";

const today = () => new Date().toISOString().slice(0, 10);
const getToolDisplayName = (tool: Pick<Tool, "code" | "name">): string => `${tool.code} - ${tool.name}`;

export const MaintenancePage = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [form, setForm] = useState<MaintenanceFormValues>({ toolId: "", dateMaintenance: today(), nextMaintenance: today() });
  const [completingToolId, setCompletingToolId] = useState("");
  const [mutationError, setMutationError] = useState("");

  const maintenanceFilters = useMemo(
    () => ({ search: search.trim(), from: fromDate, to: toDate }),
    [search, fromDate, toDate]
  );
  const debouncedFilters = useDebouncedValue(maintenanceFilters, 300);

  const toolsQuery = useQuery({
    queryKey: queryKeys.tools.list(),
    queryFn: () => listTools(),
  });
  const eventsQuery = useQuery({
    queryKey: queryKeys.maintenances.list(debouncedFilters),
    queryFn: () => listMaintenances(debouncedFilters),
  });

  const scheduleMutation = useMutation({
    mutationFn: createMaintenance,
    onMutate: () => setMutationError(""),
    onSuccess: (result) => {
      queryClient.setQueryData<Tool[]>(queryKeys.tools.list(), (previous = []) =>
        previous.map((tool) => (tool.id === result.tool.id ? result.tool : tool))
      );
      void queryClient.invalidateQueries({ queryKey: queryKeys.maintenances.all });
    },
    onError: (error) => {
      setMutationError(getApiErrorMessage(error, "No se pudo registrar el mantenimiento"));
    },
  });

  const completeMutation = useMutation({
    mutationFn: completeMaintenance,
    onMutate: () => setMutationError(""),
    onSuccess: (result) => {
      queryClient.setQueryData<Tool[]>(queryKeys.tools.list(), (previous = []) =>
        previous.map((tool) => (tool.id === result.tool.id ? result.tool : tool))
      );
      void queryClient.invalidateQueries({ queryKey: queryKeys.maintenances.all });
    },
    onError: (error) => {
      setMutationError(getApiErrorMessage(error, "No se pudo finalizar el mantenimiento"));
    },
  });

  const tools = toolsQuery.data ?? [];
  const events = eventsQuery.data ?? [];
  const operationalTools = useMemo(() => tools.filter((tool) => tool.status === "active" || tool.status === "maintenance"), [tools]);

  const toolLabelById = useMemo(() => new Map(operationalTools.map((tool) => [tool.id, getToolDisplayName(tool)])), [operationalTools]);
  const toolIdByLabel = useMemo(() => {
    const map = new Map<string, string>();
    toolLabelById.forEach((label, id) => map.set(label, id));
    return map;
  }, [toolLabelById]);

  const toolOptions = useMemo(
    () =>
      operationalTools.map((tool) => {
        const fullLabel = getToolDisplayName(tool);
        return { value: fullLabel, label: fullLabel };
      }),
    [operationalTools]
  );

  const loading = toolsQuery.isLoading || eventsQuery.isLoading;
  const error = toolsQuery.error
    ? getApiErrorMessage(toolsQuery.error, "No se pudieron cargar las herramientas")
    : eventsQuery.error
      ? getApiErrorMessage(eventsQuery.error, "No se pudieron cargar los datos de mantenimiento")
      : "";

  const handleSchedule = async () => {
    if (!form.toolId || !form.dateMaintenance || !form.nextMaintenance) {
      setMutationError("Debes seleccionar herramienta y completar ambas fechas");
      return;
    }

    try {
      await scheduleMutation.mutateAsync(form);
      setForm({ toolId: "", dateMaintenance: today(), nextMaintenance: today() });
    } catch {
      return;
    }
  };

  const handleComplete = async (toolId: string) => {
    setCompletingToolId(toolId);
    try {
      await completeMutation.mutateAsync(toolId);
    } catch {
      return;
    } finally {
      setCompletingToolId("");
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <section className="space-y-6">
      <div className="ui-panel p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[var(--text-muted)]">Mantenimiento</p>
        <h1 className="mt-2 text-2xl font-semibold text-[var(--text-primary)]">Gestion de mantenimiento</h1>
        <p className="mt-2 text-sm text-[var(--text-muted)]">Programa y finaliza mantenimientos fuera de Herramientas, con historial centralizado.</p>
      </div>

      {error ? <div className="ui-error">{error}</div> : null}
      {mutationError ? <div className="ui-error">{mutationError}</div> : null}

      <div className="ui-card">
        <h2 className="text-lg font-semibold text-[var(--text-primary)]">Programar mantenimiento</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
          <SearchableSelectField
            label="Herramienta*"
            name="maintenance-tool"
            value={toolLabelById.get(form.toolId) || ""}
            placeholder="Selecciona herramienta"
            options={toolOptions}
            onValueChange={(value) => {
              const nextToolID = toolIdByLabel.get(value) || "";
              setForm((prev) => ({ ...prev, toolId: nextToolID }));
            }}
          />
          <TextField
            label="Fecha de mantenimiento*"
            name="dateMaintenance"
            type="date"
            required
            value={form.dateMaintenance}
            onChange={(event) => setForm((prev) => ({ ...prev, dateMaintenance: event.target.value }))}
          />
          <TextField
            label="Proximo mantenimiento*"
            name="nextMaintenance"
            type="date"
            required
            value={form.nextMaintenance}
            onChange={(event) => setForm((prev) => ({ ...prev, nextMaintenance: event.target.value }))}
          />
        </div>
        <div className="mt-4 flex justify-end">
          <Button onClick={() => void handleSchedule()} disabled={scheduleMutation.isPending}>
            {scheduleMutation.isPending ? "Guardando..." : "Guardar mantenimiento"}
          </Button>
        </div>
      </div>

      <div className="ui-table-shell">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-[var(--border-subtle)]">
            <thead className="bg-[var(--surface-muted)]/70">
              <tr>
                {["Codigo", "Herramienta", "Estado", "Ultimo mantenimiento", "Proximo mantenimiento", "Acciones"].map((header) => (
                  <th key={header} className="whitespace-nowrap px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)]">
              {operationalTools.length > 0 ? (
                operationalTools.map((tool) => {
                  const status = getStatusMeta(tool.status);
                  return (
                    <tr key={tool.id} className="transition hover:bg-[var(--surface-muted)]/50">
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-[var(--text-primary)]">{tool.code}</td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-[var(--text-secondary)]">{tool.name}</td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${status.badgeClassName}`}>{status.label}</span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-[var(--text-muted)]">{formatDate(tool.dateMaintenance)}</td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-[var(--text-muted)]">{formatDate(tool.nextMaintenance)}</td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm">
                        <div className="flex gap-2">
                          <button
                            type="button"
                            className="inline-flex items-center justify-center rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-base)] px-3 py-1.5 text-xs font-medium text-[var(--text-primary)] transition hover:border-[var(--border-accent)] hover:bg-[var(--surface-accent)]"
                            onClick={() => setForm((prev) => ({ ...prev, toolId: tool.id }))}
                          >
                            {tool.status === "maintenance" ? "Reprogramar" : "Programar"}
                          </button>
                          {tool.status === "maintenance" ? (
                            <button
                              type="button"
                              className="inline-flex items-center justify-center rounded-xl px-3 py-1.5 text-xs font-medium text-rose-700 transition hover:bg-rose-500/10 dark:text-rose-300"
                              onClick={() => void handleComplete(tool.id)}
                              disabled={completingToolId === tool.id}
                            >
                              {completingToolId === tool.id ? "Procesando..." : "Finalizar"}
                            </button>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-14 text-center text-sm text-[var(--text-muted)]">No hay herramientas disponibles para gestionar mantenimiento.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="ui-card space-y-4">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <TextField label="Buscar" name="maintenance-search" placeholder="Herramienta o accion" value={search} onChange={(event) => setSearch(event.target.value)} />
          <TextField label="Desde" name="maintenance-from" type="date" value={fromDate} onChange={(event) => setFromDate(event.target.value)} />
          <TextField label="Hasta" name="maintenance-to" type="date" value={toDate} onChange={(event) => setToDate(event.target.value)} />
        </div>

        <div className="ui-table-shell">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[var(--border-subtle)]">
              <thead className="bg-[var(--surface-muted)]/70">
                <tr>
                  {["Fecha", "Accion", "Herramienta", "Fecha mantenimiento", "Proximo"].map((header) => (
                    <th key={header} className="whitespace-nowrap px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)]">
                {events.length > 0 ? (
                  events
                    .slice()
                    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
                    .map((event) => (
                      <tr key={event.id} className="transition hover:bg-[var(--surface-muted)]/50">
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-[var(--text-muted)]">{formatDate(event.createdAt)}</td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-[var(--text-primary)]">{event.action === "scheduled" ? "Programado" : "Finalizado"}</td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-[var(--text-secondary)]">{event.toolCode} - {event.toolName}</td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-[var(--text-muted)]">{formatDate(event.dateMaintenance)}</td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-[var(--text-muted)]">{formatDate(event.nextMaintenance)}</td>
                      </tr>
                    ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-sm text-[var(--text-muted)]">No hay eventos de mantenimiento con los filtros actuales.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};
