import React from 'react';

const ReportModal = ({ tools, stats, closeModal, modalType }) => {
    const totalLost = tools.filter(t => t.status === 'lost').length;
    const totalAvailable = tools.filter(t => t.status === 'active').length;
    const totalAssigned = tools.filter(t => t.status === 'assigned').length;
    const totalMaintenance = tools.filter(t => t.status === 'maintenance').length;

    if (modalType !== 'report') return null; // Solo muestra el modal si el tipo es 'report'

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-800">Reporte de Inventario</h2>
                    <button onClick={closeModal} className="text-gray-400 hover:text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div className="p-6">
                    <div className="flex justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-medium text-gray-900">Empresa Constructora XYZ</h3>
                            <p className="text-gray-600">Fecha del reporte: {new Date().toLocaleDateString()}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-gray-600">Total herramientas: {stats.total}</p>
                            <p className="text-gray-600">Herramientas perdidas/deterioradas: {totalLost}</p>
                        </div>
                    </div>
                    <div className="mb-8">
                        <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Resumen por Estado</h4>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
                                <p className="text-sm text-gray-500">Disponibles</p>
                                <p className="text-xl font-bold text-gray-800">{totalAvailable}</p>
                            </div>
                            <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
                                <p className="text-sm text-gray-500">Asignadas</p>
                                <p className="text-xl font-bold text-gray-800">{totalAssigned}</p>
                            </div>
                            <div className="bg-white p-4 rounded-lg shadow border-l-4 border-yellow-500">
                                <p className="text-sm text-gray-500">Mantenimiento</p>
                                <p className="text-xl font-bold text-gray-800">{totalMaintenance}</p>
                            </div>
                            <div className="bg-white p-4 rounded-lg shadow border-l-4 border-red-500">
                                <p className="text-sm text-gray-500">Perdidas/Dañadas</p>
                                <p className="text-xl font-bold text-gray-800">{totalLost}</p>
                            </div>
                        </div>
                    </div>
                    <div className="mt-6 flex justify-end space-x-3">
                        <button onClick={closeModal} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors">Cerrar</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReportModal;
