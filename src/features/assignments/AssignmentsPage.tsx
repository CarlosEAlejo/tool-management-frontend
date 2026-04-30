import React, { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { SearchableSelectField, TextField } from "../../shared/components/form/Field";
import { Loader } from "../../shared/components/Loader";
import { getWorkerApiErrorMessage, getWorkerFullName } from "../../entities/worker/model";
import { getApiErrorMessage, getStatusMeta } from "../../entities/tool/model";
import type { AssignmentFormValues, Tool } from "../../shared/types";
import { listWorkers } from "../../services/api/workersService";
import { listTools } from "../../services/api/toolsService";
import { createAssignment, listAssignments, returnAssignment } from "../../services/api/assignmentsService";
import { formatDate } from "../../shared/lib/date";
import { Button } from "../../shared/components/Button";
import { queryKeys } from "../../services/query/queryKeys";
import { useDebouncedValue } from "../../shared/hooks/useDebouncedValue";

const today = () => new Date().toISOString().slice(0, 10);

const getToolDisplayName = (tool: Pick<Tool, "code" | "name">): string => `${tool.code} - ${tool.name}`;

export const AssignmentsPage = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [form, setForm] = useState<AssignmentFormValues>({ toolId: "", workerId: "", assignmentDate: today() });
  const [returningToolId, setReturningToolId] = useState("");
  const [mutationError, setMutationError] = useState("");

  const assignmentFilters = useMemo(
    () => ({ search: search.trim(), from: fromDate, to: toDate }),
    [search, fromDate, toDate]
  );
  const debouncedFilters = useDebouncedValue(assignmentFilters, 300);

  const toolsQuery = useQuery({
    queryKey: queryKeys.tools.list(),
    queryFn: () => listTools(),
  });
  const workersQuery = useQuery({
    queryKey: queryKeys.workers.list(),
    queryFn: () => listWorkers(),
  });
  const eventsQuery = useQuery({
    queryKey: queryKeys.assignments.list(debouncedFilters),
    queryFn: () => listAssignments(debouncedFilters),
  });

  const assignMutation = useMutation({
    mutationFn: createAssignment,
    onMutate: () => setMutationError(""),
    onSuccess: (result) => {
      queryClient.setQueryData<Tool[]>(queryKeys.tools.list(), (previous = []) =>
        previous.map((tool) => (tool.id === result.tool.id ? result.tool : tool))
      );
      void queryClient.invalidateQueries({ queryKey: queryKeys.assignments.all });
    },
    onError: (error) => {
      setMutationError(getApiErrorMessage(error, "No se pudo registrar la asignacion"));
    },
  });

  const returnMutation = useMutation({
    mutationFn: returnAssignment,
    onMutate: () => setMutationError(""),
    onSuccess: (result) => {
      queryClient.setQueryData<Tool[]>(queryKeys.tools.list(), (previous = []) =>
        previous.map((tool) => (tool.id === result.tool.id ? result.tool : tool))
      );
      void queryClient.invalidateQueries({ queryKey: queryKeys.assignments.all });
    },
    onError: (error) => {
      setMutationError(getApiErrorMessage(error, "No se pudo devolver la herramienta"));
    },
  });

  const tools = toolsQuery.data ?? [];
  const workers = workersQuery.data ?? [];
  const events = eventsQuery.data ?? [];

  const workerById = useMemo(() => new Map(workers.map((worker) => [worker.id, worker])), [workers]);
  const operationalTools = useMemo(() => tools.filter((tool) => tool.status === "active" || tool.status === "assigned"), [tools]);

  const toolLabelById = useMemo(() => new Map(operationalTools.map((tool) => [tool.id, getToolDisplayName(tool)])), [operationalTools]);
  const toolIdByLabel = useMemo(() => {
    const map = new Map<string, string>();
    toolLabelById.forEach((label, id) => {
      map.set(label, id);
    });
    return map;
  }, [toolLabelById]);

  const workerLabelById = useMemo(
    () => new Map(workers.map((worker) => [worker.id, `${getWorkerFullName(worker)} (${worker.position})`])),
    [workers]
  );
  const workerIdByLabel = useMemo(() => {
    const map = new Map<string, string>();
    workerLabelById.forEach((label, id) => {
      map.set(label, id);
    });
    return map;
  }, [workerLabelById]);

  const toolOptions = useMemo(
    () =>
      operationalTools.map((tool) => {
        const fullLabel = getToolDisplayName(tool);
        return {
          value: fullLabel,
          label: fullLabel,
        };
      }),
    [operationalTools]
  );

  const workerOptions = useMemo(
    () =>
      workers.map((worker) => {
        const fullLabel = `${getWorkerFullName(worker)} (${worker.position})`;
        return {
          value: fullLabel,
          label: fullLabel,
        };
      }),
    [workers]
  );

  const loading = toolsQuery.isLoading || workersQuery.isLoading || eventsQuery.isLoading;
  const error = toolsQuery.error
    ? getApiErrorMessage(toolsQuery.error, "No se pudieron cargar las herramientas")
    : workersQuery.error
      ? getWorkerApiErrorMessage(workersQuery.error, "No se pudo cargar el personal")
      : eventsQuery.error
        ? getWorkerApiErrorMessage(eventsQuery.error, "No se pudieron cargar los datos de asignaciones")
        : "";

  const handleAssign = async () => {
    if (!form.toolId || !form.workerId) {
      setMutationError("Debes seleccionar herramienta y trabajador");
      return;
    }

    try {
      await assignMutation.mutateAsync(form);
      setForm({ toolId: "", workerId: "", assignmentDate: today() });
    } catch {
      return;
    }
  };

  const handleReturn = async (toolId: string) => {
    setReturningToolId(toolId);
    try {
      await returnMutation.mutateAsync(toolId);
    } catch {
      return;
    } finally {
      setReturningToolId("");
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <section className="space-y-6">
      <div className="ui-panel p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[var(--text-muted)]">Asignaciones</p>
        <h1 className="mt-2 text-2xl font-semibold text-[var(--text-primary)]">Gestion de asignaciones</h1>
        <p className="mt-2 text-sm text-[var(--text-muted)]">
          Asigna, reasigna o devuelve herramientas sin editar ese flujo desde el modulo de Herramientas.
        </p>
      </div>

      {error ? <div className="ui-error">{error}</div> : null}
      {mutationError ? <div className="ui-error">{mutationError}</div> : null}

      <div className="ui-card">
        <h2 className="text-lg font-semibold text-[var(--text-primary)]">Registrar asignacion</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
          <SearchableSelectField
            label="Herramienta*"
            name="assignment-tool"
            value={toolLabelById.get(form.toolId) || ""}
            placeholder="Selecciona herramienta"
            options={toolOptions}
            onValueChange={(value) => {
              const nextToolID = toolIdByLabel.get(value) || "";
              setForm((prev) => ({ ...prev, toolId: nextToolID }));
            }}
          />
          <SearchableSelectField
            label="Trabajador*"
            name="assignment-worker"
            value={workerLabelById.get(form.workerId) || ""}
            placeholder="Selecciona trabajador"
            options={workerOptions}
            onValueChange={(value) => {
              const nextWorkerID = workerIdByLabel.get(value) || "";
              setForm((prev) => ({ ...prev, workerId: nextWorkerID }));
            }}
          />
          <TextField
            label="Fecha de asignacion*"
            name="assignmentDate"
            type="date"
            required
            value={form.assignmentDate}
            onChange={(event) => setForm((prev) => ({ ...prev, assignmentDate: event.target.value }))}
          />
        </div>
        <div className="mt-4 flex justify-end">
          <Button onClick={() => void handleAssign()} disabled={assignMutation.isPending}>
            {assignMutation.isPending ? "Guardando..." : "Guardar asignacion"}
          </Button>
        </div>
      </div>

      <div className="ui-table-shell">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-[var(--border-subtle)]">
            <thead className="bg-[var(--surface-muted)]/70">
              <tr>
                {["Codigo", "Herramienta", "Estado", "Responsable", "Fecha asignacion", "Acciones"].map((header) => (
                  <th key={header} className="whitespace-nowrap px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
                    {header}
                  </th>
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
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-[var(--text-muted)]">{tool.responsible || "-"}</td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-[var(--text-muted)]">{formatDate(tool.assignmentDate)}</td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm">
                        <div className="flex gap-2">
                          <button
                            type="button"
                            className="inline-flex items-center justify-center rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-base)] px-3 py-1.5 text-xs font-medium text-[var(--text-primary)] transition hover:border-[var(--border-accent)] hover:bg-[var(--surface-accent)]"
                            onClick={() => setForm((prev) => ({ ...prev, toolId: tool.id }))}
                          >
                            {tool.status === "assigned" ? "Reasignar" : "Asignar"}
                          </button>
                          {tool.status === "assigned" ? (
                            <button
                              type="button"
                              className="inline-flex items-center justify-center rounded-xl px-3 py-1.5 text-xs font-medium text-rose-700 transition hover:bg-rose-500/10 dark:text-rose-300"
                              onClick={() => void handleReturn(tool.id)}
                              disabled={returningToolId === tool.id}
                            >
                              {returningToolId === tool.id ? "Procesando..." : "Devolver"}
                            </button>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-14 text-center text-sm text-[var(--text-muted)]">
                    No hay herramientas disponibles para gestionar asignaciones.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="ui-card space-y-4">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <TextField label="Buscar" name="assignment-search" placeholder="Herramienta o trabajador" value={search} onChange={(event) => setSearch(event.target.value)} />
          <TextField label="Desde" name="assignment-from" type="date" value={fromDate} onChange={(event) => setFromDate(event.target.value)} />
          <TextField label="Hasta" name="assignment-to" type="date" value={toDate} onChange={(event) => setToDate(event.target.value)} />
        </div>

        <div className="ui-table-shell">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[var(--border-subtle)]">
              <thead className="bg-[var(--surface-muted)]/70">
                <tr>
                  {["Fecha", "Accion", "Herramienta", "Trabajador", "Fecha asignacion"].map((header) => (
                    <th key={header} className="whitespace-nowrap px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)]">
                {events.length > 0 ? (
                  events
                    .slice()
                    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
                    .map((event) => {
                      const worker = workerById.get(event.workerId);
                      const workerName = worker ? getWorkerFullName(worker) : event.workerName || "-";
                      return (
                        <tr key={event.id} className="transition hover:bg-[var(--surface-muted)]/50">
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-[var(--text-muted)]">{formatDate(event.createdAt)}</td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-[var(--text-primary)]">{event.action === "assigned" ? "Asignacion" : "Devolucion"}</td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-[var(--text-secondary)]">{event.toolCode} - {event.toolName}</td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-[var(--text-secondary)]">{workerName}</td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-[var(--text-muted)]">{formatDate(event.assignmentDate)}</td>
                        </tr>
                      );
                    })
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-sm text-[var(--text-muted)]">
                      No hay eventos de asignacion con los filtros actuales.
                    </td>
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
