import React from 'react';
import { FaDownload, FaPlus } from 'react-icons/fa';
import { Button } from '../../../shared/components/Button';

export const ToolsHeader = ({ onCreate, onReport }) => (
  <header className="mb-8">
    <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Gestion de Herramientas</h1>
        <p className="text-slate-600">Control de inventario para empresa de construccion</p>
      </div>
      <div className="flex gap-2">
        <Button onClick={onCreate}>
          <FaPlus className="h-4 w-4" />
          Nueva Herramienta
        </Button>
        <Button variant="success" onClick={onReport}>
          <FaDownload className="h-4 w-4" />
          Generar Reporte
        </Button>
      </div>
    </div>
  </header>
);
