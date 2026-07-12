'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { User, LogOut, ChevronDown, Shield, Settings, UserCircle, Clock } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { useAuth } from '@/hooks/useAuth';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout: authLogout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:8000/api/logout', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          Accept: 'application/json',
        },
      });
    } catch { /* ignore */ }
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agustus', 'Sep', 'Okt', 'November', 'Des'];
  const dayName = days[currentTime.getDay()];
  const date = currentTime.getDate();
  const month = months[currentTime.getMonth()];
  const year = currentTime.getFullYear();
  const hours = String(currentTime.getHours()).padStart(2, '0');
  const minutes = String(currentTime.getMinutes()).padStart(2, '0');
  const seconds = String(currentTime.getSeconds()).padStart(2, '0');

  const displayPhoto = user?.photo_url || user?.avatar || user?.foto;

  return (
    <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/60 dark:border-gray-700/60 h-14 flex items-center justify-between px-3 sm:px-6 gap-2 transition-colors duration-300 sticky top-0 z-30">
      {/* Left */}
      <div className="flex items-center gap-2 min-w-0">
        <div className="flex items-center gap-1.5">
          <Shield size={16} className="text-blue-500 shrink-0" />
          <h1 className="text-sm sm:text-base font-bold text-gray-800 dark:text-white leading-none truncate">
            HSSE Management
          </h1>
        </div>
        <span className="text-[10px] text-gray-500 dark:text-gray-400 capitalize px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full hidden sm:inline font-medium shrink-0">
          {user?.role === 'admin' ? '👑 Admin' : user?.role === 'supervisor' ? '⭐ Supervisor' : '👤 User'}
        </span>
      </div>

      {/* Center — Clock (visible on sm+) */}
      <div className="flex-1 flex justify-center">
        <div className="hidden sm:flex flex-col items-center text-center">
          <p className="text-xs font-semibold text-gray-700 dark:text-gray-200 leading-tight whitespace-nowrap">
            {dayName}, {date} {month} {year}
          </p>
          <p className="text-[11px] text-blue-500 dark:text-blue-400 font-mono leading-tight">
            {hours}:{minutes}:{seconds} WIB
          </p>
        </div>
        {/* Mobile: only time */}
        <div className="flex sm:hidden items-center gap-1 text-[10px] font-mono text-gray-500 dark:text-gray-400">
          <Clock size={11} />
          <span>{hours}:{minutes}</span>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2 shrink-0">
        <ThemeToggle />

        {/* Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center shadow-sm overflow-hidden border border-gray-300 dark:border-gray-600 shrink-0">
              {displayPhoto ? (
                <img src={displayPhoto} alt={user?.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-xs font-bold text-white">
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              )}
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-gray-100 leading-tight max-w-[120px] truncate">
                {user?.name || 'User'}
              </p>
            </div>
            <ChevronDown className={`h-3.5 w-3.5 text-gray-400 dark:text-gray-500 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 z-50 animate-fade-in overflow-hidden">
              <div className="px-4 pt-4 pb-3 border-b border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center shrink-0 overflow-hidden">
                    {displayPhoto ? (
                      <img src={displayPhoto} alt={user?.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-base font-bold text-white">
                        {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                      </span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                      {user?.name || 'User'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {user?.email || ''}
                    </p>
                    <span className="inline-block mt-0.5 text-[10px] font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-1.5 py-0.5 rounded-full capitalize">
                      {user?.role || '-'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="py-1">
                <Link
                  href="/profil"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <UserCircle size={18} className="text-gray-400" />
                  Profil
                </Link>
                <Link
                  href="/settings"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <Settings size={18} className="text-gray-400" />
                  Pengaturan
                </Link>
              </div>

              <div className="border-t border-gray-100 dark:border-gray-700 py-1">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                >
                  <LogOut size={18} />
                  Keluar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
