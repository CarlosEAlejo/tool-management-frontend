import React from 'react';
import { ToolRow } from './ToolRow';

export const ToolTable = ({ tools, onView, onEdit, onDelete }) => (
  <div className="overflow-hidden rounded-xl bg-white shadow">
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            {['Codigo', 'Nombre', 'Tipo', 'Estado', 'Responsable', 'Fecha Asignacion', 'Acciones'].map((header) => (
              <th key={header} className="whitespace-nowrap px-6 py-3 text-left text-sm font-medium text-slate-500">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 bg-white">
          {tools.length > 0 ? (
            tools.map((tool) => (
              <ToolRow
                key={tool.id}
                tool={tool}
                onView={() => onView(tool)}
                onEdit={() => onEdit(tool)}
                onDelete={() => onDelete(tool)}
              />
            ))
          ) : (
            <tr>
              <td colSpan={7} className="px-6 py-8 text-center text-sm text-slate-500">
                No hay herramientas para los filtros seleccionados.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
);
