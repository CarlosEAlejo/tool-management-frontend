import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { vi } from "vitest";
import { LoginPage } from "./features/auth/pages/LoginPage";
import { ThemeProvider, THEME_STORAGE_KEY } from "./features/theme/context/ThemeContext";
import { ToolsPage } from "./features/tools/ToolsPage";
import { AppShell } from "./shared/layout/AppShell";
import type { Tool, ToolFormValues } from "./entities/tool/model";

const mockLogout = vi.fn<() => Promise<void>>();
const mockLogin = vi.fn();

vi.mock("./services/api/toolsService", () => ({
  listTools: vi.fn(),
  createTool: vi.fn(),
  updateTool: vi.fn(),
  deleteTool: vi.fn(),
}));

vi.mock("./features/auth/context/AuthContext", () => ({
  useAuth: () => ({
    user: { email: "admin@empresa.com" },
    logout: mockLogout,
    login: mockLogin,
    initializing: false,
    isAuthenticated: true,
  }),
}));

const toolsService = await import("./services/api/toolsService");

const initialTools: Tool[] = [
  {
    id: "1",
    code: "TL-1",
    name: "Taladro",
    type: "electric",
    status: "active",
    responsible: "",
    assignmentDate: "",
    dateMaintenance: "",
    nextMaintenance: "",
    location: "Almacen",
    notes: "",
    deterioration: false,
    assignmentHistory: [],
    maintenanceRecord: [],
  },
];

const renderToolsShell = (initialEntries: string[] = ["/tools"]) =>
  render(
    <ThemeProvider>
      <MemoryRouter initialEntries={initialEntries}>
        <Routes>
          <Route element={<AppShell />}>
            <Route path="/tools" element={<ToolsPage />} />
          </Route>
          <Route path="/login" element={<div>Login screen</div>} />
        </Routes>
      </MemoryRouter>
    </ThemeProvider>
  );

beforeEach(() => {
  vi.clearAllMocks();
  window.localStorage.clear();
  document.documentElement.className = "";
});

test("renders the protected shell with navigation and fetched tools", async () => {
  vi.mocked(toolsService.listTools).mockResolvedValue(initialTools);

  renderToolsShell();

  expect((await screen.findAllByText(/Gestion de herramientas/i)).length).toBeGreaterThan(0);
  expect((await screen.findAllByText("Taladro")).length).toBeGreaterThan(0);
  expect(screen.getAllByText(/Prestamos/i).length).toBeGreaterThan(0);
  expect(screen.getAllByText("admin@empresa.com").length).toBeGreaterThan(0);
});

test("persists theme changes from the shell toggle", async () => {
  vi.mocked(toolsService.listTools).mockResolvedValue(initialTools);

  renderToolsShell();

  expect((await screen.findAllByText("Taladro")).length).toBeGreaterThan(0);
  const toggleButtons = screen.getAllByLabelText(/Cambiar tema/i);
  fireEvent.click(toggleButtons[0]!);

  await waitFor(() => {
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });
  expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe("dark");
  expect(screen.getAllByText(/Cambiar a tema claro/i).length).toBeGreaterThan(0);
});

test("creates and deletes a tool from the redesigned UI", async () => {
  vi.mocked(toolsService.listTools).mockResolvedValue(initialTools);
  vi.mocked(toolsService.createTool).mockImplementation(async (payload: ToolFormValues) => ({
    id: "2",
    ...payload,
    assignmentHistory: [],
    maintenanceRecord: [],
  }));
  vi.mocked(toolsService.deleteTool).mockResolvedValue();

  renderToolsShell();

  expect((await screen.findAllByText("Taladro")).length).toBeGreaterThan(0);

  fireEvent.click(screen.getByText(/Nueva herramienta/i));
  fireEvent.change(screen.getByLabelText(/Codigo de Herramienta\*/i), { target: { value: "TL-2" } });
  fireEvent.change(screen.getByLabelText(/^Nombre\*/i), { target: { value: "Martillo" } });
  fireEvent.change(screen.getByLabelText(/Ubicacion\/Almacen\*/i), { target: { value: "Obra" } });
  fireEvent.click(screen.getByText(/Guardar herramienta/i));

  expect((await screen.findAllByText("Martillo")).length).toBeGreaterThan(0);

  fireEvent.click(screen.getByLabelText(/Abrir acciones Taladro/i));
  fireEvent.click(screen.getByLabelText(/Eliminar Taladro/i));
  const deleteButtons = screen.getAllByText(/^Eliminar$/i);
  fireEvent.click(deleteButtons.at(-1) ?? deleteButtons[0]!);

  await waitFor(() => {
    expect(screen.queryAllByText("Taladro")).toHaveLength(0);
  });
});

test("redirects to login after logout from the shell", async () => {
  vi.mocked(toolsService.listTools).mockResolvedValue(initialTools);
  mockLogout.mockResolvedValue();

  renderToolsShell();

  expect((await screen.findAllByText("Taladro")).length).toBeGreaterThan(0);
  const logoutButtons = screen.getAllByRole("button", { name: /^Cerrar sesion$/i });
  fireEvent.click(logoutButtons[0]!);

  await waitFor(() => {
    expect(mockLogout).toHaveBeenCalled();
  });
  expect(await screen.findByText("Login screen")).toBeInTheDocument();
});

test("login page also responds to the global theme toggle", () => {
  render(
    <ThemeProvider>
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    </ThemeProvider>
  );

  fireEvent.click(screen.getByLabelText(/Cambiar tema/i));

  expect(document.documentElement.classList.contains("dark")).toBe(true);
  expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe("dark");
  expect(screen.getByRole("heading", { name: /Iniciar sesion/i })).toBeInTheDocument();
});
