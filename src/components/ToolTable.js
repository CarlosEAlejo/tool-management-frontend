import React, { useState, useEffect } from 'react';
import ToolCard from './ToolCard';
import ConfirmationModal from './ConfirmationModal';

const ToolTable = ({ tools, editTool, deleteTool, setCurrentTool, openModal, searchTerm, statusFilter, responsibleFilter }) => {

  const [filteredTools, setFilteredTools] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toolToDelete, setToolToDelete] = useState(null);

  useEffect(() => {
    if (tools) {
      filterTools();
    }
  }, [tools, searchTerm, statusFilter, responsibleFilter]);

  // Filter tools
  const filterTools = () => {
    const filteredTools = tools.filter(tool => {
      const matchesSearch = tool.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tool.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || tool.status === statusFilter;
      const matchesResponsible = responsibleFilter === 'all' ||
        (responsibleFilter === '' && !tool.responsible) ||
        tool.responsible === responsibleFilter;
      return matchesSearch && matchesStatus && matchesResponsible;
    });
    setFilteredTools(filteredTools);

  }

  const handleDelete = (tool) => {
    setToolToDelete(tool);
    setIsModalOpen(true);
  };

  const confirmDelete = () => {
    if (toolToDelete) {
      deleteTool(toolToDelete.id);
      setToolToDelete(null);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left whitespace-nowrap text-sm text-gray-500">Código</th>
              <th scope="col" className="px-6 py-3 text-left whitespace-nowrap text-sm text-gray-500">Nombre</th>
              <th scope="col" className="px-6 py-3 text-left whitespace-nowrap text-sm text-gray-500">Tipo</th>
              <th scope="col" className="px-6 py-3 text-left whitespace-nowrap text-sm text-gray-500">Estado</th>
              <th scope="col" className="px-6 py-3 text-left whitespace-nowrap text-sm text-gray-500">Responsable</th>
              <th scope="col" className="px-6 py-3 text-left whitespace-nowrap text-sm text-gray-500">Fecha Asignación</th>
              <th scope="col" className="px-6 py-3 text-left whitespace-nowrap text-sm text-gray-500">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredTools.map(tool => (
              <ToolCard key={tool.id} tool={tool} deleteTool={handleDelete} setCurrentTool={setCurrentTool} openModal={openModal} />
            ))}
          </tbody>
        </table>
        <ConfirmationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={confirmDelete}
          message={`¿Estás seguro de que deseas eliminar la herramienta "${toolToDelete ? toolToDelete.name : ''}"?`}
        />
      </div>
    </div>
  );
};

export default ToolTable;
