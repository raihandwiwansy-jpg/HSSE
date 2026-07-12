import api from '../axios';

export interface KaryawanParams {
  search?: string;
  departemen?: string;
  page?: number;
  per_page?: number;
}

export const getKaryawan = (params?: KaryawanParams) => {
  return api.get('/karyawan', { params });
};

export const createKaryawan = (data: Record<string, unknown>) => {
  return api.post('/karyawan', data);
};

export const getKaryawanById = (id: number) => {
  return api.get(`/karyawan/${id}`);
};

export const updateKaryawan = (id: number, data: Record<string, unknown>) => {
  return api.put(`/karyawan/${id}`, data);
};

export const deleteKaryawan = (id: number) => {
  return api.delete(`/karyawan/${id}`);
};

export const importKaryawan = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await api.post('/karyawan/import', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};
