import { useState, useEffect } from 'react';
import { initialTools } from '../data';

export const useTools = () => {
  const [tools, setTools] = useState(initialTools);
  const [currentTool, setCurrentTool] = useState(null);
  const [stats, setStats] = useState({ total: 0, maintenance: 0, nextMaintenance: '-' });
  const [modalType, setModalType] = useState(null); // Inicializa como null

  const responsibles = [...new Set(tools.map(tool => tool.responsible).filter(Boolean))];

  // Efecto para actualizar estadísticas cada vez que cambie el estado de tools
  useEffect(() => {
    updateStats();
  }, [tools]);

  const updateStats = () => {
    const total = tools.length;
    const maintenance = tools.filter(t => t.status === 'maintenance').length;
    let nextMaintenanceDate = '-';
    const nextMaintenance = tools
      .filter(t => t.nextMaintenance)
      .map(t => new Date(t.nextMaintenance))
      .filter(date => !isNaN(date.getTime()));
    if (nextMaintenance.length > 0) {
      const nextDate = new Date(Math.min(...nextMaintenance.map(date => date.getTime())));
      nextMaintenanceDate = nextDate.toLocaleDateString();
    }
    setStats({
      total,
      maintenance,
      nextMaintenance: nextMaintenanceDate,
    });
  };

  const addTool = (tool) => {
    setTools(prev => [...prev, { ...tool, id: prev.length + 1 }]);
    updateStats();
    closeModal();
  };

  const editTool = (updatedTool) => {
    setTools(prev => prev.map(tool => (tool.id === updatedTool.id ? updatedTool : tool)));
    updateStats();
    closeModal();
  };

  const deleteTool = (id) => {
    setTools(prev => prev.filter(tool => tool.id !== id));
    updateStats();
  };

  const generateReport = () => {
    setModalType('report');
  };

  const openModal = (type) => {
    setModalType(type);
    // Establece el tipo de modal a abrir
  };

  const closeModal = () => {
    setModalType(null); // Restablece a null para cerrar todos los modales
    setCurrentTool(null); // Limpia el tool actual
  };

  return {
    tools,
    addTool,
    editTool,
    deleteTool,
    generateReport,
    updateStats,
    stats,
    currentTool,
    setCurrentTool,
    openModal,
    closeModal,
    modalType,
    responsibles,
  };
};
