import React from 'react';

const Stats = ({ stats }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-gray-500 text-sm font-medium">Total Herramientas</h3>
                <p className="text-2xl font-bold text-gray-800 mt-1">{stats.total}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-gray-500 text-sm font-medium">En Mantenimiento</h3>
                <p className="text-2xl font-bold text-yellow-800 mt-1">{stats.maintenance}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-gray-500 text-sm font-medium">Próximo Mantenimiento</h3>
                <p className="text-2xl font-bold text-blue-800 mt-1">{stats.nextMaintenance}</p>
            </div>
        </div>
    );
};

export default Stats;
