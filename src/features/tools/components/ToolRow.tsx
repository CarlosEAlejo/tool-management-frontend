import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { FaEdit, FaEllipsisV, FaEye, FaTrash } from "react-icons/fa";
import { getStatusMeta, getTypeLabel } from "../../../entities/tool/model";
import { formatDate } from "../../../shared/lib/date";
import type { Tool } from "../../../entities/tool/model";

interface ToolRowProps {
  tool: Tool;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

interface MenuPosition {
  top: number;
  left: number;
}

const MENU_WIDTH = 208;
const MENU_FALLBACK_HEIGHT = 164;
const MENU_GAP = 8;
const VIEWPORT_PADDING = 16;

const getMenuPosition = (button: HTMLButtonElement, menuHeight: number): MenuPosition => {
  const buttonRect = button.getBoundingClientRect();
  const fitsBelow = buttonRect.bottom + MENU_GAP + menuHeight <= window.innerHeight - VIEWPORT_PADDING;
  const top = fitsBelow
    ? buttonRect.bottom + MENU_GAP
    : Math.max(VIEWPORT_PADDING, buttonRect.top - menuHeight - MENU_GAP);
  const left = Math.min(
    Math.max(VIEWPORT_PADDING, buttonRect.right - MENU_WIDTH),
    window.innerWidth - MENU_WIDTH - VIEWPORT_PADDING
  );

  return { top, left };
};

export const ToolRow = ({ tool, onView, onEdit, onDelete }: ToolRowProps) => {
  const status = getStatusMeta(tool.status);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState<MenuPosition | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!menuOpen || !buttonRef.current) {
      return undefined;
    }

    const updateMenuPosition = () => {
      if (!buttonRef.current) {
        return;
      }

      const nextHeight = menuRef.current?.offsetHeight ?? MENU_FALLBACK_HEIGHT;
      setMenuPosition(getMenuPosition(buttonRef.current, nextHeight));
    };

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) {
        return;
      }

      if (menuRef.current?.contains(target) || buttonRef.current?.contains(target)) {
        return;
      }

      setMenuOpen(false);
      setMenuPosition(null);
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        setMenuPosition(null);
      }
    };

    updateMenuPosition();

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);
    window.addEventListener("resize", updateMenuPosition);
    window.addEventListener("scroll", updateMenuPosition, true);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
      window.removeEventListener("resize", updateMenuPosition);
      window.removeEventListener("scroll", updateMenuPosition, true);
    };
  }, [menuOpen]);

  const handleAction = (callback: () => void) => {
    setMenuOpen(false);
    setMenuPosition(null);
    callback();
  };

  const handleToggleMenu = () => {
    if (menuOpen) {
      setMenuOpen(false);
      setMenuPosition(null);
      return;
    }

    if (!buttonRef.current) {
      return;
    }

    setMenuPosition(getMenuPosition(buttonRef.current, MENU_FALLBACK_HEIGHT));
    setMenuOpen(true);
  };

  return (
    <>
      <tr className="transition hover:bg-[var(--surface-muted)]/60">
        <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-[var(--text-primary)]">{tool.code}</td>
        <td className="whitespace-nowrap px-6 py-4 text-sm text-[var(--text-secondary)]">{tool.name}</td>
        <td className="whitespace-nowrap px-6 py-4 text-sm text-[var(--text-muted)]">{getTypeLabel(tool.type)}</td>
        <td className="whitespace-nowrap px-6 py-4">
          <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${status.badgeClassName}`}>{status.label}</span>
        </td>
        <td className="whitespace-nowrap px-6 py-4 text-sm text-[var(--text-muted)]">{tool.responsible || "-"}</td>
        <td className="whitespace-nowrap px-6 py-4 text-sm text-[var(--text-muted)]">{formatDate(tool.assignmentDate)}</td>
        <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
          <div className="flex justify-end">
            <button
              ref={buttonRef}
              type="button"
              aria-label={`Abrir acciones ${tool.name}`}
              aria-expanded={menuOpen}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border-subtle)] bg-[var(--surface-base)] text-[var(--text-secondary)] transition hover:border-[var(--border-accent)] hover:bg-[var(--surface-accent)]"
              onClick={handleToggleMenu}
            >
              <FaEllipsisV className="h-4 w-4" />
            </button>
          </div>
        </td>
      </tr>

      {menuOpen && menuPosition
        ? createPortal(
            <div
              ref={menuRef}
              className="fixed z-[80] min-w-[208px] rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-base)] p-2 shadow-[var(--shadow-soft)]"
              style={{ top: menuPosition.top, left: menuPosition.left }}
            >
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
            </div>,
            document.body
          )
        : null}
    </>
  );
};
