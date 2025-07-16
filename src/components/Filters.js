import React from 'react';

const Filters = ({ searchTerm, setSearchTerm, statusFilter, setStatusFilter, responsibleFilter, setResponsibleFilter, responsibles }) => {
    return (
        <div className="bg-white rounded-lg shadow p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
                <div className="w-full md:w-1/3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Buscar Herramienta</label>
                    <input
                        type="text"
                        placeholder="Nombre o código..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="w-full md:w-1/3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="all">Todos</option>
                        <option value="active">Disponible</option>
                        <option value="assigned">Asignada</option>
                        <option value="maintenance">Mantenimiento</option>
                        <option value="lost">Perdida/Dañada</option>
                    </select>
                </div>
                <div className="w-full md:w-1/3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Responsable</label>
                    <select
                        value={responsibleFilter}
                        onChange={(e) => setResponsibleFilter(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="all">Todos</option>
                        {responsibles.map((responsible, index) => (
                            <option key={index} value={responsible}>{responsible}</option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
};

export default Filters;
