'use client';

import { useState, createContext, useContext } from 'react';
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
  toggleSidebar: () => {},
  setIsMobileOpen: (open: boolean) => {},
});

export const useSidebar = () => useContext(SidebarContext);

const mainMenus = [
  { label: 'Dashboard', icon: <LayoutDashboard size={20} />, href: '/dashboard', roles: ['admin', 'user', 'supervisor'] },
  { label: 'Permit / Izin Kerja', icon: <FileText size={20} />, href: '/permit', roles: ['admin', 'user', 'supervisor'] },
  { label: 'Insiden', icon: <ShieldAlert size={20} />, href: '/insiden', roles: ['admin', 'user'] },
  { label: 'Man Hours', icon: <Clock size={20} />, href: '/man-hours', roles: ['admin', 'user'] },
  { label: 'Safety Patrol', icon: <ClipboardCheck size={20} />, href: '/safety-patrol', roles: ['admin', 'user'] },
  { label: 'Safety Behavior', icon: <Activity size={20} />, href: '/safety-behavior', roles: ['admin', 'user'] },
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

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard';
    if (href === '/settings') return pathname === '/settings' || pathname.startsWith('/settings/');
    return pathname === href;
  };

  const isSettingsActive = () => pathname.startsWith('/settings');

  const filteredMain = mainMenus.filter((m) => {
    if (!m.roles) return true;
    return m.roles.includes(user?.role as 'admin' | 'user' | 'supervisor');
  });

  const filteredSettings = settingsSubmenus.filter(
    (s) => !s.roles || s.roles.includes(user?.role as string)
  );

  const displayPhoto = user?.photo_url || user?.avatar || user?.foto;

  return (
    <SidebarContext.Provider value={{ isCollapsed, toggleSidebar, setIsMobileOpen }}>
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700"
      >
        {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setIsMobileOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-40 h-full
          bg-white dark:bg-gray-900
          border-r border-gray-200 dark:border-gray-700
          transition-all duration-300 ease-in-out
          ${isCollapsed ? 'w-20' : 'w-64'}
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
          flex flex-col
        `}
      >
        {/* Collapse Toggle */}
        <button
          onClick={toggleSidebar}
          className="hidden lg:flex absolute -right-3 top-5 w-6 h-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-full items-center justify-center shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 z-50"
        >
          <ChevronLeft size={14} className={`text-gray-500 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} />
        </button>


        {/* User Info */}
        {!isCollapsed && (
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-blue-50 dark:bg-blue-900/20">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center shrink-0 overflow-hidden border-2 border-blue-500">
                {displayPhoto ? (
                  <img src={displayPhoto} alt={user?.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xs font-bold text-white">{user?.name?.charAt(0)?.toUpperCase() || 'U'}</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 dark:text-white truncate">
                  {user?.name || 'User'}
                </p>
                <p className="text-xs text-blue-600 dark:text-blue-400 capitalize truncate">
                  {user?.role || 'User'}{user?.departemen ? ` · ${user.departemen}` : ''}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Menu */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1 custom-scrollbar">
          {filteredMain.map((menu) => (
            <Link
              key={menu.href}
              href={menu.href}
              onClick={() => setIsMobileOpen(false)}
              className={`
                relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                transition-all duration-200
                ${isCollapsed ? 'justify-center' : ''}
                ${isActive(menu.href)
                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                }
              `}
              title={isCollapsed ? menu.label : ''}
            >
              {isActive(menu.href) && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-600 rounded-r-full" />
              )}
              <span className="shrink-0 transition-transform duration-200 group-hover:scale-110">
                {menu.icon}
              </span>
              {!isCollapsed && <span>{menu.label}</span>}
            </Link>
          ))}

          {/* Settings Dropdown */}
          <div>
            <button
              onClick={() => { if (!isCollapsed) setIsSettingsOpen(!isSettingsOpen); }}
              className={`
                relative w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                transition-all duration-200
                ${isCollapsed ? 'justify-center' : ''}
                ${isSettingsActive()
                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                }
              `}
              title={isCollapsed ? 'Settings' : ''}
            >
              {isSettingsActive() && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-600 rounded-r-full" />
              )}
              <Settings size={20} className="shrink-0" />
              {!isCollapsed && (
                <>
                  <span className="flex-1 text-left">Settings</span>
                  <ChevronDown size={16} className={`transition-transform duration-200 ${isSettingsOpen ? 'rotate-180' : ''}`} />
                </>
              )}
            </button>

            {/* Submenu with slide */}
            {!isCollapsed && (
              <div
                className={`
                  overflow-hidden transition-all duration-300 ease-in-out
                  ${isSettingsOpen || isSettingsActive() ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
                `}
              >
                <div className="ml-6 border-l-2 border-gray-200 dark:border-gray-700 pl-3 space-y-1 mt-1">
                  {filteredSettings.map((sub) => (
                    <Link
                      key={sub.href}
                      href={sub.href}
                      onClick={() => setIsMobileOpen(false)}
                      className={`
                        flex items-center gap-2 px-3 py-2 rounded-lg text-sm
                        transition-all duration-200
                        ${pathname === sub.href
                          ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-medium'
                          : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-200'
                        }
                      `}
                    >
                      <span className="shrink-0">{sub.icon}</span>
                      <span>{sub.label}</span>
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
              relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
              transition-all duration-200
              ${isCollapsed ? 'justify-center' : ''}
              ${pathname === '/profil'
                ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
              }
            `}
            title={isCollapsed ? 'Profil' : ''}
          >
            {pathname === '/profil' && (
              <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-600 rounded-r-full" />
            )}
            <User size={20} className="shrink-0" />
            {!isCollapsed && <span>Profil</span>}
          </Link>
        </nav>

        {/* Bottom */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-3">
          <button
            onClick={logout}
            className={`
              w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
              text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20
              transition-all duration-200
              ${isCollapsed ? 'justify-center' : ''}
            `}
            title={isCollapsed ? 'Logout' : ''}
          >
            <LogOut size={20} className="shrink-0" />
            {!isCollapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {children}
    </SidebarContext.Provider>
  );
}
