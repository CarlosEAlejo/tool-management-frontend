import React from 'react';
import { FaEdit, FaEye, FaTrash } from 'react-icons/fa';
import { getStatusMeta, getTypeLabel } from '../../../entities/tool/model';
import { formatDate } from '../../../shared/lib/date';

export const ToolRow = ({ tool, onView, onEdit, onDelete }) => {
  const status = getStatusMeta(tool.status);

  return (
    <tr className="hover:bg-slate-50">
      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-900">{tool.code}</td>
      <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">{tool.name}</td>
      <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">{getTypeLabel(tool.type)}</td>
      <td className="whitespace-nowrap px-6 py-4">
        <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${status.badgeClassName}`}>{status.label}</span>
      </td>
      <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">{tool.responsible || '-'}</td>
      <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">{formatDate(tool.assignmentDate)}</td>
      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
        <div className="flex gap-3">
          <button aria-label={`Ver ${tool.name}`} className="text-blue-600 hover:text-blue-800" onClick={onView}>
            <FaEye className="h-4 w-4" />
          </button>
          <button aria-label={`Editar ${tool.name}`} className="text-emerald-600 hover:text-emerald-800" onClick={onEdit}>
            <FaEdit className="h-4 w-4" />
          </button>
          <button aria-label={`Eliminar ${tool.name}`} className="text-rose-600 hover:text-rose-800" onClick={onDelete}>
            <FaTrash className="h-4 w-4" />
          </button>
        </div>
      </td>
    </tr>
  );
};
