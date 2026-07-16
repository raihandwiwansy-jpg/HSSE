'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { X, ChevronRight, ChevronLeft, BookOpen, AlertCircle, ShieldCheck, Info, CheckSquare, Eye } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import Portal from '@/components/ui/Portal';

interface GuideBookProps {
  isOpen: boolean;
  onClose: () => void;
}

// Helper for generic default pages
const defaultPages = [
  <div key="1" className="space-y-4">
    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
      Gunakan sistem ini sesuai dengan panduan dan SOP K3 Perusahaan yang berlaku. Jika Anda memerlukan panduan spesifik, silakan buka menu terkait.
    </p>
  </div>
];

// Helper to define role-based content
type RoleContent = { title: string; pages: React.ReactNode[] };
type PageContent = Record<string, RoleContent>; // key is role (admin, supervisor, user, audit)

const guideContents: Record<string, PageContent> = {
  '/dashboard': {
    user: {
      title: 'Panduan Dashboard - Karyawan',
      pages: [
        <div key="1" className="space-y-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Info className="text-blue-600" /> Ringkasan Keselamatan Kerja
          </h3>
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            Selamat datang di <b>Dashboard HSSE PT. INL</b>. Halaman ini adalah pusat informasi real-time keselamatan kerja di seluruh area pabrik kita.
          </p>
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800">
            <h4 className="font-semibold text-blue-900 dark:text-indigo-300 text-sm mb-1.5">Metrik Utama yang Dapat Anda Pantau:</h4>
            <ul className="list-disc pl-4 space-y-1 text-xs text-blue-800 dark:text-blue-400">
              <li><b>Hari Kerja Selamat:</b> Jumlah hari berurutan tanpa adanya kecelakaan kerja fatal.</li>
              <li><b>Jam Kerja Selamat:</b> Akumulasi jam kerja produktif yang aman dari seluruh tim.</li>
              <li><b>Tanggal Kecelakaan Terakhir:</b> Pengingat penting untuk selalu waspada di lapangan.</li>
            </ul>
          </div>
        </div>,
        <div key="2" className="space-y-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Eye className="text-emerald-600" /> Visualisasi Grafik & Tren
          </h3>
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            Di bagian bawah dashboard, Anda dapat melihat statistik insiden bulanan dan grafik partisipasi program keselamatan. Mari kita jaga grafik kecelakaan tetap di angka nol dengan mematuhi SOP!
          </p>
        </div>
      ]
    },
    supervisor: {
      title: 'Panduan Dashboard - Supervisor',
      pages: [
        <div key="1" className="space-y-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Info className="text-blue-600" /> Pemantauan Area Kerja Anda
          </h3>
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            Sebagai <b>Supervisor</b>, dashboard ini membantu Anda memantau kinerja keselamatan departemen Anda secara cepat.
          </p>
          <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-xl border border-amber-100 dark:border-amber-800">
            <h4 className="font-semibold text-amber-900 dark:text-amber-300 text-sm mb-1.5">Tugas Pengawasan Anda:</h4>
            <ul className="list-disc pl-4 space-y-1 text-xs text-amber-800 dark:text-amber-400">
              <li>Perhatikan jumlah izin kerja (permit) aktif di area Anda agar tidak terjadi tumpang tindih pekerjaan berisiko.</li>
              <li>Pantau tindak lanjut temuan kondisi tidak aman (Unsafe Condition) agar diselesaikan tepat waktu.</li>
            </ul>
          </div>
        </div>
      ]
    },
    admin: {
      title: 'Panduan Dashboard - Admin HSE',
      pages: [
        <div key="1" className="space-y-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Info className="text-blue-600" /> Panel Kendali HSSE Korporat
          </h3>
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            Sebagai <b>Admin HSE</b>, gunakan dashboard untuk menganalisis data keselamatan kerja perusahaan secara menyeluruh guna menyusun laporan K3 bulanan ke manajemen.
          </p>
          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-xl border border-red-100 dark:border-red-800">
            <h4 className="font-semibold text-red-900 dark:text-red-300 text-sm mb-1.5">Fokus Utama:</h4>
            <ul className="list-disc pl-4 space-y-1 text-xs text-red-800 dark:text-red-400">
              <li>Pastikan data insiden baru segera ditindaklanjuti.</li>
              <li>Evaluasi rasio penyelesaian patrol (Close-Out Rate) agar selalu di atas 95%.</li>
              <li>Gunakan tombol jalan pintas di sidebar untuk mengakses kelola master data keselamatan.</li>
            </ul>
          </div>
        </div>
      ]
    },
    kasubag: {
      title: 'Panduan Dashboard - Kasubag',
      pages: [
        <div key="1" className="space-y-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Info className="text-blue-600" /> Sinkronisasi & Otorisasi Sistem
          </h3>
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            Sebagai <b>Kasubag Sistem & IT</b>, dashboard menyajikan rangkuman performa operasional sistem perizinan dan K3 berbasis data digital.
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            Pastikan alur tanda tangan elektronik, penulisan log audit, dan integrasi statistik jam kerja selamat berjalan secara lancar tanpa hambatan teknis.
          </p>
        </div>
      ]
    },
    audit: {
      title: 'Panduan Dashboard - Auditor',
      pages: [
        <div key="1" className="space-y-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Info className="text-blue-600" /> Analisis Kepatuhan & Transparansi
          </h3>
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            Sebagai <b>Auditor</b>, Anda dapat mengamati tren kepatuhan keselamatan kerja secara transparan melalui grafik interaktif di dashboard.
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            Bandingkan rasio kecelakaan dengan total jam kerja selamat terkumpul untuk mengevaluasi efektivitas penerapan sistem manajemen K3 di PT. INL.
          </p>
        </div>
      ]
    }
  },
  '/permit': {
    user: {
      title: 'Buku Panduan Izin Kerja - Pemohon (User)',
      pages: [
        <div key="1" className="space-y-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <ShieldCheck className="text-indigo-600" /> HAL 1: Pengajuan Izin Baru
          </h3>
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            Sebelum memulai pekerjaan berisiko tinggi (panas, galian, ruang terbatas, listrik, dll), Anda wajib mengajukan permit baru.
          </p>
          <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-xl border border-indigo-100 dark:border-indigo-800">
            <h4 className="font-semibold text-indigo-900 dark:text-indigo-300 text-sm mb-2">Langkah Mengajukan:</h4>
            <ol className="list-decimal pl-4 space-y-1.5 text-xs text-indigo-800 dark:text-indigo-400">
              <li>Klik tombol <b>+ Buat Izin Baru</b> di pojok kanan atas.</li>
              <li>Pilih jenis permit yang sesuai dengan aktivitas Anda.</li>
              <li>Isi formulir dengan detail: deskripsi pekerjaan, area, durasi, dan daftar pekerja.</li>
              <li>Unggah berkas <b>JSA (Job Safety Analysis)</b> yang telah disetujui.</li>
              <li>Klik <b>Submit</b>. Status permit berubah menjadi <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-400">Menunggu Review</span>.</li>
            </ol>
          </div>
        </div>,
        <div key="2" className="space-y-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Info className="text-blue-600" /> HAL 2: Menunggu Review & Approval
          </h3>
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            Setelah permit dikirim, alur verifikasi berjalan sebagai berikut:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-xs text-gray-700 dark:text-gray-300">
            <li><b>Review Supervisor (Pemilik Lokasi):</b> Supervisor Anda akan memeriksa kesiapan aspek keselamatan di lapangan secara nyata, lalu memberikan review digital (Status menjadi <span className="px-1.5 py-0.5 rounded text-[10px] bg-blue-100 dark:bg-blue-900/40 text-blue-800">Menunggu Approval</span>).</li>
            <li><b>Approval HSE (Pemberi Izin):</b> Tim HSE akan memeriksa kelengkapan akhir dokumen dan menyetujui permit (Status menjadi <span className="px-1.5 py-0.5 rounded text-[10px] bg-green-100 dark:bg-green-900/40 text-green-800">Aktif / Siap Dikerjakan</span>).</li>
            <li><b>Cetak Dokumen Fisik:</b> Setelah aktif, buka detail permit Anda, klik tombol <b>Cetak (Print)</b>, lalu pasang permit fisik di lokasi kerja.</li>
          </ul>
        </div>,
        <div key="3" className="space-y-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <CheckSquare className="text-emerald-600" /> HAL 3: Penutupan Permit (Closing)
          </h3>
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            Permit yang sudah selesai dikerjakan <b>wajib ditutup secara resmi</b> di dalam sistem. Jangan membiarkan permit menggantung tanpa kejelasan penyelesaian!
          </p>
          <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-xl border border-emerald-100 dark:border-emerald-800">
            <h4 className="font-semibold text-emerald-900 dark:text-emerald-300 text-sm mb-2">Langkah Menutup Permit:</h4>
            <ol className="list-decimal pl-4 space-y-1.5 text-xs text-emerald-800 dark:text-emerald-400">
              <li>Pastikan area kerja sudah bersih, rapi, dan aman (Housekeeping tuntas).</li>
              <li>Buka detail permit terkait di aplikasi.</li>
              <li>Scroll ke paling bawah ke bagian <b>Pengesahan Selesai Pekerjaan</b>.</li>
              <li>Masukkan tanggal penutupan, nama Anda, dan bubuhkan tanda tangan/paraf digital Anda di bagian <b>A. Pemohon Izin</b>.</li>
              <li>Klik <b>Submit Penutupan</b> agar Supervisor dan Admin HSE dapat memverifikasi serta mengubah status menjadi <span className="px-1.5 py-0.5 rounded text-[10px] bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300">Selesai (Closed)</span>.</li>
            </ol>
          </div>
        </div>
      ]
    },
    supervisor: {
      title: 'Buku Panduan Izin Kerja - Supervisor',
      pages: [
        <div key="1" className="space-y-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <ShieldCheck className="text-indigo-600" /> HAL 1: Review Lapangan
          </h3>
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            Sebagai Supervisor (Pemilik Lokasi), Anda memikul tanggung jawab atas keamanan area sebelum izin kerja resmi diaktifkan.
          </p>
          <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-xl border border-amber-100 dark:border-amber-800">
            <h4 className="font-semibold text-amber-900 dark:text-amber-300 text-sm mb-2">Langkah Verifikasi Awal:</h4>
            <ol className="list-decimal pl-4 space-y-1.5 text-xs text-amber-800 dark:text-amber-400">
              <li>Buka permit berstatus <b>Menunggu Review</b>.</li>
              <li>Lakukan pemeriksaan visual ke lokasi. Pastikan rambu K3, APD, pemadam api (APAR), dan sarana mitigasi lainnya terpasang nyata.</li>
              <li>Jika semua aman, isi paraf digital Anda di baris <b>B. Pemilik Lokasi</b> dan klik tombol <b>Review</b>.</li>
            </ol>
          </div>
        </div>,
        <div key="2" className="space-y-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <CheckSquare className="text-emerald-600" /> HAL 2: Pengesahan Penutupan Area
          </h3>
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            Setelah pekerjaan dinyatakan selesai oleh pelaksana (User), Anda wajib mengesahkan penutupan area tersebut.
          </p>
          <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-xl border border-emerald-100 dark:border-emerald-800">
            <h4 className="font-semibold text-emerald-900 dark:text-emerald-300 text-sm mb-2">Langkah Penutupan:</h4>
            <ol className="list-decimal pl-4 space-y-1.5 text-xs text-emerald-800 dark:text-emerald-400">
              <li>Inspeksi kembali lokasi kerja. Pastikan tidak ada sampah proyek, sisa material, atau alat kerja yang tertinggal.</li>
              <li>Buka detail permit yang bersangkutan, bubuhkan tanda tangan di bagian <b>B. Pemilik Lokasi</b> di form completion, lalu tekan tombol kirim untuk diteruskan ke Admin HSE.</li>
            </ol>
          </div>
        </div>
      ]
    },
    admin: {
      title: 'Buku Panduan Izin Kerja - Admin HSE',
      pages: [
        <div key="1" className="space-y-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <ShieldCheck className="text-indigo-600" /> HAL 1: Otoritas Approval Akhir
          </h3>
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            Admin HSE memegang kewenangan mutlak untuk menyetujui atau menolak permit kerja berisiko tinggi demi melindungi jiwa pekerja.
          </p>
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl border border-green-100 dark:border-green-800">
            <h4 className="font-semibold text-green-900 dark:text-green-300 text-sm mb-2">Langkah Approval:</h4>
            <ol className="list-decimal pl-4 space-y-1.5 text-xs text-green-800 dark:text-green-400">
              <li>Buka permit berstatus <b>Menunggu Approval</b>.</li>
              <li>Periksa kesesuaian dokumen JSA dan verifikasi apakah Supervisor sudah memberikan tanda tangan review.</li>
              <li>Jika layak, bubuhkan tanda tangan K3 Anda, isi catatan K3 jika diperlukan, lalu klik <b>Approve</b>. Nomor permit resmi akan diterbitkan.</li>
              <li>Jika tidak layak, klik <b>Reject</b> dengan memberi catatan alasan penolakan yang detail.</li>
            </ol>
          </div>
        </div>,
        <div key="2" className="space-y-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <CheckSquare className="text-emerald-600" /> HAL 2: Closing Permit Permanen
          </h3>
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            Permit yang telah selesai dikerjakan dan ditandatangani oleh Pemohon & Supervisor wajib ditutup secara permanen oleh Admin HSE.
          </p>
          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-xl border border-red-100 dark:border-red-800">
            <h4 className="font-semibold text-red-900 dark:text-red-300 text-sm mb-2">Langkah Closing:</h4>
            <ol className="list-decimal pl-4 space-y-1.5 text-xs text-red-800 dark:text-red-400">
              <li>Tinjau kelengkapan berkas penyelesaian kerja.</li>
              <li>Bubuhkan tanda tangan Anda pada baris <b>C. Pemberi Izin</b> pada modul completion.</li>
              <li>Klik tombol <b>Close Permit</b>. Permit akan diarsipkan dengan status <b>Selesai (Closed)</b> di database dan lembar laporan Excel dapat diunduh.</li>
            </ol>
          </div>
        </div>
      ]
    },
    kasubag: {
      title: 'Buku Panduan Izin Kerja - Kasubag',
      pages: [
        <div key="1" className="space-y-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <ShieldCheck className="text-indigo-600" /> HAL 1: Pengesahan Mengetahui
          </h3>
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            Sebagai Kasubag Sistem & IT, Anda memvalidasi bahwa permit tertentu telah diverifikasi secara administratif dan tercatat di log server.
          </p>
          <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-xl border border-indigo-100 dark:border-indigo-800">
            <h4 className="font-semibold text-indigo-900 dark:text-indigo-300 text-sm mb-2">Langkah Validasi Mengetahui:</h4>
            <ol className="list-decimal pl-4 space-y-1.5 text-xs text-indigo-800 dark:text-indigo-400">
              <li>Periksa pemberitahuan permit masuk yang membutuhkan pengesahan "D. Mengetahui".</li>
              <li>Buka halaman detail permit tersebut.</li>
              <li>Bubuhkan paraf digital Anda pada bagian yang tersedia untuk menyelesaikan alur otorisasi formal.</li>
            </ol>
          </div>
        </div>
      ]
    },
    audit: {
      title: 'Buku Panduan Izin Kerja - Auditor',
      pages: [
        <div key="1" className="space-y-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Eye className="text-blue-600" /> HAL 1: Pengawasan Kepatuhan SOP
          </h3>
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            Gunakan hak akses Read-Only Anda untuk melacak validitas setiap dokumen permit kerja di perusahaan.
          </p>
          <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-800">
            <h4 className="font-semibold text-gray-900 dark:text-gray-300 text-sm mb-2">Poin Audit Utama:</h4>
            <ul className="list-disc pl-4 space-y-1 text-xs text-gray-700 dark:text-gray-400">
              <li>Apakah ada permit berstatus Aktif tanpa tanda tangan Supervisor?</li>
              <li>Apakah dokumen JSA terlampir secara lengkap dan logis?</li>
              <li>Periksa *timestamp* pembuatan dan persetujuan untuk menghindari manipulasi data pasca-kejadian.</li>
            </ul>
          </div>
        </div>,
        <div key="2" className="space-y-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <CheckSquare className="text-emerald-600" /> HAL 2: Audit Penutupan Kerja
          </h3>
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            Periksa seluruh berkas permit yang statusnya telah diubah menjadi <b>Selesai (Closed)</b>.
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            Pastikan penutupan lembar kerja (completion data) ditandatangani lengkap oleh ketiga pihak (Pemohon, Pemilik Lokasi, dan Pemberi Izin) sebagai dokumen pertanggungjawaban hukum K3.
          </p>
        </div>
      ]
    }
  },
  '/insiden': {
    admin: {
      title: 'Buku Panduan Insiden - Admin HSE',
      pages: [
        <div key="1" className="space-y-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <AlertCircle className="text-red-600" /> HAL 1: Pelaporan Cepat 1x24 Jam
          </h3>
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            Bila melihat atau menerima laporan kecelakaan kerja, near miss (hampir celaka), kerusakan alat, atau tumpahan bahan kimia, segera laporkan di menu ini!
          </p>
          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-xl border border-red-100 dark:border-red-800">
            <h4 className="font-semibold text-red-900 dark:text-red-300 text-sm mb-2">Langkah Membuat Laporan:</h4>
            <ol className="list-decimal pl-4 space-y-1.5 text-xs text-red-800 dark:text-red-400">
              <li>Klik tombol <b>Buat Laporan Baru</b>.</li>
              <li>Pilih jenis insiden (Kecelakaan, Near Miss, dll).</li>
              <li>Tulis kronologi kejadian secara jujur, objektif, dan jelas.</li>
              <li>Tentukan tanggal, waktu, dan lokasi spesifik.</li>
              <li>Wajib unggah foto kondisi di lokasi sebagai bukti awal penyelidikan.</li>
              <li>Klik <b>Submit</b>. Laporan akan disimpan dan siap diinvestigasi.</li>
            </ol>
          </div>
        </div>,
        <div key="2" className="space-y-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <AlertCircle className="text-red-600" /> HAL 2: Investigasi & Root Cause Analysis
          </h3>
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            Admin HSE bertanggung jawab penuh untuk mengusut tuntas setiap kecelakaan kerja menggunakan metode ilmiah.
          </p>
          <div className="bg-red-55 dark:bg-red-900/20 p-4 rounded-xl border border-red-100 dark:border-red-800">
            <h4 className="font-semibold text-red-900 dark:text-red-300 text-sm mb-2">Prosedur Investigasi:</h4>
            <ol className="list-decimal pl-4 space-y-1.5 text-xs text-red-800 dark:text-red-400">
              <li>Ubah status laporan menjadi <b>Dalam Investigasi</b>.</li>
              <li>Tentukan tingkat keparahan insiden secara akurat (LTI, First Aid, Damage, dll).</li>
              <li>Lakukan wawancara saksi dan rekonstruksi di lokasi kejadian.</li>
              <li>Analisis akar masalah menggunakan metode <b>Root Cause Analysis (RCA)</b> seperti Fishbone Diagram atau 5-Whys.</li>
            </ol>
          </div>
        </div>,
        <div key="3" className="space-y-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <CheckSquare className="text-emerald-600" /> HAL 3: Tindakan Perbaikan & Closing Kasus
          </h3>
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            Penyelidikan tidak ada gunanya tanpa adanya langkah pencegahan konkret (Action Plan).
          </p>
          <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-xl border border-emerald-100 dark:border-emerald-800">
            <h4 className="font-semibold text-emerald-900 dark:text-emerald-300 text-sm mb-2">Langkah Penyelesaian:</h4>
            <ul className="list-disc pl-4 space-y-1.5 text-xs text-emerald-800 dark:text-emerald-400">
              <li>Tentukan rekomendasi perbaikan, PIC pelaksana, dan tenggat waktu penyelesaiannya.</li>
              <li>Pantau eksekusi perbaikan secara berkala.</li>
              <li>Bila perbaikan fisik sudah selesai dibuktikan di lapangan, ubah status insiden menjadi <b>Selesai (Closed)</b>.</li>
            </ul>
          </div>
        </div>
      ]
    },
    kasubag: {
      title: 'Buku Panduan Insiden - Kasubag',
      pages: [
        <div key="1" className="space-y-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <AlertCircle className="text-red-600" /> HAL 1: Input Laporan Insiden Baru
          </h3>
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            Kasubag memiliki wewenang untuk melaporkan kejadian insiden di lapangan secara langsung.
          </p>
          <div className="bg-red-55 dark:bg-red-900/20 p-4 rounded-xl border border-red-100 dark:border-red-800">
            <h4 className="font-semibold text-red-900 dark:text-red-300 text-sm mb-2">Langkah Membuat Laporan:</h4>
            <ol className="list-decimal pl-4 space-y-1.5 text-xs text-red-800 dark:text-red-400">
              <li>Klik tombol <b>Buat Laporan Baru</b>.</li>
              <li>Pilih jenis insiden, isi kronologi secara jujur, objektif, dan jelas.</li>
              <li>Tentukan tanggal, waktu, lokasi spesifik, dan unggah bukti foto lapangan.</li>
              <li>Klik <b>Submit</b>. Laporan akan tersimpan dan siap diinvestigasi.</li>
            </ol>
          </div>
        </div>,
        <div key="2" className="space-y-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Info className="text-blue-600" /> HAL 2: Sinkronisasi Statistik LTI
          </h3>
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            Sebagai Kasubag Sistem & IT, Anda memonitor sinkronisasi database insiden dengan visualisasi dashboard utama keselamatan pabrik.
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            Pastikan penambahan rekor kecelakaan baru secara otomatis memicu pengurangan akumulasi Hari Kerja Selamat dan Jam Kerja Selamat pada papan informasi depan pabrik agar info yang disajikan selalu valid.
          </p>
        </div>
      ]
    },
    supervisor: {
      title: 'Buku Panduan Insiden - Supervisor',
      pages: [
        <div key="1" className="space-y-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <AlertCircle className="text-red-600" /> HAL 1: Tindakan Awal Pengamanan
          </h3>
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            Jika terjadi insiden di area kerja wewenang Anda, lakukan langkah-langkah darurat berikut:
          </p>
          <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-xl border border-amber-100 dark:border-amber-800">
            <h4 className="font-semibold text-amber-900 dark:text-amber-300 text-sm mb-2">Protokol Penanganan:</h4>
            <ul className="list-disc pl-4 space-y-1.5 text-xs text-amber-800 dark:text-amber-400">
              <li>Hentikan seluruh aktivitas kerja di sekitar lokasi kejadian.</li>
              <li>Segera evakuasi korban ke klinik/sarana medis terdekat.</li>
              <li>Amankan area (pasang barikade/police line) agar tempat kejadian perkara (TKP) tidak rusak demi kelancaran penyelidikan tim HSE.</li>
            </ul>
          </div>
        </div>,
        <div key="2" className="space-y-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Info className="text-blue-600" /> HAL 2: Koordinasi & Input Detail Awal
          </h3>
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            Bantu tim investigator K3 dengan memberikan detail keterangan awal mengenai kronologis kejadian di lapangan.
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            Tinjau draf laporan insiden yang diajukan bawahan Anda dan berikan persetujuan administrasi agar tim K3 dapat menaikkan status menjadi <b>Dalam Investigasi</b>.
          </p>
        </div>
      ]
    },
    audit: {
      title: 'Buku Panduan Insiden - Auditor',
      pages: [
        <div key="1" className="space-y-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Eye className="text-blue-600" /> HAL 1: Kepatuhan Pelaporan Kecelakaan
          </h3>
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            Tugas Anda adalah memverifikasi kepatuhan hukum atas pelaporan kecelakaan kerja di perusahaan.
          </p>
          <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-800">
            <h4 className="font-semibold text-gray-900 dark:text-gray-300 text-sm mb-2">Kriteria Evaluasi Kepatuhan:</h4>
            <ul className="list-disc pl-4 space-y-1.5 text-xs text-gray-700 dark:text-gray-400">
              <li>Periksa jeda waktu antara waktu kejadian insiden dengan waktu dibuatnya laporan di aplikasi (patuh pada SOP K3 1x24 jam).</li>
              <li>Evaluasi apakah *Corrective Action* dari insiden masa lalu benar-benar telah berstatus Closed dan diimplementasikan secara permanen di area kerja terkait.</li>
            </ul>
          </div>
        </div>
      ]
    }
  },
  '/man-hours': {
    admin: {
      title: 'Panduan Man Hours - Pengelola (Admin)',
      pages: [
        <div key="1" className="space-y-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Info className="text-blue-600" /> HAL 1: Input Data Jam Kerja Bulanan
          </h3>
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            Setiap akhir bulan, Admin HSE wajib memasukkan rekapitulasi data jam kerja selamat seluruh karyawan PT. INL.
          </p>
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800">
            <h4 className="font-semibold text-blue-900 dark:text-blue-300 text-sm mb-1.5">Langkah Input Bulanan:</h4>
            <ol className="list-decimal pl-4 space-y-1 text-xs text-blue-800 dark:text-blue-400">
              <li>Klik tombol <b>+ Tambah Data Bulanan</b>.</li>
              <li>Pilih bulan dan tahun input (misal: Januari 2026).</li>
              <li>Masukkan total hari kerja, jam lembur, dan jumlah pekerja aktif.</li>
              <li>Pastikan data sesuai dengan laporan absensi HR resmi. Klik **Simpan**.</li>
            </ol>
          </div>
        </div>,
        <div key="2" className="space-y-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <CheckSquare className="text-emerald-600" /> HAL 2: Rekapan Historis (2018-2025) & Ekspor Excel
          </h3>
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            Untuk data sejarah jam kerja dari Juni 2018 hingga akhir tahun 2025, Anda dapat memasukkan rekapan tunggal dengan memilih tahun khusus **"2018-2025"** pada opsi dropdown tahun.
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            Klik tombol **Export to Excel** untuk mengunduh rekapan dengan total baris akumulasi otomatis (=SUM) untuk bahan pelaporan ke Dinas Tenaga Kerja.
          </p>
        </div>
      ]
    },
    kasubag: {
      title: 'Panduan Man Hours - Pengelola (Kasubag)',
      pages: [
        <div key="1" className="space-y-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Info className="text-blue-600" /> HAL 1: Otoritas Penginputan & Ekspor
          </h3>
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            Sebagai Kasubag Sistem & IT, Anda memiliki wewenang penuh yang sama dengan Admin HSE untuk mengelola data Man Hours.
          </p>
          <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-xl border border-indigo-100 dark:border-indigo-800">
            <h4 className="font-semibold text-indigo-900 dark:text-indigo-300 text-sm mb-1.5">Tugas Penginputan:</h4>
            <ul className="list-disc pl-4 space-y-1 text-xs text-indigo-800 dark:text-indigo-400">
              <li>Input rekapan bulanan baru secara presisi berdasarkan data absensi.</li>
              <li>Input data historis tahun **"2018-2025"** jika ada penyesuaian angka audit lama.</li>
              <li>Ekspor laporan ke format Excel resmi yang dilengkapi rumus penjumlah otomatis.</li>
            </ul>
          </div>
        </div>
      ]
    },
    supervisor: {
      title: 'Panduan Man Hours - Supervisor',
      pages: [
        <div key="1" className="space-y-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Eye className="text-blue-600" /> HAL 1: Evaluasi Kinerja K3 Departemen
          </h3>
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            Halaman ini bersifat baca saja (*Read-Only*) untuk Anda.
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            Analisis tren jam kerja selamat bulanan untuk mengevaluasi apakah produktivitas tim Anda berjalan seimbang dengan kepatuhan prinsip K3 di area kerja Anda.
          </p>
        </div>
      ]
    },
    audit: {
      title: 'Panduan Man Hours - Auditor',
      pages: [
        <div key="1" className="space-y-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Eye className="text-blue-600" /> HAL 1: Rekonsiliasi & Audit Data Absensi
          </h3>
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            Sebagai Auditor, Anda memverifikasi keakuratan perhitungan Jam Kerja Selamat yang diinput di aplikasi.
          </p>
          <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-800">
            <h4 className="font-semibold text-gray-900 dark:text-gray-300 text-sm mb-1.5">Langkah Verifikasi Silang:</h4>
            <ul className="list-disc pl-4 space-y-1 text-xs text-gray-700 dark:text-gray-400">
              <li>Pilih bulan acak dan lakukan ekspor data ke Excel.</li>
              <li>Cocokkan jumlah pekerja aktif dan jam kerja lembur yang diinput di sistem dengan berkas rekapitulasi absensi fisik/fingerprint resmi dari pihak HRD.</li>
            </ul>
          </div>
        </div>
      ]
    }
  },
  '/safety-patrol': {
    user: {
      title: 'Panduan Patrol - Pelapor (User)',
      pages: [
        <div key="1" className="space-y-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Eye className="text-blue-600" /> HAL 1: Melaporkan Bahaya di Lapangan
          </h3>
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            Bila menjumpai kondisi tidak aman (Unsafe Condition) or tindakan tidak aman (Unsafe Act) di area kerja, segera laporkan!
          </p>
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800">
            <h4 className="font-semibold text-blue-900 dark:text-blue-300 text-sm mb-2">Langkah Pelaporan Patrol:</h4>
            <ol className="list-decimal pl-4 space-y-1.5 text-xs text-blue-800 dark:text-blue-400">
              <li>Klik tombol <b>Buat Laporan Baru</b>.</li>
              <li>Pilih lokasi kerja, sebutkan observer/auditee, dan lengkapi kategori temuan observasi.</li>
              <li>Tulis deskripsi temuan, tindakan perbaikan, due date, serta unggah foto dokumentasi temuan.</li>
              <li>Klik <b>Submit</b>. Laporan akan dikirim untuk diperiksa oleh Auditor terlebih dahulu sebelum disetujui Kasubag.</li>
            </ol>
          </div>
        </div>
      ]
    },
    supervisor: {
      title: 'Panduan Patrol - Supervisor',
      pages: [
        <div key="1" className="space-y-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Info className="text-blue-600" /> HAL 1: Pemantauan Kepatuhan Area
          </h3>
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            Supervisor dapat memantau temuan-temuan patrol di areanya yang dilaporkan oleh user agar segera ditindaklanjuti secara fisik oleh tim di lapangan.
          </p>
        </div>
      ]
    },
    admin: {
      title: 'Panduan Patrol - Admin HSE',
      pages: [
        <div key="1" className="space-y-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <ShieldCheck className="text-indigo-600" /> HAL 1: Approval Akhir Laporan
          </h3>
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            Admin HSE (bersama Kasubag) memiliki wewenang untuk memberikan persetujuan akhir pada laporan safety patrol.
          </p>
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl border border-green-100 dark:border-green-800">
            <h4 className="font-semibold text-green-900 dark:text-green-300 text-sm mb-2">Langkah Approval:</h4>
            <ol className="list-decimal pl-4 space-y-1.5 text-xs text-green-800 dark:text-green-400">
              <li>Buka laporan berstatus <b>Menunggu Konfirmasi</b>.</li>
              <li>Periksa hasil checklist observasi dan catatan dari Auditor.</li>
              <li>Klik <b>Review Laporan</b>, berikan catatan jika diperlukan, lalu klik <b>Setujui</b>. Status keseluruhan akan berubah menjadi <b>Selesai (Closed)</b> jika Auditor juga sudah menyetujuinya.</li>
            </ol>
          </div>
        </div>
      ]
    },
    kasubag: {
      title: 'Panduan Patrol - Kasubag (Pak Oka)',
      pages: [
        <div key="1" className="space-y-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <ShieldCheck className="text-amber-600" /> HAL 1: Approval Akhir Kasubag
          </h3>
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            Sebagai Kasubag (Pak Oka), Anda memegang wewenang approval akhir setelah laporan safety patrol diperiksa oleh Auditor.
          </p>
          <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-xl border border-amber-100 dark:border-amber-800">
            <h4 className="font-semibold text-amber-900 dark:text-amber-300 text-sm mb-2">Langkah Approval Kasubag:</h4>
            <ol className="list-decimal pl-4 space-y-1.5 text-xs text-amber-800 dark:text-amber-400">
              <li>Buka laporan safety patrol berstatus Menunggu.</li>
              <li>Pastikan Status Audit sudah bernilai <b>Approved</b> (sudah diperiksa oleh Auditor).</li>
              <li>Klik tombol <b>Review Laporan</b>, masukkan catatan opsional, lalu klik <b>Setujui</b> untuk merubah status laporan menjadi <b>Selesai</b>.</li>
            </ol>
          </div>
        </div>
      ]
    },
    audit: {
      title: 'Panduan Patrol - Auditor',
      pages: [
        <div key="1" className="space-y-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Eye className="text-blue-600" /> HAL 1: Pemeriksaan & Verifikasi Laporan
          </h3>
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            Sebagai Auditor, Anda wajib memeriksa kepatuhan dan kebenaran temuan safety patrol yang disubmit oleh User.
          </p>
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800">
            <h4 className="font-semibold text-blue-900 dark:text-blue-300 text-sm mb-2">Langkah Pemeriksaan Auditor:</h4>
            <ol className="list-decimal pl-4 space-y-1.5 text-xs text-blue-800 dark:text-blue-400">
              <li>Buka laporan safety patrol yang berstatus <b>Menunggu Konfirmasi</b>.</li>
              <li>Periksa detail lokasi, kesesuaian kategori temuan, dan tindakan perbaikan yang diusulkan.</li>
              <li>Klik <b>Review Laporan</b>, tulis rekomendasi/catatan audit Anda, lalu pilih <b>Setujui</b> untuk menyetel Status Audit menjadi <b>Approved</b>.</li>
            </ol>
          </div>
        </div>
      ]
    }
  },
  '/safety-behavior': {
    user: {
      title: 'Panduan BBS - Pelapor (User)',
      pages: [
        <div key="1" className="space-y-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <CheckSquare className="text-emerald-600" /> HAL 1: Observasi Perilaku Rekan Kerja
          </h3>
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            Program BBS (Behavior-Based Safety) mendidik kita saling peduli keselamatan antar rekan kerja secara aktif.
          </p>
          <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-xl border border-emerald-100 dark:border-emerald-800">
            <h4 className="font-semibold text-emerald-900 dark:text-emerald-300 text-sm mb-2">Langkah Pelaporan Observasi:</h4>
            <ol className="list-decimal pl-4 space-y-1.5 text-xs text-emerald-800 dark:text-emerald-400">
              <li>Amati rekan kerja yang sedang beraktivitas secara objektif selama 5-10 menit.</li>
              <li>Buka formulir BBS baru, pilih lokasi, observer, dan auditee.</li>
              <li>Centang indikator perilaku tim apakah sudah sesuai SOP (<b>Safe</b>) atau berisiko (<b>At-Risk</b>).</li>
              <li>Masukkan alasan perilaku berisiko serta tindakan korektif, lalu klik <b>Submit</b>. Laporan akan diperiksa oleh Auditor terlebih dahulu sebelum diapprove Kasubag.</li>
            </ol>
          </div>
        </div>
      ]
    },
    supervisor: {
      title: 'Panduan BBS - Supervisor',
      pages: [
        <div key="1" className="space-y-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Info className="text-blue-600" /> HAL 1: Pembinaan Perilaku Tim
          </h3>
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            Supervisor memantau tren At-Risk Behavior yang sering muncul di areanya guna merancang pembinaan perilaku aman di tempat kerja.
          </p>
        </div>
      ]
    },
    admin: {
      title: 'Panduan BBS - Admin HSE',
      pages: [
        <div key="1" className="space-y-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <ShieldCheck className="text-indigo-600" /> HAL 1: Approval Akhir Laporan BBS
          </h3>
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            Admin HSE (bersama Kasubag) memberikan persetujuan akhir pada laporan observasi perilaku agar data masuk ke dalam statistik performa budaya K3.
          </p>
        </div>
      ]
    },
    kasubag: {
      title: 'Panduan BBS - Kasubag (Pak Oka)',
      pages: [
        <div key="1" className="space-y-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <ShieldCheck className="text-amber-600" /> HAL 1: Approval Akhir Kasubag
          </h3>
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            Sebagai Kasubag (Pak Oka), Anda bertugas memberikan approval akhir pada laporan BBS yang telah diperiksa oleh Auditor.
          </p>
          <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-xl border border-amber-100 dark:border-amber-800">
            <h4 className="font-semibold text-amber-900 dark:text-amber-300 text-sm mb-2">Langkah Approval Kasubag:</h4>
            <ol className="list-decimal pl-4 space-y-1.5 text-xs text-amber-800 dark:text-amber-400">
              <li>Buka laporan BBS berstatus Menunggu.</li>
              <li>Periksa checklist perilaku tim dan pastikan Status Audit sudah bernilai <b>Approved</b>.</li>
              <li>Klik tombol <b>Review Laporan</b>, tulis catatan opsional, lalu klik <b>Setujui</b> untuk menutup laporan menjadi <b>Selesai</b>.</li>
            </ol>
          </div>
        </div>
      ]
    },
    audit: {
      title: 'Panduan BBS - Auditor',
      pages: [
        <div key="1" className="space-y-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Eye className="text-blue-600" /> HAL 1: Pemeriksaan Kualitas Observasi BBS
          </h3>
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            Tugas Auditor adalah memverifikasi data observasi perilaku yang dilaporkan oleh user agar bernilai valid dan objektif.
          </p>
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800">
            <h4 className="font-semibold text-blue-900 dark:text-blue-300 text-sm mb-2">Langkah Pemeriksaan Auditor:</h4>
            <ol className="list-decimal pl-4 space-y-1.5 text-xs text-blue-800 dark:text-blue-400">
              <li>Buka detail laporan BBS berstatus <b>Menunggu Konfirmasi</b>.</li>
              <li>Periksa kebenaran penilaian Safe / At-Risk dari input foto atau detail deskripsi aktivitas.</li>
              <li>Klik <b>Review Laporan</b>, masukkan catatan audit, lalu pilih <b>Setujui</b> untuk mengubah Status Audit menjadi <b>Approved</b>.</li>
            </ol>
          </div>
        </div>
      ]
    }
  },
  '/settings': {
    admin: {
      title: 'Panduan Pengaturan - Admin HSE',
      pages: [
        <div key="1" className="space-y-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <ShieldCheck className="text-indigo-600" /> HAL 1: Pengelolaan Master Data Sistem
          </h3>
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            Halaman pengaturan digunakan untuk mengonfigurasi parameter dasar dan hak akses sistem keselamatan kerja.
          </p>
          <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-xl border border-indigo-100 dark:border-indigo-800">
            <h4 className="font-semibold text-indigo-900 dark:text-indigo-300 text-sm mb-1.5">Modul Master yang Tersedia:</h4>
            <ul className="list-disc pl-4 space-y-1 text-xs text-indigo-800 dark:text-indigo-400">
              <li><b>Master Users:</b> Tambah, edit, atau nonaktifkan akun pengguna dan tentukan tingkat kewenangan peran (*Role*).</li>
              <li><b>Master Signatures:</b> Kelola tanda tangan digital resmi pejabat K3 yang berwenang untuk pencetakan otomatis izin kerja.</li>
              <li><b>Master Konfigurasi Lapangan:</b> Sesuaikan opsi mitigasi bahaya.</li>
            </ul>
          </div>
        </div>
      ]
    },
    kasubag: {
      title: 'Panduan Pengaturan - Kasubag',
      pages: [
        <div key="1" className="space-y-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <ShieldCheck className="text-indigo-600" /> HAL 1: Otoritas Master & Keamanan IT
          </h3>
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            Sebagai Kasubag Sistem & IT, Anda memegang tanggung jawab mengelola konfigurasi akun pengguna dan tanda tangan digital.
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            Pastikan seluruh data tanda tangan digital tersimpan dengan protokol keamanan tinggi dan hak akses peran (*Role*) terdistribusi secara tepat sesuai jabatan karyawan.
          </p>
        </div>
      ]
    },
    user: {
      title: 'Panduan Pengaturan - Karyawan (User)',
      pages: [
        <div key="1" className="space-y-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Info className="text-blue-600" /> HAL 1: Pengaturan Profil & Keamanan Akun
          </h3>
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            Sebagai User, akses pengaturan Anda terbatas untuk keamanan akun Anda sendiri.
          </p>
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800">
            <h4 className="font-semibold text-blue-900 dark:text-blue-300 text-sm mb-1.5">Fitur yang Tersedia:</h4>
            <ul className="list-disc pl-4 space-y-1 text-xs text-blue-800 dark:text-blue-400">
              <li><b>Keamanan:</b> Ubah kata sandi (*Password*) akun Anda secara berkala guna mencegah penyalahgunaan akun.</li>
              <li><b>Tampilan:</b> Atur tema sistem (Terang / Gelap) demi kenyamanan mata Anda selama bekerja.</li>
            </ul>
          </div>
        </div>
      ]
    },
    supervisor: {
      title: 'Panduan Pengaturan - Supervisor',
      pages: [
        <div key="1" className="space-y-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Info className="text-blue-600" /> HAL 1: Keamanan Akun
          </h3>
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            Ubah password akun Anda secara rutin untuk melindungi otorisasi digital Anda. Tanda tangan digital Anda berwujud legalitas K3 resmi, sehingga kerahasiaan akun wajib dijaga secara maksimal.
          </p>
        </div>
      ]
    },
    audit: {
      title: 'Panduan Pengaturan - Auditor',
      pages: [
        <div key="1" className="space-y-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Info className="text-blue-600" /> HAL 1: Keamanan Akun
          </h3>
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            Gunakan tab Keamanan untuk mengganti password akun Anda guna memastikan akses audit database K3 tidak disusupi oleh pihak luar.
          </p>
        </div>
      ]
    }
  },
  '/profil': {
    user: {
      title: 'Panduan Profil - Karyawan (User)',
      pages: [
        <div key="1" className="space-y-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Info className="text-blue-600" /> HAL 1: Biodata & Tanda Tangan Digital
          </h3>
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            Halaman profil memuat rangkuman informasi pribadi Anda (Nama, NIK, Departemen, Jabatan).
          </p>
          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-xl border border-red-100 dark:border-red-800">
            <h4 className="font-semibold text-red-900 dark:text-red-300 text-sm mb-1">PENTING: Unggah Tanda Tangan!</h4>
            <p className="text-xs text-red-800 dark:text-red-400">
              Anda wajib mengunggah tanda tangan digital pribadi Anda di halaman ini. Tanda tangan tersebut akan disematkan secara otomatis di dokumen permit kerja cetak PDF saat Anda bertindak sebagai pemohon izin. Jaga kerahasiaan password akun Anda!
            </p>
          </div>
        </div>
      ]
    },
    supervisor: {
      title: 'Panduan Profil - Supervisor',
      pages: [
        <div key="1" className="space-y-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Info className="text-blue-600" /> HAL 1: Unggah Tanda Tangan Otorisasi
          </h3>
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            Pastikan biodata Anda terisi dengan benar. Anda wajib mengunggah foto tanda tangan digital Anda.
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            Tanda tangan ini akan dicantumkan secara otomatis pada dokumen fisik PDF permit kerja K3 setelah Anda melakukan peninjauan lapangan (*Review*) atau mengesahkan penyelesaian (*Completion*) pekerjaan di aplikasi.
          </p>
        </div>
      ]
    },
    admin: {
      title: 'Panduan Profil - Admin HSE',
      pages: [
        <div key="1" className="space-y-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Info className="text-blue-600" /> HAL 1: Unggah Tanda Tangan Otorisasi Approval
          </h3>
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            Sebagai Admin HSE, tanda tangan digital Anda adalah syarat mutlak legalitas aktifnya sebuah permit kerja risiko tinggi di PT. INL.
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            Wajib unggah tanda tangan digital Anda di halaman ini dan jaga ketat keamanan akun Anda untuk menghindari penyalahgunaan wewenang approval keselamatan kerja.
          </p>
        </div>
      ]
    },
    kasubag: {
      title: 'Panduan Profil - Kasubag',
      pages: [
        <div key="1" className="space-y-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Info className="text-blue-600" /> HAL 1: Kelola Biodata & Otorisasi
          </h3>
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            Unggah tanda tangan digital pribadi Anda untuk memberikan persetujuan administratif "D. Mengetahui" pada berkas-berkas izin kerja khusus.
          </p>
        </div>
      ]
    },
    audit: {
      title: 'Panduan Profil - Auditor',
      pages: [
        <div key="1" className="space-y-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Info className="text-blue-600" /> HAL 1: Kelola Profil Anda
          </h3>
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            Gunakan halaman ini untuk memantau data keanggotaan audit Anda dan melakukan pembaruan informasi profil jika diperlukan.
          </p>
        </div>
      ]
    }
  }
};

export default function GuideBook({ isOpen, onClose }: GuideBookProps) {
  const pathname = usePathname();
  const { user } = useAuth();
  
  // Safe role extraction, defaults to 'user'
  const role = (user?.role?.toLowerCase() as 'admin' | 'supervisor' | 'user' | 'audit' | 'kasubag') || 'user';
  
  const [currentPage, setCurrentPage] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Find match logic for current path
  const matchedKey = Object.keys(guideContents).find(key => pathname.startsWith(key));
  
  // Resolve content based on path and role
  let content = { title: 'Buku Panduan', pages: defaultPages };
  if (matchedKey && guideContents[matchedKey][role]) {
    content = guideContents[matchedKey][role];
  }

  const totalPages = content.pages.length;

  useEffect(() => {
    setCurrentPage(0);
  }, [isOpen, pathname]);

  const handleNext = () => {
    if (currentPage < totalPages - 1 && !isAnimating) {
      setIsAnimating(true);
      setCurrentPage(p => p + 1);
      setTimeout(() => setIsAnimating(false), 200);
    }
  };

  const handlePrev = () => {
    if (currentPage > 0 && !isAnimating) {
      setIsAnimating(true);
      setCurrentPage(p => p - 1);
      setTimeout(() => setIsAnimating(false), 200);
    }
  };

  if (!isOpen) return null;

  return (
    <Portal>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60" onClick={onClose}>
        <div 
          className="w-full max-w-lg bg-white dark:bg-[#12121E] rounded-2xl shadow-2xl flex flex-col border border-gray-200 dark:border-gray-800 overflow-hidden animate-scale-in"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header Buku yang bersih */}
          <div className="flex items-center justify-between px-6 py-5 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
            <h2 className="text-base font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <BookOpen size={18} className="text-amber-500" /> 
              {content.title}
            </h2>
            <button 
              onClick={onClose} 
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Isi Konten (Kertas Putih Bersih tanpa embel-embel shadow aneh) */}
          <div className="bg-white dark:bg-[#12121E] p-6 sm:px-8 sm:py-6 min-h-[260px]">
            <div className={`transition-opacity duration-200 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
              {content.pages[currentPage]}
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
            <button 
              onClick={handlePrev}
              disabled={currentPage === 0 || isAnimating}
              className="px-4 py-2 flex items-center gap-1.5 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-xl disabled:opacity-30 transition-colors border border-transparent hover:border-gray-300 dark:hover:border-gray-700"
            >
              <ChevronLeft size={16} /> Sebelumnya
            </button>
            
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
              Hal {currentPage + 1} / {totalPages}
            </span>
            
            <button 
              onClick={handleNext}
              disabled={currentPage === totalPages - 1 || isAnimating}
              className="px-4 py-2 flex items-center gap-1.5 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-xl disabled:opacity-30 transition-colors border border-transparent hover:border-gray-300 dark:hover:border-gray-700"
            >
              Berikutnya <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </Portal>
  );
}
