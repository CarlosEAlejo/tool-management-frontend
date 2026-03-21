import React from 'react';

const variants = {
  primary:
    'border border-transparent bg-[linear-gradient(135deg,#1d4ed8,#0f766e)] text-white shadow-[0_14px_30px_rgba(29,78,216,0.22)] hover:brightness-105',
  secondary:
    'border border-[var(--border-subtle)] bg-[var(--surface-base)] text-[var(--text-primary)] hover:border-[var(--border-accent)] hover:bg-[var(--surface-accent)]',
  success:
    'border border-transparent bg-[linear-gradient(135deg,#15803d,#0f766e)] text-white shadow-[0_14px_30px_rgba(21,128,61,0.24)] hover:brightness-105',
  danger:
    'border border-transparent bg-[linear-gradient(135deg,#dc2626,#be185d)] text-white shadow-[0_14px_30px_rgba(190,24,93,0.2)] hover:brightness-105',
  ghost: 'border border-transparent bg-transparent text-[var(--text-secondary)] hover:bg-[var(--surface-muted)]',
};

export const Button = ({ type = 'button', variant = 'primary', className = '', ...props }) => (
  <button
    type={type}
    className={`inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold transition duration-200 disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${className}`}
    {...props}
  />
);
