import React from 'react';
import { formatDate, getTypeText, handleStatusText } from '../utils/utils';

const ToolDetailModal = ({ tool, closeModal, openModal, modalType }) => {
    if (!tool) return null;
    if (modalType !== 'details') return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                {/* Header fijo */}
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">
                    <h2 className="text-xl font-semibold text-gray-800">Detalle de Herramienta</h2>
                    <button onClick={closeModal} className="text-gray-400 hover:text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Contenido con scroll */}
                <div className="p-6 overflow-y-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <h3 className="text-sm font-medium text-gray-500">Código</h3>
                            <p className="mt-1 text-lg font-medium text-gray-900">{tool.code}</p>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-gray-500">Nombre</h3>
                            <p className="mt-1 text-lg font-medium text-gray-900">{tool.name}</p>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-gray-500">Tipo</h3>
                            <p className="mt-1 text-lg font-medium text-gray-900">{getTypeText(tool.type)}</p>
                        </div>
                        <div>
                            <h3 className="mb-1 text-sm font-medium text-gray-500">Estado</h3>
                            <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${handleStatusText(tool.status).class}`}>
                                {handleStatusText(tool.status).text || tool.status}
                            </span>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-gray-500">Responsable</h3>
                            <p className="mt-1 text-lg font-medium text-gray-900">{tool.responsible || '-'}</p>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-gray-500">Fecha Asignación</h3>
                            <p className="mt-1 text-lg font-medium text-gray-900">{formatDate(tool.assignmentDate) || '-'}</p>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-gray-500">Último Mantenimiento</h3>
                            <p className="mt-1 text-lg font-medium text-gray-900">{formatDate(tool.dateMaintenance) || '-'}</p>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-gray-500">Próximo Mantenimiento</h3>
                            <p className="mt-1 text-lg font-medium text-gray-900">{formatDate(tool.nextMaintenance) || '-'}</p>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-gray-500">Ubicación/Almacén</h3>
                            <p className="mt-1 text-lg font-medium text-gray-900">{tool.location || '-'}</p>
                        </div>
                    </div>

                    <div className="mb-6">
                        <h3 className="text-sm font-medium text-gray-500">Notas/Comentarios</h3>
                        <p className="mt-1 text-gray-900">{tool.notes || '-'}</p>
                    </div>

                    {/* Historial de Asignaciones */}
                    <div className="mb-6 relative">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2 sticky top-0 bg-white py-2 z-5">
                            Historial de Asignaciones
                        </h3>
                        <ul className="space-y-2 mt-2">
                            {tool.assignmentHistory?.length > 0 ? (
                                tool.assignmentHistory.map((assignment, index) => (
                                    <li key={index} className="border border-gray-200 rounded p-3 hover:bg-gray-50">
                                        <p className="text-sm font-medium text-gray-700">Responsable: {assignment.responsible}</p>
                                        <p className="text-xs text-gray-500 mt-1">Fecha: {formatDate(assignment.assignmentDate)}</p>
                                    </li>
                                ))
                            ) : (
                                <p className="text-gray-500 py-3 text-center">No hay historial de asignaciones</p>
                            )}
                        </ul>
                    </div>

                    {/* Registro de Mantenimiento */}
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2 sticky top-0 bg-white py-2 z-5">
                            Registro de Mantenimiento
                        </h3>
                        <div className="space-y-2 mt-2">
                            {tool.maintenanceRecord?.length > 0 ? (
                                tool.maintenanceRecord.map((record, index) => (
                                    <div key={index} className="border border-gray-200 rounded p-3 hover:bg-gray-50 grid grid-cols-2 gap-2">
                                        <div>
                                            <p className="text-xs font-medium text-gray-500">Último mantenimiento:</p>
                                            <p className="text-sm text-gray-700">{formatDate(record.dateMaintenance)}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-medium text-gray-500">Próximo mantenimiento:</p>
                                            <p className="text-sm text-gray-700">{formatDate(record.nextMaintenance)}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 py-3 text-center">No hay registros de mantenimiento</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer fijo */}
                <div className="px-6 py-3 border-t border-gray-200 sticky bottom-0 bg-white flex justify-end space-x-3">
                    <button onClick={closeModal} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors">
                        Cerrar
                    </button>
                    <button onClick={() => openModal('edit-tool')} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors">
                        Editar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ToolDetailModal;
