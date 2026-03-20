import React, { useState } from 'react';
import { ConfirmDialog } from '../../shared/components/ConfirmDialog';
import { Loader } from '../../shared/components/Loader';
import { ReportModal } from './components/ReportModal';
import { ToolDetailModal } from './components/ToolDetailModal';
import { ToolFilters } from './components/ToolFilters';
import { ToolFormModal } from './components/ToolFormModal';
import { ToolsHeader } from './components/ToolsHeader';
import { ToolStats } from './components/ToolStats';
import { ToolTable } from './components/ToolTable';
import { useToolFilters } from './hooks/useToolFilters';
import { useToolModal } from './hooks/useToolModal';
import { useTools } from './hooks/useTools';

export const ToolsPage = () => {
  const { tools, loading, error, mutationError, isSaving, isDeleting, create, update, remove, clearMutationError } = useTools();
  const { filters, filteredTools, responsibles, stats, setSearch, setStatus, setResponsible } = useToolFilters(tools);
  const { modal, selectedTool, open, close } = useToolModal();
  const [toolToDelete, setToolToDelete] = useState(null);

  if (loading) {
    return <Loader />;
  }

  const handleDelete = async () => {
    if (!toolToDelete) {
      return;
    }

    const result = await remove(toolToDelete.id);
    if (result?.ok) {
      setToolToDelete(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto max-w-7xl">
        <ToolsHeader onCreate={() => open('create')} onReport={() => open('report')} />

        {error ? <div className="mb-6 rounded-lg bg-rose-100 px-4 py-3 text-sm text-rose-700">{error}</div> : null}
        {mutationError && !toolToDelete && modal !== 'create' && modal !== 'edit' ? (
          <div className="mb-6 rounded-lg bg-rose-100 px-4 py-3 text-sm text-rose-700">{mutationError}</div>
        ) : null}

        <ToolStats stats={stats} />
        <ToolFilters
          search={filters.search}
          status={filters.status}
          responsible={filters.responsible}
          responsibles={responsibles}
          onSearchChange={setSearch}
          onStatusChange={setStatus}
          onResponsibleChange={setResponsible}
        />
        <ToolTable
          tools={filteredTools}
          onView={(tool) => open('details', tool)}
          onEdit={(tool) => open('edit', tool)}
          onDelete={(tool) => {
            clearMutationError();
            setToolToDelete(tool);
          }}
        />
      </div>

      <ToolFormModal
        isOpen={modal === 'create'}
        mode="create"
        error={modal === 'create' ? mutationError : ''}
        isSaving={isSaving}
        onClose={close}
        onSubmit={create}
        onClearError={clearMutationError}
      />
      <ToolFormModal
        isOpen={modal === 'edit'}
        mode="edit"
        tool={selectedTool}
        error={modal === 'edit' ? mutationError : ''}
        isSaving={isSaving}
        onClose={close}
        onSubmit={update}
        onClearError={clearMutationError}
      />
      <ToolDetailModal
        isOpen={modal === 'details'}
        tool={selectedTool}
        onClose={close}
        onEdit={() => open('edit', selectedTool)}
      />
      <ReportModal isOpen={modal === 'report'} onClose={close} tools={tools} stats={stats} />
      <ConfirmDialog
        isOpen={Boolean(toolToDelete)}
        title="Confirmacion"
        message={mutationError ? mutationError : `Estas seguro de que deseas eliminar la herramienta "${toolToDelete?.name || ''}"?`}
        confirmLabel={isDeleting ? 'Eliminando...' : 'Eliminar'}
        onCancel={() => {
          clearMutationError();
          setToolToDelete(null);
        }}
        onConfirm={handleDelete}
      />
    </div>
  );
};
