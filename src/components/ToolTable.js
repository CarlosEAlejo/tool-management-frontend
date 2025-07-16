import React, { useState, useEffect } from 'react';
import ToolCard from './ToolCard';

const ToolTable = ({ tools, editTool, deleteTool, setCurrentTool, openModal, searchTerm, statusFilter, responsibleFilter }) => {

  const [filteredTools, setFilteredTools] = useState(tools);

  useEffect(() => {
    filterTools();
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
      console.log('matchesSearch', matchesSearch);
      console.log('matchesStatus', matchesStatus);
      console.log('matchesResponsible', matchesResponsible);
      console.log('result', matchesSearch && matchesStatus && matchesResponsible);
      return matchesSearch && matchesStatus && matchesResponsible;
    });
    setFilteredTools(filteredTools);
    // if (filteredTools.length === 0) {
    //   //Manejar cuando no hay elementos
    // } else {
    //   setFilteredTools(filteredTools);
    // }

  }

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
              <th scope="col" className="px-6 py-3 text-left whitespace-nowrap text-sm text-gray-500">Próximo Mant.</th>
              <th scope="col" className="px-6 py-3 text-left whitespace-nowrap text-sm text-gray-500">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredTools.map(tool => (
              <ToolCard key={tool.id} tool={tool} deleteTool={deleteTool} setCurrentTool={setCurrentTool} openModal={openModal} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ToolTable;
