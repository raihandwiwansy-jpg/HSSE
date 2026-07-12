'use client';

import { useState, useEffect } from 'react';
import { masterFieldApi } from '@/lib/api/masterData';

export interface FieldConfig {
  id: number;
  permit_type: string;
  field_name: string;
  field_label: string;
  field_type: string;
  source_master: string | null;
  is_required: boolean;
  is_locked: boolean;
  urutan: number;
}

const cache = new Map<string, FieldConfig[] | null>();

export function usePermitFieldConfig(permitType: string | null) {
  const [configs, setConfigs] = useState<FieldConfig[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!permitType) { setConfigs([]); return; }
    if (cache.has(permitType)) {
      const cached = cache.get(permitType);
      setConfigs(cached || []);
      return;
    }

    setLoading(true);
    masterFieldApi.getAll(permitType).then((res) => {
      const items = res.data || [];
      cache.set(permitType, items);
      setConfigs(items);
    }).catch(() => {
      cache.set(permitType, null);
    }).finally(() => setLoading(false));
  }, [permitType]);

  const getField = (fieldName: string): FieldConfig | undefined =>
    configs.find((c) => c.field_name === fieldName);

  const isLocked = (fieldName: string) => getField(fieldName)?.is_locked ?? false;
  const isRequired = (fieldName: string) => getField(fieldName)?.is_required ?? false;
  const getSourceMaster = (fieldName: string) => getField(fieldName)?.source_master ?? null;

  return { configs, loading, getField, isLocked, isRequired, getSourceMaster };
}
