import api from '../axios';

export interface CseParams {
  status?: string;
  search?: string;
  page?: number;
  per_page?: number;
  date_from?: string;
  date_to?: string;
}

export const getCse = (params?: CseParams) => {
  return api.get('/cse', { params });
};

export const createCse = (data: Record<string, unknown>) => {
  return api.post('/cse', data);
};

export const getCseById = (id: number) => {
  return api.get(`/cse/${id}`);
};

export const updateCse = (id: number, data: Record<string, unknown>) => {
  return api.put(`/cse/${id}`, data);
};

export const deleteCse = (id: number) => {
  return api.delete(`/cse/${id}`);
};

export const submitCse = (id: number) => {
  return api.patch(`/cse/${id}/status`, { status: 'submitted' });
};

export const approveCse = (id: number) => {
  return api.patch(`/cse/${id}/status`, { status: 'approved' });
};

export const rejectCse = (id: number) => {
  return api.patch(`/cse/${id}/status`, { status: 'rejected' });
};

export const completeCse = (id: number) => {
  return api.patch(`/cse/${id}/status`, { status: 'completed' });
};

export const closeCse = (id: number) => {
  return api.patch(`/cse/${id}/status`, { status: 'closed' });
};
