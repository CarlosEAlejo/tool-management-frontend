import React, { useState } from 'react';

const AddToolModal = ({ addTool, editTool, closeModal, modalType, tool }) => {
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    type: 'electric',
    status: 'active',
    responsible: '',
    assignmentDate: '',
    dateMaintenance: '',
    nextMaintenance: '',
    deterioration: false,
    location: '',
    notes: '',
  });

  // Si el modal es para editar, prellenar los datos
  React.useEffect(() => {
    if (modalType === 'edit-tool' && tool) {
      setFormData(tool);
    } else {
      setFormData({
        code: '',
        name: '',
        type: 'electric',
        status: 'active',
        responsible: '',
        assignmentDate: '',
        dateMaintenance: '',
        nextMaintenance: '',
        deterioration: false,
        location: '',
        notes: '',
      });
    }
  }, [modalType, tool]);

  const handleChange = (e) => {

    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (modalType === 'add-tool') {
      addTool(formData);
      setFormData({
        code: '',
        name: '',
        type: 'electric',
        status: 'active',
        responsible: '',
        assignmentDate: '',
        dateMaintenance: '',
        nextMaintenance: '',
        deterioration: false,
        location: '',
        notes: '',
      });
    } else if (modalType === 'edit-tool') {
      let editFormdata = formData;
      if (formData.status !== 'maintenance' && formData.status !== 'active') {
        editFormdata.dateMaintenance = '';
        editFormdata.nextMaintenance = '';
      }
      if (formData.status !== 'damaged') {
        editFormdata.deterioration = false;
      }
      if (formData.status === 'maintenance') {
        editFormdata.responsible = '';
        editFormdata.assignmentDate = '';
      } if (formData.status === 'active') {
        editFormdata.dateMaintenance = '';
        editFormdata.nextMaintenance = '';
        editFormdata.responsible = '';
        editFormdata.assignmentDate = '';
      }
      // Aquí deberías tener una función para editar la herramienta
      editTool(editFormdata);
    }
  };

  if (modalType !== 'add-tool' && modalType !== 'edit-tool') return null;  // Solo muestra el modal si el tipo es 'add-tool' y 'edit-tool'

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Agregar Nueva Herramienta</h2>
        </div>
        <div className="p-6">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Código de Herramienta*</label>
                <input type="text" name="code" required value={formData.code} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre*</label>
                <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo*</label>
                <select name="type" value={formData.type} required onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="electric">Eléctrica</option>
                  <option value="manual">Manual</option>
                  <option value="measuring">Medición</option>
                  <option value="safety">Seguridad</option>
                  <option value="other">Otro</option>
                </select>
              </div>
              {modalType === 'add-tool' ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estado*</label>
                  <select name="status" value={formData.status} required onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="active">Disponible</option>
                  </select>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estado*</label>
                  <select name="status" value={formData.status} required onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="active">Disponible</option>
                    <option value="assigned">Asignada</option>
                    <option value="maintenance">Mantenimiento</option>
                    <option value="lost">Perdida</option>
                    <option value="damaged">Dañada</option>
                  </select>
                </div>
              )}
              {(formData.status !== 'maintenance' && formData.status !== 'active') && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Responsable*</label>
                    <input type="text" name="responsible" required value={formData.responsible} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Asignación*</label>
                    <input type="date" name="assignmentDate" required value={formData.assignmentDate} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                </>
              )}
              {formData.status === 'maintenance' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fecha del Mantenimiento*</label>
                    <input type="date" name="dateMaintenance" required value={formData.dateMaintenance} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Próximo Mantenimiento*</label>
                    <input type="date" name="nextMaintenance" required value={formData.nextMaintenance} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                </>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ubicación/Almacén*</label>
                <input type="text" name="location" required value={formData.location} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              {formData.status === 'damaged' && (
                <>
                  <div className="flex items-center">
                    <label className="mt-3 mr-3 block text-sm font-medium text-gray-700 ">Deterioro</label>
                    <input
                      type="checkbox"
                      name="deterioration"
                      required
                      checked={formData.deterioration}
                      onChange={(e) => setFormData(prev => ({ ...prev, deterioration: e.target.checked }))}
                      className="mt-3 mr-3 h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </div>
                </>
              )}
            </div>
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Notas/Comentarios</label>
              <textarea name="notes" rows="3" value={formData.notes} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
              <button type="button" onClick={closeModal} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors">Cancelar</button>
              <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors">Guardar Herramienta</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddToolModal;
