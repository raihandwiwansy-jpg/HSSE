import api from '../axios';

export interface MasterItem {
  id: number;
  nama?: string;
  name?: string;
  [key: string]: unknown;
}

const masterEndpoints: Record<string, string> = {
  departemen: 'master-data/departemen',
  perusahaan: 'master-data/perusahaan',
  personil: 'master-data/personil',
  peralatan: 'master-data/peralatan',
  bahaya: 'master-data/bahaya',
  risiko: 'master-data/risiko',
  checklist: 'master-data/checklist',
  shift: 'master-data/shift',
  'kategori-patrol': 'master-data/kategori-patrol',
  'kategori-perilaku': 'master-data/kategori-perilaku',
  lokasi: 'master-data/lokasi',
  apd: 'master-data/apd',
};

export const masterDataApi = {
  async getAll(type: string) {
    const ep = masterEndpoints[type] || `master-data/${type}`;
    const res = await api.get(`/${ep}`);
    return res.data;
  },

  async getById(type: string, id: number) {
    const ep = masterEndpoints[type] || `master-data/${type}`;
    const res = await api.get(`/${ep}/${id}`);
    return res.data;
  },

  async create(type: string, data: Record<string, unknown>) {
    const ep = masterEndpoints[type] || `master-data/${type}`;
    const res = await api.post(`/${ep}`, data);
    return res.data;
  },

  async update(type: string, id: number, data: Record<string, unknown>) {
    const ep = masterEndpoints[type] || `master-data/${type}`;
    const res = await api.put(`/${ep}/${id}`, data);
    return res.data;
  },

  async delete(type: string, id: number) {
    const ep = masterEndpoints[type] || `master-data/${type}`;
    const res = await api.delete(`/${ep}/${id}`);
    return res.data;
  },

  async seedDefaults() {
    const res = await api.get('/master-data/seed');
    return res.data;
  },
};

export const masterFieldApi = {
  async getAll(permitType?: string) {
    const params = permitType ? `?permit_type=${permitType}` : '';
    const res = await api.get(`/master-fields${params}`);
    return res.data;
  },

  async create(data: Record<string, unknown>) {
    const res = await api.post('/master-fields', data);
    return res.data;
  },

  async update(id: number, data: Record<string, unknown>) {
    const res = await api.put(`/master-fields/${id}`, data);
    return res.data;
  },

  async delete(id: number) {
    const res = await api.delete(`/master-fields/${id}`);
    return res.data;
  },
};
