export type ToolStatus = "active" | "assigned" | "maintenance" | "lost" | "damaged";
export type ToolFilterStatus = ToolStatus | "all";
export type ToolType = "electric" | "manual" | "measuring" | "safety" | "other";

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

export interface Tool {
  id: string;
  code: string;
  name: string;
  type: ToolType;
  status: ToolStatus;
  responsible: string;
  assignmentDate: string;
  dateMaintenance: string;
  nextMaintenance: string;
  deterioration: boolean;
  location: string;
  notes: string;
  assignmentHistory: AssignmentHistoryEntry[];
  maintenanceRecord: MaintenanceRecordEntry[];
}

export type ToolFormValues = Omit<Tool, "id" | "assignmentHistory" | "maintenanceRecord">;

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
  Ubicacion: string;
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
