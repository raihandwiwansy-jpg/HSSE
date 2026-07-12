import api from '../axios';

export interface SafetyBehaviorParams {
  status?: string;
  search?: string;
  page?: number;
  per_page?: number;
  date_from?: string;
  date_to?: string;
}

export const getSafetyBehaviors = (params?: SafetyBehaviorParams) => {
  return api.get('/safety-behavior', { params });
};

export const createSafetyBehavior = (data: FormData) => {
  return api.post('/safety-behavior', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const getSafetyBehaviorById = (id: number) => {
  return api.get(`/safety-behavior/${id}`);
};

export const updateSafetyBehavior = (id: number, data: FormData) => {
  return api.post(`/safety-behavior/${id}?_method=PUT`, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const deleteSafetyBehavior = (id: number) => {
  return api.delete(`/safety-behavior/${id}`);
};

export const submitSafetyBehavior = (id: number) => {
  return api.post(`/safety-behavior/${id}/submit`);
};

export const reviewSafetyBehavior = (id: number, catatan?: string) => {
  return api.post(`/safety-behavior/${id}/review`, { catatan });
};

export const getSafetyBehaviorStatusCounts = () => {
  return api.get('/safety-behavior/status-counts');
};
