import React from 'react';

export const PlaceholderPage = ({ title }) => (
  <section className="rounded-[2rem] border border-[var(--border-strong)] bg-[var(--surface-base)]/92 p-8 shadow-[var(--shadow-card)]">
    <div className="max-w-2xl">
      <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[var(--text-muted)]">Categoria futura</p>
      <h3 className="mt-3 text-3xl font-semibold text-[var(--text-primary)]">{title}</h3>
      <p className="mt-4 text-base leading-7 text-[var(--text-muted)]">
        Esta seccion ya tiene un espacio reservado dentro de la nueva shell. Cuando se implemente el modulo, heredara el
        mismo sistema visual, navegacion y soporte de tema sin tener que rehacer la estructura general.
      </p>
      <div className="mt-8 rounded-[1.5rem] border border-dashed border-[var(--border-accent)] bg-[var(--surface-accent)] p-6">
        <p className="text-sm font-medium text-[var(--text-primary)]">Estado actual</p>
        <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
          Navegacion, jerarquia visual y layout base listos. Pendiente agregar logica funcional y datos del modulo.
        </p>
      </div>
    </div>
  </section>
);
