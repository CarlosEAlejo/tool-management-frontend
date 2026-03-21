import React, { useEffect, useRef, useState } from 'react';
import { FaEdit, FaEllipsisV, FaEye, FaTrash } from 'react-icons/fa';
import { getStatusMeta, getTypeLabel } from '../../../entities/tool/model';
import { formatDate } from '../../../shared/lib/date';

export const ToolRow = ({ tool, onView, onEdit, onDelete }) => {
  const status = getStatusMeta(tool.status);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!menuOpen) {
      return undefined;
    }

    const handlePointerDown = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [menuOpen]);

  const handleAction = (callback) => {
    setMenuOpen(false);
    callback();
  };

  return (
    <tr className="transition hover:bg-[var(--surface-muted)]/60">
      <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-[var(--text-primary)]">{tool.code}</td>
      <td className="whitespace-nowrap px-6 py-4 text-sm text-[var(--text-secondary)]">{tool.name}</td>
      <td className="whitespace-nowrap px-6 py-4 text-sm text-[var(--text-muted)]">{getTypeLabel(tool.type)}</td>
      <td className="whitespace-nowrap px-6 py-4">
        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${status.badgeClassName}`}>{status.label}</span>
      </td>
      <td className="whitespace-nowrap px-6 py-4 text-sm text-[var(--text-muted)]">{tool.responsible || '-'}</td>
      <td className="whitespace-nowrap px-6 py-4 text-sm text-[var(--text-muted)]">{formatDate(tool.assignmentDate)}</td>
      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
        <div className="relative flex justify-end" ref={menuRef}>
          <button
            type="button"
            aria-label={`Abrir acciones ${tool.name}`}
            aria-expanded={menuOpen}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border-subtle)] bg-[var(--surface-base)] text-[var(--text-secondary)] transition hover:border-[var(--border-accent)] hover:bg-[var(--surface-accent)]"
            onClick={() => setMenuOpen((current) => !current)}
          >
            <FaEllipsisV className="h-4 w-4" />
          </button>

          {menuOpen ? (
            <div className="absolute right-0 top-12 z-10 min-w-[190px] rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-base)] p-2 shadow-[var(--shadow-card)]">
              <button
                type="button"
                aria-label={`Ver ${tool.name}`}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm text-sky-700 transition hover:bg-sky-500/10 dark:text-sky-300"
                onClick={() => handleAction(onView)}
              >
                <FaEye className="h-4 w-4" />
                <span>Ver detalle</span>
              </button>
              <button
                type="button"
                aria-label={`Editar ${tool.name}`}
                className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm text-emerald-700 transition hover:bg-emerald-500/10 dark:text-emerald-300"
                onClick={() => handleAction(onEdit)}
              >
                <FaEdit className="h-4 w-4" />
                <span>Editar</span>
              </button>
              <button
                type="button"
                aria-label={`Eliminar ${tool.name}`}
                className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm text-rose-700 transition hover:bg-rose-500/10 dark:text-rose-300"
                onClick={() => handleAction(onDelete)}
              >
                <FaTrash className="h-4 w-4" />
                <span>Eliminar</span>
              </button>
            </div>
          ) : null}
        </div>
      </td>
    </tr>
  );
};
