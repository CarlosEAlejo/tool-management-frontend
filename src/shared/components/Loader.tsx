import React from "react";

export const Loader = () => (
  <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[var(--app-bg)]/90 backdrop-blur-sm">
    <div className="relative h-20 w-20">
      <div className="absolute inset-0 animate-spin rounded-full border-4 border-emerald-400/30 border-t-emerald-500" />
      <div className="absolute inset-3 rounded-full bg-[var(--surface-base)] shadow-[var(--shadow-card)]" />
    </div>
    <p className="mt-5 text-sm font-medium text-[var(--text-muted)]">Cargando panel operativo...</p>
  </div>
);
