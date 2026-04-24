import React, { useMemo, useState } from "react";
import type { Worker } from "../../entities/worker/model";
import { ConfirmDialog } from "../../shared/components/ConfirmDialog";
import { Loader } from "../../shared/components/Loader";
import { WorkerFilters } from "./components/WorkerFilters";
import { WorkerFormModal } from "./components/WorkerFormModal";
import { WorkersHeader } from "./components/WorkersHeader";
import { WorkerTable } from "./components/WorkerTable";
import { useWorkers } from "./hooks/useWorkers";

export const WorkersPage = () => {
  const { workers, loading, error, mutationError, isSaving, isDeleting, create, update, remove, clearMutationError } = useWorkers();
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState<"create" | "edit" | null>(null);
  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null);
  const [workerToDelete, setWorkerToDelete] = useState<Worker | null>(null);

  const filteredWorkers = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) {
      return workers;
    }

    return workers.filter((worker) => {
      const fullName = `${worker.firstName} ${worker.lastName}`.toLowerCase();
      return (
        fullName.includes(query) ||
        worker.position.toLowerCase().includes(query) ||
        worker.email.toLowerCase().includes(query)
      );
    });
  }, [workers, search]);

  if (loading) {
    return <Loader />;
  }

  const handleDelete = async () => {
    if (!workerToDelete) {
      return;
    }

    const result = await remove(workerToDelete.id);
    if (result.ok) {
      setWorkerToDelete(null);
    }
  };

  return (
    <>
      <section className="space-y-6">
        <WorkersHeader
          onCreate={() => {
            clearMutationError();
            setSelectedWorker(null);
            setModal("create");
          }}
        />

        {error ? <div className="ui-error">{error}</div> : null}
        {mutationError && !workerToDelete && modal !== "create" && modal !== "edit" ? <div className="ui-error">{mutationError}</div> : null}

        <WorkerFilters search={search} onSearchChange={setSearch} />
        <WorkerTable
          workers={filteredWorkers}
          onEdit={(worker) => {
            clearMutationError();
            setSelectedWorker(worker);
            setModal("edit");
          }}
          onDelete={(worker) => {
            clearMutationError();
            setWorkerToDelete(worker);
          }}
        />
      </section>

      <WorkerFormModal
        isOpen={modal === "create"}
        mode="create"
        error={modal === "create" ? mutationError : ""}
        isSaving={isSaving}
        onClose={() => setModal(null)}
        onSubmit={create}
        onClearError={clearMutationError}
      />
      <WorkerFormModal
        isOpen={modal === "edit"}
        mode="edit"
        worker={selectedWorker}
        error={modal === "edit" ? mutationError : ""}
        isSaving={isSaving}
        onClose={() => setModal(null)}
        onSubmit={(worker) => update(worker as Worker)}
        onClearError={clearMutationError}
      />

      <ConfirmDialog
        isOpen={Boolean(workerToDelete)}
        title="Confirmacion"
        message={mutationError ? mutationError : `Estas seguro de que deseas eliminar al trabajador "${workerToDelete?.firstName || ""} ${workerToDelete?.lastName || ""}"?`}
        confirmLabel={isDeleting ? "Eliminando..." : "Eliminar"}
        onCancel={() => {
          clearMutationError();
          setWorkerToDelete(null);
        }}
        onConfirm={() => {
          void handleDelete();
        }}
      />
    </>
  );
};
