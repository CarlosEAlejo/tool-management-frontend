import React from "react";
import type { PropsWithChildren, ReactNode } from "react";

interface ModalShellProps extends PropsWithChildren {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  footer?: ReactNode;
  maxWidth?: string;
}

export const ModalShell = ({ isOpen, title, onClose, footer, children, maxWidth = "max-w-2xl" }: ModalShellProps) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
      <div className={`flex max-h-[90vh] w-full flex-col overflow-hidden rounded-[1.75rem] border border-[var(--border-strong)] bg-[var(--surface-base)] shadow-[var(--shadow-soft)] ${maxWidth}`}>
        <div className="flex items-center justify-between border-b border-[var(--border-subtle)] px-6 py-5">
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">{title}</h2>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-[var(--text-muted)] transition hover:bg-[var(--surface-muted)] hover:text-[var(--text-primary)]"
            onClick={onClose}
            aria-label="Cerrar"
          >
            x
          </button>
        </div>
        <div className="overflow-y-auto p-6">{children}</div>
        {footer ? <div className="border-t border-[var(--border-subtle)] px-6 py-4">{footer}</div> : null}
      </div>
    </div>
  );
};
