'use client';

import { useState, useRef, useEffect } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { Sun, Moon, Monitor, Upload, Type, Save, Palette, Bell } from 'lucide-react';
import { toast } from 'react-toastify';
import { Logo } from '@/components/ui/Logo';
import { LogoSmall } from '@/components/ui/LogoSmall';
import { useAuth } from '@/hooks/useAuth';

export default function AppearanceTab() {
  const { isAdmin } = useAuth();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [logo, setLogo] = useState<string | null>(null);
  const [font, setFont] = useState('Inter');
  const [notifications, setNotifications] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const savedLogo = localStorage.getItem('customLogo');
    const savedFont = localStorage.getItem('font');
    const savedNotif = localStorage.getItem('notifications');
    if (savedLogo) setLogo(savedLogo);
    if (savedFont) setFont(savedFont);
    if (savedNotif) setNotifications(savedNotif === 'true');
  }, []);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Ukuran file maksimal 2MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        setLogo(dataUrl);
        localStorage.setItem('customLogo', dataUrl);
        // Dispatch custom event to let header and logo components update immediately
        window.dispatchEvent(new Event('logoChanged'));
        toast.success('Logo berhasil diupload!');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveSettings = () => {
    localStorage.setItem('font', font);
    localStorage.setItem('notifications', String(notifications));
    // Apply font family dynamically
    document.body.style.fontFamily = font;
    toast.success('Pengaturan berhasil disimpan!');
  };

  return (
    <div className="space-y-6 page-enter">
      {/* Theme */}
      <div className="hse-card bg-white dark:bg-[#12121E] p-5 rounded-2xl border border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-2 mb-4">
          <Palette className="w-5 h-5 text-[#1A365D]" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Tema</h2>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {(['light', 'dark', 'system'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTheme(t)}
              className={`p-4 rounded-xl border-2 transition-all ${
                theme === t
                  ? 'border-[#1A365D] bg-[#EBF4FF] dark:bg-[#1E3A5F] shadow-md'
                  : 'border-gray-200 dark:border-[#2D2D44] hover:border-gray-300 dark:hover:border-[#3D3D55] hover:shadow-sm'
              }`}
            >
              {t === 'light' && <Sun className="w-8 h-8 mx-auto mb-2 text-yellow-500" />}
              {t === 'dark' && <Moon className="w-8 h-8 mx-auto mb-2 text-indigo-500" />}
              {t === 'system' && <Monitor className="w-8 h-8 mx-auto mb-2 text-gray-500" />}
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">{t}</p>
            </button>
          ))}
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
          Tema Aktif: <span className="font-semibold capitalize text-[#1A365D]">{resolvedTheme}</span>
        </p>
      </div>

      {/* Font */}
      <div className="hse-card bg-white dark:bg-[#12121E] p-5 rounded-2xl border border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-2 mb-4">
          <Type className="w-5 h-5 text-[#1A365D]" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Font</h2>
        </div>
        <select
          value={font}
          onChange={(e) => setFont(e.target.value)}
          className="w-full max-w-sm px-4 py-2.5 bg-gray-50 dark:bg-[#1A1A2E] border border-gray-300 dark:border-gray-700 rounded-xl text-gray-850 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-[#1A365D] focus:border-transparent transition-all text-sm"
        >
          <option value="Inter">Inter (Default)</option>
          <option value="Poppins">Poppins</option>
          <option value="Roboto">Roboto</option>
          <option value="Open Sans">Open Sans</option>
          <option value="Nunito">Nunito</option>
        </select>
      </div>

      {/* Logo Upload */}
      {isAdmin() && (
        <div className="hse-card bg-white dark:bg-[#12121E] p-5 rounded-2xl border border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-2 mb-4">
            <Upload className="w-5 h-5 text-[#1A365D]" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Logo Aplikasi</h2>
          </div>

          {/* Logo Preview */}
          <div className="mb-4 p-6 border border-gray-200 dark:border-[#2D2D44] rounded-xl bg-gray-50 dark:bg-[#151528]">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 font-medium">Preview Logo Aplikasi:</p>
            <div className="flex items-center justify-center gap-8 flex-wrap">
              <div className="text-center">
                <p className="text-xs text-gray-400 mb-2">Login (XL)</p>
                <Logo size="xl" showSubtitle={true} />
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-400 mb-2">Sidebar (SM)</p>
                <div className="bg-white dark:bg-[#1A1A2E] p-4 rounded-xl border border-gray-200 dark:border-[#2D2D44]">
                  <Logo size="sm" showSubtitle={false} />
                </div>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-400 mb-2">Navbar</p>
                <div className="bg-white dark:bg-[#1A1A2E] p-4 rounded-xl border border-gray-200 dark:border-[#2D2D44]">
                  <LogoSmall showText={true} />
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6 flex-wrap">
            <div className="w-24 h-24 bg-gray-50 dark:bg-[#151528] rounded-xl flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-[#3D3D55]">
              {logo ? (
                <img src={logo} alt="Logo" className="w-20 h-20 object-contain" />
              ) : (
                <Upload className="w-8 h-8 text-gray-400 dark:text-gray-500" />
              )}
            </div>
            <div>
              <input type="file" ref={fileInputRef} onChange={handleLogoUpload} accept="image/*" className="hidden" />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-[#1A365D] hover:bg-[#2B4C7E] text-white rounded-xl text-sm font-semibold transition-all shadow-md shadow-[#1A365D]/10"
              >
                Upload Logo
              </button>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5">PNG, JPG, SVG (Max 2MB)</p>
            </div>
          </div>
        </div>
      )}

      {/* Notifications */}
      <div className="hse-card bg-white dark:bg-[#12121E] p-5 rounded-2xl border border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-2 mb-4">
          <Bell className="w-5 h-5 text-[#1A365D]" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Notifikasi</h2>
        </div>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={notifications}
            onChange={(e) => setNotifications(e.target.checked)}
            className="w-5 h-5 text-[#1A365D] rounded border-gray-300 dark:border-[#3D3D55] focus:ring-[#1A365D]"
          />
          <span className="text-gray-705 dark:text-gray-300 text-sm">Aktifkan notifikasi sistem</span>
        </label>
      </div>

      {/* Save */}
      <button onClick={handleSaveSettings} className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-[#1A365D] hover:bg-[#2B4C7E] text-white rounded-xl font-bold transition-all shadow-lg shadow-[#1A365D]/20">
        <Save size={18} />
        Simpan Pengaturan
      </button>
    </div>
  );
}
