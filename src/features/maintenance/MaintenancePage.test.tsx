import { fireEvent, screen, waitFor } from "@testing-library/react";
import { beforeEach, expect, test, vi } from "vitest";
import { MaintenancePage } from "./MaintenancePage";
import { renderPage } from "../../test/testUtils";
import type { MaintenanceEvent, MaintenanceFormValues, Tool } from "../../shared/types";

vi.mock("../../shared/hooks/useDebouncedValue", () => ({
  useDebouncedValue: <T,>(value: T) => value,
}));

vi.mock("../../services/api/toolsService", () => ({
  listTools: vi.fn(),
}));

vi.mock("../../services/api/maintenancesService", () => ({
  listMaintenances: vi.fn(),
  createMaintenance: vi.fn(),
  completeMaintenance: vi.fn(),
}));

const toolsService = await import("../../services/api/toolsService");
const maintenancesService = await import("../../services/api/maintenancesService");

let toolsState: Tool[] = [];
let maintenanceEventsState: MaintenanceEvent[] = [];

const seedTools = (): Tool[] => [
  {
    id: "t-1",
    code: "CP-10",
    name: "Compresor",
    type: "electric",
    status: "active",
    responsibleId: "",
    responsible: "",
    assignmentDate: "",
    dateMaintenance: "",
    nextMaintenance: "",
    purchaseDate: "",
    price: 200,
    deterioration: false,
    location: "Taller",
    notes: "",
    assignmentHistory: [],
    maintenanceRecord: [],
  },
];

beforeEach(() => {
  toolsState = seedTools();
  maintenanceEventsState = [];
  vi.clearAllMocks();

  vi.mocked(toolsService.listTools).mockImplementation(async () => [...toolsState]);
  vi.mocked(maintenancesService.listMaintenances).mockImplementation(async () => [...maintenanceEventsState]);
  vi.mocked(maintenancesService.createMaintenance).mockImplementation(async (payload: MaintenanceFormValues) => {
    const updatedTool: Tool = {
      ...toolsState.find((item) => item.id === payload.toolId)!,
      status: "maintenance",
      dateMaintenance: payload.dateMaintenance,
      nextMaintenance: payload.nextMaintenance,
      maintenanceRecord: [{ dateMaintenance: payload.dateMaintenance, nextMaintenance: payload.nextMaintenance }],
    };
    toolsState = toolsState.map((tool) => (tool.id === updatedTool.id ? updatedTool : tool));
    const event: MaintenanceEvent = {
      id: `me-${maintenanceEventsState.length + 1}`,
      toolId: updatedTool.id,
      toolCode: updatedTool.code,
      toolName: updatedTool.name,
      action: "scheduled",
      dateMaintenance: payload.dateMaintenance,
      nextMaintenance: payload.nextMaintenance,
      createdAt: `2026-04-30T12:0${maintenanceEventsState.length}:00Z`,
    };
    maintenanceEventsState = [event, ...maintenanceEventsState];
    return { tool: updatedTool, event };
  });
  vi.mocked(maintenancesService.completeMaintenance).mockImplementation(async (toolId: string) => {
    const currentTool = toolsState.find((item) => item.id === toolId)!;
    const updatedTool: Tool = {
      ...currentTool,
      status: "active",
      dateMaintenance: "",
      nextMaintenance: "",
    };
    toolsState = toolsState.map((tool) => (tool.id === updatedTool.id ? updatedTool : tool));
    const event: MaintenanceEvent = {
      id: `me-${maintenanceEventsState.length + 1}`,
      toolId: updatedTool.id,
      toolCode: updatedTool.code,
      toolName: updatedTool.name,
      action: "completed",
      dateMaintenance: currentTool.dateMaintenance,
      nextMaintenance: currentTool.nextMaintenance,
      createdAt: `2026-04-30T13:0${maintenanceEventsState.length}:00Z`,
    };
    maintenanceEventsState = [event, ...maintenanceEventsState];
    return { tool: updatedTool, event };
  });
});

test("handles validation, scheduling and completion flows for maintenance", async () => {
  renderPage(<MaintenancePage />);

  expect(await screen.findByText("Compresor")).toBeInTheDocument();

  fireEvent.click(screen.getByRole("button", { name: /Guardar mantenimiento/i }));
  expect(await screen.findByText(/Debes seleccionar herramienta y completar ambas fechas/i)).toBeInTheDocument();

  fireEvent.change(screen.getByLabelText(/Herramienta\*/i), { target: { value: "CP-10 - Compresor" } });
  fireEvent.change(screen.getByLabelText(/Fecha de mantenimiento\*/i), { target: { value: "2026-04-15" } });
  fireEvent.change(screen.getByLabelText(/Proximo mantenimiento\*/i), { target: { value: "2026-05-15" } });
  fireEvent.click(screen.getByRole("button", { name: /Guardar mantenimiento/i }));

  await waitFor(() => {
    expect(vi.mocked(maintenancesService.createMaintenance).mock.calls[0]?.[0]).toEqual({
      toolId: "t-1",
      dateMaintenance: "2026-04-15",
      nextMaintenance: "2026-05-15",
    });
  });

  expect(await screen.findByText("Programado")).toBeInTheDocument();
  expect(screen.getAllByText("Mantenimiento").length).toBeGreaterThan(0);

  fireEvent.click(screen.getByRole("button", { name: /Finalizar/i }));

  await waitFor(() => {
    expect(vi.mocked(maintenancesService.completeMaintenance).mock.calls[0]?.[0]).toBe("t-1");
  });

  await waitFor(() => {
    expect(screen.getByText("Finalizado")).toBeInTheDocument();
  });
  expect(screen.getAllByText("Disponible").length).toBeGreaterThan(0);
});
