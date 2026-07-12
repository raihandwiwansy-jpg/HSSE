'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Save, Loader2 } from 'lucide-react';
import axios from '@/lib/axios';

const defaults: Record<string, string> = {
  form_input_size: 'md',
  form_font_size: 'sm',
  form_border_radius: 'lg',
  form_spacing: 'normal',
  form_label_size: 'xs',
  form_table_padding: 'normal',
};

const sizeOptions = [
  { value: 'sm', label: 'Small / Kecil' },
  { value: 'md', label: 'Medium / Sedang' },
  { value: 'lg', label: 'Large / Besar' },
];

const spacingOptions = [
  { value: 'compact', label: 'Compact / Rapat' },
  { value: 'normal', label: 'Normal' },
  { value: 'relaxed', label: 'Relaxed / Longgar' },
];

export default function FormLayoutTab() {
  const [settings, setSettings] = useState<Record<string, string>>({ ...defaults });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    axios.get('/settings').then((res) => {
      const saved = res.data || {};
      setSettings((prev) => ({ ...prev, ...saved }));
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const update = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    applyCss({ ...settings, [key]: value });
  };

  const applyCss = (vals: Record<string, string>) => {
    const root = document.documentElement;
    root.style.setProperty('--form-input-size', vals.form_input_size);
    root.style.setProperty('--form-font-size', vals.form_font_size);
    root.style.setProperty('--form-border-radius', vals.form_border_radius);
    root.style.setProperty('--form-spacing', vals.form_spacing);
    root.style.setProperty('--form-label-size', vals.form_label_size);
    root.style.setProperty('--form-table-padding', vals.form_table_padding);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await axios.post('/settings', { settings });
      toast.success('Pengaturan tampilan form disimpan');
    } catch {
      toast.error('Gagal menyimpan pengaturan');
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    if (!loading) applyCss(settings);
  }, [loading]);

  if (loading) {
    return <div className="flex items-center justify-center py-12"><Loader2 size={24} className="animate-spin text-gray-400" /></div>;
  }

  return (
    <div className="animate-fade-in-up space-y-6 max-w-2xl">
      <div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Pengaturan Tampilan Form</h3>
        <p className="text-sm text-gray-500 mt-0.5">Sesuaikan ukuran, jarak, dan tampilan form permit & safety</p>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 divide-y divide-gray-100 dark:divide-gray-800">
        <SettingRow label="Ukuran Input" desc="Tinggi dan padding field input">
          <select value={settings.form_input_size} onChange={(e) => update('form_input_size', e.target.value)}
            className="px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/40">
            {sizeOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </SettingRow>

        <SettingRow label="Ukuran Font" desc="Besar teks di form">
          <select value={settings.form_font_size} onChange={(e) => update('form_font_size', e.target.value)}
            className="px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/40">
            {sizeOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </SettingRow>

        <SettingRow label="Ukuran Label" desc="Besar teks label field">
          <select value={settings.form_label_size} onChange={(e) => update('form_label_size', e.target.value)}
            className="px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/40">
            <option value="xs">XS / Sangat Kecil</option>
            <option value="sm">Small / Kecil</option>
            <option value="base">Normal</option>
          </select>
        </SettingRow>

        <SettingRow label="Border Radius" desc="Tingkat kelengkungan sudut input">
          <select value={settings.form_border_radius} onChange={(e) => update('form_border_radius', e.target.value)}
            className="px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/40">
            <option value="sm">Small (4px)</option>
            <option value="md">Medium (8px)</option>
            <option value="lg">Large (12px)</option>
            <option value="xl">XL (16px)</option>
          </select>
        </SettingRow>

        <SettingRow label="Spacing Form" desc="Jarak antar field">
          <select value={settings.form_spacing} onChange={(e) => update('form_spacing', e.target.value)}
            className="px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/40">
            {spacingOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </SettingRow>

        <SettingRow label="Padding Table" desc="Padding dalam sel tabel">
          <select value={settings.form_table_padding} onChange={(e) => update('form_table_padding', e.target.value)}
            className="px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/40">
            {spacingOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </SettingRow>
      </div>

      <button onClick={handleSave} disabled={saving}
        className="flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 rounded-xl transition-all disabled:opacity-50 shadow-sm">
        {saving && <Loader2 size={16} className="animate-spin" />}
        <Save size={16} />
        Simpan Pengaturan
      </button>
    </div>
  );
}

function SettingRow({ label, desc, children }: { label: string; desc: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between px-5 py-4 gap-4">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 dark:text-white">{label}</p>
        <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}
