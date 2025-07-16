import React from 'react';
import { FaPlus } from 'react-icons/fa';
import { FaDownload } from 'react-icons/fa';


const Header = ({ openModal, generateReport }) => {
  return (
    <header className="mb-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">🏗️ Gestión de Herramientas</h1>
          <p className="text-gray-600">Control de inventario para empresa de construcción</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => openModal('add-tool')} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 transition-colors">
            <FaPlus className="h-5 w-5" />
            Nueva Herramienta
          </button>
          <button onClick={generateReport} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-2 transition-colors">
            <FaDownload className="h-5 w-5" />
            Generar Reporte
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
