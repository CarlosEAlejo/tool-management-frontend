import React from 'react';
const LoadingComponent = () => {
    return (
        <div className="fixed inset-0 bg-white bg-opacity-90 flex flex-col items-center justify-center z-50">
            <div className="relative w-20 h-20 mb-6">
                {/* Spinner principal */}
                <div className="loader-spinner absolute inset-0 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>

                {/* Logo o ícono central (opcional) */}
                <div className="absolute inset-4 flex items-center justify-center">
                    <svg className="w-8 h-8 text-blue-600 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v8l4 4" />
                    </svg>
                </div>
            </div>
            <p className="text-lg text-gray-700">Cargando, por favor espera...</p>
        </div>
    );
};
export default LoadingComponent;