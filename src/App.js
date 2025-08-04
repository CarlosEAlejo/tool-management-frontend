import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ToolTable from './components/ToolTable';
import AddToolModal from './components/AddToolModal';
import ToolDetailModal from './components/ToolDetailModal';
import ReportModal from './components/ReportModal';
import Stats from './components/Stats';
import Filters from './components/Filters';
import LoadingComponent from './components/LoadingComponent';
import { GetTool, CreateTool, UpdateTool, DeleteTool } from './api/Tools';
import { initialPerson } from './data';


const App = () => {
  const [tool, setTool] = useState(null);
  const [tools, setTools] = useState();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [responsibles, setResponsibles] = useState(initialPerson);
  const [statusFilter, setStatusFilter] = useState('all');
  const [responsibleFilter, setResponsibleFilter] = useState('all');
  const [modalType, setModalType] = useState(null);
  const [stats, setStats] = useState();

  useEffect(() => {
    // Solo llama a fetchTools si tools está vacío
    if (!tools) {
      fetchTools();
    }
  }, [tools]);

  const fetchTools = async () => {
    setLoading(true);
    try {
      const respuesta = await GetTool();
      setTools(respuesta);
    } catch (error) {
      console.error('Error al obtener herramientas:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStats = (newStats) => {
    setStats(newStats);
  };


  const addTool = async (tool) => {
    setLoading(true);
    await CreateTool(tool)
      .then(() => {
        fetchTools();
        closeModal();
      })
      .catch((error) => {
        console.error('Error al crear herramienta:', error);
      })
      .finally(() => {
        setLoading(false);
      })
  };

  const editTool = async (updatedTool) => {
    setLoading(true);
    await UpdateTool(updatedTool.id, updatedTool)
      .then((respuesta) => {
        setTools(prev => prev.map(tool => (tool.id === respuesta.id ? respuesta : tool)));
        closeModal();
      })
      .catch((error) => {
        console.error('Error al editar herramienta:', error);
      })
      .finally(() => {
        setLoading(false);
      })
  };

  const deleteTool = async (id) => {
    await DeleteTool(id)
      .then(() => {
        setTools(prev => prev.filter(tool => tool.id !== id));
        closeModal();
      })
      .catch((error) => {
        console.error('Error al eliminar herramienta:', error);
      })
      .finally(() => {
        setLoading(false);
      })
  };

  const generateReport = () => {
    setModalType('report');
  };

  const openModal = (type) => {
    setModalType(type);
  };

  const closeModal = () => {
    setModalType(null);
    setTool(null);
  };

  return (
    <>
      {loading ? (
        <LoadingComponent />
      ) : (
        <div className="container mx-auto px-4 py-8 bg-gray-50">
          <Header openModal={openModal} generateReport={generateReport} />
          <Stats tools={tools} updateStats={updateStats} />
          <Filters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            responsibleFilter={responsibleFilter}
            setResponsibleFilter={setResponsibleFilter}
            responsibles={responsibles}
          />
          <ToolTable
            tools={tools}
            editTool={editTool}
            deleteTool={deleteTool}
            setCurrentTool={setTool}
            openModal={openModal}
            searchTerm={searchTerm}
            statusFilter={statusFilter}
            responsibleFilter={responsibleFilter}
          />
          <AddToolModal addTool={addTool} editTool={editTool} closeModal={closeModal} modalType={modalType} tool={tool} />
          <ToolDetailModal tool={tool} closeModal={closeModal} openModal={openModal} modalType={modalType} />
          <ReportModal tools={tools} stats={stats} closeModal={closeModal} modalType={modalType} />
        </div>
      )}
    </>
  );
};

export default App;
