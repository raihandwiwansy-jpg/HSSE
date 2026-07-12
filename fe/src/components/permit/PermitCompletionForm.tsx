'use client';
import Input from '@/components/ui/Input';
import Checkbox from '@/components/ui/Checkbox';
import RadioGroup from '@/components/ui/RadioGroup';
import Button from '@/components/ui/Button';
import { PermitJenis } from '@/types';
import { CircleCheck, Lock } from 'lucide-react';

interface PermitCompletionFormProps {
  jenis: PermitJenis;
  userRole: 'user' | 'supervisor' | 'admin';
  completionData: Record<string, unknown>;
  onChange: (d: Record<string, unknown>) => void;
  onSubmit: (mergedData: Record<string, unknown>) => void;
  isPending: boolean;
  onSubmitRole?: (role: string) => void;
}

const GWP_STATEMENTS = {
  pemohon: 'Saya telah menyelesaikan pekerjaan. Lokasi kerja telah dibersihkan dari peralatan yang digunakan termasuk barang barang sisa yang dihasilkan dalam pekerjaan.',
  pemilik: 'Saya telah melihat lokasi kerja, melakukan pengecekan terhadap area kerja dan memastikan bahwa lokasi kerja telah bersih dan mesin/peralatan telah siap untuk digunakan kembali.',
  pemberi: 'Saya telah memastikan bahwa pekerjaan telah selesai dan kondisi area dan mesin/peralatan sudah dalam keadaan aman dan siap untuk digunakan kembali',
};

const HWP_STATEMENTS = {
  pemohon: 'Saya telah selesai/hentikan pekerjaan pada Izin Kerja ini dan kembalikan ke kondisi aman di lapangan',
  pemilik: 'Saya konfirmasi bahwa pekerjaan telah selesai/ditangguhkan dan worksite dikembalikan ke posisi aman',
  pemberi: 'Saya telah memastikan pekerjaan ini dapat dilakukan dengan aman',
};

const CSE_STATEMENTS = {
  pemohon: 'Saya telah menyelesaikan pekerjaan. Lokasi kerja telah dibersihkan dari peralatan yang digunakan termasuk barang sisa pekerjaan.',
  pemilik: 'Saya telah melihat lokasi kerja, memastikan bahwa lokasi kerja telah bersih dan mesin/peralatan telah siap untuk digunakan kembali.',
  pemberi: 'Saya telah memastikan bahwa pekerjaan telah selesai dan kondisi area dan mesin/peralatan sudah dalam keadaan aman dan siap untuk digunakan kembali',
};

const ELP_STATEMENTS = {
  pemohon: 'Dengan ini menyatakan bahwa pekerjaan yang dirinci untuk izin kerja ini telah selesai atau dihentikan dan setiap orang telah ditarik kembali',
  pemilik: 'Saya telah memastikan bahwa lokasi kerja telah bersih dan peralatan dapat digunakan kembali',
  pemberi: 'Saya telah memastikan bahwa area dan peralatan sudah dalam keadaan aman',
};

const EWP_STATEMENTS = {
  pemohon: 'Saya menyatakan pekerjaan penggalian telah selesai dan area kerja telah dibersihkan',
  pemilik: 'Saya telah melakukan pemeriksaan terhadap lokasi ini dan memastikan area kerja telah bersih dan aman',
  pemberi: 'Saya telah memastikan pekerjaan ini dapat dilakukan dengan aman',
};

const LWP_STATEMENTS = {
  pemohon: 'Pekerjaan pengangkatan telah selesai dan area kerja dalam kondisi aman',
  pemilik: 'Saya telah memastikan area kerja aman dan peralatan siap digunakan kembali',
  pemberi: 'Saya telah memastikan bahwa area dan peralatan sudah dalam keadaan aman',
};

const RWP_STATEMENTS = {
  pemohon: 'Saya telah menyelesaikan pekerjaan. Lokasi kerja telah dibersihkan dari peralatan yang digunakan dalam pekerjaan.',
  pemilik: 'Saya telah melihat lokasi kerja, melakukan pengecekan terhadap area kerja dan memastikan bahwa lokasi kerja telah bersih',
  pemberi: 'Saya telah memastikan bahwa pekerjaan telah selesai dan kondisi area dan mesin/peralatan sudah dalam keadaan aman',
};

const WHP_STATEMENTS = {
  pemohon: 'Saya telah menyelesaikan pekerjaan. Lokasi kerja telah dibersihkan dari peralatan yang digunakan termasuk barang barang sisa yang dihasilkan dalam pekerjaan.',
  pemilik: 'Saya telah melihat lokasi kerja, melakukan pengecekan terhadap area kerja dan memastikan bahwa lokasi kerja telah bersih',
  pemberi: 'Saya telah memastikan bahwa pekerjaan telah selesai dan kondisi area dan mesin/peralatan sudah dalam keadaan aman',
};

const STATEMENTS: Record<PermitJenis, typeof GWP_STATEMENTS> = {
  gwp: GWP_STATEMENTS, hwp: HWP_STATEMENTS, cse: CSE_STATEMENTS, elp: ELP_STATEMENTS,
  ewp: EWP_STATEMENTS, lwp: LWP_STATEMENTS, rwp: RWP_STATEMENTS, whp: WHP_STATEMENTS,
};

const COMPLETION_TITLES: Record<PermitJenis, string> = {
  gwp: 'Pengesahan Setelah Selesai Bekerja',
  hwp: 'Pekerjaan Selesai',
  cse: 'Bagian Penyelesaian Izin',
  elp: 'Selesai Izin Kerja',
  ewp: 'Izin dan Penggalian Selesai',
  lwp: 'Penyelesaian Pekerjaan/Penutupan Izin Kerja',
  rwp: 'Penyelesaian Permit',
  whp: 'Penyelesaian Kerja',
};

export default function PermitCompletionForm({ jenis, userRole, completionData, onChange, onSubmit, isPending, onSubmitRole }: PermitCompletionFormProps) {
  const u = (k: string, v: unknown) => onChange({ ...completionData, [k]: v });
  const stmt = STATEMENTS[jenis];
  const title = COMPLETION_TITLES[jenis];
  const roleCompletion = (completionData.role_completion as Record<string, boolean>) || {};

  const isUserDone = !!roleCompletion.user;
  const isSupervisorDone = !!roleCompletion.supervisor;
  const isAdminDone = !!roleCompletion.admin;

  const renderUserSection = () => (
    <div className={`rounded-xl border-2 p-4 space-y-3 ${isUserDone ? 'border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-900/10' : 'border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-900/10'}`}>
      <div className="flex items-center justify-between">
        <h4 className="font-bold text-xs sm:text-sm text-gray-800 dark:text-white uppercase tracking-wide">A. Pemohon Izin (User)</h4>
        {isUserDone ? (
          <span className="text-[10px] font-semibold text-green-600 bg-green-100 px-2 py-0.5 rounded-full">Selesai</span>
        ) : userRole === 'user' ? (
          <span className="text-[10px] font-semibold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">Diisi Oleh Anda</span>
        ) : null}
      </div>
      <p className="text-[11px] text-gray-600 dark:text-gray-400 italic">&quot;{stmt.pemohon}&quot;</p>
      {(!isUserDone || userRole === 'user') ? (
        <>
          {(jenis === 'hwp' || jenis === 'ewp') && (
            <RadioGroup
              name="status_pekerjaan_selesai"
              options={[
                { value: 'selesai', label: 'Pekerjaan Selesai' },
                { value: 'belum_selesai', label: 'Pekerjaan Belum Selesai' },
                { value: 'dihentikan', label: 'Pekerjaan Dihentikan' },
              ]}
              value={(completionData.status_pekerjaan_selesai as string) || 'selesai'}
              onChange={(v) => u('status_pekerjaan_selesai', v)}
            />
          )}
          {jenis === 'hwp' && (completionData.status_pekerjaan_selesai as string) === 'dihentikan' && (
            <Input label="Alasan Keselamatan" name="alasan_dihentikan" value={(completionData.alasan_dihentikan as string) || ''} onChange={(e) => u('alasan_dihentikan', e.target.value)} register={() => ({})} placeholder="Sebutkan alasan" />
          )}
          {jenis === 'hwp' && (completionData.status_pekerjaan_selesai as string) === 'dilanjutkan' && (
            <Input label="Nomor Permit Lanjutan" name="nomor_permit_lanjutan" value={(completionData.nomor_permit_lanjutan as string) || ''} onChange={(e) => u('nomor_permit_lanjutan', e.target.value)} register={() => ({})} placeholder="Nomor permit" />
          )}
          {jenis === 'cse' && (
            <Input label="Tanggal Izin Tidak Lagi Diperlukan" name="tanggal_tidak_diperlukan" type="date" value={(completionData.tanggal_tidak_diperlukan as string) || ''} onChange={(e) => u('tanggal_tidak_diperlukan', e.target.value)} register={() => ({})} />
          )}
          <Input label="Tanggal" name="user_tanggal" type="date" value={(completionData.user_tanggal as string) || new Date().toISOString().split('T')[0]} onChange={(e) => u('user_tanggal', e.target.value)} register={() => ({})} />
          <Input label="Nama Pemohon" name="user_nama" value={(completionData.user_nama as string) || ''} onChange={(e) => u('user_nama', e.target.value)} register={() => ({})} placeholder="Nama lengkap" />
          <Input label="Paraf/Tanda Tangan" name="user_paraf" disabled value={(completionData.user_paraf as string) || ''} onChange={()=>{}} register={() => ({})} placeholder="Paraf" className="opacity-60" />
        </>
      ) : (
        <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1 pt-1">
          <p>Tanggal: {completionData.user_tanggal as string || '-'}</p>
          <p>Nama: {completionData.user_nama as string || '-'}</p>
          <p>Paraf: {completionData.user_paraf as string || '-'}</p>
        </div>
      )}
    </div>
  );

  const renderSupervisorSection = () => (
    <div className={`rounded-xl border-2 p-4 space-y-3 ${isSupervisorDone ? 'border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-900/10' : userRole === 'supervisor' ? 'border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-900/10' : 'border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50'}`}>
      <div className="flex items-center justify-between">
        <h4 className="font-bold text-xs sm:text-sm text-gray-800 dark:text-white uppercase tracking-wide">B. Pemilik Lokasi (Supervisor)</h4>
        {isSupervisorDone ? (
          <span className="text-[10px] font-semibold text-green-600 bg-green-100 px-2 py-0.5 rounded-full">Selesai</span>
        ) : userRole === 'supervisor' ? (
          <span className="text-[10px] font-semibold text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full">Diisi Oleh Anda</span>
        ) : !isUserDone ? (
          <span className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full flex items-center gap-1"><Lock size={10}/> Menunggu User</span>
        ) : null}
      </div>
      <p className="text-[11px] text-gray-600 dark:text-gray-400 italic">&quot;{stmt.pemilik}&quot;</p>
      {(userRole === 'supervisor' || (isUserDone && !isSupervisorDone && userRole === 'admin')) ? (
        <>
          <Input label="Tanggal" name="supervisor_tanggal" type="date" value={(completionData.supervisor_tanggal as string) || new Date().toISOString().split('T')[0]} onChange={(e) => u('supervisor_tanggal', e.target.value)} register={() => ({})} />
          <Input label="Nama Supervisor/Pemilik Lokasi" name="supervisor_nama" value={(completionData.supervisor_nama as string) || ''} onChange={(e) => u('supervisor_nama', e.target.value)} register={() => ({})} placeholder="Nama lengkap" />
          <Input label="Paraf/Tanda Tangan" name="supervisor_paraf" disabled value={(completionData.supervisor_paraf as string) || ''} onChange={()=>{}} register={() => ({})} placeholder="Paraf" className="opacity-60" />
        </>
      ) : isSupervisorDone ? (
        <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1 pt-1">
          <p>Tanggal: {completionData.supervisor_tanggal as string || '-'}</p>
          <p>Nama: {completionData.supervisor_nama as string || '-'}</p>
          <p>Paraf: {completionData.supervisor_paraf as string || '-'}</p>
        </div>
      ) : null}
    </div>
  );

  const renderAdminSection = () => (
    <div className={`rounded-xl border-2 p-4 space-y-3 ${isAdminDone ? 'border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-900/10' : userRole === 'admin' ? 'border-purple-200 dark:border-purple-800 bg-purple-50/50 dark:bg-purple-900/10' : 'border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50'}`}>
      <div className="flex items-center justify-between">
        <h4 className="font-bold text-xs sm:text-sm text-gray-800 dark:text-white uppercase tracking-wide">C. Pemberi Izin & D. Mengetahui (Admin HSSE)</h4>
        {isAdminDone ? (
          <span className="text-[10px] font-semibold text-green-600 bg-green-100 px-2 py-0.5 rounded-full">Selesai</span>
        ) : userRole === 'admin' ? (
          <span className="text-[10px] font-semibold text-purple-600 bg-purple-100 px-2 py-0.5 rounded-full">Diisi Oleh Anda</span>
        ) : !isSupervisorDone ? (
          <span className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full flex items-center gap-1"><Lock size={10}/> Menunggu Supervisor</span>
        ) : null}
      </div>
      <p className="text-[11px] text-gray-600 dark:text-gray-400 italic">&quot;{stmt.pemberi}&quot;</p>
      {(userRole === 'admin') ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input label="Tanggal" name="admin_tanggal" type="date" value={(completionData.admin_tanggal as string) || new Date().toISOString().split('T')[0]} onChange={(e) => u('admin_tanggal', e.target.value)} register={() => ({})} />
            <Input label="HSSE Admin/Inspektor" name="admin_hse_nama" value={(completionData.admin_hse_nama as string) || ''} onChange={(e) => u('admin_hse_nama', e.target.value)} register={() => ({})} placeholder="Nama" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input label="Asisten HSSE" name="admin_asisten_nama" value={(completionData.admin_asisten_nama as string) || ''} onChange={(e) => u('admin_asisten_nama', e.target.value)} register={() => ({})} placeholder="Nama" />
            <Input label="Kasubag Sistem & IT" name="admin_kasubag_nama" value={(completionData.admin_kasubag_nama as string) || ''} onChange={(e) => u('admin_kasubag_nama', e.target.value)} register={() => ({})} placeholder="Nama" />
          </div>
          {jenis === 'whp' && (
            <Input label="Manager" name="admin_manager_nama" value={(completionData.admin_manager_nama as string) || ''} onChange={(e) => u('admin_manager_nama', e.target.value)} register={() => ({})} placeholder="Nama Manager" />
          )}
          {jenis === 'hwp' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input label="HSSE Foreman/Spv" name="admin_hse_foreman" value={(completionData.admin_hse_foreman as string) || ''} onChange={(e) => u('admin_hse_foreman', e.target.value)} register={() => ({})} placeholder="Nama" />
              <Input label="Manager" name="admin_manager_nama" value={(completionData.admin_manager_nama as string) || ''} onChange={(e) => u('admin_manager_nama', e.target.value)} register={() => ({})} placeholder="Nama" />
            </div>
          )}
        </>
      ) : isAdminDone ? (
        <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1 pt-1">
          <p>Tanggal: {completionData.admin_tanggal as string || '-'}</p>
          <p>HSSE Admin: {completionData.admin_hse_nama as string || '-'}</p>
          <p>Asisten HSSE: {completionData.admin_asisten_nama as string || '-'}</p>
          <p>Kasubag Sistem & IT: {completionData.admin_kasubag_nama as string || '-'}</p>
        </div>
      ) : null}
    </div>
  );

  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-4 sm:p-6 border-2 border-green-200 dark:border-green-800 space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-green-500 text-white flex items-center justify-center shadow-lg shadow-green-500/30">
          <CircleCheck size={20} />
        </div>
        <div>
          <h3 className="font-bold text-gray-800 dark:text-white text-sm sm:text-base">{title}</h3>
          <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Diisi oleh masing-masing role sesuai urutan</p>
        </div>
      </div>

      {/* Status Summary */}
      <div className="flex items-center gap-2 flex-wrap">
        <StatusDot label="User" done={isUserDone} />
        <div className="w-6 h-px bg-gray-300 dark:bg-gray-600" />
        <StatusDot label="Supervisor" done={isSupervisorDone} />
        <div className="w-6 h-px bg-gray-300 dark:bg-gray-600" />
        <StatusDot label="Admin" done={isAdminDone} />
      </div>

      {/* Role Sections */}
      <div className="space-y-3">
        {renderUserSection()}
        {renderSupervisorSection()}
        {renderAdminSection()}
      </div>

      {/* Special sections per permit type */}
      {jenis === 'elp' && (
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 space-y-3 border border-gray-200 dark:border-gray-700">
          <h4 className="font-bold text-xs text-gray-800 dark:text-white uppercase tracking-wide">De-Isolation (Jika Diperlukan)</h4>
          <Checkbox checked={!!completionData.deisolasi_diperlukan} onChange={(c) => u('deisolasi_diperlukan', c)} label="Diperlukan De-Isolation" size="md" />
          {!!completionData.deisolasi_diperlukan && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input label="Penanggung Jawab Elektrik" name="deisolasi_pj_nama" value={(completionData.deisolasi_pj_nama as string) || ''} onChange={(e) => u('deisolasi_pj_nama', e.target.value)} register={() => ({})} placeholder="Nama" />
              <Input label="Tanggal & Waktu" name="deisolasi_tanggal" type="datetime-local" value={(completionData.deisolasi_tanggal as string) || ''} onChange={(e) => u('deisolasi_tanggal', e.target.value)} register={() => ({})} />
            </div>
          )}
        </div>
      )}

      {jenis === 'lwp' && (
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 space-y-3 border border-gray-200 dark:border-gray-700">
          <h4 className="font-bold text-xs text-gray-800 dark:text-white uppercase tracking-wide">Informasi Tambahan LWP</h4>
          <Checkbox checked={!!completionData.diberhentikan_keselamatan} onChange={(c) => u('diberhentikan_keselamatan', c)} label="Diberhentikan Karena Alasan Keselamatan?" size="md" />
          <Checkbox checked={!!completionData.lampirkan_lifting_plan} onChange={(c) => u('lampirkan_lifting_plan', c)} label="Lampirkan Lifting Plan" size="md" />
        </div>
      )}

      {/* Submit Button */}
      <div className="flex items-center gap-2 pt-2 border-t border-green-200 dark:border-green-800">
        <Button size="sm" onClick={() => {
          const prevRoleCompletion = (completionData.role_completion as Record<string, boolean>) || {};
          const roleCompletion = { ...prevRoleCompletion, [userRole]: true };
          const mergedData = { ...completionData, role_completion: roleCompletion };
          onChange(mergedData);
          if (onSubmitRole) onSubmitRole(userRole);
          onSubmit(mergedData);
        }} isLoading={isPending}>
          <CircleCheck size={14} /> Kirim & Tandai Selesai
        </Button>
      </div>
    </div>
  );
}

function StatusDot({ label, done }: { label: string; done: boolean }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className={`w-2.5 h-2.5 rounded-full ${done ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`} />
      <span className={`text-[10px] font-semibold ${done ? 'text-green-600' : 'text-gray-400 dark:text-gray-500'}`}>{label}</span>
    </div>
  );
}
