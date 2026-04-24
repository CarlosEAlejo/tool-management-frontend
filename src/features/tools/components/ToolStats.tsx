import React from "react";
import type { ComponentType } from "react";
import { FaArrowTrendUp, FaTriangleExclamation, FaWrench } from "react-icons/fa6";
import type { IconBaseProps } from "react-icons";
import { formatDate } from "../../../shared/lib/date";
import type { ToolStats as ToolStatsData } from "../../../entities/tool/model";

interface StatCard {
  label: string;
  value: number | string;
  helper: string;
  icon: ComponentType<IconBaseProps>;
  accent: string;
}

interface ToolStatsProps {
  stats: ToolStatsData;
}

const cards = (stats: ToolStatsData): StatCard[] => [
  {
    label: "Total herramientas",
    value: stats.total,
    helper: "Base operativa disponible",
    icon: FaArrowTrendUp,
    accent: "from-sky-500/20 to-blue-500/5 text-sky-700 dark:text-sky-300",
  },
  {
    label: "En mantenimiento",
    value: stats.maintenance,
    helper: "Equipos fuera de servicio",
    icon: FaWrench,
    accent: "from-amber-500/20 to-orange-500/5 text-amber-700 dark:text-amber-300",
  },
  {
    label: "Proximo mantenimiento",
    value: formatDate(stats.nextMaintenance),
    helper: "Fecha mas cercana registrada",
    icon: FaTriangleExclamation,
    accent: "from-emerald-500/20 to-teal-500/5 text-emerald-700 dark:text-emerald-300",
  },
];

export const ToolStats = ({ stats }: ToolStatsProps) => (
  <section>
    <div className="mb-3 flex items-center justify-between gap-3">
      <div>
        <h2 className="text-lg font-semibold text-[var(--text-primary)]">Resumen general</h2>
        <p className="text-sm text-[var(--text-muted)]">Indicadores clave para leer el estado del inventario de un vistazo.</p>
      </div>
    </div>
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
      {cards(stats).map((card) => {
        const Icon = card.icon;
        return (
          <div key={card.label} className="ui-card overflow-hidden">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-sm font-medium text-[var(--text-muted)]">{card.label}</h3>
                <p className="mt-3 text-3xl font-semibold tracking-tight text-[var(--text-primary)]">{card.value}</p>
                <p className="mt-2 text-sm text-[var(--text-muted)]">{card.helper}</p>
              </div>
              <div className={`rounded-2xl bg-gradient-to-br p-4 ${card.accent}`}>
                <Icon className="h-5 w-5" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  </section>
);
