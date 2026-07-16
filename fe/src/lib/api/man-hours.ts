import api from '../axios';

export interface MonthlyManHoursParams {
  tahun?: string;
}

export interface MonthlyManHoursData {
  tahun: string;
  bulan: string;
  manpower_inl?: number;
  manpower_kontraktor?: number;
  manpower_outsourcing?: number;
  normal_jam_inl?: number;
  normal_jam_kontraktor?: number;
  normal_jam_outsourcing?: number;
  overtime_inl?: number;
  overtime_kontraktor?: number;
  overtime_outsourcing?: number;
  cuti_sakit?: number;
}

export const getManHours = (params?: MonthlyManHoursParams) => {
  return api.get('/man-hours', { params });
};

export const createManHours = (data: MonthlyManHoursData) => {
  return api.post('/man-hours', data);
};

export const getManHoursById = (id: number) => {
  return api.get(`/man-hours/${id}`);
};

export const updateManHours = (id: number, data: Partial<MonthlyManHoursData>) => {
  return api.put(`/man-hours/${id}`, data);
};

export const deleteManHours = (id: number) => {
  return api.delete(`/man-hours/${id}`);
};
