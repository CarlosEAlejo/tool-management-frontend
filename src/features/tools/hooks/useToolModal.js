import { useState } from 'react';

export const useToolModal = () => {
  const [modal, setModal] = useState(null);
  const [selectedTool, setSelectedTool] = useState(null);

  const open = (nextModal, tool = null) => {
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
