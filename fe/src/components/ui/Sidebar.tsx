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

  const displayPhoto = user?.photo_url || user?.avatar || user?.foto;

  return (
    <SidebarContext.Provider value={{ isCollapsed, isMobileOpen, toggleSidebar, setIsMobileOpen }}>
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


        {/* Brand Header */}
        <div className={`h-16 flex items-center px-5 border-b border-gray-150 dark:border-gray-800 ${isCollapsed ? 'justify-center px-0' : 'gap-3 bg-gradient-to-r from-blue-50/20 to-transparent'}`}>
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-650 flex items-center justify-center p-1.5 shadow-md shadow-blue-500/10 shrink-0">
            <img src="/Picture1.png" alt="INL Logo" className="w-full h-full object-contain filter invert-0 dark:brightness-110" />
          </div>
          {!isCollapsed && (
            <div className="min-w-0">
              <h2 className="text-xs font-black tracking-wider text-gray-800 dark:text-white leading-none">PT. INL</h2>
              <p className="text-[9px] font-bold text-blue-600 dark:text-blue-400 tracking-widest mt-1 uppercase">HSSE SYSTEM</p>
            </div>
          )}
        </div>

        {/* User Info */}
        {!isCollapsed && (
          <div className="px-4 py-3.5 border-b border-gray-150 dark:border-gray-800 bg-gradient-to-r from-blue-50/80 via-blue-50/40 to-transparent dark:from-blue-950/15 dark:via-blue-950/5">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-650 flex items-center justify-center shrink-0 overflow-hidden border-2 border-white dark:border-gray-800 shadow-sm">
                  {displayPhoto ? (
                    <img src={displayPhoto} alt={user?.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-sm font-extrabold text-white">{user?.name?.charAt(0)?.toUpperCase() || 'U'}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-gray-800 dark:text-white truncate">
                    {user?.name || 'User'}
                  </p>
                  <p className="text-[10px] text-blue-650 dark:text-blue-400 font-extrabold capitalize truncate mt-0.5">
                    {user?.role || 'User'}{user?.departemen ? ` · ${user.departemen}` : ''}
                  </p>
                </div>
              </div>
              {/* Mobile Close Button */}
              <button
                onClick={() => setIsMobileOpen(false)}
                className="lg:hidden p-1.5 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-xl text-gray-500 dark:text-gray-400 shrink-0"
              >
                <X size={18} />
              </button>
            </div>
          </div>
        )}

        {/* Menu */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1.5 custom-scrollbar">
          {filteredMain.map((menu) => (
            <Link
              key={menu.href}
              href={menu.href}
              onClick={() => setIsMobileOpen(false)}
              className={`
                relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold
                transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] group
                ${isCollapsed ? 'justify-center' : ''}
                ${isActive(menu.href)
                  ? 'bg-gradient-to-r from-blue-50 to-indigo-50/50 dark:from-blue-950/30 dark:to-indigo-950/15 text-blue-600 dark:text-blue-400 shadow-sm border-l-4 border-blue-500' + (isCollapsed ? ' pl-3' : ' pl-2')
                  : 'text-gray-650 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-850 hover:text-gray-900 dark:hover:text-white'
                }
              `}
              title={isCollapsed ? menu.label : ''}
            >
              <span className="shrink-0 transition-transform duration-300 group-hover:scale-110">
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
                relative w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold
                transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]
                ${isCollapsed ? 'justify-center' : ''}
                ${isSettingsActive()
                  ? 'bg-gradient-to-r from-blue-50 to-indigo-50/50 dark:from-blue-950/30 dark:to-indigo-950/15 text-blue-600 dark:text-blue-400 shadow-sm border-l-4 border-blue-500' + (isCollapsed ? ' pl-3' : ' pl-2')
                  : 'text-gray-650 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-850 hover:text-gray-900 dark:hover:text-white'
                }
              `}
              title={isCollapsed ? 'Settings' : ''}
            >
              <Settings size={20} className="shrink-0" />
              {!isCollapsed && (
                <>
                  <span className="flex-1 text-left">Settings</span>
                  <ChevronDown size={16} className={`transition-transform duration-300 ${isSettingsOpen ? 'rotate-180' : ''}`} />
                </>
              )}
            </button>

            {/* Submenu with slide */}
            {!isCollapsed && (
              <div
                className={`
                  overflow-hidden transition-all duration-350 ease-in-out
                  ${isSettingsOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
                `}
              >
                <div className="ml-5 border-l-2 border-gray-150 dark:border-gray-800 pl-3.5 space-y-1.5 mt-1.5">
                  {filteredSettings.map((sub) => (
                    <Link
                      key={sub.href}
                      href={sub.href}
                      onClick={() => setIsMobileOpen(false)}
                      className={`
                        flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold
                        transition-all duration-200 hover:translate-x-0.5
                        ${pathname === sub.href
                          ? 'bg-blue-50/75 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 font-bold'
                          : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-850 hover:text-gray-700 dark:hover:text-gray-200'
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
              relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold
              transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]
              ${isCollapsed ? 'justify-center' : ''}
              ${pathname === '/profil'
                ? 'bg-gradient-to-r from-blue-50 to-indigo-50/50 dark:from-blue-950/30 dark:to-indigo-950/15 text-blue-600 dark:text-blue-400 shadow-sm border-l-4 border-blue-500' + (isCollapsed ? ' pl-3' : ' pl-2')
                : 'text-gray-650 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-850 hover:text-gray-900 dark:hover:text-white'
              }
            `}
            title={isCollapsed ? 'Profil' : ''}
          >
            <User size={20} className="shrink-0" />
            {!isCollapsed && <span>Profil</span>}
          </Link>
        </nav>

        {/* Bottom */}
        <div className="border-t border-gray-150 dark:border-gray-800 p-3 bg-gradient-to-t from-gray-50/50 dark:from-gray-950/5 to-transparent">
          <button
            onClick={logout}
            className={`
              w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold
              text-red-650 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20
              transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]
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
