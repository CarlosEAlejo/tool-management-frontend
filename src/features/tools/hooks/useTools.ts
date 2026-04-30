import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getApiErrorMessage, sanitizeToolPayload } from "../../../entities/tool/model";
import { createTool, deleteTool, listTools, updateTool } from "../../../services/api/toolsService";
import { queryKeys } from "../../../services/query/queryKeys";
import type { MutationResponse, Tool, ToolFormValues } from "../../../entities/tool/model";

export const useTools = () => {
  const queryClient = useQueryClient();
  const [mutationError, setMutationError] = useState("");

  const toolsQuery = useQuery({
    queryKey: queryKeys.tools.list(),
    queryFn: () => listTools(),
  });

  const clearMutationError = () => {
    setMutationError("");
  };

  const createMutation = useMutation({
    mutationFn: async (tool: ToolFormValues) => createTool(sanitizeToolPayload(tool)),
    onMutate: clearMutationError,
    onSuccess: (created) => {
      queryClient.setQueryData<Tool[]>(queryKeys.tools.list(), (previous = []) => [...previous, created]);
    },
    onError: (error) => {
      setMutationError(getApiErrorMessage(error, "No se pudo crear la herramienta"));
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (tool: Tool & ToolFormValues) => updateTool(tool.id, sanitizeToolPayload(tool)),
    onMutate: clearMutationError,
    onSuccess: (updated) => {
      queryClient.setQueryData<Tool[]>(queryKeys.tools.list(), (previous = []) =>
        previous.map((item) => (item.id === updated.id ? updated : item))
      );
    },
    onError: (error) => {
      setMutationError(getApiErrorMessage(error, "No se pudo actualizar la herramienta"));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await deleteTool(id);
      return id;
    },
    onMutate: clearMutationError,
    onSuccess: (id) => {
      queryClient.setQueryData<Tool[]>(queryKeys.tools.list(), (previous = []) => previous.filter((item) => item.id !== id));
    },
    onError: (error) => {
      setMutationError(getApiErrorMessage(error, "No se pudo eliminar la herramienta"));
    },
  });

  const refresh = async (): Promise<void> => {
    await queryClient.invalidateQueries({ queryKey: queryKeys.tools.all });
  };

  const create = async (tool: ToolFormValues): Promise<MutationResponse<Tool>> => {
    try {
      const created = await createMutation.mutateAsync(tool);
      return { ok: true, data: created };
    } catch {
      return { ok: false, error: mutationError || "No se pudo crear la herramienta" };
    }
  };

  const update = async (tool: Tool & ToolFormValues): Promise<MutationResponse<Tool>> => {
    try {
      const updated = await updateMutation.mutateAsync(tool);
      return { ok: true, data: updated };
    } catch {
      return { ok: false, error: mutationError || "No se pudo actualizar la herramienta" };
    }
  };

  const remove = async (id: string): Promise<MutationResponse<null>> => {
    try {
      await deleteMutation.mutateAsync(id);
      return { ok: true, data: null };
    } catch {
      return { ok: false, error: mutationError || "No se pudo eliminar la herramienta" };
    }
  };

  return {
    tools: toolsQuery.data ?? [],
    loading: toolsQuery.isLoading,
    error: toolsQuery.error ? getApiErrorMessage(toolsQuery.error, "No se pudieron cargar las herramientas") : "",
    mutationError,
    isSaving: createMutation.isPending || updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    refresh,
    create,
    update,
    remove,
    clearMutationError,
  };
};
