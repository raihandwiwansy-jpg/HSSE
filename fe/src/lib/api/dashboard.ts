import api from '../axios';

export const getDashboardSummary = () => {
  return api.get('/dashboard/summary');
};

export const getDashboardStats = () => {
  return api.get('/dashboard/stats');
};

export const getDashboardChart = () => {
  return api.get('/dashboard/chart');
};

export const getPerformanceBoard = () => {
  return api.get('/dashboard/performance-board');
};

export const getAdminDashboard = () => {
  return api.get('/admin/dashboard');
};

export const getDashboardRoleData = () => {
  return api.get('/dashboard/role-data');
};
