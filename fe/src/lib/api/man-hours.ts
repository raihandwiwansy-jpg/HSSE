import api from '../axios';

export interface ManHoursParams {
  search?: string;
  date_from?: string;
  date_to?: string;
  status?: string;
  page?: number;
  per_page?: number;
}

export interface ManHoursData {
  user_id: number;
  judul_pekerjaan: string;
  lokasi: string;
  tanggal: string;
  durasi_jam: number;
  deskripsi?: string;
  status?: 'pending' | 'in_progress' | 'completed';
}

export const getManHours = (params?: ManHoursParams) => {
  return api.get('/man-hours', { params });
};

export const createManHours = (data: ManHoursData) => {
  return api.post('/man-hours', data);
};

export const getManHoursById = (id: number) => {
  return api.get(`/man-hours/${id}`);
};

export const updateManHours = (id: number, data: Partial<ManHoursData>) => {
  return api.put(`/man-hours/${id}`, data);
};

export const updateManHoursStatus = (id: number, status: 'pending' | 'in_progress' | 'completed') => {
  return api.patch(`/man-hours/${id}/status`, { status });
};

export const deleteManHours = (id: number) => {
  return api.delete(`/man-hours/${id}`);
};
