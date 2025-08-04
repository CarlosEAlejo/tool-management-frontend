// Función auxiliar para formatear fechas
export function formatDate(dateString) {
    if (!dateString || dateString === '-') return dateString;
    try {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('es-ES', options);
    } catch {
        return dateString; // Si hay error al parsear, devuelve el string original
    }
}

export const getTypeText = (type) => {
    const types = {
        'electric': 'Eléctrica',
        'manual': 'Manual',
        'measuring': 'Medición',
        'safety': 'Seguridad',
        'other': 'Otros'
    };
    return types[type] || type;
}

export const handleStatusText = (status) => {
    const stats = {
        'active': { class: 'status-active', text: 'Disponible' },
        'assigned': { class: 'status-active', text: 'Asignada' },
        'maintenance': { class: 'status-maintenance', text: 'Mantenimiento' },
        'lost': { class: 'status-lost', text: 'Perdida' },
        'damaged': { class: 'status-lost', text: 'Dañada' },
    };
    return stats[status] || status;
}