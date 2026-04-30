import { fireEvent, screen, waitFor } from "@testing-library/react";
import { beforeEach, expect, test, vi } from "vitest";
import { WorkersPage } from "./WorkersPage";
import { renderPage } from "../../test/testUtils";
import type { Worker, WorkerFormValues } from "../../entities/worker/model";

vi.mock("../../services/api/workersService", () => ({
  listWorkers: vi.fn(),
  createWorker: vi.fn(),
  updateWorker: vi.fn(),
  deleteWorker: vi.fn(),
}));

const workersService = await import("../../services/api/workersService");

let workersState: Worker[] = [];

const seedWorkers = (): Worker[] => [
  {
    id: "w-1",
    firstName: "Ana",
    lastName: "Garcia",
    position: "Tecnica",
    email: "ana@empresa.com",
    phone: "5551001",
    notes: "",
  },
  {
    id: "w-2",
    firstName: "Pedro",
    lastName: "Ruiz",
    position: "Almacenista",
    email: "pedro@empresa.com",
    phone: "5551002",
    notes: "",
  },
];

beforeEach(() => {
  workersState = seedWorkers();
  vi.clearAllMocks();

  vi.mocked(workersService.listWorkers).mockImplementation(async () => [...workersState]);
  vi.mocked(workersService.createWorker).mockImplementation(async (payload: WorkerFormValues) => {
    const created: Worker = {
      id: `w-${workersState.length + 1}`,
      ...payload,
    };
    workersState = [...workersState, created];
    return created;
  });
  vi.mocked(workersService.updateWorker).mockImplementation(async (id: string, payload: WorkerFormValues) => {
    const updated: Worker = { id, ...payload };
    workersState = workersState.map((worker) => (worker.id === id ? updated : worker));
    return updated;
  });
  vi.mocked(workersService.deleteWorker).mockImplementation(async (id: string) => {
    workersState = workersState.filter((worker) => worker.id !== id);
  });
});

test("handles the real worker flow: search, create, edit and delete", async () => {
  renderPage(<WorkersPage />);

  expect((await screen.findAllByText("Ana Garcia")).length).toBeGreaterThan(0);
  expect(screen.getAllByText("Pedro Ruiz").length).toBeGreaterThan(0);

  fireEvent.change(screen.getByLabelText(/Buscar/i), { target: { value: "almacen" } });
  await waitFor(() => {
    expect(screen.queryByText("Ana Garcia")).not.toBeInTheDocument();
  });
  expect(screen.getAllByText("Pedro Ruiz").length).toBeGreaterThan(0);

  fireEvent.change(screen.getByLabelText(/Buscar/i), { target: { value: "" } });
  expect((await screen.findAllByText("Ana Garcia")).length).toBeGreaterThan(0);

  fireEvent.click(screen.getByRole("button", { name: /Nuevo trabajador/i }));
  fireEvent.change(screen.getByLabelText(/Nombre\*/i), { target: { value: " Laura " } });
  fireEvent.change(screen.getByLabelText(/Apellidos\*/i), { target: { value: " Perez " } });
  fireEvent.change(screen.getByLabelText(/Cargo\*/i), { target: { value: " Supervisora " } });
  fireEvent.change(screen.getByLabelText(/Correo/i), { target: { value: " LAURA@EMPRESA.COM " } });
  fireEvent.click(screen.getByRole("button", { name: /Guardar trabajador/i }));

  expect((await screen.findAllByText("Laura Perez")).length).toBeGreaterThan(0);
  expect(workersService.createWorker).toHaveBeenCalledWith({
    firstName: "Laura",
    lastName: "Perez",
    position: "Supervisora",
    email: "laura@empresa.com",
    phone: "",
    notes: "",
  });

  fireEvent.click(screen.getByLabelText(/Abrir acciones Laura Perez/i));
  fireEvent.click(screen.getByLabelText(/Editar Laura Perez/i));
  fireEvent.change(screen.getByLabelText(/Cargo\*/i), { target: { value: "Jefa de brigada" } });
  fireEvent.click(screen.getByRole("button", { name: /Guardar trabajador/i }));

  expect((await screen.findAllByText("Jefa de brigada")).length).toBeGreaterThan(0);

  fireEvent.click(screen.getByLabelText(/Abrir acciones Pedro Ruiz/i));
  fireEvent.click(screen.getByLabelText(/Eliminar Pedro Ruiz/i));
  const deleteButtons = screen.getAllByRole("button", { name: /^Eliminar$/i });
  fireEvent.click(deleteButtons.at(-1) ?? deleteButtons[0]!);

  await waitFor(() => {
    expect(screen.queryByText("Pedro Ruiz")).not.toBeInTheDocument();
  });
  expect(workersService.deleteWorker).toHaveBeenCalledWith("w-2");
});
