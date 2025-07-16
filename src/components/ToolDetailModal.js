import React from 'react';

const ToolDetailModal = ({ tool, editTool, closeModal, modalType }) => {
    if (!tool) return null;

    const handleEdit = () => {
        editTool(tool);
        closeModal();
    };
    
    if (modalType !== 'details') return null; // Solo muestra el modal si el tipo es 'add-tool'

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-800">Detalle de Herramienta</h2>
                    <button onClick={closeModal} className="text-gray-400 hover:text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div className="p-6">
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
                            <p className="mt-1 text-lg font-medium text-gray-900">{tool.type}</p>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-gray-500">Estado</h3>
                            <p className="mt-1 text-lg font-medium text-gray-900">{tool.status}</p>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-gray-500">Responsable</h3>
                            <p className="mt-1 text-lg font-medium text-gray-900">{tool.responsible || '-'}</p>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-gray-500">Fecha Asignación</h3>
                            <p className="mt-1 text-lg font-medium text-gray-900">{tool.assignmentDate || '-'}</p>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-gray-500">Próximo Mantenimiento</h3>
                            <p className="mt-1 text-lg font-medium text-gray-900">{tool.nextMaintenance || '-'}</p>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-gray-500">Ubicación/Almacén</h3>
                            <p className="mt-1 text-lg font-medium text-gray-900">{tool.location || '-'}</p>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-gray-500">Notas/Comentarios</h3>
                        <p className="mt-1 text-gray-900">{tool.notes || '-'}</p>
                    </div>
                    <div className="mt-6 flex justify-end space-x-3">
                        <button onClick={closeModal} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors">Cerrar</button>
                        <button onClick={handleEdit} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors">Editar</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ToolDetailModal;
