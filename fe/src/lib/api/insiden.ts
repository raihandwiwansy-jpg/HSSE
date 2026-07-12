import api from '../axios';

export interface InsidenParams {
  status?: string;
  jenis?: string;
  search?: string;
  page?: number;
  per_page?: number;
  date_from?: string;
  date_to?: string;
}

export const getInsiden = (params?: InsidenParams) => {
  return api.get('/insiden', { params });
};

export const createInsiden = (data: FormData) => {
  return api.post('/insiden', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const getInsidenById = (id: number) => {
  return api.get(`/insiden/${id}`);
};

export const updateInsiden = (id: number, data: FormData) => {
  return api.post(`/insiden/${id}?_method=PUT`, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const deleteInsiden = (id: number) => {
  return api.delete(`/insiden/${id}`);
};

export const updateStatusInsiden = (id: number, status: string) => {
  return api.patch(`/insiden/${id}/status`, { status });
};
