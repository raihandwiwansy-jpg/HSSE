import axios from '../axios';

export interface UserData {
  id: number;
  username: string;
  name: string;
  email: string;
  role: string;
  tempat_lahir?: string;
  tanggal_lahir?: string;
  no_hp?: string;
  departemen?: string;
  created_at: string;
  updated_at: string;
}

interface PaginatedResponse {
  success: boolean;
  data: {
    current_page: number;
    data: UserData[];
    last_page: number;
    per_page: number;
    total: number;
  };
}

export const getUsers = async (params: { search?: string; role?: string; page?: number; per_page?: number }) => {
  const response = await axios.get<PaginatedResponse>('/users', { params });
  return response.data;
};

export const getUser = async (id: number) => {
  const response = await axios.get(`/users/${id}`);
  return response.data;
};

export const createUser = async (data: {
  username: string;
  name: string;
  email: string;
  password: string;
  role: string;
  tempat_lahir?: string;
  tanggal_lahir?: string;
  no_hp?: string;
  departemen?: string;
}) => {
  const response = await axios.post('/users', data);
  return response.data;
};

export const updateUser = async (id: number, data: {
  username: string;
  name: string;
  email: string;
  password?: string;
  role: string;
  tempat_lahir?: string;
  tanggal_lahir?: string;
  no_hp?: string;
  departemen?: string;
}) => {
  const response = await axios.put(`/users/${id}`, data);
  return response.data;
};

export const deleteUser = async (id: number) => {
  const response = await axios.delete(`/users/${id}`);
  return response.data;
};

export const getRoles = async () => {
  const response = await axios.get('/users/roles');
  return response.data;
};

export const importUsers = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await axios.post('/users/import', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};
