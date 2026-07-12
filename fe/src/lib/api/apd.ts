import api from '../axios';

export interface ApdParams {
  search?: string;
  status?: string;
  page?: number;
  per_page?: number;
}

export const getApd = (params?: ApdParams) => {
  return api.get('/apd', { params });
};

export const createApd = (data: Record<string, unknown>) => {
  return api.post('/apd', data);
};

export const getApdById = (id: number) => {
  return api.get(`/apd/${id}`);
};

export const updateApd = (id: number, data: Record<string, unknown>) => {
  return api.put(`/apd/${id}`, data);
};

export const deleteApd = (id: number) => {
  return api.delete(`/apd/${id}`);
};

export const getApdKadaluarsa = () => {
  return api.get('/apd-kadaluarsa');
};

export const importApd = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await api.post('/apd/import', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};
