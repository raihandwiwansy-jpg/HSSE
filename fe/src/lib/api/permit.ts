import api from '../axios';

export interface PermitParams {
  status?: string;
  jenis?: string;
  search?: string;
  page?: number;
  per_page?: number;
  date_from?: string;
  date_to?: string;
}

export const getPermits = (params?: PermitParams) => {
  return api.get('/permit', { params });
};

export const createPermit = (data: Record<string, unknown>) => {
  return api.post('/permit', data);
};

export const getPermitById = (id: number) => {
  return api.get(`/permit/${id}`);
};

export const updatePermit = (id: number, data: Record<string, unknown>) => {
  return api.put(`/permit/${id}`, data);
};

export const deletePermit = (id: number) => {
  return api.delete(`/permit/${id}`);
};

export const submitPermit = (id: number) => {
  return api.post(`/permit/${id}/submit`);
};

export const supervisorApprovePermit = (id: number, catatan?: string) => {
  return api.post(`/permit/${id}/supervisor-approve`, { catatan });
};

export const supervisorRejectPermit = (id: number, catatan_reject?: string) => {
  return api.post(`/permit/${id}/supervisor-reject`, { catatan_reject });
};

export const hseApprovePermit = (id: number, catatan?: string, hseData?: Record<string, unknown>) => {
  return api.post(`/permit/${id}/hse-approve`, { catatan, hse_data: hseData });
};

export const hseRejectPermit = (id: number, catatan_reject?: string) => {
  return api.post(`/permit/${id}/hse-reject`, { catatan_reject });
};

export const completePermit = (id: number, completionData?: Record<string, unknown>) => {
  return api.post(`/permit/${id}/complete`, { completion_data: completionData });
};

export const confirmCompletePermit = (id: number, completionData?: Record<string, unknown>) => {
  return api.post(`/permit/${id}/confirm-complete`, { completion_data: completionData });
};

export const getPermitStatusCounts = () => {
  return api.get('/permit/status-counts');
};

export const getNextSequence = (field: string, jenis?: string) => {
  const params: Record<string, string> = { field };
  if (jenis) params.jenis = jenis;
  return api.get('/permit/next-sequence', { params });
};
