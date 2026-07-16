'use client';

import { useEffect, useState, useCallback } from 'react';

export interface User {
  id: number;
  username?: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'supervisor';
  tempat_lahir?: string;
  tanggal_lahir?: string;
  no_hp?: string;
  departemen?: string;
  foto?: string;
  avatar?: string;
  photo_url?: string;
  require_otp_forgot_password?: boolean;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(() => {
    const userStr = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (token && userStr) {
      try {
        setUser(JSON.parse(userStr));
      } catch {
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    loadUser();
    setLoading(false);
  }, [loadUser]);

  // Listen for storage changes from other components (e.g. profile photo update)
  useEffect(() => {
    const handleStorage = () => loadUser();
    window.addEventListener('storage', handleStorage);
    window.addEventListener('local-storage-update', handleStorage);
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('local-storage-update', handleStorage);
    };
  }, [loadUser]);

  /** Update partial user data in state + localStorage */
  const updateUser = useCallback((partial: Partial<User>) => {
    setUser(prev => {
      if (!prev) return prev;
      const updated = { ...prev, ...partial };
      localStorage.setItem('user', JSON.stringify(updated));
      return updated;
    });
    window.dispatchEvent(new Event('local-storage-update'));
  }, []);

  const isAdmin = () => user?.role === 'admin';
  const isUser = () => user?.role === 'user';
  const isSupervisor = () => user?.role === 'supervisor';
  const canApprove = () => user?.role === 'admin';
  const canComplete = () => user?.role === 'supervisor';

  const logout = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
        await fetch(`${baseUrl}/logout`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        });
      }
    } catch {
      // ignore server errors during logout
    }
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/login';
  };

  return { user, loading, updateUser, isAdmin, isUser, isSupervisor, canApprove, canComplete, logout };
}
