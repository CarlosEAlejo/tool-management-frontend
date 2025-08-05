import React, { useState, useEffect } from 'react';
import { formatDate } from '../utils/utils';

const Stats = ({ tools, updateStats }) => {
    const [stats, setStats] = useState({
        total: 0,
        active: 0,
        assigned: 0,
        damaged: 0,
        maintenance: 0,
        nextMaintenance: '-'
    });

    const updateComponentStats = () => {
        const total = tools.length;
        const active = tools.filter(t => t.status === 'active').length;
        const assigned = tools.filter(t => t.status === 'assigned').length;
        const damaged = tools.filter(t => t.status === 'damaged').length;
        const maintenance = tools.filter(t => t.status === 'maintenance').length;

        let nextMaintenanceDate = '-';
        const nextMaintenance = tools
            .filter(t => t.nextMaintenance)
            .map(t => new Date(t.nextMaintenance))
            .filter(date => !isNaN(date.getTime()));

        if (nextMaintenance.length > 0) {
            const nextDate = new Date(Math.min(...nextMaintenance.map(date => date.getTime())));
            nextMaintenanceDate = nextDate.toLocaleDateString();
        }

        const newStats = {
            total,
            active,
            assigned,
            damaged,
            maintenance,
            nextMaintenance: formatDate(nextMaintenanceDate),
        };
        setStats(newStats);
        updateStats(newStats)
    };

    // Efecto para actualizar estadísticas cada vez que cambie el estado de tools
    useEffect(() => {
        if (Array.isArray(tools)) {
            updateComponentStats();
        }
    }, [tools]); // Solo se ejecuta cuando tools cambia

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-gray-500 text-sm font-medium">Total Herramientas</h3>
                <p className="text-2xl font-bold text-gray-800 mt-1">{stats.total}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-gray-500 text-sm font-medium">Disponibles</h3>
                <p className="text-2xl font-bold text-green-800 mt-1">{stats.active}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-gray-500 text-sm font-medium">Asignadas</h3>
                <p className="text-2xl font-bold text-blue-800 mt-1">{stats.assigned}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-gray-500 text-sm font-medium">Dañadas</h3>
                <p className="text-2xl font-bold text-red-800 mt-1">{stats.damaged}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-gray-500 text-sm font-medium">En Mantenimiento</h3>
                <p className="text-2xl font-bold text-yellow-800 mt-1">{stats.maintenance}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-gray-500 text-sm font-medium">Próximo Mantenimiento</h3>
                <p className="text-2xl font-bold text-yellow-800 mt-1">{stats.nextMaintenance}</p>
            </div>
        </div>
    );
};

export default Stats;
