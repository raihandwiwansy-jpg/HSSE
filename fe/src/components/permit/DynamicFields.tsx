'use client';

import { usePermitFieldConfig } from '@/hooks/usePermitFieldConfig';
import MasterSelect from '@/components/ui/MasterSelect';
import { Loader2 } from 'lucide-react';

interface Props {
  permitType: string;
  data: Record<string, unknown>;
  onChange: (data: Record<string, unknown>) => void;
  hardcodedFields?: string[];
}

export default function DynamicFields({ permitType, data, onChange, hardcodedFields = [] }: Props) {
  const { configs, loading } = usePermitFieldConfig(permitType);

  if (loading) return null;
  if (!configs.length) return null;

  const additional = configs.filter((c) => !hardcodedFields.includes(c.field_name));
  if (!additional.length) return null;

  const update = (key: string, value: unknown) => onChange({ ...data, [key]: value });

  return (
    <div className="bg-blue-50/50 dark:bg-blue-900/10 rounded-xl p-4 space-y-3 border border-blue-200/50 dark:border-blue-800/30">
      <h4 className="font-bold text-gray-800 dark:text-white text-xs sm:text-sm uppercase tracking-wide flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
        Additional Fields
      </h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {additional.map((field) => {
          const val = (data[field.field_name] as string) || '';

          if (field.source_master) {
            return (
              <div key={field.id} className="space-y-1">
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                  {field.field_label}
                  {field.is_required && <span className="text-red-500 ml-0.5">*</span>}
                </label>
                <MasterSelect
                  masterType={field.source_master}
                  value={val}
                  onChange={(v) => update(field.field_name, v)}
                  placeholder={`Pilih ${field.field_label.toLowerCase()}...`}
                  disabled={field.is_locked}
                  required={field.is_required}
                />
              </div>
            );
          }

          if (field.field_type === 'textarea') {
            return (
              <div key={field.id} className="space-y-1 sm:col-span-2">
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                  {field.field_label}
                  {field.is_required && <span className="text-red-500 ml-0.5">*</span>}
                </label>
                <textarea
                  value={val}
                  onChange={(e) => update(field.field_name, e.target.value)}
                  className="hse-input text-xs resize-y min-h-[60px]"
                  rows={2}
                  disabled={field.is_locked}
                  required={field.is_required}
                  placeholder={field.field_label}
                />
              </div>
            );
          }

          if (field.field_type === 'checkbox') {
            return (
              <div key={field.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id={`df-${field.field_name}`}
                  checked={!!data[field.field_name]}
                  onChange={(e) => update(field.field_name, e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 disabled:opacity-50"
                  disabled={field.is_locked}
                />
                <label htmlFor={`df-${field.field_name}`} className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  {field.field_label}
                  {field.is_required && <span className="text-red-500 ml-0.5">*</span>}
                </label>
              </div>
            );
          }

          if (field.field_type === 'date') {
            return (
              <div key={field.id} className="space-y-1">
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                  {field.field_label}
                  {field.is_required && <span className="text-red-500 ml-0.5">*</span>}
                </label>
                <input
                  type="date"
                  value={val}
                  onChange={(e) => update(field.field_name, e.target.value)}
                  className="hse-input text-xs"
                  disabled={field.is_locked}
                  required={field.is_required}
                />
              </div>
            );
          }
 
          if (field.field_type === 'time') {
            return (
              <div key={field.id} className="space-y-1">
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                  {field.field_label}
                  {field.is_required && <span className="text-red-500 ml-0.5">*</span>}
                </label>
                <input
                  type="time"
                  value={val}
                  onChange={(e) => update(field.field_name, e.target.value)}
                  className="hse-input text-xs"
                  disabled={field.is_locked}
                  required={field.is_required}
                />
              </div>
            );
          }

          return (
            <div key={field.id} className="space-y-1">
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                {field.field_label}
                {field.is_required && <span className="text-red-500 ml-0.5">*</span>}
              </label>
              <input
                type={field.field_type === 'number' ? 'number' : 'text'}
                value={val}
                onChange={(e) => update(field.field_name, e.target.value)}
                className="hse-input text-xs"
                disabled={field.is_locked}
                required={field.is_required}
                placeholder={field.field_label}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
