import axios from '../axios';

export const getHseKpiData = async (year?: number) => {
  const response = await axios.get('/hse-kpi', { params: { year } });
  return response.data;
};

export const getHseKpiEntries = async (params: { year?: number; page?: number; per_page?: number }) => {
  const response = await axios.get('/hse-kpi/entries', { params });
  return response.data;
};

export const getHseKpiRecord = async (id: number) => {
  const response = await axios.get(`/hse-kpi/${id}`);
  return response.data;
};

export const createHseKpi = async (data: any) => {
  const response = await axios.post('/hse-kpi', data);
  return response.data;
};

export const updateHseKpi = async (id: number, data: any) => {
  const response = await axios.put(`/hse-kpi/${id}`, data);
  return response.data;
};

export const deleteHseKpi = async (id: number) => {
  const response = await axios.delete(`/hse-kpi/${id}`);
  return response.data;
};
