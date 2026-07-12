import api from '../axios';

export interface GwpParams {
  status?: string;
  kategori_risiko?: string;
  kategori_pekerjaan?: string;
  search?: string;
  page?: number;
  per_page?: number;
  date_from?: string;
  date_to?: string;
}

export const getGwp = (params?: GwpParams) => {
  return api.get('/gwp', { params });
};

export const createGwp = (data: Record<string, unknown>) => {
  return api.post('/gwp', data);
};

export const getGwpById = (id: number) => {
  return api.get(`/gwp/${id}`);
};

export const updateGwp = (id: number, data: Record<string, unknown>) => {
  return api.put(`/gwp/${id}`, data);
};

export const deleteGwp = (id: number) => {
  return api.delete(`/gwp/${id}`);
};

export const updateStatusGwp = (id: number, status: string) => {
  return api.patch(`/gwp/${id}/status`, { status });
};

export const submitGwp = (id: number) => {
  return api.post(`/gwp/${id}/submit`);
};

export const approveGwp = (id: number, catatan_hse?: string) => {
  return api.post(`/gwp/${id}/approve`, { catatan_hse });
};

export const rejectGwp = (id: number, catatan_hse?: string) => {
  return api.post(`/gwp/${id}/reject`, { catatan_hse });
};

export const completeGwp = (id: number) => {
  return api.post(`/gwp/${id}/complete`);
};

export const updateApproval = (permitId: number, approvalId: number, data: { nama?: string; jabatan?: string; status: string; tanggal?: string; paraf?: string; catatan?: string }) => {
  return api.post(`/gwp/${permitId}/approvals/${approvalId}`, data);
};
