'use client';

import { useState, useEffect, createContext, useContext } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import {
  LayoutDashboard,
  FileText,
  Shield,
  Users,
  BarChart3,
  Settings,
  User,
  LogOut,
  ChevronDown,
  ChevronLeft,
  Palette,
  KeyRound,
  Database,
  Info,
  Menu,
  X,
  ClipboardCheck,
  Activity,
  ShieldAlert,
  Clock,
} from 'lucide-react';

interface SubMenuItem {
  label: string;
  icon: React.ReactNode;
  href: string;
  roles?: string[];
}

const SidebarContext = createContext({
  isCollapsed: false,
  isMobileOpen: false,
  toggleSidebar: () => {},
  setIsMobileOpen: (open: boolean) => {},
});

export const useSidebar = () => useContext(SidebarContext);

const mainMenus = [
  { label: 'Dashboard', icon: <LayoutDashboard size={20} />, href: '/dashboard', roles: ['admin', 'user', 'supervisor', 'kasubag', 'audit'] },
  { label: 'Permit / Izin Kerja', icon: <FileText size={20} />, href: '/permit', roles: ['admin', 'user', 'supervisor', 'kasubag'] },
  { label: 'Insiden', icon: <ShieldAlert size={20} />, href: '/insiden', roles: ['admin', 'kasubag'] },
  { label: 'Man Hours', icon: <Clock size={20} />, href: '/man-hours', roles: ['admin', 'kasubag'] },
  { label: 'Safety Patrol', icon: <ClipboardCheck size={20} />, href: '/safety-patrol', roles: ['admin', 'user', 'kasubag', 'audit'] },
  { label: 'Safety Behavior', icon: <Activity size={20} />, href: '/safety-behavior', roles: ['admin', 'user', 'kasubag', 'audit'] },
  { label: 'HSSE KPI Performance', icon: <BarChart3 size={20} />, href: '/hse-kpi-performance', roles: ['admin'] },
];

const settingsSubmenus: SubMenuItem[] = [
  { label: 'Appearance', icon: <Palette size={16} />, href: '/settings/appearance' },
  { label: 'Keamanan Akun', icon: <KeyRound size={16} />, href: '/settings/security' },
  { label: 'Master Data', icon: <Database size={16} />, href: '/settings/master', roles: ['admin'] },
  { label: 'Tentang Aplikasi', icon: <Info size={16} />, href: '/settings/about' },
];

export default function Sidebar({ children }: { children?: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    if (pathname.startsWith('/settings')) {
      setIsSettingsOpen(true);
    } else {
      setIsSettingsOpen(false);
    }
  }, [pathname]);

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard';
    if (href === '/settings') return pathname === '/settings' || pathname.startsWith('/settings/');
    return pathname === href;
  };

  const isSettingsActive = () => pathname.startsWith('/settings');

  const filteredMain = mainMenus.filter((m) => {
    if (!m.roles) return true;
    return m.roles.includes(user?.role as string);
  });

  const filteredSettings = settingsSubmenus.filter(
    (s) => !s.roles || s.roles.includes(user?.role as string)
  );

  return (
    <SidebarContext.Provider value={{ isCollapsed, isMobileOpen, toggleSidebar, setIsMobileOpen }}>
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-[1px]" onClick={() => setIsMobileOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-40 h-full
          bg-white dark:bg-[#12121E]
          border-r border-gray-200 dark:border-gray-800
          transition-all duration-300 ease-in-out
          ${isCollapsed ? 'w-20' : 'w-64'}
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
          flex flex-col select-none
        `}
      >
        {/* Collapse Toggle */}
        <button
          onClick={toggleSidebar}
          className="hidden lg:flex absolute -right-3 top-5 w-6 h-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full items-center justify-center shadow-sm hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors z-50"
          title={isCollapsed ? 'Perluas Sidebar' : 'Perkecil Sidebar'}
        >
          <ChevronLeft size={14} className={`text-gray-500 dark:text-gray-400 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} />
        </button>

        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-800/80 shrink-0">
          <div className={`flex items-center gap-3 min-w-0 ${isCollapsed ? 'mx-auto' : ''}`}>
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center p-1.5 shrink-0 shadow-sm">
              <img src="/Picture1.png" alt="INL Logo" className="w-full h-full object-contain filter invert-0 dark:brightness-110" />
            </div>
            {!isCollapsed && (
              <div className="min-w-0">
                <h2 className="text-xs font-bold tracking-wide text-gray-900 dark:text-white leading-tight truncate">PT. INL</h2>
                <p className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 tracking-wider uppercase mt-0.5">HSSE SYSTEM</p>
              </div>
            )}
          </div>
          {/* Mobile Close Button */}
          {!isCollapsed && (
            <button
              onClick={() => setIsMobileOpen(false)}
              className="lg:hidden p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors shrink-0"
              title="Tutup menu"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Menu Navigation */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1 custom-scrollbar">
          {filteredMain.map((menu) => (
            <Link
              key={menu.href}
              href={menu.href}
              onClick={() => setIsMobileOpen(false)}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors duration-150 group
                ${isCollapsed ? 'justify-center px-2' : ''}
                ${isActive(menu.href)
                  ? 'bg-blue-50 dark:bg-blue-900/25 text-blue-600 dark:text-blue-400 font-semibold'
                  : 'text-gray-600 dark:text-gray-400 font-medium hover:bg-gray-100/80 dark:hover:bg-gray-800/60 hover:text-gray-900 dark:hover:text-gray-200'
                }
              `}
              title={isCollapsed ? menu.label : ''}
            >
              <span className={`shrink-0 transition-colors ${isActive(menu.href) ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300'}`}>
                {menu.icon}
              </span>
              {!isCollapsed && <span className="truncate">{menu.label}</span>}
            </Link>
          ))}

          {/* Settings Dropdown */}
          <div>
            <button
              onClick={() => { if (!isCollapsed) setIsSettingsOpen(!isSettingsOpen); }}
              className={`
                w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors duration-150
                ${isCollapsed ? 'justify-center px-2' : ''}
                ${isSettingsActive()
                  ? 'bg-blue-50 dark:bg-blue-900/25 text-blue-600 dark:text-blue-400 font-semibold'
                  : 'text-gray-600 dark:text-gray-400 font-medium hover:bg-gray-100/80 dark:hover:bg-gray-800/60 hover:text-gray-900 dark:hover:text-gray-200'
                }
              `}
              title={isCollapsed ? 'Settings' : ''}
            >
              <span className={`shrink-0 transition-colors ${isSettingsActive() ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`}>
                <Settings size={20} />
              </span>
              {!isCollapsed && (
                <>
                  <span className="flex-1 text-left truncate">Settings</span>
                  <ChevronDown size={16} className={`text-gray-400 transition-transform duration-200 ${isSettingsOpen ? 'rotate-180' : ''}`} />
                </>
              )}
            </button>

            {/* Submenu */}
            {!isCollapsed && (
              <div
                className={`
                  overflow-hidden transition-all duration-200 ease-in-out
                  ${isSettingsOpen ? 'max-h-96 opacity-100 mt-1' : 'max-h-0 opacity-0'}
                `}
              >
                <div className="ml-5 border-l border-gray-200 dark:border-gray-800 pl-3 space-y-1 py-1">
                  {filteredSettings.map((sub) => (
                    <Link
                      key={sub.href}
                      href={sub.href}
                      onClick={() => setIsMobileOpen(false)}
                      className={`
                        flex items-center gap-2.5 px-2.5 py-2 rounded-md text-xs transition-colors duration-150
                        ${pathname === sub.href
                          ? 'bg-blue-50/80 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-semibold'
                          : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100/60 dark:hover:bg-gray-800/40 hover:text-gray-800 dark:hover:text-gray-200 font-medium'
                        }
                      `}
                    >
                      <span className="shrink-0">{sub.icon}</span>
                      <span className="truncate">{sub.label}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Profil */}
          <Link
            href="/profil"
            onClick={() => setIsMobileOpen(false)}
            className={`
              flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors duration-150 group
              ${isCollapsed ? 'justify-center px-2' : ''}
              ${pathname === '/profil'
                ? 'bg-blue-50 dark:bg-blue-900/25 text-blue-600 dark:text-blue-400 font-semibold'
                : 'text-gray-600 dark:text-gray-400 font-medium hover:bg-gray-100/80 dark:hover:bg-gray-800/60 hover:text-gray-900 dark:hover:text-gray-200'
              }
            `}
            title={isCollapsed ? 'Profil' : ''}
          >
            <span className={`shrink-0 transition-colors ${pathname === '/profil' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300'}`}>
              <User size={20} />
            </span>
            {!isCollapsed && <span className="truncate">Profil</span>}
          </Link>
        </nav>

        {/* Bottom Logout Section */}
        <div className="border-t border-gray-200 dark:border-gray-800/80 p-3 shrink-0">
          <button
            onClick={logout}
            className={`
              w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
              text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30
              transition-colors duration-150 group
              ${isCollapsed ? 'justify-center px-2' : ''}
            `}
            title={isCollapsed ? 'Logout' : ''}
          >
            <span className="shrink-0 text-red-500 dark:text-red-400 group-hover:text-red-600 dark:group-hover:text-red-300">
              <LogOut size={20} />
            </span>
            {!isCollapsed && <span className="truncate">Logout</span>}
          </button>
        </div>
      </aside>

      {children}
    </SidebarContext.Provider>
  );
}
