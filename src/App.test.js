import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ToolsPage } from './features/tools/ToolsPage';

jest.mock('./services/api/toolsService', () => ({
  listTools: jest.fn(),
  createTool: jest.fn(),
  updateTool: jest.fn(),
  deleteTool: jest.fn(),
}));

jest.mock('./features/auth/context/AuthContext', () => ({
  useAuth: () => ({
    user: { email: 'admin@empresa.com' },
    logout: jest.fn(),
  }),
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

  render(
    <MemoryRouter>
      <ToolsPage />
    </MemoryRouter>
  );

  expect(await screen.findByText(/Gestion de Herramientas/i)).toBeInTheDocument();
  expect(screen.getByText('Taladro')).toBeInTheDocument();
  expect(screen.getByText('admin@empresa.com')).toBeInTheDocument();
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

  render(
    <MemoryRouter>
      <ToolsPage />
    </MemoryRouter>
  );

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

test('keeps form open and shows mutation error when create fails', async () => {
  toolsService.listTools.mockResolvedValue(initialTools);
  toolsService.createTool.mockRejectedValue({
    response: { data: { code: 'validation_error', details: { name: 'Nombre requerido' } } },
  });

  render(
    <MemoryRouter>
      <ToolsPage />
    </MemoryRouter>
  );

  await screen.findByText('Taladro');
  fireEvent.click(screen.getByText(/Nueva Herramienta/i));
  fireEvent.change(screen.getByLabelText(/Codigo de Herramienta/i), { target: { value: 'TL-2' } });
  fireEvent.click(screen.getByText(/Guardar Herramienta/i));

  expect(await screen.findByText('Nombre requerido')).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: /Agregar Nueva Herramienta/i })).toBeInTheDocument();
});

test('shows delete error and keeps row when delete fails', async () => {
  toolsService.listTools.mockResolvedValue(initialTools);
  toolsService.deleteTool.mockRejectedValue({ response: { data: { code: 'tool_not_found' } } });

  render(
    <MemoryRouter>
      <ToolsPage />
    </MemoryRouter>
  );

  await screen.findByText('Taladro');
  fireEvent.click(screen.getByLabelText(/Eliminar Taladro/i));
  fireEvent.click(screen.getByText(/^Eliminar$/i));

  expect(await screen.findByText(/ya no existe/i)).toBeInTheDocument();
  expect(screen.getByText('Taladro')).toBeInTheDocument();
});
