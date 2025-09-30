export enum EngineType {
  THETA = 'THETA',
  ATKINSON = 'ATKINSON',
  GAMMA = 'GAMMA',
  SMARTSTREAM = 'SMARTSTREAM',
}

export enum DiagnosticStatus {
  NORMAL = 'NORMAL',
  WARNING = 'WARNING',
  CRITICAL = 'CRITICAL',
}

export type DiagnosticRecord = {
  id: number;
  vin: string;
  chassisNumber: string;
  engineType: EngineType;
  modelYear: number;
  vehicleModel: string;
  rpm: number;
  engineTemp: number;
  oilPressure: number;
  fuelPressure: number;
  intakeAirTemp: number;
  throttlePosition: number;
  maf: number;
  dtcCodes: string[];
  mileage: number;
  diagnosticDate: string;
  technician: string;
  notes: string;
  status: DiagnosticStatus;
  createdAt: string;
  updatedAt: string;
}

export type DiagnosticRecordCreate = {
  vin: string;
  chassisNumber: string;
  engineType: EngineType;
  modelYear: number;
  vehicleModel: string;
  rpm: number;
  engineTemp: number;
  oilPressure: number;
  fuelPressure: number;
  intakeAirTemp: number;
  throttlePosition: number;
  maf: number;
  dtcCodes: string[];
  mileage: number;
  diagnosticDate: string;
  technician: string;
  notes: string;
  status: DiagnosticStatus;
}

export type PaginatedResponse<T> = {
  content: T[];
  totalPages: number;
  totalElements: number;
  currentPage: number;
}

export type User = {
  id: number;
  username: string;
  email: string;
}

export type LoginRequest = {
  userId: string;
  password: string;
}

export type LoginResponse = {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export type DiagnosticFilters = {
  page?: number;
  size?: number;
  engineType?: EngineType;
  search?: string;
  startDate?: string;
  endDate?: string;
  status?: DiagnosticStatus;
}