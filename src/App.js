import React, { useState } from 'react';
import Header from './components/Header';
import ToolTable from './components/ToolTable';
import AddToolModal from './components/AddToolModal';
import ToolDetailModal from './components/ToolDetailModal';
import ReportModal from './components/ReportModal';
import Stats from './components/Stats';
import Filters from './components/Filters';
import { useTools } from './hooks/useTools';

const App = () => {
  const {
    tools,
    addTool,
    editTool,
    deleteTool,
    generateReport,
    updateStats,
    stats,
    modalType,
    openModal,
    closeModal,
    currentTool,
    setCurrentTool,
    responsibles,
  } = useTools();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [responsibleFilter, setResponsibleFilter] = useState('all');

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-50">
      <Header openModal={openModal} generateReport={generateReport} />
      <Stats stats={stats} />
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
        setCurrentTool={setCurrentTool}
        openModal={openModal}
        searchTerm={searchTerm}
        statusFilter={statusFilter}
        responsibleFilter={responsibleFilter}
      />
      <AddToolModal addTool={addTool} editTool={editTool} closeModal={closeModal} modalType={modalType} tool={currentTool} />
      <ToolDetailModal tool={currentTool} editTool={editTool} closeModal={closeModal} modalType={modalType} />
      <ReportModal tools={tools} stats={stats} closeModal={closeModal} modalType={modalType} />
    </div>
  );
};

export default App;
