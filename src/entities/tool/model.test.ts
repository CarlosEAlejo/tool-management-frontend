import { buildToolStats, filterTools, getApiErrorMessage, sanitizeToolPayload, TOOL_STATUS, TOOL_TYPE } from "./model";
import type { Tool } from "../../shared/types";

const tools: Tool[] = [
  {
    id: "1",
    code: "TL-1",
    name: "Taladro",
    type: TOOL_TYPE.ELECTRIC,
    status: TOOL_STATUS.ACTIVE,
    responsibleId: "",
    responsible: "",
    assignmentDate: "",
    dateMaintenance: "",
    nextMaintenance: "2026-01-10",
    purchaseDate: "2025-12-01",
    price: 125.5,
    deterioration: false,
    location: "Almacen",
    notes: "",
    assignmentHistory: [],
    maintenanceRecord: [],
  },
  {
    id: "2",
    code: "MS-2",
    name: "Martillo",
    type: TOOL_TYPE.MANUAL,
    status: TOOL_STATUS.ASSIGNED,
    responsibleId: "w-1",
    responsible: "Ana",
    assignmentDate: "2026-01-01",
    dateMaintenance: "",
    nextMaintenance: "",
    purchaseDate: "2025-11-20",
    price: 44,
    deterioration: false,
    location: "Obra",
    notes: "",
    assignmentHistory: [],
    maintenanceRecord: [],
  },
  {
    id: "3",
    code: "SC-3",
    name: "Sierra",
    type: TOOL_TYPE.ELECTRIC,
    status: TOOL_STATUS.MAINTENANCE,
    responsibleId: "",
    responsible: "",
    assignmentDate: "",
    dateMaintenance: "2025-01-15",
    nextMaintenance: "2025-02-01",
    purchaseDate: "2024-12-10",
    price: 80,
    deterioration: false,
    location: "Taller",
    notes: "",
    assignmentHistory: [],
    maintenanceRecord: [],
  },
];

test("filterTools applies search and responsible filters", () => {
  const result = filterTools(tools, { search: "mar", responsible: "Ana", status: "all" });
  expect(result).toHaveLength(1);
  expect(result[0]?.name).toBe("Martillo");
});

test("buildToolStats calculates totals", () => {
  const stats = buildToolStats(tools);
  expect(stats.total).toBe(3);
  expect(stats.assigned).toBe(1);
  expect(stats.maintenance).toBe(1);
});

test("buildToolStats keeps plain dates stable across timezone parsing", () => {
  const stats = buildToolStats([
    {
      ...tools[0]!,
      nextMaintenance: "2026-03-20",
    },
  ]);
  expect(stats.nextMaintenance.startsWith("2026-03-20")).toBe(true);
});

test("sanitizeToolPayload clears incompatible fields for active tool", () => {
  const payload = sanitizeToolPayload({
    code: "TL-1",
    name: "Taladro",
    status: TOOL_STATUS.ACTIVE,
    responsibleId: "w-1",
    responsible: "Ana",
    assignmentDate: "2026-01-01",
    dateMaintenance: "2026-02-01",
    nextMaintenance: "2026-03-01",
    purchaseDate: "2026-01-20",
    price: 95.99,
    location: "Almacen",
    notes: "  nota  ",
  });

  expect(payload.responsible).toBe("");
  expect(payload.responsibleId).toBe("");
  expect(payload.assignmentDate).toBe("");
  expect(payload.dateMaintenance).toBe("");
  expect(payload.notes).toBe("nota");
  expect(payload.price).toBe(95.99);
});

test("getApiErrorMessage prioritizes validation details and known codes", () => {
  expect(getApiErrorMessage({ response: { data: { code: "invalid_id" } } }, "fallback")).toMatch(/identificador/i);
  expect(
    getApiErrorMessage({ response: { data: { code: "validation_error", details: { name: "Nombre requerido" } } } }, "fallback")
  ).toBe("Nombre requerido");
});
