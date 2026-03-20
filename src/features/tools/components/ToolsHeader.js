import React from 'react';
import { FaDownload, FaPlus } from 'react-icons/fa';
import { Button } from '../../../shared/components/Button';

export const ToolsHeader = ({ onCreate, onReport, onLogout, userEmail, isLoggingOut }) => (
  <header className="mb-8">
    <div className="flex flex-col gap-4 rounded-3xl bg-slate-900 px-6 py-6 text-white shadow-xl shadow-slate-300 md:flex-row md:items-center md:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-blue-300">Administracion segura</p>
        <h1 className="mt-2 text-3xl font-bold">Gestion de Herramientas</h1>
        <p className="mt-2 text-sm text-slate-300">Control de inventario para empresa de construccion.</p>
      </div>

      <div className="flex flex-col items-start gap-3 md:items-end">
        <div className="rounded-full border border-slate-700 bg-slate-800 px-4 py-2 text-sm text-slate-200">
          Sesion: <span className="font-semibold text-white">{userEmail}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button onClick={onCreate}>
            <FaPlus className="h-4 w-4" />
            Nueva Herramienta
          </Button>
          <Button variant="success" onClick={onReport}>
            <FaDownload className="h-4 w-4" />
            Generar Reporte
          </Button>
          <Button variant="secondary" onClick={onLogout}>
            {isLoggingOut ? 'Saliendo...' : 'Cerrar sesion'}
          </Button>
        </div>
      </div>
    </div>
  </header>
);
