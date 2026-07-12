'use client';

import { useState, useEffect } from 'react';
import { masterDataApi, type MasterItem } from '@/lib/api/masterData';

const cache = new Map<string, MasterItem[]>();

export function useMasterData(type: string | null) {
  const [data, setData] = useState<MasterItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!type) { setData([]); return; }
    if (cache.has(type)) { setData(cache.get(type)!); return; }

    setLoading(true);
    masterDataApi.getAll(type).then((res) => {
      const items = res.data || [];
      cache.set(type, items);
      setData(items);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [type]);

  return { options: data, loading };
}
