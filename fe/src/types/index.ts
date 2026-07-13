export interface User {
  id: number;
  username: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'supervisor';
  tempat_lahir?: string;
  tanggal_lahir?: string;
  no_hp?: string;
  departemen?: string;
  avatar?: string;
  created_at: string;
  updated_at: string;
}

export interface Insiden {
  id: number;
  user_id: number;
  judul: string;
  jenis: 'kecelakaan' | 'near_miss' | 'unsafe_condition';
  lokasi: string;
  tanggal_kejadian: string;
  deskripsi: string;
  foto: string | null;
  status: 'pending' | 'investigation' | 'resolved' | 'closed';
  created_at: string;
  updated_at: string;
  user?: User;
}

export interface GwpPermit {
  id: number;
  user_id: number;
  tanggal: string;
  pukul_mulai: string;
  pukul_selesai: string;
  departemen: string;
  lokasi: string;
  deskripsi_pekerjaan: string;
  peralatan: string;
  kategori_risiko: 'rendah' | 'sedang' | 'tinggi';
  berdasarkan_jsa?: string;
  kategori_pekerjaan: 'cold_work' | 'hot_work';
  daftar_keselamatan_pemohon?: string[];
  daftar_keselamatan_hse?: string[];
  ppe_checklist?: string[];
  validasi_shift?: { tanggal: string; pukul: string; paraf: string }[];
  status: 'draft' | 'submitted' | 'approved' | 'rejected' | 'completed';
  catatan_hse?: string;
  catatan_reject?: string;
  submitted_at?: string;
  approved_at?: string;
  completed_at?: string;
  created_at: string;
  updated_at: string;
  user?: User;
  approvals?: GwpApproval[];
}

export interface GwpApproval {
  id: number;
  gwp_permit_id: number;
  tipe: 'pemohon' | 'hse' | 'supervisor';
  nama: string;
  jabatan?: string;
  tanggal?: string;
  paraf?: string;
  status: 'pending' | 'approved' | 'rejected';
  catatan?: string;
  created_at: string;
  updated_at: string;
}

export interface JsaTahapan {
  nama: string;
  bahaya: string;
  risiko: string;
  kontrol: string;
}

export interface Jsa {
  id: number;
  user_id: number;
  departemen: string;
  tanggal: string;
  kegiatan: string;
  lokasi: string;
  tahapan: JsaTahapan[];
  created_at: string;
  updated_at: string;
  user?: User;
}

export interface Apd {
  id: number;
  nama: string;
  kode: string;
  stok: number;
  satuan: string;
  tanggal_kadaluarsa?: string;
  status: 'aktif' | 'kadaluarsa' | 'nonaktif' | 'habis';
  created_at: string;
  updated_at: string;
}

export interface Karyawan {
  id: number;
  nama: string;
  nik: string;
  jabatan: string;
  departemen: string;
  no_hp: string;
  created_at: string;
  updated_at: string;
}

export interface CsePermit {
  id: number;
  user_id: number;
  tanggal: string;
  supervisor: string;
  fasilitas: string;
  lokasi: string;
  alasan: string;
  jumlah_pekerja: number;
  hasil_gas?: string[];
  status: 'draft' | 'submitted' | 'approved' | 'rejected' | 'completed' | 'closed';
  catatan?: string;
  catatan_reject?: string;
  submitted_at?: string;
  approved_at?: string;
  completed_at?: string;
  created_at: string;
  updated_at: string;
  user?: User;
}

export interface HwpPermit {
  id: number;
  user_id: number;
  gwp_permit_id?: number;
  tanggal: string;
  shift: string;
  lokasi: string;
  deskripsi: string;
  jam_mulai: string;
  jam_selesai: string;
  bahaya_terkait: string;
  pencegahan: string;
  apd_digunakan?: string;
  status: 'draft' | 'submitted' | 'approved' | 'rejected' | 'completed';
  catatan?: string;
  catatan_reject?: string;
  submitted_at?: string;
  approved_at?: string;
  completed_at?: string;
  created_at: string;
  updated_at: string;
  user?: User;
  gwpPermit?: GwpPermit;
  approvals?: HwpApproval[];
}

export interface HwpApproval {
  id: number;
  hwp_permit_id: number;
  tipe: 'pemohon' | 'hse' | 'supervisor';
  nama: string;
  jabatan?: string;
  tanggal?: string;
  paraf?: string;
  status: 'pending' | 'approved' | 'rejected';
  catatan?: string;
  created_at: string;
  updated_at: string;
}

export interface PermitStatusCounts {
  total: number;
  draft: number;
  submitted: number;
  approved: number;
  rejected: number;
  completed: number;
}

export interface DashboardSummary {
  role: 'admin' | 'user' | 'supervisor';
  user_name: string;
  user_email: string;
  gwp: PermitStatusCounts;
  hwp: PermitStatusCounts;
  cse: PermitStatusCounts;
  insiden: {
    total: number;
    pending: number;
    kecelakaan?: number;
    near_miss?: number;
    unsafe_condition?: number;
  };
  need_action: number;
  total_permits: number;
  total_manhours?: number;
}

export interface DashboardStats {
  total_insiden: number;
  insiden_pending: number;
  total_gwp_aktif: number;
  total_apd: number;
  total_karyawan: number;
}

export interface DashboardChart {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string[];
  }[];
}

export interface PerformanceBoard {
  bulan: string;
  tahun: string;
  total_hari_kerja: number;
  total_manhours: number;
  total_safe_days: number;
  total_karyawan: number;
  last_accident_date: string | null;
  bulan_ini: number[];
  bulan_lalu: number[];
  tanggal: number[];
  trend_data?: any[];
}

export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  pagination: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface LoginResponse {
  user: User;
  token: string;
}

// ========================================
// UNIFIED PERMIT TYPES
// ========================================

export type PermitJenis = 'gwp' | 'hwp' | 'cse' | 'elp' | 'ewp' | 'lwp' | 'rwp' | 'whp';

export type PermitStatus =
  | 'draft'
  | 'submitted'
  | 'supervisor_approved'
  | 'supervisor_rejected'
  | 'hse_approved'
  | 'hse_rejected'
  | 'work_ready'
  | 'completed';

export interface Permit {
  id: number;
  user_id: number;
  permit_number: string;
  jenis: PermitJenis;
  judul: string;
  lokasi: string;
  deskripsi?: string;
  tanggal: string;
  pukul_mulai?: string;
  pukul_selesai?: string;
  departemen?: string;
  status: PermitStatus;
  jsa_id?: number;
  catatan?: string;
  catatan_reject?: string;
  submitted_at?: string;
  supervisor_approved_at?: string;
  supervisor_rejected_at?: string;
  hse_approved_at?: string;
  hse_rejected_at?: string;
  work_ready_at?: string;
  completed_at?: string;
  completion_data?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
  user?: User;
  jsa?: Jsa;
  detail?: PermitDetail;
}

export interface PermitDetail {
  id: number;
  permit_id: number;
  detail_data: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface PermitStatusCounts {
  total: number;
  draft: number;
  submitted: number;
  supervisor_approved: number;
  supervisor_rejected: number;
  hse_approved: number;
  hse_rejected: number;
  work_ready: number;
  completed: number;
}

// ========================================
// SAFETY PATROL TYPES
// ========================================

export type SafetyPatrolStatus = 'menunggu' | 'selesai';

export interface SafetyPatrol {
  id: number;
  user_id: number;
  tanggal: string;
  waktu?: string;
  lokasi: string;
  observer?: string;
  auditee?: string;
  leader?: string;
  observation_data?: SafetyObservationData;
  tindakan_perbaikan?: string;
  due_date?: string;
  foto?: string[];
  catatan?: string;
  status: SafetyPatrolStatus;
  submitted_at?: string;
  reviewed_at?: string;
  created_at: string;
  updated_at: string;
  user?: User;
}

export interface SafetyObservationData {
  reactions_of_people?: { items: { label: string; checked: boolean }[]; lainnya?: string };
  ppe?: { items: { label: string; checked: boolean }[]; lainnya?: string };
  position_of_people?: { items: { label: string; checked: boolean }[]; lainnya?: string };
  tools_and_equipment?: { items: { label: string; checked: boolean }[]; lainnya?: string };
  procedure_housekeeping?: { items: { label: string; checked: boolean }[]; lainnya?: string };
  observasi?: string;
  perlu_tindakan?: boolean;
  foto_sebelum?: string;
  foto_sesudah?: string;
}

// ========================================
// SAFETY BEHAVIOR OBSERVATION TYPES
// ========================================

export type SafetyBehaviorStatus = 'menunggu' | 'selesai';

export interface SafetyBehavior {
  id: number;
  user_id: number;
  tanggal: string;
  waktu?: string;
  lokasi: string;
  observer?: string;
  auditee?: string;
  kasubag?: string;
  observation_data?: SafetyBehaviorObservationData;
  tindakan_perbaikan?: string;
  due_date?: string;
  foto?: string[];
  catatan?: string;
  status: SafetyBehaviorStatus;
  submitted_at?: string;
  reviewed_at?: string;
  created_at: string;
  updated_at: string;
  user?: User;
}

export interface SafetyBehaviorObservationData {
  ppe?: { items: { label: string; value: 'safe' | 'at_risk' }[]; lainnya?: string };
  position_of_people?: { items: { label: string; value: 'safe' | 'at_risk' }[]; lainnya?: string };
  tools_and_equipment?: { items: { label: string; value: 'safe' | 'at_risk' }[]; lainnya?: string };
  housekeeping?: { items: { label: string; value: 'safe' | 'at_risk' }[] };
  environment?: { items: { label: string; value: 'safe' | 'at_risk' }[]; lainnya?: string };
  nearmiss?: { items: { label: string; value: 'safe' | 'at_risk' }[]; lainnya?: string };
  swa?: { items: { label: string; value: 'safe' | 'at_risk' }[] };
  kategori_perilaku?: 'safe' | 'at_risk';
  aktivitas?: string;
  observasi_perilaku?: string;
  alasan_beresiko?: string;
  perlu_tindakan?: boolean;
}
