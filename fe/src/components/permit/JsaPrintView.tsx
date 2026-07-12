'use client';

import { Permit } from '@/types';

interface JsaPrintViewProps {
  permit: Permit;
}

const S = {
  page: { fontFamily: "'Calibri','Inter',sans-serif", fontSize: '7px', lineHeight: '1.25', color: '#000', width: '100%' } as React.CSSProperties,
  headerTbl: { width: '100%', borderCollapse: 'collapse' as const, fontSize: '7px' },
  headerLabel: { fontWeight: 700, color: '#000', padding: '1px 4px', border: '1px solid #000' },
  headerVal: { padding: '1px 4px', border: '1px solid #000', color: '#000' },
  titleBar: { textAlign: 'center' as const, background: '#f2f2f2', color: '#000', padding: '4px 8px', marginBottom: '4px', fontSize: '9px', fontWeight: 700, letterSpacing: '0.5px', border: '1px solid #000' },
  metaTbl: { width: '100%', borderCollapse: 'collapse' as const, fontSize: '6.5px', marginBottom: '3px' },
  metaLabel: { fontWeight: 600, color: '#000', padding: '2px 4px', border: '1px solid #000', background: '#f2f2f2', whiteSpace: 'nowrap' as const },
  metaVal: { padding: '2px 4px', border: '1px solid #000', color: '#000' },
  metaSigHeader: { fontWeight: 700, padding: '4px 4px', border: '1px solid #000', background: '#f2f2f2', textAlign: 'center' as const, fontSize: '6.5px' },
  metaSigVal: { padding: '8px 4px', border: '1px solid #000', textAlign: 'center' as const, verticalAlign: 'bottom' as const, height: '40px', minHeight: '40px', color: '#000' },
  dataTbl: { width: '100%', borderCollapse: 'collapse' as const, fontSize: '5.5px' },
  dataTh: { background: '#f2f2f2', color: '#000', padding: '2px 3px', textAlign: 'center' as const, fontWeight: 700, border: '1px solid #000', fontSize: '5px', verticalAlign: 'bottom' as const },
  dataTd: { padding: '2px 3px', border: '1px solid #000', verticalAlign: 'top' as const, fontSize: '5.5px', color: '#000' },
  legend: { fontSize: '5px', color: '#000', marginTop: '3px', borderTop: '0.5px solid #000', paddingTop: '2px', lineHeight: '1.5' },
  sigTbl: { width: '100%', borderCollapse: 'collapse' as const, fontSize: '6.5px', marginTop: '4px' },
  sigTh: { background: '#f2f2f2', color: '#000', padding: '2px 4px', textAlign: 'center' as const, fontWeight: 700, border: '1px solid #000', fontSize: '6px' },
  sigTd: { padding: '2px 4px', border: '1px solid #000', textAlign: 'center' as const, verticalAlign: 'top' as const, fontSize: '6px', color: '#000' },
};

function V({ v }: { v: unknown }) {
  if (v === null || v === undefined || v === '') return <span style={{ color: '#999' }}>-</span>;
  return <span>{String(v)}</span>;
}

export default function JsaPrintView({ permit }: JsaPrintViewProps) {
  const det = permit.detail?.detail_data || {};
  const tahapan = (det.jsa_tahapan as any[]) || [];

  return (
    <div style={S.page} id="print-jsa-content">
    <table style={{ width: '100%', borderCollapse: 'collapse', border: '1.5px solid #000', marginBottom: '8px' }}>
      <thead>
        <tr style={{ textAlign: 'center' }}>
          <td
            rowSpan={4}
            style={{
              width: '15%',
              border: '1px solid #000',
              padding: '4px',
              textAlign: 'center',
              verticalAlign: 'middle',
            }}
          >
            <img
              src="/Picture1.png"
              alt="Logo INL"
              style={{
                display: 'block',
                margin: '0 auto',
                maxWidth: '100%',
                height: 'auto',
                maxHeight: '44px',
                objectFit: 'contain',
              }}
            />
          </td>
          <td
            rowSpan={3}
            style={{
              width: '50%',
              border: '1px solid #000',
              padding: '4px 6px',
              textAlign: 'center',
              verticalAlign: 'middle',
            }}
          >
            <div style={{ fontSize: '11px', fontWeight: 800, color: '#000', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
              PT. Industri Nabati Lestari
            </div>
            <div style={{ fontSize: '8px', color: '#000', fontWeight: 700, marginTop: '1px', textTransform: 'uppercase' }}>
              Pabrik Minyak Goreng
            </div>
            <div style={{ fontSize: '6.5px', color: '#000', marginTop: '2px', lineHeight: '1.2', fontWeight: 500 }}>
              Komp. KEK Sei Mangkei, Kav. 2-3, Kec. Bosar Maligas, Kab. Simalungun, Sumatera Utara, 21184
            </div>
          </td>
          <th style={{ width: '17.5%', border: '1px solid #000', padding: '3px', fontWeight: 700, fontSize: '8px', textTransform: 'uppercase', color: '#000', textAlign: 'center' }}>
            No. Dokumen
          </th>
          <th style={{ width: '17.5%', border: '1px solid #000', padding: '3px', fontWeight: 700, fontSize: '8px', textTransform: 'uppercase', color: '#000', textAlign: 'center' }}>
            Tgl. Berlaku
          </th>
        </tr>
        <tr style={{ textAlign: 'center' }}>
          <td style={{ border: '1px solid #000', padding: '3px', fontSize: '8px', textAlign: 'center', fontWeight: 600, color: '#000' }}>
            INLHO/OPP-HSE/F-006
          </td>
          <td style={{ border: '1px solid #000', padding: '3px', fontSize: '8px', textAlign: 'center', fontWeight: 600, color: '#000' }}>
            1-Aug-24
          </td>
        </tr>
        <tr style={{ textAlign: 'center' }}>
          <th style={{ border: '1px solid #000', padding: '3px', fontWeight: 700, fontSize: '8px', textTransform: 'uppercase', color: '#000', textAlign: 'center' }}>
            No. Revisi
          </th>
          <th style={{ border: '1px solid #000', padding: '3px', fontWeight: 700, fontSize: '8px', textTransform: 'uppercase', color: '#000', textAlign: 'center' }}>
            Halaman
          </th>
        </tr>
        <tr style={{ textAlign: 'center' }}>
          <th style={{ border: '1px solid #000', padding: '4px 6px', fontSize: '9px', fontWeight: 800, color: '#000', textAlign: 'center', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
            JOB SAFETY ANALYSIS (JSA) DAN RISK ASSESSMENT
          </th>
          <td style={{ border: '1px solid #000', padding: '3px', fontSize: '8px', textAlign: 'center', fontWeight: 600, color: '#000' }}>
            02
          </td>
          <td style={{ border: '1px solid #000', padding: '3px', fontSize: '8px', textAlign: 'center', fontWeight: 600, color: '#000' }}>
            1 dari 1
          </td>
        </tr>
      </thead>
    </table>

      {/* Meta Table */}
      <table style={S.metaTbl}>
        <tbody>
          <tr>
            <td style={{ ...S.metaLabel, width: '14%' }}>Depart/Bagian/CV</td>
            <td style={{ ...S.metaVal, width: '23%' }}>: {permit.departemen || '-'}</td>
            <td style={{ ...S.metaSigHeader, width: '16%' }} rowSpan={3}>
              Disusun dan dikaji<br/>bersama Oleh:
            </td>
            <td style={{ ...S.metaSigVal, width: '16%', fontWeight: 600, borderBottom: '1px solid #888' }}>Head Dept</td>
            <td style={{ ...S.metaSigVal, width: '16%', fontWeight: 600, borderBottom: '1px solid #888' }}>HSSE</td>
            <td style={{ ...S.metaSigVal, width: '15%', fontWeight: 600, borderBottom: '1px solid #888' }}>GM Produksi</td>
          </tr>
          <tr>
            <td style={S.metaLabel}>Tanggal</td>
            <td style={S.metaVal}>: {permit.tanggal || '-'}</td>
            <td style={S.metaSigVal}></td>
            <td style={S.metaSigVal}></td>
            <td style={S.metaSigVal}></td>
          </tr>
          <tr>
            <td style={S.metaLabel}>Kegiatan</td>
            <td style={S.metaVal}>: {permit.judul || '-'}</td>
            <td style={{ ...S.metaSigHeader, fontSize: '5.5px' }} rowSpan={2}>Diketahui Oleh:</td>
            <td style={S.metaSigVal}></td>
            <td style={S.metaSigVal}></td>
            <td style={S.metaSigVal}></td>
          </tr>
          <tr>
            <td style={S.metaLabel}>Area / Lokasi</td>
            <td style={S.metaVal}>: {permit.lokasi || '-'}</td>
            <td style={S.metaSigVal}></td>
            <td style={S.metaSigVal}></td>
            <td style={S.metaSigVal}></td>
          </tr>
        </tbody>
      </table>

      {/* JSA Data Table */}
      <table style={S.dataTbl}>
        <thead>
          <tr>
            <th style={{ ...S.dataTh, width: '11%' }}>Proses/Pekerjaan<br/>Mesin/Alat/Material</th>
            <th style={{ ...S.dataTh, width: '3%', fontSize: '4.5px' }}>Rutin</th>
            <th style={{ ...S.dataTh, width: '3%', fontSize: '4.5px' }}>Non<br/>Rutin</th>
            <th style={{ ...S.dataTh, width: '13%' }}>Tahapan Kegiatan /<br/>Deskripsi</th>
            <th style={{ ...S.dataTh, width: '11%' }}>Deskripsi Bahaya</th>
            <th style={{ ...S.dataTh, width: '9%' }}>Identifikasi<br/>Bahaya</th>
            <th style={{ ...S.dataTh, width: '3%', fontSize: '4.5px' }}>Peluang<br/>(A)</th>
            <th style={{ ...S.dataTh, width: '3%', fontSize: '4.5px' }}>Akibat<br/>(B)</th>
            <th style={{ ...S.dataTh, width: '4%', fontSize: '4.5px' }}>Tingkat<br/>Risiko<br/>(AxB)</th>
            <th style={{ ...S.dataTh, width: '16%' }}>Tindakan<br/>Pengendalian</th>
            <th style={{ ...S.dataTh, width: '8%' }}>PIC</th>
            <th style={{ ...S.dataTh, width: '8%' }}>Supervisi</th>
            <th style={{ ...S.dataTh, width: '5%' }}>Ket</th>
          </tr>
        </thead>
        <tbody>
          {tahapan.length === 0 && (
            <tr>
              <td style={{ ...S.dataTd, textAlign: 'center', color: '#999', padding: '8px' }} colSpan={13}>
                Tidak ada data JSA
              </td>
            </tr>
          )}
          {tahapan.map((row: any, i: number) => {
            const score = (row.peluang || 0) * (row.akibat || 0);
            const isRutin = row.sifat === 'rutin';
            let rcBg = '#fff', rcFg = '#000';
            if (score <= 4) { rcBg = '#dcfce7'; rcFg = '#166534'; }
            else if (score <= 9) { rcBg = '#fef9c3'; rcFg = '#854d0e'; }
            else if (score <= 16) { rcBg = '#ffedd5'; rcFg = '#9a3412'; }
            else { rcBg = '#fee2e2'; rcFg = '#991b1b'; }
            return (
              <tr key={i}>
                <td style={{ ...S.dataTd }}>{row.proses || '-'}</td>
                <td style={{ ...S.dataTd, textAlign: 'center' }}>{isRutin ? '✓' : ''}</td>
                <td style={{ ...S.dataTd, textAlign: 'center' }}>{!isRutin ? '✓' : ''}</td>
                <td style={{ ...S.dataTd }}>{row.tahapan || '-'}</td>
                <td style={{ ...S.dataTd }}>{row.deskripsi_bahaya || '-'}</td>
                <td style={{ ...S.dataTd }}>{row.identifikasi_bahaya || '-'}</td>
                <td style={{ ...S.dataTd, textAlign: 'center' }}>{row.peluang ?? '-'}</td>
                <td style={{ ...S.dataTd, textAlign: 'center' }}>{row.akibat ?? '-'}</td>
                <td style={{ ...S.dataTd, textAlign: 'center', fontWeight: 700, background: rcBg, color: rcFg }}>{score}</td>
                <td style={{ ...S.dataTd }}>{row.tindakan_pengendalian || '-'}</td>
                <td style={{ ...S.dataTd }}>{row.pic || '-'}</td>
                <td style={{ ...S.dataTd }}>{row.supervisi || '-'}</td>
                <td style={{ ...S.dataTd }}>{row.keterangan || '-'}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Risk Legend */}
      <div style={S.legend}>
        <div style={{ display: 'flex', gap: '12px', marginBottom: '1px' }}>
          <span><b>Peluang (A):</b> 1=Sangat Jarang, 2=Jarang, 3=Mungkin, 4=Hampir Pasti, 5=Pasti</span>
          <span><b>Akibat (B):</b> 1=Tidak Ada, 2=Kecil, 3=Sedang, 4=Besar, 5=Fatal</span>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <span><b style={{ color: '#166534' }}>Rendah (1-4)</b></span>
          <span><b style={{ color: '#854d0e' }}>Sedang (5-9)</b></span>
          <span><b style={{ color: '#9a3412' }}>Tinggi (10-16)</b></span>
          <span><b style={{ color: '#991b1b' }}>Ekstrim (17-25)</b></span>
        </div>
      </div>

      {/* Footer */}
      <div style={{ fontSize: '5.5px', color: '#888', borderTop: '0.5px solid #ccc', paddingTop: '2px', marginTop: '4px', textAlign: 'center' }}>
        Note : - Putih: HSSE, - Merah Muda: Pemohon Izin, - Hijau Muda: Dept lain
      </div>
    </div>
  );
}
