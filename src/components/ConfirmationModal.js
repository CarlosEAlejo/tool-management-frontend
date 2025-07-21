import React from 'react';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, message }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>
            <div className="bg-white rounded-lg shadow-lg p-6 z-10">
                <h2 className="text-lg font-bold mb-4">Confirmación</h2>
                <p>{message}</p>
                <div className="mt-4 flex justify-end">
                    <button className="bg-gray-300 text-gray-700 px-4 py-2 rounded mr-2" onClick={onClose}>
                        Cancelar
                    </button>
                    <button className="bg-red-600 text-white px-4 py-2 rounded" onClick={onConfirm}>
                        Eliminar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
