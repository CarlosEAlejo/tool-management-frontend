import { useEffect, useState } from 'react';
import { getApiErrorMessage, sanitizeToolPayload } from '../../../entities/tool/model';
import { createTool, deleteTool, listTools, updateTool } from '../../../services/api/toolsService';

export const useTools = () => {
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mutationError, setMutationError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const clearMutationError = () => {
    setMutationError('');
  };

  const refresh = async () => {
    setLoading(true);
    setError('');
    try {
      const nextTools = await listTools();
      setTools(Array.isArray(nextTools) ? nextTools : []);
    } catch (err) {
      setError(getApiErrorMessage(err, 'No se pudieron cargar las herramientas'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const create = async (tool) => {
    setIsSaving(true);
    clearMutationError();
    try {
      const created = await createTool(sanitizeToolPayload(tool));
      setTools((prev) => [...prev, created]);
      return { ok: true, data: created };
    } catch (err) {
      const message = getApiErrorMessage(err, 'No se pudo crear la herramienta');
      setMutationError(message);
      return { ok: false, error: message };
    } finally {
      setIsSaving(false);
    }
  };

  const update = async (tool) => {
    setIsSaving(true);
    clearMutationError();
    try {
      const updated = await updateTool(tool.id, sanitizeToolPayload(tool));
      setTools((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
      return { ok: true, data: updated };
    } catch (err) {
      const message = getApiErrorMessage(err, 'No se pudo actualizar la herramienta');
      setMutationError(message);
      return { ok: false, error: message };
    } finally {
      setIsSaving(false);
    }
  };

  const remove = async (id) => {
    setIsDeleting(true);
    clearMutationError();
    try {
      await deleteTool(id);
      setTools((prev) => prev.filter((item) => item.id !== id));
      return { ok: true };
    } catch (err) {
      const message = getApiErrorMessage(err, 'No se pudo eliminar la herramienta');
      setMutationError(message);
      return { ok: false, error: message };
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    tools,
    loading,
    error,
    mutationError,
    isSaving,
    isDeleting,
    refresh,
    create,
    update,
    remove,
    clearMutationError,
  };
};
