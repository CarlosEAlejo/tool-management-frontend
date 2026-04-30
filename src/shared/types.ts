export type ToolStatus = "active" | "assigned" | "maintenance" | "lost" | "damaged";
export type ToolFilterStatus = ToolStatus | "all";
export type ToolType = "electric" | "manual" | "measuring" | "safety" | "other";
export type AssignmentAction = "assigned" | "returned";
export type MaintenanceAction = "scheduled" | "completed";

export interface Option<T extends string = string> {
  value: T;
  label: string;
}

export interface AssignmentHistoryEntry {
  responsible: string;
  assignmentDate: string;
}

export interface MaintenanceRecordEntry {
  dateMaintenance: string;
  nextMaintenance: string;
}

export interface Worker {
  id: string;
  firstName: string;
  lastName: string;
  position: string;
  email: string;
  phone: string;
  notes: string;
}

export type WorkerFormValues = Omit<Worker, "id">;

export interface Tool {
  id: string;
  code: string;
  name: string;
  type: ToolType;
  status: ToolStatus;
  responsibleId: string;
  responsible: string;
  assignmentDate: string;
  dateMaintenance: string;
  nextMaintenance: string;
  purchaseDate: string;
  price: number;
  deterioration: boolean;
  location: string;
  notes: string;
  assignmentHistory: AssignmentHistoryEntry[];
  maintenanceRecord: MaintenanceRecordEntry[];
}

export type ToolFormValues = Omit<Tool, "id" | "assignmentHistory" | "maintenanceRecord">;

export interface AssignmentEvent {
  id: string;
  toolId: string;
  toolCode: string;
  toolName: string;
  workerId: string;
  workerName: string;
  action: AssignmentAction;
  assignmentDate: string;
  createdAt: string;
}

export interface AssignmentFormValues {
  toolId: string;
  workerId: string;
  assignmentDate: string;
}

export interface MaintenanceEvent {
  id: string;
  toolId: string;
  toolCode: string;
  toolName: string;
  action: MaintenanceAction;
  dateMaintenance: string;
  nextMaintenance: string;
  createdAt: string;
}

export interface MaintenanceFormValues {
  toolId: string;
  dateMaintenance: string;
  nextMaintenance: string;
}

export interface ToolFiltersState {
  search: string;
  status: ToolFilterStatus;
  responsible: string;
}

export interface ToolStats {
  total: number;
  maintenance: number;
  lostOrDamaged: number;
  assigned: number;
  active: number;
  nextMaintenance: string;
}

export interface ToolReportRow {
  Codigo: string;
  Nombre: string;
  Tipo: string;
  Estado: string;
  Responsable: string;
  FechaAsignacion: string;
  FechaCompra: string;
  Precio: string;
  Ubicacion: string;
  Notas: string;
}

export interface ToolAssignmentHistoryRow {
  Codigo: string;
  Herramienta: string;
  Responsable: string;
  FechaAsignacion: string;
}

export interface ToolMaintenanceHistoryRow {
  Codigo: string;
  Herramienta: string;
  FechaMantenimiento: string;
  ProximoMantenimiento: string;
}

export interface ToolSummaryRow {
  Indicador: string;
  Valor: string | number;
}

export interface ExcelSheet<Row extends object = Record<string, string | number>> {
  name: string;
  rows: Row[];
}

export interface User {
  id?: string;
  email: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload extends LoginPayload {
  confirmPassword: string;
}

export interface SessionTokens {
  accessToken: string;
}

export interface AuthSession extends SessionTokens {
  user: User;
  expiresIn?: number;
}

export interface ApiValidationDetails {
  [key: string]: string;
}

export interface ApiErrorData {
  code?: string;
  message?: string;
  details?: ApiValidationDetails;
}

export interface MutationResult<T> {
  ok: true;
  data: T;
}

export interface MutationErrorResult {
  ok: false;
  error: string;
}

export type MutationResponse<T> = MutationResult<T> | MutationErrorResult;
