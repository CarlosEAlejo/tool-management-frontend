import React from 'react';

export const Loader = () => (
  <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/90">
    <div className="h-16 w-16 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
    <p className="mt-4 text-slate-600">Cargando, por favor espera...</p>
  </div>
);
