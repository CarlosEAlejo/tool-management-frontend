import React from 'react';
import { formatDate } from '../../../shared/lib/date';

const cards = (stats) => [
  { label: 'Total Herramientas', value: stats.total, tone: 'text-slate-800' },
  { label: 'En Mantenimiento', value: stats.maintenance, tone: 'text-amber-700' },
  { label: 'Proximo Mantenimiento', value: formatDate(stats.nextMaintenance), tone: 'text-blue-700' },
];

export const ToolStats = ({ stats }) => (
  <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
    {cards(stats).map((card) => (
      <div key={card.label} className="rounded-xl bg-white p-6 shadow">
        <h3 className="text-sm font-medium text-slate-500">{card.label}</h3>
        <p className={`mt-2 text-2xl font-bold ${card.tone}`}>{card.value || '-'}</p>
      </div>
    ))}
  </div>
);
