import React, { useEffect, useMemo, useState } from "react";
import type { Worker } from "../../shared/types";
import { listWorkers } from "../../services/api/workersService";
import { getWorkerApiErrorMessage, getWorkerFullName } from "../../entities/worker/model";
import { ConfirmDialog } from "../../shared/components/ConfirmDialog";
import { Loader } from "../../shared/components/Loader";
import { ReportModal } from "./components/ReportModal";
import { ToolDetailModal } from "./components/ToolDetailModal";
import { ToolFilters } from "./components/ToolFilters";
import { ToolFormModal } from "./components/ToolFormModal";
import { ToolsHeader } from "./components/ToolsHeader";
import { ToolStats } from "./components/ToolStats";
import { ToolTable } from "./components/ToolTable";
import { useToolFilters } from "./hooks/useToolFilters";
import { useToolModal } from "./hooks/useToolModal";
import { useTools } from "./hooks/useTools";
import type { Tool } from "../../entities/tool/model";

export const ToolsPage = () => {
  const { tools, loading, error, mutationError, isSaving, isDeleting, create, update, remove, clearMutationError } = useTools();
  const { modal, selectedTool, open, close } = useToolModal();
  const [toolToDelete, setToolToDelete] = useState<Tool | null>(null);
  const [workers, setWorkers] = useState<Worker[]>([]);

  useEffect(() => {
    const loadWorkers = async () => {
      try {
        const nextWorkers = await listWorkers();
        setWorkers(Array.isArray(nextWorkers) ? nextWorkers : []);
      } catch (workerError) {
        console.warn(getWorkerApiErrorMessage(workerError, "No se pudo cargar el personal"));
      }
    };

    void loadWorkers();
  }, []);

  const workerNameById = useMemo(
    () => new Map(workers.map((worker) => [worker.id, getWorkerFullName(worker)])),
    [workers]
  );

  const toolsWithResolvedResponsible = useMemo(
    () =>
      tools.map((tool) => {
        if (tool.responsibleId && workerNameById.has(tool.responsibleId)) {
          return {
            ...tool,
            responsible: workerNameById.get(tool.responsibleId) || tool.responsible,
          };
        }
        return tool;
      }),
    [tools, workerNameById]
  );

  const { filters, filteredTools, stats, setSearch, setStatus, setResponsible } = useToolFilters(toolsWithResolvedResponsible);

  const responsibleOptions = useMemo(() => {
    const fromWorkers = workers.map((worker) => getWorkerFullName(worker)).filter(Boolean);
    const fromTools = toolsWithResolvedResponsible.map((tool) => tool.responsible).filter(Boolean);
    return Array.from(new Set([...fromWorkers, ...fromTools])).sort((left, right) => left.localeCompare(right));
  }, [workers, toolsWithResolvedResponsible]);

  if (loading) {
    return <Loader />;
  }

  const handleDelete = async () => {
    if (!toolToDelete) {
      return;
    }

    const result = await remove(toolToDelete.id);
    if (result.ok) {
      setToolToDelete(null);
    }
  };

  return (
    <>
      <section className="space-y-6">
        <ToolsHeader onCreate={() => open("create")} onReport={() => open("report")} />

        {error ? <div className="ui-error">{error}</div> : null}
        {mutationError && !toolToDelete && modal !== "create" && modal !== "edit" ? <div className="ui-error">{mutationError}</div> : null}

        <ToolStats stats={stats} />
        <ToolFilters
          search={filters.search}
          status={filters.status}
          responsible={filters.responsible}
          responsibleOptions={responsibleOptions}
          onSearchChange={setSearch}
          onStatusChange={setStatus}
          onResponsibleChange={setResponsible}
        />
        <ToolTable
          tools={filteredTools}
          onView={(tool) => open("details", tool)}
          onEdit={(tool) => open("edit", tool)}
          onDelete={(tool) => {
            clearMutationError();
            setToolToDelete(tool);
          }}
        />
      </section>

      <ToolFormModal
        isOpen={modal === "create"}
        mode="create"
        workers={workers}
        error={modal === "create" ? mutationError : ""}
        isSaving={isSaving}
        onClose={close}
        onSubmit={create}
        onClearError={clearMutationError}
      />
      <ToolFormModal
        isOpen={modal === "edit"}
        mode="edit"
        workers={workers}
        tool={selectedTool}
        error={modal === "edit" ? mutationError : ""}
        isSaving={isSaving}
        onClose={close}
        onSubmit={(tool) => update(tool as Tool & typeof tool)}
        onClearError={clearMutationError}
      />
      <ToolDetailModal
        isOpen={modal === "details"}
        tool={selectedTool}
        onClose={close}
        onEdit={() => {
          if (selectedTool) {
            open("edit", selectedTool);
          }
        }}
      />
      <ReportModal isOpen={modal === "report"} onClose={close} tools={toolsWithResolvedResponsible} stats={stats} />
      <ConfirmDialog
        isOpen={Boolean(toolToDelete)}
        title="Confirmacion"
        message={mutationError ? mutationError : `Estas seguro de que deseas eliminar la herramienta "${toolToDelete?.name || ""}"?`}
        confirmLabel={isDeleting ? "Eliminando..." : "Eliminar"}
        onCancel={() => {
          clearMutationError();
          setToolToDelete(null);
        }}
        onConfirm={() => {
          void handleDelete();
        }}
      />
    </>
  );
};
