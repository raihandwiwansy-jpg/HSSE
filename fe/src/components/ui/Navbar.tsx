'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { User, LogOut, ChevronDown, Shield, Settings, UserCircle, Clock, BookOpen, Menu } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { useAuth } from '@/hooks/useAuth';
import GuideBook from '@/components/ui/GuideBook';
import { useSidebar } from '@/components/ui/Sidebar';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout: authLogout } = useAuth();
  const { isMobileOpen, setIsMobileOpen } = useSidebar();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);
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
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
      await fetch(`${baseUrl}/logout`, {
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
      <div className="flex items-center gap-2 min-w-0 flex-1 sm:flex-initial">
        {/* Hamburger mobile menu button */}
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="lg:hidden p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-gray-600 dark:text-gray-300 transition-colors shrink-0"
          aria-label="Toggle Menu"
        >
          <Menu size={20} className="shrink-0" />
        </button>

        <div className="flex items-center gap-1.5 min-w-0">
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
      <div className="flex justify-center shrink-0 sm:flex-1">
        <div className="hidden sm:flex flex-col items-center text-center">
          <p className="text-xs font-semibold text-gray-700 dark:text-gray-200 leading-tight whitespace-nowrap">
            {dayName}, {date} {month} {year}
          </p>
          <p className="text-[11px] text-blue-500 dark:text-blue-400 font-mono leading-tight">
            {hours}:{minutes}:{seconds} WIB
          </p>
        </div>
        {/* Mobile: only time */}
        <div className="flex sm:hidden items-center gap-1 text-[10px] font-mono text-gray-500 dark:text-gray-400 shrink-0 whitespace-nowrap bg-gray-50 dark:bg-gray-800/50 px-2 py-1 rounded-lg border border-gray-100 dark:border-gray-700">
          <Clock size={11} className="shrink-0 text-blue-500" />
          <span>{hours}:{minutes}</span>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        {!pathname.startsWith('/dashboard') && !pathname.startsWith('/settings') && !pathname.startsWith('/profil') && (
          <button
            onClick={() => setGuideOpen(true)}
            title="Buku Panduan"
            className="relative p-2 text-amber-600 dark:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-xl transition-all hover:scale-105 active:scale-95 group overflow-hidden shrink-0"
          >
            <span className="absolute inset-0 bg-amber-400/20 scale-0 rounded-xl group-active:scale-100 transition-transform duration-300 ease-out" />
            <BookOpen size={20} className="relative z-10 group-hover:rotate-[-5deg] transition-transform duration-300 shrink-0" />
          </button>
        )}
        <ThemeToggle />

        {/* Profile Dropdown */}
        <div className="relative shrink-0" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-1 sm:gap-2 px-1.5 sm:px-3 py-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors shrink-0"
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
            <ChevronDown className={`h-3.5 w-3.5 text-gray-400 dark:text-gray-500 transition-transform duration-200 shrink-0 ${dropdownOpen ? 'rotate-180' : ''}`} />
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

      <GuideBook isOpen={guideOpen} onClose={() => setGuideOpen(false)} />
    </header>
  );
}
