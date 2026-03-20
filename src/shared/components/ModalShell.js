import React from 'react';

export const ModalShell = ({ isOpen, title, onClose, footer, children, maxWidth = 'max-w-2xl' }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className={`flex max-h-[90vh] w-full flex-col overflow-hidden rounded-xl bg-white shadow-xl ${maxWidth}`}>
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <h2 className="text-xl font-semibold text-slate-800">{title}</h2>
          <button className="text-slate-400 hover:text-slate-600" onClick={onClose}>
            X
          </button>
        </div>
        <div className="overflow-y-auto p-6">{children}</div>
        {footer ? <div className="border-t border-slate-200 px-6 py-4">{footer}</div> : null}
      </div>
    </div>
  );
};
