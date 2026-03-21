import React from "react";
import type { PropsWithChildren, ReactNode } from "react";
import { FaMoon, FaSun } from "react-icons/fa";
import { useTheme } from "../../theme/context/ThemeContext";

interface AuthLayoutProps extends PropsWithChildren {
  eyebrow: string;
  title: string;
  description: string;
  accent?: string;
  footer?: ReactNode;
}

export const AuthLayout = ({ eyebrow, title, description, accent = "from-sky-600 to-emerald-500", footer, children }: AuthLayoutProps) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[var(--app-bg)] px-4 py-10 text-[var(--text-primary)]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-4rem] top-[-4rem] h-72 w-72 rounded-full bg-[var(--accent-soft)] blur-3xl" />
        <div className="absolute bottom-[-6rem] right-[-5rem] h-80 w-80 rounded-full bg-[var(--accent-soft-2)] blur-3xl" />
      </div>

      <button
        type="button"
        onClick={toggleTheme}
        className="absolute right-5 top-5 inline-flex items-center gap-3 rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-base)]/90 px-4 py-3 text-sm font-medium text-[var(--text-primary)] shadow-[var(--shadow-card)] backdrop-blur transition hover:border-[var(--border-accent)] hover:bg-[var(--surface-accent)]"
        aria-label="Cambiar tema"
      >
        {isDark ? <FaSun className="h-4 w-4 text-amber-400" /> : <FaMoon className="h-4 w-4 text-indigo-500" />}
        <span>{isDark ? "Tema oscuro" : "Tema claro"}</span>
      </button>

      <div className="relative grid w-full max-w-6xl gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <section className="hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,var(--brand-start),var(--brand-end))] p-10 text-white shadow-[var(--shadow-soft)] lg:block">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-white/70">Tool Hub</p>
          <h1 className="mt-5 text-5xl font-semibold leading-tight">Control visual armonico para operaciones tecnicas.</h1>
          <p className="mt-6 max-w-xl text-base leading-8 text-white/78">
            Un acceso moderno al sistema administrativo con estructura lista para inventario, mantenimiento y nuevas categorias.
          </p>
          <div className="mt-10 grid grid-cols-2 gap-4 text-sm text-white/80">
            <div className="rounded-[1.5rem] border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
              Navegacion preparada para crecer sin rehacer el frontend.
            </div>
            <div className="rounded-[1.5rem] border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
              Tema claro y oscuro persistente en toda la experiencia.
            </div>
          </div>
        </section>

        <section className="ui-panel w-full max-w-xl justify-self-center px-8 py-8">
          <div className={`inline-flex rounded-full bg-gradient-to-r ${accent} px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-white`}>
            {eyebrow}
          </div>
          <h2 className="mt-5 text-3xl font-semibold tracking-tight text-[var(--text-primary)]">{title}</h2>
          <p className="mt-3 text-sm leading-7 text-[var(--text-muted)]">{description}</p>

          <div className="mt-8">{children}</div>

          {footer ? <div className="mt-6 text-sm text-[var(--text-muted)]">{footer}</div> : null}
        </section>
      </div>
    </div>
  );
};
