import api from '../axios';

export interface HwpParams {
  status?: string;
  search?: string;
  page?: number;
  per_page?: number;
  date_from?: string;
  date_to?: string;
}

export const getHwp = (params?: HwpParams) => {
  return api.get('/hwp', { params });
};

export const createHwp = (data: Record<string, unknown>) => {
  return api.post('/hwp', data);
};

export const getHwpById = (id: number) => {
  return api.get(`/hwp/${id}`);
};

export const updateHwp = (id: number, data: Record<string, unknown>) => {
  return api.put(`/hwp/${id}`, data);
};

export const deleteHwp = (id: number) => {
  return api.delete(`/hwp/${id}`);
};

export const updateStatusHwp = (id: number, status: string) => {
  return api.patch(`/hwp/${id}/status`, { status });
};

export const submitHwp = (id: number) => {
  return api.post(`/hwp/${id}/submit`);
};

export const approveHwp = (id: number, catatan?: string) => {
  return api.post(`/hwp/${id}/approve`, { catatan });
};

export const rejectHwp = (id: number, catatan?: string) => {
  return api.post(`/hwp/${id}/reject`, { catatan });
};

export const completeHwp = (id: number) => {
  return api.post(`/hwp/${id}/complete`);
};
