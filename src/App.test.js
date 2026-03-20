import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import App from './App';

jest.mock('./services/api/toolsService', () => ({
  listTools: jest.fn(),
  createTool: jest.fn(),
  updateTool: jest.fn(),
  deleteTool: jest.fn(),
}));

const toolsService = require('./services/api/toolsService');

const initialTools = [
  {
    id: '1',
    code: 'TL-1',
    name: 'Taladro',
    type: 'electric',
    status: 'active',
    responsible: '',
    assignmentDate: '',
    dateMaintenance: '',
    nextMaintenance: '',
    location: 'Almacen',
    notes: '',
    deterioration: false,
    assignmentHistory: [],
    maintenanceRecord: [],
  },
];

beforeEach(() => {
  jest.clearAllMocks();
});

test('renders the tools page with fetched data', async () => {
  toolsService.listTools.mockResolvedValue(initialTools);

  render(<App />);

  expect(await screen.findByText(/Gestion de Herramientas/i)).toBeInTheDocument();
  expect(screen.getByText('Taladro')).toBeInTheDocument();
});

test('creates and deletes a tool from the UI', async () => {
  toolsService.listTools.mockResolvedValue(initialTools);
  toolsService.createTool.mockImplementation(async (payload) => ({
    id: '2',
    ...payload,
    assignmentHistory: [],
    maintenanceRecord: [],
  }));
  toolsService.deleteTool.mockResolvedValue();

  render(<App />);

  await screen.findByText('Taladro');

  fireEvent.click(screen.getByText(/Nueva Herramienta/i));
  fireEvent.change(screen.getByLabelText(/Codigo de Herramienta/i), { target: { value: 'TL-2' } });
  fireEvent.change(screen.getByLabelText(/^Nombre/i), { target: { value: 'Martillo' } });
  fireEvent.change(screen.getByLabelText(/Ubicacion\/Almacen/i), { target: { value: 'Obra' } });
  fireEvent.click(screen.getByText(/Guardar Herramienta/i));

  expect(await screen.findByText('Martillo')).toBeInTheDocument();

  fireEvent.click(screen.getByLabelText(/Eliminar Taladro/i));
  fireEvent.click(screen.getByText(/^Eliminar$/i));

  await waitFor(() => {
    expect(screen.queryByText('Taladro')).not.toBeInTheDocument();
  });
});
