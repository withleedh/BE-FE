import api from './api';
import type {
  DiagnosticRecord,
  DiagnosticRecordCreate,
  PaginatedResponse,
  DiagnosticFilters,
} from '../types';

export const diagnosticService = {
  getAll: async (filters: DiagnosticFilters = {}): Promise<PaginatedResponse<DiagnosticRecord>> => {
    const params = new URLSearchParams();

    if (filters.page !== undefined) params.append('page', String(filters.page));
    if (filters.size !== undefined) params.append('size', String(filters.size));
    if (filters.engineType) params.append('engineType', filters.engineType);
    if (filters.search) params.append('search', filters.search);
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);
    if (filters.status) params.append('status', filters.status);

    const response = await api.get<PaginatedResponse<DiagnosticRecord>>(
      `/items?${params.toString()}`
    );
    return response.data;
  },

  getById: async (id: number): Promise<DiagnosticRecord> => {
    const response = await api.get<DiagnosticRecord>(`/items/${id}`);
    return response.data;
  },

  create: async (data: DiagnosticRecordCreate): Promise<DiagnosticRecord> => {
    const response = await api.post<DiagnosticRecord>('/items', data);
    return response.data;
  },

  update: async (id: number, data: DiagnosticRecordCreate): Promise<DiagnosticRecord> => {
    const response = await api.put<DiagnosticRecord>(`/items/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/items/${id}`);
  },

  download: async (filters: DiagnosticFilters & { format: 'csv' | 'pdf' }): Promise<Blob> => {
    const params = new URLSearchParams();

    if (filters.engineType) params.append('engineType', filters.engineType);
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);
    if (filters.format) params.append('format', filters.format);

    const response = await api.get(`/items/download?${params.toString()}`, {
      responseType: 'blob',
    });
    return response.data;
  },
};