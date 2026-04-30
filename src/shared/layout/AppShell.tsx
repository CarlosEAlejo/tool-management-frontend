import React, { useState } from "react";
import type { ComponentType } from "react";
import { FaBoxOpen, FaClipboardList, FaMoon, FaSun, FaToolbox, FaUsers, FaWrench } from "react-icons/fa";
import type { IconBaseProps } from "react-icons";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../features/auth/context/AuthContext";
import { useTheme } from "../../features/theme/context/ThemeContext";
import { Button } from "../components/Button";

interface NavigationItem {
  label: string;
  description: string;
  to: string;
  icon: ComponentType<IconBaseProps>;
  available: boolean;
}

const navigationItems: NavigationItem[] = [
  {
    label: "Herramientas",
    description: "Inventario, filtros y reportes",
    to: "/tools",
    icon: FaToolbox,
    available: true,
  },
  {
    label: "Trabajadores",
    description: "Personal y cargos operativos",
    to: "/workers",
    icon: FaUsers,
    available: true,
  },
  {
    label: "Asignaciones",
    description: "Asignar y devolver herramientas",
    to: "/assignments",
    icon: FaClipboardList,
    available: true,
  },
  {
    label: "Mantenimiento",
    description: "Programar y cerrar mantenimientos",
    to: "/maintenance",
    icon: FaWrench,
    available: true,
  },
  {
    label: "Inventario general",
    description: "Nuevas categorias futuras",
    to: "/inventory",
    icon: FaBoxOpen,
    available: false,
  },
];

const getPageMeta = (pathname: string) => {
  if (pathname.startsWith("/tools")) {
    return {
      eyebrow: "Panel operativo",
      title: "Gestion de herramientas",
      description: "Inventario, filtros y acciones principales en una vista mas compacta y clara.",
    };
  }

  if (pathname.startsWith("/workers")) {
    return {
      eyebrow: "Panel operativo",
      title: "Gestion de trabajadores",
      description: "Control del personal para asignaciones y seguimiento operativo.",
    };
  }

  if (pathname.startsWith("/assignments")) {
    return {
      eyebrow: "Panel operativo",
      title: "Gestion de asignaciones",
      description: "Asigna, reasigna y devuelve herramientas con historial centralizado.",
    };
  }

  if (pathname.startsWith("/maintenance")) {
    return {
      eyebrow: "Panel operativo",
      title: "Gestion de mantenimiento",
      description: "Programa y cierra mantenimientos con historial centralizado.",
    };
  }

  return {
    eyebrow: "Expansion del sistema",
    title: "Categoria en preparacion",
    description: "La arquitectura de navegacion ya esta lista para sumar nuevos modulos sin redisenar la aplicacion.",
  };
};

const renderNavigationItem = (item: NavigationItem) => {
  const Icon = item.icon;

  if (!item.available) {
    return (
      <div key={item.label} className="flex items-start gap-3 rounded-2xl border border-transparent px-4 py-3 text-[var(--text-muted)] opacity-80">
        <div className="mt-1 rounded-xl bg-[var(--surface-muted)] p-3 text-[var(--text-secondary)]">
          <Icon className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <p className="text-sm font-semibold text-[var(--text-secondary)]">{item.label}</p>
            <span className="inline-flex self-start rounded-full border border-[var(--border-subtle)] px-2 py-0.5 text-[11px] uppercase tracking-[0.2em]">
              Proximamente
            </span>
          </div>
          <p className="mt-1 text-sm leading-5">{item.description}</p>
        </div>
      </div>
    );
  }

  return (
    <NavLink
      key={item.label}
      to={item.to}
      className={({ isActive }) =>
        `group flex items-start gap-3 rounded-2xl border px-4 py-3 transition ${
          isActive
            ? "border-[var(--border-accent)] bg-[var(--surface-accent)] text-[var(--text-primary)] shadow-[var(--shadow-card)]"
            : "border-transparent text-[var(--text-muted)] hover:border-[var(--border-subtle)] hover:bg-[var(--surface-muted)]"
        }`
      }
    >
      <div className="mt-1 rounded-xl bg-[var(--surface-muted)] p-3 text-[var(--text-secondary)] transition group-hover:text-[var(--text-primary)]">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold">{item.label}</p>
        <p className="mt-1 text-sm leading-5 text-[var(--text-muted)]">{item.description}</p>
      </div>
    </NavLink>
  );
};

const renderCompactNavigationItem = (item: NavigationItem) => {
  const Icon = item.icon;

  if (!item.available) {
    return (
      <div
        key={item.label}
        className="inline-flex min-w-fit items-center gap-2 rounded-full border border-[var(--border-subtle)] bg-[var(--surface-base)]/80 px-3 py-2 text-sm text-[var(--text-muted)]"
      >
        <Icon className="h-4 w-4" />
        <span>{item.label}</span>
        <span className="text-[10px] uppercase tracking-[0.2em]">Soon</span>
      </div>
    );
  }

  return (
    <NavLink
      key={item.label}
      to={item.to}
      className={({ isActive }) =>
        `inline-flex min-w-fit items-center gap-2 rounded-full border px-3 py-2 text-sm font-medium transition ${
          isActive
            ? "border-[var(--border-accent)] bg-[var(--surface-accent)] text-[var(--text-primary)]"
            : "border-[var(--border-subtle)] bg-[var(--surface-base)]/80 text-[var(--text-muted)]"
        }`
      }
    >
      <Icon className="h-4 w-4" />
      <span>{item.label}</span>
    </NavLink>
  );
};

export const AppShell = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const pageMeta = getPageMeta(location.pathname);
  const [logoutError, setLogoutError] = useState("");

  const handleLogout = async () => {
    setLogoutError("");

    try {
      await logout();
      navigate("/login", { replace: true });
    } catch (error) {
      setLogoutError(error instanceof Error ? error.message : "No se pudo cerrar la sesion");
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[var(--app-bg)] text-[var(--text-primary)]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-8rem] top-[-5rem] h-72 w-72 rounded-full bg-[var(--accent-soft)] blur-3xl" />
        <div className="absolute bottom-[-9rem] right-[-7rem] h-80 w-80 rounded-full bg-[var(--accent-soft-2)] blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-screen w-full max-w-[1600px] gap-6 px-4 py-4 md:px-6 lg:px-8">
        <aside className="hidden w-80 shrink-0 lg:block">
          <div className="sticky top-4 flex flex-col rounded-[2rem] border border-[var(--border-strong)] bg-[var(--surface-strong)]/95 p-6 shadow-[var(--shadow-soft)] backdrop-blur">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[var(--text-muted)]">Navegacion</p>
              <h1 className="mt-3 text-2xl font-semibold text-[var(--text-primary)]">Panel operativo</h1>
            </div>

            <nav className="mt-6 space-y-3" aria-label="Navegacion principal">
              {navigationItems.map((item) => renderNavigationItem(item))}
            </nav>

            <div className="mt-6 rounded-[1.5rem] border border-[var(--border-subtle)] bg-[var(--surface-base)]/80 p-4 shadow-[var(--shadow-card)]">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--text-muted)]">Sesion activa</p>
              <p className="mt-2 break-words text-sm font-medium text-[var(--text-primary)]">{user?.email || "Administrador"}</p>
              <p className="mt-1 text-sm text-[var(--text-muted)]">Controles globales del panel.</p>
              {logoutError ? <p className="mt-3 text-sm text-rose-600 dark:text-rose-300">{logoutError}</p> : null}
              <div className="mt-4 grid gap-3">
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="inline-flex items-center justify-center gap-3 rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-muted)] px-4 py-3 text-sm font-medium text-[var(--text-primary)] transition hover:border-[var(--border-accent)] hover:bg-[var(--surface-accent)]"
                  aria-label="Cambiar tema"
                >
                  {isDark ? <FaSun className="h-4 w-4 text-amber-400" /> : <FaMoon className="h-4 w-4 text-indigo-500" />}
                  <span>{isDark ? "Cambiar a tema claro" : "Cambiar a tema oscuro"}</span>
                </button>
                <Button variant="secondary" onClick={() => void handleLogout()} className="w-full">
                  Cerrar sesion
                </Button>
              </div>
            </div>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="mb-5 rounded-[2rem] border border-[var(--border-strong)] bg-[var(--surface-base)]/85 px-4 py-4 shadow-[var(--shadow-card)] backdrop-blur lg:hidden">
            <div className="flex flex-col gap-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[var(--text-muted)]">{pageMeta.eyebrow}</p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[var(--text-primary)]">{pageMeta.title}</h2>
                </div>
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[var(--border-subtle)] bg-[var(--surface-muted)] text-[var(--text-primary)] transition hover:border-[var(--border-accent)] hover:bg-[var(--surface-accent)]"
                  aria-label="Cambiar tema"
                >
                  {isDark ? <FaSun className="h-4 w-4 text-amber-400" /> : <FaMoon className="h-4 w-4 text-indigo-500" />}
                </button>
              </div>

              <p className="text-sm leading-6 text-[var(--text-muted)]">{pageMeta.description}</p>

              <div className="flex flex-wrap items-center gap-2">{navigationItems.map((item) => renderCompactNavigationItem(item))}</div>

              <div className="flex items-center justify-between gap-3 rounded-[1.5rem] border border-[var(--border-subtle)] bg-[var(--surface-base)]/80 px-4 py-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--text-muted)]">Sesion activa</p>
                  <p className="mt-1 text-sm font-medium text-[var(--text-primary)]">{user?.email || "Administrador"}</p>
                  {logoutError ? <p className="mt-2 text-sm text-rose-600 dark:text-rose-300">{logoutError}</p> : null}
                </div>
                <Button variant="secondary" onClick={() => void handleLogout()}>
                  Salir
                </Button>
              </div>
            </div>
          </header>

          <main>
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};
