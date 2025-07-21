import React, { useState, useEffect } from 'react';
import { FaEdit } from 'react-icons/fa';
import { FaTrash } from 'react-icons/fa';
import { FaEye } from 'react-icons/fa';

const ToolCard = ({ tool, deleteTool, setCurrentTool, openModal }) => {

  const [statusClass, setStatusClass] = useState('');
  const [statusText, setStatusText] = useState('');

  useEffect(() => {
    handleStatus();
  }, [tool]);

  const handleDetails = () => {
    setCurrentTool(tool);
    openModal('details');
  };
  const handleEdit = () => {
    setCurrentTool(tool);
    openModal('edit-tool');
  };

  const handleDelete = () => {
    deleteTool(tool);
  };

  const handleStatus = () => {
    switch (tool.status) {
      case 'active':
        setStatusClass('status-active');
        setStatusText('Disponible');
        break;
      case 'assigned':
        setStatusClass('status-active');
        setStatusText('Asignada');
        break;
      case 'maintenance':
        setStatusClass('status-maintenance');
        setStatusText('Mantenimiento');
        break;
      case 'lost':
        setStatusClass('status-lost');
        setStatusText('Perdida/Dañada');
        break;
    }
  }
  const getTypeText = (type) => {
    const types = {
      'electric': 'Eléctrica',
      'manual': 'Manual',
      'measuring': 'Medición',
      'safety': 'Seguridad',
      'other': 'Otros'
    };
    return types[type] || type;
  }

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{tool.code}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tool.name}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getTypeText(tool.type)}</td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClass}`}>
          {statusText}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tool.responsible || '-'}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tool.assignmentDate || '-'}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tool.nextMaintenance || '-'}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <div className="tooltip">
          <button onClick={handleDetails} className="text-blue-600 hover:text-blue-900 mr-3"><FaEye className="h-4 w-4" /></button>
          <span className="tooltiptext">Ver detalles</span>
        </div>
        <div className="tooltip">
          <button onClick={handleEdit} className="text-green-600 hover:text-green-900 mr-3"><FaEdit className="h-4 w-4" /></button>
          <span className="tooltiptext">Editar herramienta</span>
        </div>
        <div className="tooltip">
          <button onClick={handleDelete} className="text-red-600 hover:text-red-900"><FaTrash className="h-4 w-4" /></button>
          <span className="tooltiptext">Eliminar herramienta</span>
        </div>
      </td>
    </tr>
  );
};

export default ToolCard;
