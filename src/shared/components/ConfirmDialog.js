import React from 'react';
import { Button } from './Button';
import { ModalShell } from './ModalShell';

export const ConfirmDialog = ({ isOpen, title, message, confirmLabel, onCancel, onConfirm }) => (
  <ModalShell
    isOpen={isOpen}
    onClose={onCancel}
    title={title}
    maxWidth="max-w-lg"
    footer={
      <div className="flex justify-end gap-3">
        <Button variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
        <Button variant="danger" onClick={onConfirm}>
          {confirmLabel}
        </Button>
      </div>
    }
  >
    <p className="text-sm leading-6 text-[var(--text-muted)]">{message}</p>
  </ModalShell>
);
