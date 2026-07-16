'use client';

import { Permit } from '@/types';

interface PermitPrintViewProps {
  permit: Permit;
}

const JC: Record<string, { label: string; doc: string }> = {
  gwp: { label: 'IZIN KERJA UMUM (GENERAL WORK PERMIT)', doc: 'FM-BSHS-19/01' },
  hwp: { label: 'Izin Kerja Panas / Hot Work Permit', doc: 'FM-BSHS-19/03' },
  cse: { label: 'Izin Masuk Ruang Terbatas / Confined Space Entry', doc: 'FM-BSHS-19/02' },
  elp: { label: 'Izin Kerja Elektrikal / Electrical Work Permit', doc: 'FM-BSHS-19/05' },
  ewp: { label: 'Izin Kerja Pengalian / Excavation Work Permit', doc: 'FM-BSHS-19/06' },
  lwp: { label: 'Izin Kerja Critical Lifting / Critical Lifting Work Permit', doc: 'FM-BSHS-19/07' },
  rwp: { label: 'Izin Kerja Radiografi / Radiografy Work Permit', doc: 'FM-BSHS-19/08' },
  whp: { label: 'Izin Kerja Pada Ketinggian (Work At Height Permit)', doc: 'FM-BSHS-19/04' },
};

const S = {
  page: { fontFamily: "'Calibri','Inter',sans-serif", fontSize: '7.5px', lineHeight: '1.25', color: '#000', width: '100%' } as React.CSSProperties,
  headerTbl: { width: '100%', borderCollapse: 'collapse' as const, fontSize: '7px' },
  headerLabel: { fontWeight: 700, color: '#000', padding: '1px 4px', border: '1px solid #000' },
  headerVal: { padding: '1px 4px', border: '1px solid #000', color: '#000' },
  titleBar: { textAlign: 'center' as const, background: '#f2f2f2', color: '#000', padding: '3px 8px', marginBottom: '3px', fontSize: '9px', fontWeight: 700, border: '1px solid #000' },
  subBar: { fontSize: '6.5px', color: '#000', marginBottom: '2px', padding: '1px 0' },
  section: { marginBottom: '4px', pageBreakInside: 'avoid' as const },
  sectionTitle: { fontSize: '7.5px', fontWeight: 700, color: '#000', borderBottom: '1px solid #000', paddingBottom: '1px', marginBottom: '2px', textTransform: 'uppercase' as const },
  tbl: { width: '100%', borderCollapse: 'collapse' as const, fontSize: '7px' },
  lbl: { fontWeight: 600, color: '#000', background: '#f2f2f2', padding: '2px 4px', border: '1px solid #000', whiteSpace: 'nowrap' as const },
  val: { padding: '2px 4px', border: '1px solid #000', color: '#000' },
  chkTbl: { width: '100%', borderCollapse: 'collapse' as const, fontSize: '6.5px' },
  chkTh: { background: '#f2f2f2', color: '#000', padding: '2px 4px', textAlign: 'left' as const, fontWeight: 700, border: '1px solid #000', fontSize: '6.5px' },
  chkTd: { padding: '2px 4px', border: '1px solid #000', color: '#000' },
  appTbl: { width: '100%', borderCollapse: 'collapse' as const, fontSize: '6.5px' },
  appTh: { background: '#f2f2f2', color: '#000', padding: '2px 4px', textAlign: 'left' as const, fontWeight: 700, border: '1px solid #000', fontSize: '6px' },
  appTd: { padding: '4px', border: '1px solid #000', verticalAlign: 'middle' as const, fontSize: '6.5px', height: '28px', color: '#000' },
  appDeclaration: { fontStyle: 'italic', fontSize: '6px', color: '#000', lineHeight: '1.3' },
};

function V({ v }: { v: unknown }) {
  if (v === null || v === undefined || v === '') return <span style={{ color: '#999' }}>-</span>;
  if (Array.isArray(v)) return <span>{v.filter(Boolean).join(', ') || '-'}</span>;
  if (typeof v === 'boolean') return <span>{v ? 'Ya' : 'Tidak'}</span>;
  return <span>{String(v)}</span>;
}

function Ck({ v }: { v: unknown }) {
  return <span style={{ fontSize: '9px' }}>{v ? '☑' : '☐'}</span>;
}

function DocHeader({ permit, jc }: { permit: Permit; jc: { label: string; doc: string } }) {
  return (
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
            {jc.doc || '-'}
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
            {jc.label}
          </th>
          <td style={{ border: '1px solid #000', padding: '3px', fontSize: '8px', textAlign: 'center', fontWeight: 600, color: '#000' }}>
            00
          </td>
          <td style={{ border: '1px solid #000', padding: '3px', fontSize: '8px', textAlign: 'center', fontWeight: 600, color: '#000' }}>
            1 dari 1
          </td>
        </tr>
      </thead>
    </table>
  );
}

function PermitInfoBar({ permit }: { permit: Permit }) {
  return (
    <div style={S.subBar}>
      Izin ini hanya berlaku untuk satu shift kerja &bull; Dept/Bag/CV: <b>{permit.departemen || '-'}</b> &bull; No. Permit: <b>{permit.permit_number}</b>
    </div>
  );
}

function CompletionSection({ permit }: { permit: Permit }) {
  const cd = permit.completion_data;
  if (!cd || Object.keys(cd).length === 0) return null;
  return (
    <div style={S.section}>
      <div style={{ ...S.sectionTitle, color: '#2E7D32', borderColor: '#2E7D32' }}>Pengesahan Setelah Selesai Bekerja</div>
      <table style={S.appTbl}>
        <thead>
          <tr>
            <th style={{ ...S.appTh, width: '22%' }}>Bagian</th>
            <th style={{ ...S.appTh, width: '16%' }}>Tanggal</th>
            <th style={{ ...S.appTh, width: '32%' }}>Nama</th>
            <th style={{ ...S.appTh, width: '15%' }}>Paraf</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ ...S.appTd, fontWeight: 600 }}>A. Pemohon Izin</td>
            <td style={S.appTd}><V v={cd.user_tanggal} /></td>
            <td style={S.appTd}><V v={cd.user_nama} /></td>
            <td style={S.appTd}><V v={cd.user_paraf} /></td>
          </tr>
          <tr>
            <td style={{ ...S.appTd, fontWeight: 600 }}>B. Pemilik Lokasi</td>
            <td style={S.appTd}><V v={cd.supervisor_tanggal} /></td>
            <td style={S.appTd}><V v={cd.supervisor_nama} /></td>
            <td style={S.appTd}><V v={cd.supervisor_paraf} /></td>
          </tr>
          <tr>
            <td style={{ ...S.appTd, fontWeight: 600 }}>C. Pemberi Izin</td>
            <td style={S.appTd}><V v={cd.admin_tanggal} /></td>
            <td style={S.appTd}><V v={cd.admin_hse_nama} /></td>
            <td style={S.appTd}><V v={cd.admin_paraf} /></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

const FOUR_PARTY_ROLES = [
  { key: 'A', label: 'A. Pemohon Izin', decl: 'Saya menyatakan telah membaca dan paham bahaya yang ada serta upaya penanganannya untuk pekerjaan penggalian ini' },
  { key: 'B', label: 'B. Pemilik Lokasi', decl: 'Saya telah melakukan pemeriksaan terhadap lokasi ini dan pekerjaan ini dapat dilakukan' },
  { key: 'C', label: 'C. Pemberi Izin', decl: 'Saya telah memastikan pekerjaan ini dapat dilakukan dengan aman' },
  { key: 'D', label: 'D. Mengetahui', decl: null },
];

function FourPartySignature({
  prefix, det, withDecl, extraFooter,
}: {
  prefix: string;
  det: Record<string, unknown>;
  withDecl?: boolean;
  extraFooter?: { label: string; fields: string[] }[];
}) {
  const getF = (party: string, field: string) => det[`${prefix}_${party.toLowerCase()}_${field}`];
  const parties = [
    { key: 'a', label: 'A. Pemohon Izin' },
    { key: 'b', label: 'B. Pemilik Lokasi' },
    { key: 'c', label: 'C. Pemberi Izin' },
    { key: 'd', label: 'D. Mengetahui' },
  ];
  return (
    <table style={S.appTbl}>
      {withDecl && (
        <tbody>
          <tr>
            {parties.map((p, i) => (
              <td key={p.key} style={{ ...S.appTd, fontStyle: 'italic', fontSize: '6px', width: i < 2 ? '30%' : '20%', padding: '3px 4px' }}>
                {p.label}
              </td>
            ))}
          </tr>
          <tr>
            <td style={{ ...S.appTd, ...S.appDeclaration }} colSpan={1}>
              Saya menyatakan telah membaca dan paham bahaya yang ada serta upaya penanganannya untuk pekerjaan ini
            </td>
            <td style={{ ...S.appTd, ...S.appDeclaration }}>
              Saya telah melakukan pemeriksaan terhadap lokasi ini dan pekerjaan ini dapat dilakukan
            </td>
            <td style={{ ...S.appTd, ...S.appDeclaration }}>
              Saya telah memastikan pekerjaan ini dapat dilakukan dengan aman
            </td>
            <td style={S.appTd}></td>
          </tr>
        </tbody>
      )}
      <thead>
        <tr>
          <th style={{ ...S.appTh, width: '24%' }}>Pihak</th>
          <th style={{ ...S.appTh, width: '14%' }}>Tanggal</th>
          <th style={{ ...S.appTh, width: '24%' }}>Nama</th>
          <th style={{ ...S.appTh, width: '24%' }}>Jabatan</th>
          <th style={{ ...S.appTh, width: '14%' }}>Paraf</th>
        </tr>
      </thead>
      <tbody>
        {parties.slice(0, 2).map((p) => (
          <tr key={p.key}>
            <td style={{ ...S.appTd, fontWeight: 600 }}>{p.label}</td>
            <td style={S.appTd}><V v={getF(p.key, 'tanggal')} /></td>
            <td style={S.appTd}><V v={getF(p.key, 'nama')} /></td>
            <td style={S.appTd}><V v={getF(p.key, 'jabatan')} /></td>
            <td style={S.appTd}><V v={getF(p.key, 'paraf')} /></td>
          </tr>
        ))}
        {extraFooter ? (
          <tr>
            <td style={{ ...S.appTd, fontWeight: 600, verticalAlign: 'middle' }}>C. Pemberi Izin</td>
            <td style={S.appTd} colSpan={4}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '6.5px' }}>
                <tbody>
                  {extraFooter.map((ef, i) => (
                    <tr key={i}>
                      <td style={{ padding: '1px 2px', fontWeight: 600, width: '30%' }}>{ef.label}</td>
                      {ef.fields.map((f, j) => (
                        <td key={j} style={{ padding: '1px 2px' }}><V v={det[f]} /></td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </td>
          </tr>
        ) : (
          <tr>
            <td style={{ ...S.appTd, fontWeight: 600 }}>C. Pemberi Izin</td>
            <td style={S.appTd}><V v={getF('c', 'tanggal')} /></td>
            <td style={S.appTd}><V v={getF('c', 'nama')} /></td>
            <td style={S.appTd}><V v={getF('c', 'jabatan')} /></td>
            <td style={S.appTd}><V v={getF('c', 'paraf')} /></td>
          </tr>
        )}
        <tr>
          <td style={{ ...S.appTd, fontWeight: 600 }}>D. Mengetahui</td>
          <td style={S.appTd}><V v={getF('d', 'tanggal')} /></td>
          <td style={S.appTd}><V v={getF('d', 'nama')} /></td>
          <td style={S.appTd}><V v={getF('d', 'jabatan')} /></td>
          <td style={S.appTd}><V v={getF('d', 'paraf')} /></td>
        </tr>
      </tbody>
    </table>
  );
}

/* =================================================================
   GWP - General Work Permit (Izin Kerja Umum)
   Source: gwp.xls (FORM Rev.1 - OK)
   ================================================================= */
function GwpPrint({ det, permit }: { det: Record<string, unknown>; permit: Permit }) {
  const CP = ['Peralatan telah dipisahkan/di kosongkan/dibersihkan dari bekas bahan mudah terbakar/gas', 'Peralatan telah dipasang label/memutus aliran listrik/mengunci dengan LOTO', 'Penutup main hole dan saluran pembuangan telah tertutup', 'Petugas operasi telah menggunakan/melengkapi APD yang diperlukan', 'Perlakuan lain yang dilakukan, sebutkan'];
  const CH = ['Daerah kerja telah diperiksa dari kebocoran atau bahaya lain dan telah dipasang tanda-tanda yang benar termasuk arah angin', 'Semua tindakan pencegahan untuk bahaya listrik, steam, hidrolik dll telah diperiksa dan diberi label', 'Persyaratan penerangan daerah kerja telah memenuhi standar/layak', 'Memastikan tidak ada sumber api dekat bahan mudah terbakar', 'Memastikan tidak ada pelepasan bahan mudah terbakar dari pekerjaan lain di sekitar area kerja'];
  const PPE = ['Helmet', 'Safety shoes', 'Seragam kerja', 'Masker', 'Safety Harness', 'Goggle', 'Sarung tangan', 'Safety Boots', 'Ear plug', 'Ear Muff'];
  const pc = (det.checklist_pemohon as string[]) || [];
  const hc = (det.checklist_hse as string[]) || [];
  const pp = (det.ppe_checklist as string[]) || [];
  return (
    <>
      {/* A. Identitas Permintaan Izin Kerja */}
      <div style={S.section}>
        <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #000', fontSize: '7.5px', marginBottom: '4px' }}>
          <tbody>
            <tr>
              <td colSpan={3} style={{ borderBottom: '1px solid #000', padding: '3px 4px', fontWeight: 'bold', textDecoration: 'underline', textTransform: 'uppercase' }}>
                A. Identitas Permintaan Izin Kerja
              </td>
            </tr>
            <tr>
              <td style={{ width: '40%', padding: '4px', borderRight: '1px solid #000', verticalAlign: 'top', lineHeight: '1.4' }}>
                <div>1. Tanggal : <strong><V v={permit.tanggal} /></strong></div>
                <div style={{ marginTop: '2px' }}>2. Pukul : <strong><V v={permit.pukul_mulai} /></strong> s.d <strong><V v={permit.pukul_selesai} /></strong></div>
              </td>
              <td style={{ width: '40%', padding: '4px', borderRight: '1px solid #000', verticalAlign: 'top', lineHeight: '1.4' }}>
                <div>3. Dept/Bagian/CV : <strong><V v={permit.departemen} /></strong></div>
                <div style={{ marginTop: '2px' }}>4. Lokasi Area Kerja : <strong><V v={permit.lokasi} /></strong></div>
              </td>
              <td style={{ width: '20%', padding: '4px', verticalAlign: 'top', textAlign: 'center' }}>
                <div style={{ fontWeight: 'bold', marginBottom: '2px', fontSize: '6.5px' }}>No. Permit GWP :</div>
                <div style={{ border: '1.5px solid #000', padding: '3px 5px', fontWeight: 'bold', display: 'inline-block', fontSize: '8.5px', minWidth: '80px' }}>
                  <V v={det.nomor_gwp || permit.permit_number} />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* B. Identitas Pekerjaan */}
      <div style={S.section}>
        <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #000', fontSize: '7.5px', marginBottom: '4px' }}>
          <tbody>
            <tr>
              <td style={{ borderBottom: '1px solid #000', padding: '3px 4px', fontWeight: 'bold', textDecoration: 'underline', textTransform: 'uppercase' }}>
                B. Identitas Pekerjaan
              </td>
            </tr>
            <tr>
              <td style={{ padding: '4px', borderBottom: '1px solid #000', lineHeight: '1.3' }}>
                <div style={{ fontWeight: 'bold', marginBottom: '2px' }}>Deskripsi jenis pekerjaan :</div>
                <div style={{ paddingLeft: '6px', minHeight: '20px', whiteSpace: 'pre-wrap' }}><V v={det.deskripsi_pekerjaan || permit.deskripsi} /></div>
              </td>
            </tr>
            <tr>
              <td style={{ padding: '4px', lineHeight: '1.3' }}>
                <div style={{ fontWeight: 'bold', marginBottom: '2px' }}>Peralatan yang akan dipergunakan :</div>
                <div style={{ paddingLeft: '6px', minHeight: '20px', whiteSpace: 'pre-wrap' }}><V v={det.peralatan} /></div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* C. Kategori Resiko Pekerjaan */}
      <div style={S.section}>
        <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #000', fontSize: '7.5px', marginBottom: '4px' }}>
          <tbody>
            <tr>
              <td colSpan={2} style={{ borderBottom: '1px solid #000', padding: '3px 4px', fontWeight: 'bold', textDecoration: 'underline', textTransform: 'uppercase' }}>
                C. Kategori Resiko Pekerjaan
              </td>
            </tr>
            <tr>
              <td style={{ width: '50%', padding: '4px', borderRight: '1px solid #000' }}>
                Kategori resiko pekerjaan berdasarkan : <strong>Job Safety Analysis (JSA)</strong>
              </td>
              <td style={{ width: '50%', padding: '4px' }}>
                <span style={{ marginRight: '12px' }}>JSA Dilakukan: <strong><Ck v={det.jsa_dilakukan} /></strong></span>
                <span>Kategori Risiko: <strong><V v={det.kategori_risiko} /></strong></span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* D. Daftar Keselamatan */}
      <div style={S.section}>
        <div style={S.sectionTitle}>D. Daftar Keselamatan</div>
        <table style={S.chkTbl}>
          <thead><tr>
            <th style={{ ...S.chkTh, width: '42%' }}>Daftar Check Untuk Pemohon Izin</th>
            <th style={{ ...S.chkTh, width: '8%', textAlign: 'center' }}>Ö</th>
            <th style={{ ...S.chkTh, width: '42%' }}>Daftar Check Untuk HSE</th>
            <th style={{ ...S.chkTh, width: '8%', textAlign: 'center' }}>Ö</th>
          </tr></thead>
          <tbody>
            {CP.map((item, i) => (
              <tr key={i}>
                <td style={S.chkTd}>{item}</td>
                <td style={{ ...S.chkTd, textAlign: 'center' }}>{pc.includes(item) ? '☑' : '☐'}</td>
                <td style={S.chkTd}>{CH[i] || ''}</td>
                <td style={{ ...S.chkTd, textAlign: 'center' }}>{CH[i] && hc.includes(CH[i]) ? '☑' : '☐'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* E. Peralatan Keamanan (APD) */}
      <div style={S.section}>
        <div style={S.sectionTitle}>E. Peralatan Keamanan (APD)</div>
        <table style={S.chkTbl}>
          <thead><tr>
            <th style={{ ...S.chkTh, width: '42%' }}>Peralatan Keamanan</th>
            <th style={{ ...S.chkTh, width: '8%', textAlign: 'center' }}>Ö</th>
            <th style={{ ...S.chkTh, width: '42%' }}>Peralatan Keamanan</th>
            <th style={{ ...S.chkTh, width: '8%', textAlign: 'center' }}>Ö</th>
          </tr></thead>
          <tbody>
            {Array.from({ length: Math.ceil(PPE.length / 2) }, (_, i) => {
              const l = PPE[i * 2], r = PPE[i * 2 + 1];
              return (
                <tr key={i}>
                  <td style={S.chkTd}>{l}</td>
                  <td style={{ ...S.chkTd, textAlign: 'center' }}>{pp.includes(l) ? '☑' : '☐'}</td>
                  <td style={S.chkTd}>{r || ''}</td>
                  <td style={{ ...S.chkTd, textAlign: 'center' }}>{r && pp.includes(r) ? '☑' : '☐'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* F. Persetujuan Izin */}
      <div style={S.section}>
        <div style={S.sectionTitle}>F. Persetujuan Izin</div>
        <table style={S.appTbl}>
          <thead><tr>
            <th style={{ ...S.appTh, width: '16%' }}>Keterangan</th>
            <th style={{ ...S.appTh, width: '28%' }}>Pernyataan</th>
            <th style={{ ...S.appTh, width: '14%' }}>Tanggal</th>
            <th style={{ ...S.appTh, width: '16%' }}>Nama</th>
            <th style={{ ...S.appTh, width: '16%' }}>Jabatan</th>
            <th style={{ ...S.appTh, width: '10%' }}>Paraf</th>
          </tr></thead>
          <tbody>
            <tr>
              <td style={{ ...S.appTd, fontWeight: 600 }}>A. Pemohon Izin</td>
              <td style={{ ...S.appTd, ...S.appDeclaration }}>Bahwa saya akan melakukan pekerjaan yang telah diinstruksikan dan bekerja sesuai dengan prosedur</td>
              <td style={S.appTd}><V v={det.persetujuan_pemohon_tanggal} /></td>
              <td style={S.appTd}><V v={det.persetujuan_pemohon_nama} /></td>
              <td style={S.appTd}><V v={det.persetujuan_pemohon_jabatan} /></td>
              <td style={S.appTd}><V v={det.persetujuan_pemohon_paraf} /></td>
            </tr>
            <tr>
              <td style={{ ...S.appTd, fontWeight: 600 }}>B. Pemilik Lokasi</td>
              <td style={{ ...S.appTd, ...S.appDeclaration }}>Saya telah melakukan pemeriksaan terhadap lokasi ini dan pekerjaan ini dapat dilakukan</td>
              <td style={S.appTd}><V v={det.persetujuan_pemilik_lokasi_tanggal} /></td>
              <td style={S.appTd}><V v={det.persetujuan_pemilik_lokasi_nama} /></td>
              <td style={S.appTd}><V v={det.persetujuan_pemilik_lokasi_jabatan} /></td>
              <td style={S.appTd}><V v={det.persetujuan_pemilik_lokasi_paraf} /></td>
            </tr>
            <tr>
              <td style={{ ...S.appTd, fontWeight: 600 }}>C. Pemberi Izin</td>
              <td style={{ ...S.appTd, ...S.appDeclaration }}>Saya telah memastikan pekerjaan ini dapat dilakukan dengan aman</td>
              <td style={S.appTd}><V v={det.persetujuan_pemberi_izin_tanggal} /></td>
              <td style={S.appTd}><V v={det.persetujuan_pemberi_izin_nama} /></td>
              <td style={S.appTd}><V v={det.persetujuan_pemberi_izin_jabatan} /></td>
              <td style={S.appTd}><V v={det.persetujuan_pemberi_izin_paraf} /></td>
            </tr>
            <tr>
              <td style={{ ...S.appTd, fontWeight: 600 }} rowSpan={3}>D. Mengetahui</td>
              <td style={S.appTd}>HSE Admin/Inspektor</td>
              <td style={S.appTd}><V v={det.mengetahui_hse_tanggal} /></td>
              <td style={S.appTd}><V v={det.mengetahui_hse_nama} /></td>
              <td style={S.appTd}><V v={det.mengetahui_hse_jabatan} /></td>
              <td style={S.appTd}><V v={det.mengetahui_hse_paraf} /></td>
            </tr>
            <tr>
              <td style={S.appTd}>Asisten HSSE</td>
              <td style={S.appTd}><V v={det.mengetahui_asisten_hse_tanggal} /></td>
              <td style={S.appTd}><V v={det.mengetahui_asisten_hse_nama} /></td>
              <td style={S.appTd}><V v={det.mengetahui_asisten_hse_jabatan} /></td>
              <td style={S.appTd}><V v={det.mengetahui_asisten_hse_paraf} /></td>
            </tr>
            <tr>
              <td style={S.appTd}>Kasubag Sistem &amp; IT</td>
              <td style={S.appTd}><V v={det.mengetahui_kasubag_sit_tanggal} /></td>
              <td style={S.appTd}><V v={det.mengetahui_kasubag_sit_nama} /></td>
              <td style={S.appTd}><V v={det.mengetahui_kasubag_sit_jabatan} /></td>
              <td style={S.appTd}><V v={det.mengetahui_kasubag_sit_paraf} /></td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* G. Validasi Ulang */}
      <div style={S.section}>
        <div style={S.sectionTitle}>G. Validasi Ulang</div>
        <p style={{ fontSize: '5.5px', fontStyle: 'italic', color: '#888', margin: '0 0 2px' }}>
          Penilaian pada awal shift kerja berikutnya - Izin kerja Umum hanya berlaku 1 hari (3 shift)
        </p>
        <table style={S.chkTbl}>
          <thead><tr>
            <th style={{ ...S.chkTh, width: '4%' }}>No</th>
            <th style={{ ...S.chkTh, width: '4%', textAlign: 'center' }}>1</th>
            <th style={{ ...S.chkTh, width: '4%', textAlign: 'center' }}>2</th>
            <th style={{ ...S.chkTh, width: '4%', textAlign: 'center' }}>3</th>
            <th style={{ ...S.chkTh, width: '14%' }}>Pemohon</th>
            <th style={{ ...S.chkTh, width: '14%' }}>Pemilik Lokasi</th>
            <th style={{ ...S.chkTh, width: '14%' }}>Pemberi Izin</th>
            <th style={{ ...S.chkTh, width: '12%' }}>Tanggal</th>
            <th style={{ ...S.chkTh, width: '8%' }}>Pukul</th>
            <th style={{ ...S.chkTh, width: '10%' }}>Paraf</th>
          </tr></thead>
          <tbody>
            {[1, 2, 3].map((r) => (
              <tr key={r}>
                <td style={{ ...S.chkTd, textAlign: 'center', fontWeight: 600 }}>{r}</td>
                <td style={{ ...S.chkTd, textAlign: 'center' }}>{det[`validasi_shift_${r}`] === '1' ? '◉' : '○'}</td>
                <td style={{ ...S.chkTd, textAlign: 'center' }}>{det[`validasi_shift_${r}`] === '2' ? '◉' : '○'}</td>
                <td style={{ ...S.chkTd, textAlign: 'center' }}>{det[`validasi_shift_${r}`] === '3' ? '◉' : '○'}</td>
                <td style={S.chkTd}><V v={det[`validasi_pemohon_${r}`]} /></td>
                <td style={S.chkTd}><V v={det[`validasi_pemilik_lokasi_${r}`]} /></td>
                <td style={S.chkTd}><V v={det[`validasi_pemberi_izin_${r}`]} /></td>
                <td style={S.chkTd}><V v={det[`validasi_tanggal_${r}`]} /></td>
                <td style={S.chkTd}><V v={det[`validasi_pukul_${r}`]} /></td>
                <td style={S.chkTd}><V v={det[`validasi_paraf_${r}`]} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

/* =================================================================
   HWP - Hot Work Permit (Izin Kerja Panas)
   Source: hwp.xlsx (HWP-OK)
   ================================================================= */
function HwpPrint({ det, permit }: { det: Record<string, unknown>; permit: Permit }) {
  const B1 = ['Flames/Welding/Percikan Api (Sparks)', 'Produk Mudah Terbakar (Flammable products)', 'Spontaneous Fire/Ignition', 'CO, H2O, Asphyxia/Intoxication', 'Toxic/Produk Korosif', 'Gas/Cairan dalam wadah bertekanan', 'Isolasi dengan blind flange sederhana', 'Lainnya'];
  const B2 = ['Terdapat Area Kerja yang Berdekatan', 'Penghilangan Kisi/Pegangan Tangan', 'Area dibawah Resiko Spesifik', 'Kebisingan', 'Radiasi', 'Keberadaan Kabel/Pipa', 'Peralatan Bertegangan', 'Panel Bertegangan', 'Temperatur Tinggi/Rendah', 'Bahaya Biologi'];
  const B3 = ['Bagian Bergerak/Berputar', 'Kondisi Cuaca', 'Bekerja dengan Alat Berat', 'Pengangkatan Kritis', 'Bekerja dekat Pinggiran Air', 'Bekerja didalam Galian', 'Area Terbatas', 'Bekerja Pada Ketinggian (>1.8m)', 'Bekerja pada Temporary Platform', 'Memerlukan Scaffolding Tube >3m'];
  const PPE = ['Safety shoes', 'Helmet', 'Safety Glasses', 'High Reflective Vest', 'Pakaian Lengan Panjang', 'PVC Gloves', 'SCBA', 'Dust Mask', 'Face Shield', 'Alat Pelindung Pendengaran', 'Full Body Overall', 'Pakaian Overall untuk Chemicals', 'Full Body Harness', 'Life Lines', 'Life Jacket', 'Individual Gas Tester', 'Goggles', 'Welding Mask', 'HEPA Mask', '*PPE Khusus (Katun, Antistatik)'];
  const PER = ['Fire Fighting Equipment', 'Peralatan Emergency', 'Penerangan Tambahan Temporary', 'Tersedia Akses Jalan', 'Safety Sign/Barikade', 'Alat Komunikasi untuk Keamanan', 'Selimut Api/Fire Blanket', 'PPE Khusus Untuk Area Spesifik'];
  const PSY = ['Diperlukan Fire Watchman', 'Pengujian Gas', 'Pengujian Gas Secara Kontinyu', 'Peralatan Penekan/Pembuang Udara', 'Berventilasi Alami/Mekanik', 'Peralatan Penguras', 'Pemurnian Gas Inert', 'Monitoring HSE Permanen', 'Larangan Bekerja Sendirian', 'Isolasi Elektrikal/Lock-Out', 'Isolasi Mekanikal/Lock-Out', 'Area Bebas Bahan Mudah Terbakar', 'Pemantauan Area Masuk/Entry Watch', 'Monitoring Permanen (Ruang Terbatas)'];
  const bh = (det.bahaya_checklist as string[]) || [];
  const ppe = (det.ppe_checklist as string[]) || [];
  const per = (det.peralatan_lain_checklist as string[]) || [];
  const psy = (det.persyaratan_lain_checklist as string[]) || [];
  return (
    <>
      <div style={S.section}>
        <div style={S.sectionTitle}>SECTION A: Identifikasi Skope Pekerjaan</div>
        <table style={S.tbl}><tbody>
          <tr><td style={S.lbl}>No. Permit HWP</td><td style={S.val}><V v={det.no_permit_hwp} /></td><td style={S.lbl}>Shift Kerja</td><td style={S.val}><V v={det.shift} /></td></tr>
          <tr><td style={S.lbl}>Tanggal Permohonan</td><td style={S.val}><V v={det.tanggal_permohonan} /></td><td style={S.lbl}>Jam Kerja</td><td style={S.val}><V v={det.jam_mulai} /> - <V v={det.jam_selesai} /></td></tr>
          <tr><td style={S.lbl}>Pemohon Izin</td><td style={S.val}><V v={det.pemohon_izin_oleh} /></td><td style={S.lbl}>Perusahaan</td><td style={S.val}><V v={det.nama_perusahaan} /></td></tr>
          <tr><td style={S.lbl}>Penanggung Jawab</td><td style={S.val}><V v={det.penanggung_jawab} /></td><td style={S.lbl}>Position</td><td style={S.val}><V v={det.position} /></td></tr>
          <tr><td style={S.lbl}>Jumlah Pekerja</td><td style={S.val}><V v={det.jumlah_pekerja} /> Orang</td><td style={S.lbl}>Lokasi</td><td style={S.val}><V v={permit.lokasi} /></td></tr>
          <tr><td style={S.lbl}>Equipment/Tools</td><td style={S.val} colSpan={3}><V v={det.equipment_tools} /></td></tr>
        </tbody></table>
      </div>

      <div style={S.section}>
        <div style={S.sectionTitle}>SECTION B: Analisa Bahaya Terkait</div>
        <table style={S.chkTbl}>
          <thead><tr>
            <th style={{ ...S.chkTh, width: '4%', textAlign: 'center' }}>Ö</th>
            <th style={{ ...S.chkTh, width: '29%' }}>Kolom 1</th>
            <th style={{ ...S.chkTh, width: '4%', textAlign: 'center' }}>Ö</th>
            <th style={{ ...S.chkTh, width: '29%' }}>Kolom 2</th>
            <th style={{ ...S.chkTh, width: '4%', textAlign: 'center' }}>Ö</th>
            <th style={{ ...S.chkTh, width: '30%' }}>Kolom 3</th>
          </tr></thead>
          <tbody>
            {Array.from({ length: Math.max(B1.length, B2.length, B3.length) }, (_, i) => (
              <tr key={i}>
                <td style={{ ...S.chkTd, textAlign: 'center' }}>{B1[i] && bh.includes(B1[i]) ? '☑' : '☐'}</td>
                <td style={S.chkTd}>{B1[i] || ''}</td>
                <td style={{ ...S.chkTd, textAlign: 'center' }}>{B2[i] && bh.includes(B2[i]) ? '☑' : '☐'}</td>
                <td style={S.chkTd}>{B2[i] || ''}</td>
                <td style={{ ...S.chkTd, textAlign: 'center' }}>{B3[i] && bh.includes(B3[i]) ? '☑' : '☐'}</td>
                <td style={S.chkTd}>{B3[i] || ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p style={{ fontSize: '6px', margin: '2px 0 0' }}>
          <b>Bersinggungan dengan Izin Kerja Lain:</b> <V v={det.bersinggungan_izin} />
          {det.bersinggungan_izin === 'ya' && <>&nbsp;&bull; <b>Nomor Izin Lain:</b> <V v={det.nomor_izin_lain} /></>}
        </p>
      </div>

      <div style={S.section}>
        <div style={S.sectionTitle}>SECTION C: PPE &amp; Peralatan</div>
        <table style={S.chkTbl}>
          <thead><tr>
            <th style={{ ...S.chkTh, width: '4%', textAlign: 'center' }}>Ö</th>
            <th style={{ ...S.chkTh, width: '28%' }}>Alat Pelindung Pribadi (PPE)</th>
            <th style={{ ...S.chkTh, width: '4%', textAlign: 'center' }}>Ö</th>
            <th style={{ ...S.chkTh, width: '28%' }}>Peralatan Lainnya</th>
            <th style={{ ...S.chkTh, width: '4%', textAlign: 'center' }}>Ö</th>
            <th style={{ ...S.chkTh, width: '32%' }}>Persyaratan Lainnya</th>
          </tr></thead>
          <tbody>
            {Array.from({ length: Math.max(PPE.length, PER.length, PSY.length) }, (_, i) => (
              <tr key={i}>
                <td style={{ ...S.chkTd, textAlign: 'center' }}>{PPE[i] && ppe.includes(PPE[i]) ? '☑' : '☐'}</td>
                <td style={S.chkTd}>{PPE[i] || ''}</td>
                <td style={{ ...S.chkTd, textAlign: 'center' }}>{PER[i] && per.includes(PER[i]) ? '☑' : '☐'}</td>
                <td style={S.chkTd}>{PER[i] || ''}</td>
                <td style={{ ...S.chkTd, textAlign: 'center' }}>{PSY[i] && psy.includes(PSY[i]) ? '☑' : '☐'}</td>
                <td style={S.chkTd}>{PSY[i] || ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={S.section}>
        <div style={S.sectionTitle}>SECTION D: Instruksi Tambahan</div>
        <table style={S.tbl}><tbody>
          <tr><td style={S.lbl}>Instruksi Tambahan</td><td style={S.val}><V v={det.instruksi_tambahan} /></td><td style={S.lbl}>Mitigasi Bahaya</td><td style={S.val}><Ck v={det.mitigasi_bahaya} /></td></tr>
        </tbody></table>
      </div>

      <div style={S.section}>
        <div style={S.sectionTitle}>SECTION E: Persetujuan Izin Kerja</div>
        <table style={S.appTbl}>
          <thead><tr>
            <th style={{ ...S.appTh, width: '22%' }}>Keterangan</th>
            <th style={{ ...S.appTh, width: '14%' }}>Tanggal</th>
            <th style={{ ...S.appTh, width: '34%' }}>Nama</th>
            <th style={{ ...S.appTh, width: '15%' }}>Paraf/Sign</th>
          </tr></thead>
          <tbody>
            <tr><td style={{ ...S.appTd, fontWeight: 600 }}>A. Pemohon Izin (Foreman/Spv)</td><td style={S.appTd}><V v={det.persetujuan_a_tanggal} /></td><td style={S.appTd}><V v={det.persetujuan_a_nama} /></td><td style={S.appTd}><V v={det.persetujuan_a_paraf} /></td></tr>
            <tr><td style={{ ...S.appTd, fontWeight: 600 }}>B. Pemilik Lokasi (Spv/SPI)</td><td style={S.appTd}><V v={det.persetujuan_b_tanggal} /></td><td style={S.appTd}><V v={det.persetujuan_b_nama} /></td><td style={S.appTd}><V v={det.persetujuan_b_paraf} /></td></tr>
            <tr>
              <td style={{ ...S.appTd, fontWeight: 600 }} rowSpan={2}>C. Pemberi Izin</td>
              <td style={S.appTd}><V v={det.persetujuan_c_admin_tanggal} /></td>
              <td style={S.appTd}>HSE Foreman/Spv: <V v={det.persetujuan_c_admin_nama} /></td>
              <td style={S.appTd}></td>
            </tr>
            <tr>
              <td style={S.appTd}><V v={det.persetujuan_c_asisten_tanggal} /></td>
              <td style={S.appTd}>HSE SPI: <V v={det.persetujuan_c_asisten_nama} /></td>
              <td style={S.appTd}></td>
            </tr>
            <tr>
              <td style={{ ...S.appTd, fontWeight: 600 }} rowSpan={2}>D. Mengetahui</td>
              <td style={S.appTd}><V v={det.persetujuan_d_kasubag_tanggal} /></td>
              <td style={S.appTd}>Kasubag Sistem &amp; IT: <V v={det.persetujuan_d_kasubag_nama} /></td>
              <td style={S.appTd}></td>
            </tr>
            <tr>
              <td style={S.appTd}><V v={det.persetujuan_d_manager_tanggal} /></td>
              <td style={S.appTd}>Manager: <V v={det.persetujuan_d_manager_nama} /></td>
              <td style={S.appTd}></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div style={S.section}>
        <div style={S.sectionTitle}>SECTION F: Gas Testing</div>
        <table style={S.tbl}><tbody>
          <tr><td style={S.lbl}>Atmospheric Testing</td><td style={S.val}><V v={det.atmospheric_testing} /></td><td style={S.lbl}>Gas Tester</td><td style={S.val}><V v={det.gas_tester} /></td></tr>
          <tr><td style={S.lbl}>%LEL</td><td style={S.val}><V v={det.hasil_gas_lel} /></td><td style={S.lbl}>Tanggal/Waktu</td><td style={S.val}><V v={det.gas_tanggal} /> <V v={det.gas_waktu} /></td></tr>
          <tr><td style={S.lbl}>Fire Watcher</td><td style={S.val}><V v={det.fire_watcher_nama} /></td><td style={S.lbl}>Perpanjangan</td><td style={S.val}><V v={det.perpanjangan_mulai} /> s.d <V v={det.perpanjangan_sampai} /></td></tr>
        </tbody></table>
      </div>
    </>
  );
}

/* =================================================================
   CSE - Confined Space Entry
   Source: cse.xlsx (CSE (1)-ok)
   ================================================================= */
function CsePrint({ det, permit }: { det: Record<string, unknown>; permit: Permit }) {
  const CHK = ['Semua ketentuan dan persyaratan sesuai Izin Kerja terkait', 'Pengawasan Area Masuk', 'Alat PPE dan/atau pakaian khusus', 'Alat pelindung pernapasan', 'Tanda larangan sebagai barikade area kerja', 'Rencana penyelamatan telah disiapkan', 'Pencahayaan, Ventilasi', 'Isolasi/Peralatan pengaman (LOTO)', 'Lainnya'];
  const ck = (det.checklist_persyaratan as string[]) || [];
  const daftar = (det.daftar_orang as Array<{ nama: string; masuk: string; keluar: string }>) || [];
  return (
    <>
      <div style={S.section}>
        <div style={S.sectionTitle}>Section A - Diisi oleh Pemohon Izin</div>
        <table style={S.tbl}><tbody>
          <tr><td style={S.lbl}>No. Permit CSE</td><td style={S.val}><V v={det.no_permit_cse} /></td><td style={S.lbl}>No. Izin Kerja Umum</td><td style={S.val}><V v={det.no_izin_kerja_umum} /></td></tr>
          <tr><td style={S.lbl}>Tanggal</td><td style={S.val}>{permit.tanggal}</td><td style={S.lbl}>Pemohon Izin</td><td style={S.val}><V v={det.pemohon_izin} /></td></tr>
          <tr><td style={S.lbl}>Perusahaan</td><td style={S.val}><V v={det.perusahaan} /></td><td style={S.lbl}>Fasilitas</td><td style={S.val}><V v={det.fasilitas} /></td></tr>
          <tr><td style={S.lbl}>Jumlah Pekerja</td><td style={S.val}><V v={det.jumlah_pekerja} /></td><td style={S.lbl}>Peralatan/Area</td><td style={S.val}><V v={det.nama_peralatan_area} /></td></tr>
          <tr><td style={S.lbl}>Jam Masuk</td><td style={S.val}><V v={det.jam_masuk} /></td><td style={S.lbl}>Jam Keluar</td><td style={S.val}><V v={det.jam_keluar} /></td></tr>
          <tr><td style={S.lbl}>Alasan Masuk</td><td style={S.val} colSpan={3}><V v={det.alasan_memasuki} /></td></tr>
        </tbody></table>
      </div>

      <div style={S.section}>
        <div style={S.sectionTitle}>Instrumen Penguji Gas</div>
        <table style={S.tbl}><tbody>
          <tr><td style={S.lbl}>Nama Instrumen</td><td style={S.val}><V v={det.instrumen_gas} /></td><td style={S.lbl}>Terakhir Dikalibrasi</td><td style={S.val}><V v={det.tanggal_kalibrasi} /></td></tr>
          <tr><td style={S.lbl}>Kondisi Sebelumnya</td><td style={S.val} colSpan={3}><V v={det.kondisi_sebelumnya} /></td></tr>
        </tbody></table>
      </div>

      <div style={S.section}>
        <div style={S.sectionTitle}>Hasil Pengujian Gas</div>
        <table style={S.chkTbl}>
          <thead><tr>
            <th style={S.chkTh}>Waktu</th>
            <th style={S.chkTh}>%LEL</th>
            <th style={S.chkTh}>%O2</th>
            <th style={S.chkTh}>PPM H2S</th>
            <th style={S.chkTh}>Lainnya</th>
            <th style={S.chkTh}>AGT Initials</th>
          </tr></thead>
          <tbody>
            {((det as any).hasil_pengujian_gas as any[] || []).length > 0
              ? ((det as any).hasil_pengujian_gas as any[]).map((row: any, i: number) => (
                  <tr key={i}>
                    <td style={S.chkTd}><V v={row.waktu} /></td>
                    <td style={S.chkTd}><V v={row.lel} /></td>
                    <td style={S.chkTd}><V v={row.o2} /></td>
                    <td style={S.chkTd}><V v={row.h2s} /></td>
                    <td style={S.chkTd}><V v={row.lainnya} /></td>
                    <td style={S.chkTd}><V v={row.agt_initials} /></td>
                  </tr>
                ))
              : (
                <>
                  <tr>
                    <td style={S.chkTd}><V v={det.gas_waktu_1} /></td>
                    <td style={S.chkTd}><V v={det.hasil_gas_lel_1} /></td>
                    <td style={S.chkTd}><V v={det.hasil_gas_o2_1} /></td>
                    <td style={S.chkTd}><V v={det.hasil_gas_h2s_1} /></td>
                    <td style={S.chkTd}><V v={det.hasil_gas_lainnya_1} /></td>
                    <td style={S.chkTd}><V v={det.agt_initials_1} /></td>
                  </tr>
                  <tr>
                    <td style={S.chkTd}><V v={det.gas_waktu_2} /></td>
                    <td style={S.chkTd}><V v={det.hasil_gas_lel_2} /></td>
                    <td style={S.chkTd}><V v={det.hasil_gas_o2_2} /></td>
                    <td style={S.chkTd}><V v={det.hasil_gas_h2s_2} /></td>
                    <td style={S.chkTd}><V v={det.hasil_gas_lainnya_2} /></td>
                    <td style={S.chkTd}><V v={det.agt_initials_2} /></td>
                  </tr>
                </>
              )
            }
          </tbody>
        </table>
        <p style={{ fontSize: '6px', margin: '2px 0 0' }}>
          <Ck v={det.peningkatan_frekuensi} /> Peningkatan Frekuensi &nbsp;&nbsp;
          <Ck v={det.pengujian_kontinyu} /> Pengujian Gas Kontinyu
        </p>
      </div>

      {daftar.length > 0 && (
        <div style={S.section}>
          <div style={S.sectionTitle}>Daftar Orang yang Memasuki Ruang Terbatas</div>
          <table style={S.chkTbl}>
            <thead><tr>
              <th style={{ ...S.chkTh, width: '40%' }}>Nama</th>
              <th style={{ ...S.chkTh, width: '30%' }}>Waktu Masuk</th>
              <th style={{ ...S.chkTh, width: '30%' }}>Waktu Keluar</th>
            </tr></thead>
            <tbody>
              {daftar.map((o, i) => (
                <tr key={i}><td style={S.chkTd}>{o.nama}</td><td style={S.chkTd}>{o.masuk}</td><td style={S.chkTd}>{o.keluar}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div style={S.section}>
        <div style={S.sectionTitle}>Section B - Diisi oleh Pemberi Izin</div>
        <table style={S.chkTbl}>
          <thead><tr>
            <th style={{ ...S.chkTh, width: '5%' }}>No</th>
            <th style={{ ...S.chkTh, width: '55%' }}>Persyaratan</th>
            <th style={{ ...S.chkTh, width: '12%', textAlign: 'center' }}>Ya/Tidak</th>
            <th style={{ ...S.chkTh, width: '13%' }}>Inisial</th>
          </tr></thead>
          <tbody>
            {CHK.map((item, i) => (
              <tr key={i}>
                <td style={{ ...S.chkTd, textAlign: 'center' }}>{i + 1}</td>
                <td style={S.chkTd}>{item}</td>
                <td style={{ ...S.chkTd, textAlign: 'center' }}>{ck.includes(item) ? '☑' : '☐'}</td>
                <td style={S.chkTd}><V v={det[`checklist_inisial_${i}`]} /></td>
              </tr>
            ))}
          </tbody>
        </table>
        <table style={{ ...S.tbl, marginTop: '2px' }}><tbody>
          <tr><td style={S.lbl}>Alat Pernapasan</td><td style={S.val}><V v={det.nama_alat_pernapasan} /></td><td style={S.lbl}>Tambahan Kondisi Bahaya</td><td style={S.val}><V v={det.tambahan_kondisi_bahaya} /></td></tr>
        </tbody></table>
      </div>

      <div style={S.section}>
        <div style={S.sectionTitle}>Section C - Pengesahan</div>
        <table style={S.appTbl}>
          <thead><tr>
            <th style={{ ...S.appTh, width: '22%' }}>Pihak</th>
            <th style={{ ...S.appTh, width: '14%' }}>Tanggal</th>
            <th style={{ ...S.appTh, width: '34%' }}>Nama</th>
            <th style={{ ...S.appTh, width: '15%' }}>Paraf</th>
          </tr></thead>
          <tbody>
            <tr><td style={{ ...S.appTd, fontWeight: 600 }}>A. Pemohon Izin</td><td style={S.appTd}><V v={det.pengesahan_tgl_pemohon} /></td><td style={S.appTd}><V v={det.pengesahan_nama_pemohon} /></td><td style={S.appTd}><V v={det.pengesahan_paraf_pemohon} /></td></tr>
            <tr><td style={{ ...S.appTd, fontWeight: 600 }}>B. Pemilik Lokasi</td><td style={S.appTd}><V v={det.pengesahan_tgl_pemilik} /></td><td style={S.appTd}><V v={det.pengesahan_nama_pemilik} /></td><td style={S.appTd}><V v={det.pengesahan_paraf_pemilik} /></td></tr>
            <tr><td style={{ ...S.appTd, fontWeight: 600 }}>C. Pemberi Izin</td><td style={S.appTd}><V v={det.pengesahan_tgl_pemberi} /></td><td style={S.appTd}><V v={det.pengesahan_nama_pemberi} /></td><td style={S.appTd}><V v={det.pengesahan_paraf_pemberi} /></td></tr>
            <tr><td style={{ ...S.appTd, fontWeight: 600 }}>D. Mengetahui (HSE)</td><td style={S.appTd}><V v={det.mengetahui_tgl_hse} /></td><td style={S.appTd}><V v={det.mengetahui_nama_hse} /></td><td style={S.appTd}><V v={det.mengetahui_paraf_hse} /></td></tr>
            <tr><td style={{ ...S.appTd, fontWeight: 600 }}>D. Mengetahui (Asisten)</td><td style={S.appTd}><V v={det.mengetahui_tgl_asisten} /></td><td style={S.appTd}><V v={det.mengetahui_nama_asisten} /></td><td style={S.appTd}><V v={det.mengetahui_paraf_asisten} /></td></tr>
            <tr><td style={{ ...S.appTd, fontWeight: 600 }}>D. Mengetahui (Kasubag)</td><td style={S.appTd}><V v={det.mengetahui_tgl_kasubag} /></td><td style={S.appTd}><V v={det.mengetahui_nama_kasubag} /></td><td style={S.appTd}><V v={det.mengetahui_paraf_kasubag} /></td></tr>
          </tbody>
        </table>
      </div>
    </>
  );
}

/* =================================================================
   ELP - Electrical Work Permit (Izin Kerja Elektrikal)
   Source: elwp.xlsx (electrical LOTO (1)-OK)
   ================================================================= */
function ElpPrint({ det, permit }: { det: Record<string, unknown>; permit: Permit }) {
  const CHK = ['Breaker Mati', 'Racking out/Down Breaker', 'Shutters Terkunci + Nomor Padlock', 'Mengubah Main Isolator ke Keadaan Mati', 'C.B/Isolator Terkunci', 'Menghilangkan Sekring Utama', 'Memantau No. Voltase', 'Pembumian di Area Bilik', 'Pembumian Tambahan', 'Penghilangan Sekring Kendali', 'Padlock dan Taken terpasang', 'Tanda Peringatan Terpasang di Setiap Bilik', 'Sistem Penguncian Halon atau CO2', 'Isolasi Heater', 'Posisi dan Nomor Pembumian'];
  return (
    <>
      <div style={S.section}>
        <div style={S.sectionTitle}>1. Permintaan Isolasi</div>
        <table style={S.tbl}><tbody>
          <tr><td style={S.lbl}>No. Permit ELP</td><td style={S.val}><V v={det.no_permit_elp} /></td><td style={S.lbl}>Dept</td><td style={S.val}><V v={permit.departemen} /></td></tr>
          <tr><td style={S.lbl}>Tanggal</td><td style={S.val}>{permit.tanggal}</td><td style={S.lbl}>Shift Kerja</td><td style={S.val}><V v={det.shift_kerja} /></td></tr>
          <tr><td style={S.lbl}>Alat Isolasi</td><td style={S.val}><V v={det.alat_isolasi} /></td><td style={S.lbl}>Tag No.</td><td style={S.val}><V v={det.tag_no} /></td></tr>
          <tr><td style={S.lbl}>Sifat Pekerjaan</td><td style={S.val} colSpan={3}><V v={det.sifat_pekerjaan} /></td></tr>
        </tbody></table>
      </div>

      <div style={S.section}>
        <div style={S.sectionTitle}>2. Pekerjaan Isolasi Elektrikal</div>
        <table style={S.tbl}><tbody>
          <tr><td style={S.lbl}>PJ Elektrik</td><td style={S.val}><V v={det.pj_elektrik_1} /></td><td style={S.lbl}>Tipe Isolasi</td><td style={S.val}><V v={det.tipe_isolasi} /></td></tr>
          <tr><td style={S.lbl}>C/Breaker &amp; Lokasi</td><td style={S.val} colSpan={3}><V v={det.cb_isolasi_lokasi} /></td></tr>
        </tbody></table>
        <p style={{ fontSize: '6px', fontWeight: 700, margin: '2px 0 1px' }}>Isolasi Checklist:</p>
        <table style={S.chkTbl}>
          <thead><tr>
            <th style={{ ...S.chkTh, width: '5%' }}>No</th>
            <th style={{ ...S.chkTh, width: '60%' }}>Item</th>
            <th style={{ ...S.chkTh, width: '10%', textAlign: 'center' }}>YA</th>
            <th style={{ ...S.chkTh, width: '10%', textAlign: 'center' }}>TIDAK</th>
          </tr></thead>
          <tbody>
            {CHK.map((item, i) => (
              <tr key={i}>
                <td style={{ ...S.chkTd, textAlign: 'center' }}>{i + 1}</td>
                <td style={S.chkTd}>{item}</td>
                <td style={{ ...S.chkTd, textAlign: 'center' }}>{det[`checklist_${i}`] === true ? '◉' : '○'}</td>
                <td style={{ ...S.chkTd, textAlign: 'center' }}>{det[`checklist_${i}`] === false ? '◉' : '○'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={S.section}>
        <div style={S.sectionTitle}>Otorisasi Isolasi</div>
        <table style={S.tbl}><tbody>
          <tr><td style={S.lbl}>Nama</td><td style={S.val}><V v={det.otorisasi_isolasi_nama} /></td><td style={S.lbl}>Paraf</td><td style={S.val}><V v={det.otorisasi_isolasi_paraf} /></td></tr>
          <tr><td style={S.lbl}>Tanggal</td><td style={S.val}><V v={det.otorisasi_isolasi_tanggal} /></td><td style={S.lbl}>Waktu</td><td style={S.val}><V v={det.otorisasi_isolasi_waktu} /></td></tr>
        </tbody></table>
      </div>

      <div style={S.section}>
        <div style={S.sectionTitle}>Persetujuan</div>
        <table style={S.appTbl}>
          <thead><tr>
            <th style={{ ...S.appTh, width: '25%' }}>Pihak</th>
            <th style={{ ...S.appTh, width: '14%' }}>Tanggal</th>
            <th style={{ ...S.appTh, width: '31%' }}>Nama</th>
            <th style={{ ...S.appTh, width: '15%' }}>Paraf</th>
          </tr></thead>
          <tbody>
            <tr><td style={{ ...S.appTd, fontWeight: 600 }}>A. Penanggung Jawab Elektrik</td><td style={S.appTd}><V v={det.persetujuan_a_tanggal} /></td><td style={S.appTd}><V v={det.persetujuan_a_nama} /></td><td style={S.appTd}><V v={det.persetujuan_a_paraf} /></td></tr>
            <tr><td style={{ ...S.appTd, fontWeight: 600 }}>B. Pemilik Lokasi</td><td style={S.appTd}><V v={det.persetujuan_b_tanggal} /></td><td style={S.appTd}><V v={det.persetujuan_b_nama} /></td><td style={S.appTd}><V v={det.persetujuan_b_paraf} /></td></tr>
            <tr>
              <td style={{ ...S.appTd, fontWeight: 600 }} rowSpan={2}>C. Pemberi Izin</td>
              <td style={S.appTd}><V v={det.persetujuan_c_admin_tanggal} /></td>
              <td style={S.appTd}>HSE: <V v={det.persetujuan_c_admin_nama} /></td>
              <td style={S.appTd}></td>
            </tr>
            <tr>
              <td style={S.appTd}><V v={det.persetujuan_c_asisten_tanggal} /></td>
              <td style={S.appTd}>Asisten: <V v={det.persetujuan_c_asisten_nama} /></td>
              <td style={S.appTd}></td>
            </tr>
            <tr>
              <td style={{ ...S.appTd, fontWeight: 600 }} rowSpan={2}>D. Mengetahui</td>
              <td style={S.appTd}><V v={det.persetujuan_d_kasubag_tanggal} /></td>
              <td style={S.appTd}>Kasubag: <V v={det.persetujuan_d_kasubag_nama} /></td>
              <td style={S.appTd}></td>
            </tr>
            <tr>
              <td style={S.appTd}><V v={det.persetujuan_d_manager_tanggal} /></td>
              <td style={S.appTd}>Manager: <V v={det.persetujuan_d_manager_nama} /></td>
              <td style={S.appTd}></td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}

/* =================================================================
   EWP - Excavation Work Permit (Izin Kerja Pengalian)
   Source: ewp.xlsx (EWP (1)-ok)
   ================================================================= */
function EwpPrint({ det, permit }: { det: Record<string, unknown>; permit: Permit }) {
  const COL1 = ['Power Cables', 'Flooding/Banjir', 'Vehicular Traffic/Lalu Lintas Kendaraan', 'Sewer/Drainage Pipe Work (Saluran Air/Pipa)'];
  const COL2 = ['Proses Piping', 'Cave-in Potential/Potensi Terjebak', 'Noice/Kebisingan', 'Efek Getaran Akibat Penggalian'];
  const COL3 = ['Communication Cable', 'Bahan Mudah Terbakar/Beracun', 'Pengrusakan Alat/Pondasi', 'Terlampir Plot Plan Lokasi Pekerjaan'];
  const hazards = det.daftar_bahaya as string[] || [];

  return (
    <>
      <div style={S.section}>
        <div style={S.sectionTitle}>SECTION A: Permohonan Izin Kerja Galian (Diisi Oleh Pemohon Izin)</div>
        <table style={S.tbl}><tbody>
          <tr>
            <td style={{ ...S.lbl, width: '15%' }}>Nama</td>
            <td style={{ ...S.val, width: '30%' }}><V v={det.nama_pemohon} /></td>
            <td style={{ ...S.lbl, width: '15%' }}>Perusahaan</td>
            <td style={{ ...S.val, width: '40%' }}><V v={det.perusahaan} /></td>
          </tr>
          <tr>
            <td style={S.lbl}>Area/Lokasi Galian</td>
            <td style={S.val}><V v={permit.lokasi} /></td>
            <td style={S.lbl}>Metode</td>
            <td style={S.val}><V v={det.metode} /></td>
          </tr>
          <tr>
            <td style={S.lbl}>Masa Mulai</td>
            <td style={S.val}><V v={det.masa_mulai} /></td>
            <td style={S.lbl}>Masa Selesai</td>
            <td style={S.val}><V v={det.masa_selesai} /></td>
          </tr>
          <tr>
            <td style={S.lbl}>Dimensi (PxLxK)</td>
            <td style={S.val} colSpan={3}><V v={det.panjang} />m x <V v={det.lebar} />m x <V v={det.kedalaman} />m</td>
          </tr>
          <tr>
            <td style={S.lbl}>Uraian Pekerjaan</td>
            <td style={S.val} colSpan={3}><V v={det.uraian_pekerjaan} /></td>
          </tr>
        </tbody></table>
      </div>

      <div style={S.section}>
        <div style={S.sectionTitle}>SECTION B: Pemeriksaan Fasilitas Bawah Tanah (Diisi Oleh Technical Department/Civil/Electrical/Mechanical/HSE)</div>
        <p style={{ fontSize: '6px', margin: '0 0 2px' }}>
          <Ck v={det.tidak_ada_fasilitas} /> Tidak ada fasilitas tertanam dibawah tanah &nbsp;&nbsp;
          <Ck v={det.ada_fasilitas} /> Ada fasilitas bawah tanah, tandai dilapangan dan digambar (tulis detailnya)
        </p>
        <table style={S.tbl}><tbody>
          <tr>
            <td style={{ ...S.lbl, width: '30%' }}>Uraian Keterangan fasilitas dibawah lahan</td>
            <td style={{ ...S.val, width: '30%' }}><V v={det.detail_fasilitas} /></td>
            <td style={{ ...S.lbl, width: '20%' }}>Operating Pressure/Voltage</td>
            <td style={{ ...S.val, width: '20%' }}><V v={det.operating_pressure} /></td>
          </tr>
          <tr>
            <td style={S.lbl}>Kedalaman Fasilitas (m)</td>
            <td style={S.val}><V v={det.kedalaman_fasilitas} /></td>
            <td style={S.lbl}></td>
            <td style={S.val}></td>
          </tr>
        </tbody></table>
        <table style={{ ...S.tbl, marginTop: '2px' }}><tbody>
          <tr>
            <td style={{ ...S.lbl, width: '25%' }}>Gambar Diperiksa Oleh:</td>
            <td style={S.val}>Civil: <V v={det.civil_nama} /></td>
            <td style={S.val}>Electrical: <V v={det.electrical_nama} /></td>
            <td style={S.val}>Mechanical: <V v={det.mechanical_nama} /></td>
            <td style={S.val}>HSE: <V v={det.hse_dept_nama} /></td>
          </tr>
        </tbody></table>
      </div>

      <div style={S.section}>
        <div style={S.sectionTitle}>SECTION C: Bahaya-Bahaya Terkait untuk Pekerjaan Penggalian (Diisi Oleh Pemberi Izin)</div>
        <table style={S.chkTbl}>
          <thead><tr>
            <th style={{ ...S.chkTh, width: '4%', textAlign: 'center' }}>Ö</th>
            <th style={{ ...S.chkTh, width: '29%' }}>Kolom 1</th>
            <th style={{ ...S.chkTh, width: '4%', textAlign: 'center' }}>Ö</th>
            <th style={{ ...S.chkTh, width: '29%' }}>Kolom 2</th>
            <th style={{ ...S.chkTh, width: '4%', textAlign: 'center' }}>Ö</th>
            <th style={{ ...S.chkTh, width: '30%' }}>Kolom 3</th>
          </tr></thead>
          <tbody>
            {Array.from({ length: Math.max(COL1.length, COL2.length, COL3.length) }, (_, i) => (
              <tr key={i}>
                <td style={{ ...S.chkTd, textAlign: 'center' }}>{COL1[i] && hazards.includes(COL1[i]) ? '☑' : '☐'}</td>
                <td style={S.chkTd}>{COL1[i] || ''}</td>
                <td style={{ ...S.chkTd, textAlign: 'center' }}>{COL2[i] && hazards.includes(COL2[i]) ? '☑' : '☐'}</td>
                <td style={S.chkTd}>{COL2[i] || ''}</td>
                <td style={{ ...S.chkTd, textAlign: 'center' }}>{COL3[i] && hazards.includes(COL3[i]) ? '☑' : '☐'}</td>
                <td style={S.chkTd}>{COL3[i] || ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p style={{ fontSize: '6px', margin: '2px 0 0' }}><b>Lain-lain (Jelaskan):</b> <V v={det.bahaya_lainnya} /></p>
      </div>

      <div style={S.section}>
        <div style={S.sectionTitle}>SECTION D: Kewaspadaan yang Harus Dilakukan Terkait Penggalian (Diisi Oleh Pemberi Izin)</div>
        <table style={S.chkTbl}>
          <thead><tr>
            <th style={{ ...S.chkTh, width: '35%' }}>Kewaspadaan</th>
            <th style={{ ...S.chkTh, width: '10%', textAlign: 'center' }}>Ya</th>
            <th style={{ ...S.chkTh, width: '10%', textAlign: 'center' }}>Tidak</th>
            <th style={{ ...S.chkTh, width: '10%', textAlign: 'center' }}>N/A</th>
            <th style={{ ...S.chkTh, width: '35%' }}>Keterangan</th>
          </tr></thead>
          <tbody>
            {[
              { label: 'Mencegah agar Orang Tidak Tertimbun', items: ['Shoring/Landai', 'Trench Shield/Penahan', 'Sloping/Lereng', 'Benching/lereng bertingkat'], key: 'penimbunan' },
              { label: 'Pasang penahan banjir', items: null, key: 'banjir' },
              { label: 'Pondasi perlu penahan/support', items: null, key: 'pondasi' },
              { label: 'Standby Man diperlukan pada area bising', items: null, key: 'standby' },
              { label: 'Gali manual dgn hati-hati, perlahan-lahan', items: null, key: 'gali_manual' },
              { label: 'Servis yang Berlokasi di Bawah Tanah', items: null, key: 'servis_bawah' },
              { label: 'Process pipe perlu dimatikan, tekanan 0', items: null, key: 'process_pipe' },
              { label: 'Electrical services perlu dimatikan', items: null, key: 'electrical_services' },
            ].map((row, i) => (
              <tr key={i}>
                <td style={S.chkTd}>{row.label}</td>
                <td style={{ ...S.chkTd, textAlign: 'center' }}>{det[`${row.key}_ya`] ? '◉' : '○'}</td>
                <td style={{ ...S.chkTd, textAlign: 'center' }}>{det[`${row.key}_tidak`] ? '◉' : '○'}</td>
                <td style={{ ...S.chkTd, textAlign: 'center' }}>{det[`${row.key}_na`] ? '◉' : '○'}</td>
                <td style={S.chkTd}><V v={det[`${row.key}_lainnya`]} /></td>
              </tr>
            ))}
          </tbody>
        </table>
        <p style={{ fontSize: '6px', margin: '2px 0 0' }}>
          <b>Dokumen Pendukung:</b>&nbsp;
          <Ck v={det.doc_cse} /> Izin Masuk Ruang Terbatas &nbsp;
          <Ck v={det.doc_el_isolasi} /> Electrical Isolation Permit
        </p>
      </div>

      <div style={S.section}>
        <div style={S.sectionTitle}>SECTION E: Pengujian Gas/Gas Testing (Harus Dilaksanakan Penguji Gas yang Berwenang)</div>
        <p style={{ fontSize: '6px', margin: '0 0 2px' }}>
          Frekuensi:&nbsp;
          <Ck v={det.frekuensi_sekali} /> Sekali-sekali &nbsp;
          <Ck v={det.frekuensi_terus} /> Terus menerus &nbsp;
          <Ck v={det.frekuensi_sejam} /> Sejam Sekali &nbsp;
          <Ck v={det.frekuensi_tidak} /> Tidak Perlu
        </p>
        <table style={S.chkTbl}>
          <thead><tr>
            <th style={S.chkTh}>Tanggal</th>
            <th style={S.chkTh}>Jam</th>
            <th style={S.chkTh}>Nama</th>
            <th style={S.chkTh}>Tanda Tangan</th>
            <th style={S.chkTh}>O2%</th>
            <th style={S.chkTh}>%LEL</th>
            <th style={S.chkTh}>H2S (ppm)</th>
            <th style={S.chkTh}>Lainnya</th>
          </tr></thead>
          <tbody>
            {[1, 2, 3, 4].map((i) => (
              <tr key={i}>
                <td style={S.chkTd}><V v={det[`gas_tanggal_${i}`]} /></td>
                <td style={S.chkTd}><V v={det[`gas_jam_${i}`]} /></td>
                <td style={S.chkTd}><V v={det[`gas_nama_${i}`]} /></td>
                <td style={S.chkTd}><V v={det[`gas_tt_${i}`]} /></td>
                <td style={S.chkTd}><V v={det[`gas_o2_${i}`]} /></td>
                <td style={S.chkTd}><V v={det[`gas_lel_${i}`]} /></td>
                <td style={S.chkTd}><V v={det[`gas_h2s_${i}`]} /></td>
                <td style={S.chkTd}><V v={det[`gas_lainnya_${i}`]} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={S.section}>
        <div style={S.sectionTitle}>SECTION F: Validasi dan Kewenangan</div>
        <table style={S.appTbl}>
          <thead><tr>
            <th style={{ ...S.appTh, width: '22%' }}>Pihak</th>
            <th style={{ ...S.appTh, width: '14%' }}>Tanggal</th>
            <th style={{ ...S.appTh, width: '34%' }}>Nama</th>
            <th style={{ ...S.appTh, width: '15%' }}>Paraf</th>
          </tr></thead>
          <tbody>
            <tr><td style={{ ...S.appTd, fontWeight: 600 }}>A. Pemohon Izin</td><td style={S.appTd}><V v={det.pemohon_tanggal} /></td><td style={S.appTd}><V v={det.pemohon_nama} /></td><td style={S.appTd}><V v={det.pemohon_tt} /></td></tr>
            <tr><td style={{ ...S.appTd, fontWeight: 600 }}>B. Pemilik Lokasi</td><td style={S.appTd}><V v={det.pemilik_tanggal} /></td><td style={S.appTd}><V v={det.pemilik_nama} /></td><td style={S.appTd}><V v={det.pemilik_paraf} /></td></tr>
            <tr>
              <td style={{ ...S.appTd, fontWeight: 600 }}>C. Pemberi Izin</td>
              <td style={S.appTd} colSpan={3}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '6.5px' }}><tbody>
                  <tr>
                    <td style={{ padding: '1px 2px', fontWeight: 600, width: '25%' }}>HSSE Admin/Inspektor</td>
                    <td style={{ padding: '1px 2px', width: '25%' }}><V v={det.pemberi_admin_nama} /></td>
                    <td style={{ padding: '1px 2px', width: '25%' }}>Asisten HSSE</td>
                    <td style={{ padding: '1px 2px', width: '25%' }}><V v={det.pemberi_asisten_nama} /></td>
                  </tr>
                </tbody></table>
              </td>
            </tr>
            <tr>
              <td style={{ ...S.appTd, fontWeight: 600 }}>D. Mengetahui</td>
              <td style={S.appTd} colSpan={3}>
                <V v={det.mengetahui_kasubag_nama} /> (Kasubag Sistem &amp; IT)
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}

/* =================================================================
   LWP - Lifting Work Permit (Izin Kerja Critical Lifting)
   Source: lwp.xlsx (EWP indo (1)-ok)
   ================================================================= */
function LwpPrint({ det, permit }: { det: Record<string, unknown>; permit: Permit }) {
  return (
    <>
      <div style={S.section}>
        <div style={S.sectionTitle}>Informasi Umum</div>
        <table style={S.tbl}><tbody>
          <tr><td style={S.lbl}>No. Permit LWP</td><td style={S.val}><V v={det.no_permit_lwp} /></td><td style={S.lbl}>Dept</td><td style={S.val}><V v={permit.departemen} /></td></tr>
          <tr><td style={S.lbl}>Perusahaan/Kontraktor</td><td style={S.val}><V v={det.perusahaan} /></td><td style={S.lbl}>Tanggal</td><td style={S.val}>{permit.tanggal}</td></tr>
          <tr><td style={S.lbl}>Lokasi Pengangkatan</td><td style={S.val}><V v={permit.lokasi} /></td><td style={S.lbl}>Shift</td><td style={S.val}><V v={det.shift} /></td></tr>
          <tr><td style={S.lbl}>Pekerjaan</td><td style={S.val}><V v={det.pekerjaan} /></td><td style={S.lbl}>Benda Diangkat</td><td style={S.val}><V v={det.benda_diangkat} /></td></tr>
        </tbody></table>
      </div>

      <div style={S.section}>
        <div style={S.sectionTitle}>Informasi Crane</div>
        <table style={S.tbl}><tbody>
          <tr><td style={S.lbl}>Merek Crane</td><td style={S.val}><V v={det.merek_crane} /></td><td style={S.lbl}>Kapasitas</td><td style={S.val}><V v={det.kapasitas_crane} /></td></tr>
          <tr><td style={S.lbl}>Sertifikat Berlaku</td><td style={S.val}><Ck v={det.sertifikat_crane} /></td><td style={S.lbl}>SIO Operator</td><td style={S.val}><Ck v={det.sio_operator} /></td></tr>
        </tbody></table>
      </div>

      <div style={S.section}>
        <div style={S.sectionTitle}>Load Calculation</div>
        <table style={S.chkTbl}>
          <thead><tr><th style={{ ...S.chkTh, width: '50%' }}>Item</th><th style={{ ...S.chkTh, width: '50%' }}>Nilai (Kg)</th></tr></thead>
          <tbody>
            {[['load_weight','Load Weight'],['block_weight','Block Weight'],['spreader_beam_weight','Spreader Beam'],['rigging_weight','Rigging Weight'],['jib_weight','Jib Weight'],['jib_ball_weight','Jib Ball'],['hoist_line_weight','Hoist Line'],['total_load','Total Load']].map(([k, l]) => (
              <tr key={k}><td style={S.chkTd}>{l}</td><td style={S.chkTd}><V v={det[k]} /></td></tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={S.section}>
        <div style={S.sectionTitle}>Otorisasi Penandatanganan</div>
        <table style={S.appTbl}>
          <thead><tr><th style={{ ...S.appTh, width: '25%' }}>Pihak</th><th style={{ ...S.appTh, width: '25%' }}>Peran</th><th style={{ ...S.appTh, width: '50%' }}>Nama</th></tr></thead>
          <tbody>
            <tr><td style={{ ...S.appTd, fontWeight: 600 }} rowSpan={4}>Pemohon Izin</td><td style={S.appTd}>Operator/Crane 1</td><td style={S.appTd}><V v={det.tt_pemohon_op1} /></td></tr>
            <tr><td style={S.appTd}>Operator/Crane 2</td><td style={S.appTd}><V v={det.tt_pemohon_op2} /></td></tr>
            <tr><td style={S.appTd}>Supervisor/Foreman</td><td style={S.appTd}><V v={det.tt_pemohon_supervisor} /></td></tr>
            <tr><td style={S.appTd}>Competent Person</td><td style={S.appTd}><V v={det.tt_pemohon_cp} /></td></tr>
            <tr><td style={{ ...S.appTd, fontWeight: 600 }} rowSpan={5}>Pemberi Izin</td><td style={S.appTd}>Contractor Manager</td><td style={S.appTd}><V v={det.tt_pemberi_cm} /></td></tr>
            <tr><td style={S.appTd}>Superintendent</td><td style={S.appTd}><V v={det.tt_pemberi_supt} /></td></tr>
            <tr><td style={S.appTd}>Manager/Tim Leader</td><td style={S.appTd}><V v={det.tt_pemberi_manager} /></td></tr>
            <tr><td style={S.appTd}>Asisten HSSE</td><td style={S.appTd}><V v={det.tt_pemberi_hsse} /></td></tr>
            <tr><td style={S.appTd}>Kasubag Sistem &amp; IT</td><td style={S.appTd}><V v={det.tt_pemberi_it} /></td></tr>
          </tbody>
        </table>
      </div>
    </>
  );
}

/* =================================================================
   RWP - Radiography Work Permit (Izin Kerja Radiografi)
   Source: rwp.xlsx (EWP 1-Ok)
   ================================================================= */
function RwpPrint({ det, permit }: { det: Record<string, unknown>; permit: Permit }) {
  return (
    <>
      <div style={S.section}>
        <div style={S.sectionTitle}>SECTION A: Detail Pekerjaan</div>
        <table style={S.tbl}><tbody>
          <tr><td style={S.lbl}>No. Permit RWP</td><td style={S.val}><V v={det.no_permit_rwp} /></td><td style={S.lbl}>Dept</td><td style={S.val}><V v={permit.departemen} /></td></tr>
          <tr><td style={S.lbl}>Peralatan</td><td style={S.val}><V v={det.peralatan} /></td><td style={S.lbl}>Area</td><td style={S.val}><V v={det.area_radiasi} /></td></tr>
          <tr><td style={S.lbl}>Detail Pekerjaan</td><td style={S.val} colSpan={3}><V v={det.detail_pekerjaan_rwp} /></td></tr>
        </tbody></table>
      </div>

      <div style={S.section}>
        <div style={S.sectionTitle}>Pemohon Izin</div>
        <table style={S.tbl}><tbody>
          <tr><td style={S.lbl}>Nama</td><td style={S.val}><V v={det.pemohon_nama} /></td><td style={S.lbl}>Perusahaan</td><td style={S.val}><V v={det.pemohon_perusahaan} /></td></tr>
          <tr><td style={S.lbl}>Jabatan</td><td style={S.val}><V v={det.pemohon_jabatan} /></td><td style={S.lbl}>No. Badge</td><td style={S.val}><V v={det.pemohon_no_badge} /></td></tr>
        </tbody></table>
      </div>

      <div style={S.section}>
        <div style={S.sectionTitle}>SECTION B: Analisa Bahaya</div>
        <p style={{ fontSize: '6px', margin: '0 0 2px' }}><Ck v={det.jsa_diperlukan} /> JSA Diperlukan</p>
        <table style={S.tbl}><tbody>
          <tr><td style={S.lbl}>Jarak Barikade</td><td style={S.val}><V v={det.jarak_barikade} />m</td><td style={S.lbl}>Alat Komunikasi</td><td style={S.val}><V v={det.alat_komunikasi} /></td></tr>
          <tr><td style={S.lbl}>Tipe Sumber</td><td style={S.val}><V v={det.tipe_sumber} /></td><td style={S.lbl}>Ukuran Sumber</td><td style={S.val}><V v={det.ukuran_sumber} /></td></tr>
        </tbody></table>
      </div>

      <div style={S.section}>
        <div style={S.sectionTitle}>SECTION C: Pengesahan</div>
        <table style={S.appTbl}>
          <thead><tr>
            <th style={{ ...S.appTh, width: '25%' }}>Pihak</th>
            <th style={{ ...S.appTh, width: '25%' }}>Nama</th>
            <th style={{ ...S.appTh, width: '25%' }}>Tanda Tangan</th>
            <th style={{ ...S.appTh, width: '25%' }}>Tanggal</th>
          </tr></thead>
          <tbody>
            <tr><td style={{ ...S.appTd, fontWeight: 600 }}>Dari (Pembuat Izin)</td><td style={S.appTd}><V v={det.dari_pembuat_izin} /></td><td style={S.appTd}></td><td style={S.appTd}></td></tr>
            <tr><td style={{ ...S.appTd, fontWeight: 600 }}>Kepada (Pemohon)</td><td style={S.appTd}><V v={det.kepada_pemohon_izin} /></td><td style={S.appTd}></td><td style={S.appTd}></td></tr>
            <tr><td style={{ ...S.appTd, fontWeight: 600 }}>HSE</td><td style={S.appTd}><V v={det.diketahui_hse} /></td><td style={S.appTd}></td><td style={S.appTd}></td></tr>
            <tr><td style={{ ...S.appTd, fontWeight: 600 }}>QC</td><td style={S.appTd}><V v={det.diketahui_qc} /></td><td style={S.appTd}></td><td style={S.appTd}></td></tr>
          </tbody>
        </table>
      </div>
    </>
  );
}

/* =================================================================
   WHP - Work at Height Permit (Izin Kerja Pada Ketinggian)
   Source: whp.xlsx (EWP (2)-OK)
   ================================================================= */
function WhpPrint({ det, permit }: { det: Record<string, unknown>; permit: Permit }) {
  return (
    <>
      <div style={S.section}>
        <div style={S.sectionTitle}>SECTION 1: Detail Pekerjaan pada Ketinggian</div>
        <table style={S.tbl}><tbody>
          <tr><td style={S.lbl}>No. Permit WHP</td><td style={S.val}><V v={det.no_permit_whp} /></td><td style={S.lbl}>Dept</td><td style={S.val}><V v={permit.departemen} /></td></tr>
          <tr><td style={S.lbl}>Lokasi</td><td style={S.val}><V v={permit.lokasi} /></td><td style={S.lbl}>Shift</td><td style={S.val}><V v={det.shift_kerja} /></td></tr>
          <tr><td style={S.lbl}>Detail Pekerjaan</td><td style={S.val} colSpan={3}><V v={det.detail_pekerjaan_whp} /></td></tr>
          <tr><td style={S.lbl}>Tanggal</td><td style={S.val}><V v={det.tanggal_pekerjaan} /></td><td style={S.lbl}>Jam</td><td style={S.val}><V v={det.jam_mulai} /> - <V v={det.jam_selesai} /></td></tr>
        </tbody></table>
      </div>

      <div style={S.section}>
        <div style={S.sectionTitle}>SECTION 2: Checklist &amp; Pengendali Risiko</div>
        <table style={S.tbl}><tbody>
          <tr><td style={S.lbl}>Pengendali Resiko</td><td style={S.val}><V v={det.pengendali_resiko} /></td><td style={S.lbl}>Peralatan</td><td style={S.val}><V v={det.peralatan_whp} /></td></tr>
          <tr><td style={S.lbl}>Pengamat Safety</td><td style={S.val} colSpan={3}><V v={det.nama_pengamat_safety} /></td></tr>
        </tbody></table>
      </div>

      <div style={S.section}>
        <div style={S.sectionTitle}>SECTION 3: Verifikasi &amp; Persetujuan</div>
        <table style={S.appTbl}>
          <thead><tr>
            <th style={{ ...S.appTh, width: '22%' }}>Pihak</th>
            <th style={{ ...S.appTh, width: '14%' }}>Tanggal</th>
            <th style={{ ...S.appTh, width: '34%' }}>Nama</th>
            <th style={{ ...S.appTh, width: '15%' }}>Paraf</th>
          </tr></thead>
          <tbody>
            <tr><td style={{ ...S.appTd, fontWeight: 600 }}>A. Pemohon Izin</td><td style={S.appTd}><V v={det.verif_pemohon_tgl} /></td><td style={S.appTd}><V v={det.verif_pemohon_nama} /></td><td style={S.appTd}><V v={det.verif_pemohon_paraf} /></td></tr>
            <tr><td style={{ ...S.appTd, fontWeight: 600 }}>B. Pemilik Lokasi</td><td style={S.appTd}><V v={det.verif_pemilik_tgl} /></td><td style={S.appTd}><V v={det.verif_pemilik_nama} /></td><td style={S.appTd}><V v={det.verif_pemilik_paraf} /></td></tr>
            <tr>
              <td style={{ ...S.appTd, fontWeight: 600 }}>C. Pemberi Izin</td>
              <td style={S.appTd} colSpan={3}>
                HSE Foreman: <V v={det.verif_pemberi_hse_foreman} /> | HSE SPI: <V v={det.verif_pemberi_hse_spi} />
              </td>
            </tr>
            <tr>
              <td style={{ ...S.appTd, fontWeight: 600 }}>D. Mengetahui</td>
              <td style={S.appTd} colSpan={3}>
                Manager: <V v={det.verif_mengetahui_manager} />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}

/* =================================================================
   MAIN EXPORT
   ================================================================= */
export default function PermitPrintView({ permit }: PermitPrintViewProps) {
  const det = permit.detail?.detail_data || {};
  const jc = JC[permit.jenis] || { label: permit.jenis, doc: '-' };

  return (
    <div style={S.page}>
      <DocHeader permit={permit} jc={jc} />
      <PermitInfoBar permit={permit} />

      {permit.jenis === 'gwp' && <GwpPrint det={det} permit={permit} />}
      {permit.jenis === 'hwp' && <HwpPrint det={det} permit={permit} />}
      {permit.jenis === 'cse' && <CsePrint det={det} permit={permit} />}
      {permit.jenis === 'elp' && <ElpPrint det={det} permit={permit} />}
      {permit.jenis === 'ewp' && <EwpPrint det={det} permit={permit} />}
      {permit.jenis === 'lwp' && <LwpPrint det={det} permit={permit} />}
      {permit.jenis === 'rwp' && <RwpPrint det={det} permit={permit} />}
      {permit.jenis === 'whp' && <WhpPrint det={det} permit={permit} />}

       <CompletionSection permit={permit} />
 
       {permit.jenis === 'ewp' && det.gambar_fasilitas && (
         <div style={{ marginTop: '10px', textAlign: 'center', border: '1px dashed #ccc', padding: '6px', pageBreakInside: 'avoid' }}>
           <div style={{ fontSize: '9px', fontWeight: 'bold', marginBottom: '6px', textAlign: 'left', textTransform: 'uppercase', color: '#000' }}>
             Lampiran: Gambar / Sketsa Fasilitas Bawah Tanah
           </div>
           <img 
             src={det.gambar_fasilitas as string} 
             style={{ maxHeight: '500px', maxWidth: '100%', objectFit: 'contain', display: 'block', margin: '0 auto' }} 
             alt="Sketsa Fasilitas Bawah Tanah" 
           />
         </div>
       )}
 
       {/* Footer */}
       <div style={{ fontSize: '5.5px', color: '#888', borderTop: '0.5px solid #ccc', paddingTop: '2px', marginTop: '4px', textAlign: 'center' }}>
         Note : - Putih: HSE, - Merah Muda: Pemohon Izin, - Hijau Muda: Dept lain (Mech/Sipil/Elektrik)
       </div>
     </div>
   );
 }
