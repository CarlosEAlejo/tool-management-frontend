import { fireEvent, screen, waitFor } from "@testing-library/react";
import { beforeEach, expect, test, vi } from "vitest";
import { AssignmentsPage } from "./AssignmentsPage";
import { renderPage } from "../../test/testUtils";
import type { AssignmentEvent, AssignmentFormValues, Tool, Worker } from "../../shared/types";

vi.mock("../../shared/hooks/useDebouncedValue", () => ({
  useDebouncedValue: <T,>(value: T) => value,
}));

vi.mock("../../services/api/toolsService", () => ({
  listTools: vi.fn(),
}));

vi.mock("../../services/api/workersService", () => ({
  listWorkers: vi.fn(),
}));

vi.mock("../../services/api/assignmentsService", () => ({
  listAssignments: vi.fn(),
  createAssignment: vi.fn(),
  returnAssignment: vi.fn(),
}));

const toolsService = await import("../../services/api/toolsService");
const workersService = await import("../../services/api/workersService");
const assignmentsService = await import("../../services/api/assignmentsService");

let toolsState: Tool[] = [];
let workersState: Worker[] = [];
let assignmentEventsState: AssignmentEvent[] = [];

const seedTools = (): Tool[] => [
  {
    id: "t-1",
    code: "TL-1",
    name: "Taladro",
    type: "electric",
    status: "active",
    responsibleId: "",
    responsible: "",
    assignmentDate: "",
    dateMaintenance: "",
    nextMaintenance: "",
    purchaseDate: "",
    price: 120,
    deterioration: false,
    location: "Almacen",
    notes: "",
    assignmentHistory: [],
    maintenanceRecord: [],
  },
];

const seedWorkers = (): Worker[] => [
  {
    id: "w-1",
    firstName: "Luis",
    lastName: "Perez",
    position: "Operario",
    email: "luis@empresa.com",
    phone: "",
    notes: "",
  },
];

beforeEach(() => {
  toolsState = seedTools();
  workersState = seedWorkers();
  assignmentEventsState = [];
  vi.clearAllMocks();

  vi.mocked(toolsService.listTools).mockImplementation(async () => [...toolsState]);
  vi.mocked(workersService.listWorkers).mockImplementation(async () => [...workersState]);
  vi.mocked(assignmentsService.listAssignments).mockImplementation(async () => [...assignmentEventsState]);
  vi.mocked(assignmentsService.createAssignment).mockImplementation(async (payload: AssignmentFormValues) => {
    const worker = workersState.find((item) => item.id === payload.workerId)!;
    const updatedTool: Tool = {
      ...toolsState.find((item) => item.id === payload.toolId)!,
      status: "assigned",
      responsibleId: worker.id,
      responsible: `${worker.firstName} ${worker.lastName}`,
      assignmentDate: payload.assignmentDate,
      assignmentHistory: [{ responsible: `${worker.firstName} ${worker.lastName}`, assignmentDate: payload.assignmentDate }],
    };
    toolsState = toolsState.map((tool) => (tool.id === updatedTool.id ? updatedTool : tool));

    const event: AssignmentEvent = {
      id: `ae-${assignmentEventsState.length + 1}`,
      toolId: updatedTool.id,
      toolCode: updatedTool.code,
      toolName: updatedTool.name,
      workerId: worker.id,
      workerName: `${worker.firstName} ${worker.lastName}`,
      action: "assigned",
      assignmentDate: payload.assignmentDate,
      createdAt: `2026-04-30T10:0${assignmentEventsState.length}:00Z`,
    };
    assignmentEventsState = [event, ...assignmentEventsState];
    return { tool: updatedTool, event };
  });
  vi.mocked(assignmentsService.returnAssignment).mockImplementation(async (toolId: string) => {
    const currentTool = toolsState.find((item) => item.id === toolId)!;
    const updatedTool: Tool = {
      ...currentTool,
      status: "active",
      responsibleId: "",
      responsible: "",
      assignmentDate: "",
    };
    toolsState = toolsState.map((tool) => (tool.id === updatedTool.id ? updatedTool : tool));
    const event: AssignmentEvent = {
      id: `ae-${assignmentEventsState.length + 1}`,
      toolId: updatedTool.id,
      toolCode: updatedTool.code,
      toolName: updatedTool.name,
      workerId: currentTool.responsibleId,
      workerName: currentTool.responsible,
      action: "returned",
      assignmentDate: "2026-04-30",
      createdAt: `2026-04-30T11:0${assignmentEventsState.length}:00Z`,
    };
    assignmentEventsState = [event, ...assignmentEventsState];
    return { tool: updatedTool, event };
  });
});

test("handles validation, assignment and return flows consistently", async () => {
  renderPage(<AssignmentsPage />);

  expect(await screen.findByText("Taladro")).toBeInTheDocument();

  fireEvent.click(screen.getByRole("button", { name: /Guardar asignacion/i }));
  expect(await screen.findByText(/Debes seleccionar herramienta y trabajador/i)).toBeInTheDocument();

  fireEvent.change(screen.getByLabelText(/Herramienta\*/i), { target: { value: "TL-1 - Taladro" } });
  fireEvent.change(screen.getByLabelText(/Trabajador\*/i), { target: { value: "Luis Perez (Operario)" } });
  fireEvent.change(screen.getByLabelText(/Fecha de asignacion\*/i), { target: { value: "2026-04-28" } });
  fireEvent.click(screen.getByRole("button", { name: /Guardar asignacion/i }));

  await waitFor(() => {
    expect(vi.mocked(assignmentsService.createAssignment).mock.calls[0]?.[0]).toEqual({
      toolId: "t-1",
      workerId: "w-1",
      assignmentDate: "2026-04-28",
    });
  });

  expect((await screen.findAllByText("Luis Perez")).length).toBeGreaterThan(0);
  expect(screen.getByText("Asignacion")).toBeInTheDocument();

  fireEvent.click(screen.getByRole("button", { name: /Devolver/i }));

  await waitFor(() => {
    expect(vi.mocked(assignmentsService.returnAssignment).mock.calls[0]?.[0]).toBe("t-1");
  });

  await waitFor(() => {
    expect(screen.getByText("Devolucion")).toBeInTheDocument();
  });
  expect(screen.getByRole("button", { name: /Asignar/i })).toBeInTheDocument();
});
