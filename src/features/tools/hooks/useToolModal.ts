import { useState } from "react";
import type { Tool } from "../../../entities/tool/model";

export type ToolModalType = "create" | "edit" | "details" | "report" | null;

export const useToolModal = () => {
  const [modal, setModal] = useState<ToolModalType>(null);
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);

  const open = (nextModal: Exclude<ToolModalType, null>, tool: Tool | null = null) => {
    setSelectedTool(tool);
    setModal(nextModal);
  };

  const close = () => {
    setSelectedTool(null);
    setModal(null);
  };

  return {
    modal,
    selectedTool,
    open,
    close,
  };
};
