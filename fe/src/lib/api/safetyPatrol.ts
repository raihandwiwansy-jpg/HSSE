import api from '../axios';

export interface SafetyPatrolParams {
  status?: string;
  search?: string;
  page?: number;
  per_page?: number;
  date_from?: string;
  date_to?: string;
}

export const getSafetyPatrols = (params?: SafetyPatrolParams) => {
  return api.get('/safety-patrol', { params });
};

export const createSafetyPatrol = (data: FormData) => {
  return api.post('/safety-patrol', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const getSafetyPatrolById = (id: number) => {
  return api.get(`/safety-patrol/${id}`);
};

export const updateSafetyPatrol = (id: number, data: FormData) => {
  return api.post(`/safety-patrol/${id}?_method=PUT`, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const deleteSafetyPatrol = (id: number) => {
  return api.delete(`/safety-patrol/${id}`);
};

export const submitSafetyPatrol = (id: number) => {
  return api.post(`/safety-patrol/${id}/submit`);
};

export const reviewSafetyPatrol = (id: number, catatan?: string, action?: string) => {
  return api.post(`/safety-patrol/${id}/review`, { catatan, action });
};

export const getSafetyPatrolStatusCounts = () => {
  return api.get('/safety-patrol/status-counts');
};
