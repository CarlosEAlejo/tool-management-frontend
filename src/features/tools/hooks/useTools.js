import { useEffect, useState } from 'react';
import { createTool, deleteTool, listTools, updateTool } from '../../../services/api/toolsService';
import { sanitizeToolPayload } from '../../../entities/tool/model';

export const useTools = () => {
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const refresh = async () => {
    setLoading(true);
    setError('');
    try {
      const nextTools = await listTools();
      setTools(Array.isArray(nextTools) ? nextTools : []);
    } catch (err) {
      setError(err.response?.data?.message || 'No se pudieron cargar las herramientas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const create = async (tool) => {
    const created = await createTool(sanitizeToolPayload(tool));
    setTools((prev) => [...prev, created]);
    return created;
  };

  const update = async (tool) => {
    const updated = await updateTool(tool.id, sanitizeToolPayload(tool));
    setTools((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
    return updated;
  };

  const remove = async (id) => {
    await deleteTool(id);
    setTools((prev) => prev.filter((item) => item.id !== id));
  };

  return {
    tools,
    loading,
    error,
    refresh,
    create,
    update,
    remove,
  };
};
