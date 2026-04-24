import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { FaEdit, FaEllipsisV, FaTrash } from "react-icons/fa";
import { getWorkerFullName } from "../../../entities/worker/model";
import type { Worker } from "../../../entities/worker/model";

interface WorkerRowProps {
  worker: Worker;
  onEdit: () => void;
  onDelete: () => void;
}

interface MenuPosition {
  top: number;
  left: number;
}

const MENU_WIDTH = 208;
const MENU_FALLBACK_HEIGHT = 116;
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

export const WorkerRow = ({ worker, onEdit, onDelete }: WorkerRowProps) => {
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
        <td className="whitespace-nowrap px-6 py-4 align-middle text-sm font-semibold text-[var(--text-primary)]">{getWorkerFullName(worker)}</td>
        <td className="whitespace-nowrap px-6 py-4 align-middle text-sm text-[var(--text-secondary)]">{worker.position}</td>
        <td className="whitespace-nowrap px-6 py-4 align-middle text-sm text-[var(--text-muted)]">{worker.email || "-"}</td>
        <td className="whitespace-nowrap px-6 py-4 align-middle text-sm text-[var(--text-muted)]">{worker.phone || "-"}</td>
        <td className="w-28 whitespace-nowrap px-6 py-4 align-middle text-sm font-medium">
          <div className="flex items-center justify-center">
            <button
              ref={buttonRef}
              type="button"
              aria-label={`Abrir acciones ${getWorkerFullName(worker)}`}
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
                aria-label={`Editar ${getWorkerFullName(worker)}`}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm text-emerald-700 transition hover:bg-emerald-500/10 dark:text-emerald-300"
                onClick={() => handleAction(onEdit)}
              >
                <FaEdit className="h-4 w-4" />
                <span>Editar</span>
              </button>
              <button
                type="button"
                aria-label={`Eliminar ${getWorkerFullName(worker)}`}
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
