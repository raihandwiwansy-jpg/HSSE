import axios from '../axios';

interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    user: {
      id: number;
      name: string;
      email: string;
      role: 'admin' | 'user';
      no_hp?: string;
      departemen?: string;
      avatar?: string;
      photo_url?: string;
    };
    token: string;
  };
}

export const login = async (email: string, password: string): Promise<LoginResponse> => {
  try {
    console.log('Mengirim request login ke:', (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api') + '/login');
    console.log('Data:', { email, password });

    const response = await axios.post('/login', { email, password });

    console.log('Response:', response.data);

    if (response.data.success && response.data.data?.token) {
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
    }

    return response.data;
  } catch (error: any) {
    console.error('Login error detail:', error);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
      throw error.response.data;
    } else if (error.request) {
      console.error('No response from server:', error.request);
      throw {
        success: false,
        message: 'Network Error - Pastikan backend berjalan',
      };
    } else {
      console.error('Error:', error.message);
      throw {
        success: false,
        message: 'Terjadi kesalahan: ' + error.message,
      };
    }
  }
};

export const logout = async () => {
  try {
    const token = localStorage.getItem('token');
    if (token) {
      await axios.post('/logout');
    }
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

export const getUser = async () => {
  try {
    const response = await axios.get('/user');
    return response.data;
  } catch (error) {
    console.error('Get user error:', error);
    throw error;
  }
};

export const getCurrentUser = () => {
  try {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  } catch {
    return null;
  }
};

export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

export const forgotPassword = async (email: string) => {
  const response = await axios.post('/forgot-password', { email });
  return response.data;
};

export const verifyOtp = async (email: string, otp: string) => {
  const response = await axios.post('/verify-otp', { email, otp });
  return response.data;
};

export const resetPassword = async (email: string, reset_token: string, password: string, password_confirmation: string) => {
  const response = await axios.post('/reset-password', { email, reset_token, password, password_confirmation });
  return response.data;
};

export const changePassword = async (payload: any) => {
  const response = await axios.post('/change-password', payload);
  return response.data;
};

export const changeEmail = async (payload: any) => {
  const response = await axios.post('/change-email', payload);
  return response.data;
};

export const toggleOtpForgot = async (require_otp_forgot_password: boolean) => {
  const response = await axios.post('/toggle-otp-forgot', { require_otp_forgot_password });
  return response.data;
};
