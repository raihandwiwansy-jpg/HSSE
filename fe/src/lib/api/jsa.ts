import api from '../axios';

export interface JsaParams {
  search?: string;
  departemen?: string;
  page?: number;
  per_page?: number;
  date_from?: string;
  date_to?: string;
}

export const getJsa = (params?: JsaParams) => {
  return api.get('/jsa', { params });
};

export const createJsa = (data: Record<string, unknown>) => {
  return api.post('/jsa', data);
};

export const getJsaById = (id: number) => {
  return api.get(`/jsa/${id}`);
};

export const updateJsa = (id: number, data: Record<string, unknown>) => {
  return api.put(`/jsa/${id}`, data);
};

export const deleteJsa = (id: number) => {
  return api.delete(`/jsa/${id}`);
};
