'use client';

import { SafetyBehavior } from '@/types';

interface SafetyBehaviorPrintViewProps {
  data: SafetyBehavior;
}

const S = {
  page: { fontFamily: "'Calibri','Inter',sans-serif", fontSize: '7.5px', lineHeight: '1.2', color: '#000', width: '100%' } as React.CSSProperties,
  headerTbl: { width: '100%', borderCollapse: 'collapse' as const, fontSize: '7.5px', marginBottom: '6px' },
  headerLabel: { fontWeight: 700, color: '#000', padding: '3px', border: '1px solid #000', textAlign: 'center' as const },
  headerVal: { padding: '3px', border: '1px solid #000', color: '#000', textAlign: 'center' as const, fontWeight: 600 },
  mainGrid: { width: '100%', borderCollapse: 'collapse' as const, marginTop: '5px' },
  leftCol: { width: '55%', verticalAlign: 'top' as const, paddingRight: '5px' },
  rightCol: { width: '45%', verticalAlign: 'top' as const, paddingLeft: '5px' },
  checklistTitle: { fontWeight: 700, fontSize: '8px', backgroundColor: '#f2f2f2', border: '1px solid #000', padding: '3px 5px', marginBottom: '2px', textTransform: 'uppercase' as const },
  checklistBox: { border: '1px solid #000', marginBottom: '6px', padding: '4px' },
  checklistCatTitle: { fontWeight: 700, fontSize: '7.5px', borderBottom: '0.5px solid #000', paddingBottom: '2px', margin: '0 0 3px 0', textTransform: 'uppercase' as const },
  checklistItem: { fontSize: '7px', padding: '1.2px 0', clear: 'both' as const, overflow: 'hidden' as const },
  checklistLabel: { float: 'left' as const, width: '75%' },
  checklistVal: { float: 'right' as const, width: '22%', textAlign: 'right' as const, fontWeight: 700, fontSize: '7px' },
  valSafe: { color: '#166534' },
  valRisk: { color: '#b91c1c' },
  catLainnya: { fontSize: '6.5px', color: '#555', fontStyle: 'italic', marginTop: '2px', borderTop: '0.5px dashed #ccc', paddingTop: '2px' },
  reportBox: { border: '1px solid #000', padding: '5px' },
  reportTitle: { fontWeight: 700, fontSize: '8px', backgroundColor: '#f2f2f2', border: '1px solid #000', padding: '3px 5px', marginBottom: '4px', textTransform: 'uppercase' as const, textAlign: 'center' as const },
  reportRow: { fontSize: '7.5px', marginBottom: '3px' },
  reportLabel: { fontWeight: 700, color: '#000', width: '75px', display: 'inline-block' },
  reportVal: { color: '#000', display: 'inline-block' },
  kategoriBadge: { fontWeight: 700, fontSize: '7px', padding: '1px 4px', border: '0.5px solid #000' },
  badgeSafe: { backgroundColor: '#dcfce7', color: '#166534' },
  badgeRisk: { backgroundColor: '#fee2e2', color: '#991b1b' },
  reportTextArea: { border: '1px solid #000', padding: '4px', fontSize: '7px', minHeight: '32px', marginTop: '2px', backgroundColor: '#fff', whiteSpace: 'pre-wrap' as const, lineHeight: '1.2' },
  signTbl: { width: '100%', borderCollapse: 'collapse' as const, marginTop: '8px' },
  signHeader: { fontWeight: 700, backgroundColor: '#f2f2f2', border: '1px solid #000', padding: '3px', textAlign: 'center' as const, fontSize: '7px' },
  signTd: { border: '1px solid #000', padding: '4px', textAlign: 'center' as const, fontSize: '7px', width: '33.33%' },
  signSpace: { height: '28px' },
  signName: { fontWeight: 700, borderTop: '0.5px solid #000', paddingTop: '1px', display: 'inline-block', minWidth: '80px' },
  footerNote: { fontSize: '6px', color: '#555', textAlign: 'center' as const, marginTop: '6px', borderTop: '0.5px solid #ccc', paddingTop: '2px' }
};

export default function SafetyBehaviorPrintView({ data }: SafetyBehaviorPrintViewProps) {
  const od = data.observation_data || {};

  const renderChecklist = (
    title: string,
    items: string[],
    catKey: keyof typeof od
  ) => {
    const cat = od[catKey] as any;
    if (!cat) return null;
    const activeItems = cat.items || [];
    const lainnya = cat.lainnya;

    return (
      <div style={S.checklistBox}>
        <div style={S.checklistCatTitle}>{title}</div>
        {items.map((item, idx) => {
          const found = activeItems.find((ai: any) => ai.label === item);
          return (
            <div key={idx} style={S.checklistItem}>
              <span style={S.checklistLabel}>&#8226; {item}</span>
              {found && (
                <span style={{ 
                  ...S.checklistVal, 
                  ...(found.value === 'safe' ? S.valSafe : S.valRisk) 
                }}>
                  {found.value === 'safe' ? 'Safe' : 'At-Risk'}
                </span>
              )}
            </div>
          );
        })}
        {lainnya && <div style={S.catLainnya}>Lainnya: {lainnya}</div>}
      </div>
    );
  };

  return (
    <div style={S.page} id="print-safety-behavior-content">
      {/* Official Kop Surat Header */}
      <table style={S.headerTbl}>
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
                  maxHeight: '38px',
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
              <div style={{ fontSize: '10px', fontWeight: 800, color: '#000', textTransform: 'uppercase' }}>
                PT. Industri Nabati Lestari
              </div>
              <div style={{ fontSize: '7.5px', color: '#000', fontWeight: 700, marginTop: '1px', textTransform: 'uppercase' }}>
                Pabrik Minyak Goreng
              </div>
              <div style={{ fontSize: '6px', color: '#000', marginTop: '2px', lineHeight: '1.1', fontWeight: 500 }}>
                Komp. KEK Sei Mangkei, Kav. 2-3, Kec. Bosar Maligas, Kab. Simalungun, Sumatera Utara, 21184
              </div>
            </td>
            <th style={{ ...S.headerLabel, width: '17.5%' }}>
              No. Dokumen
            </th>
            <th style={{ ...S.headerLabel, width: '17.5%' }}>
              Tgl. Berlaku
            </th>
          </tr>
          <tr style={{ textAlign: 'center' }}>
            <td style={S.headerVal}>
              FM-BSHS-17/01
            </td>
            <td style={S.headerVal}>
              1-Nov-24
            </td>
          </tr>
          <tr style={{ textAlign: 'center' }}>
            <th style={S.headerLabel}>
              No. Revisi
            </th>
            <th style={S.headerLabel}>
              Halaman
            </th>
          </tr>
          <tr style={{ textAlign: 'center' }}>
            <th style={{ border: '1px solid #000', padding: '4px 6px', fontSize: '8px', fontWeight: 800, color: '#000', textAlign: 'center', textTransform: 'uppercase' }}>
              SAFETY BEHAVIOR OBSERVATION
            </th>
            <td style={S.headerVal}>
              00
            </td>
            <td style={S.headerVal}>
              1 dari 1
            </td>
          </tr>
        </thead>
      </table>

      {/* Main Grid */}
      <table style={S.mainGrid}>
        <tbody>
          <tr>
            {/* Left side: Checklist */}
            <td style={S.leftCol}>
              <div style={S.checklistTitle}>Observation Checklist</div>

              {renderChecklist(
                'A. PPE (Personal Protection Equipment)',
                [
                  'Tidak/Menggunakan Safety Shoes',
                  'Tidak/Menggunakan Helmet',
                  'Tidak/Menggunakan Tali dagu',
                  'Tidak/Menggunakan Ear plug/ear muff',
                  'Tidak/Menggunakan Face Shield',
                  'Tidak/Menggunakan Safety Harness',
                  'Tidak/Menggunakan Masker Debu/Masker Gas',
                  'Tidak/Menggunakan Sarung tangan',
                  'Tidak/Menggunakan APD yg sudah dipersyaratkan'
                ],
                'ppe'
              )}

              {renderChecklist(
                'B. Position Of People (Posisi Kerja Orang)',
                [
                  'Berada pada lokasi temperature/tegangan tinggi*',
                  'Terhirup/Tertelan/Terserap oleh bahan kimia/berbahaya*',
                  'Melakukan pekerjaan yg terlalu keras',
                  'Berada di antara/dalam objek yg tertutup/sumber bahaya*',
                  'Terlalu dekat dengan sumber api/bahaya'
                ],
                'position_of_people'
              )}

              {renderChecklist(
                'C. Tools and Equipment',
                [
                  'Cara penggunaan alat kerja yg salah',
                  'Menggunakan Alat/peralatan yg salah',
                  'Tidak sesuai dengan prosedur yg berlaku',
                  'Mesin/peralatan yg digunakan dalam kondisi abnormal/emergency'
                ],
                'tools_and_equipment'
              )}

              {renderChecklist(
                'D. Housekeeping',
                [
                  'Sampah berserakan / Sampah dikumpulkan Rapi',
                  'Tidak /Banyak debu diarea kerja',
                  'Tidak melakukan sesuai dengan prosedur yg berlaku',
                  'Tidak perduli dengan kondisi housekeeping tempat kerja',
                  'Tidak/Tempat kerja berantakan dan kotor'
                ],
                'housekeeping'
              )}

              {renderChecklist(
                'E. Environment',
                [
                  'Tidak/Mencegah tumpahan kimia/limbah',
                  'Tidak/Melakukan pembersihan tumpahan',
                  'Tidak/ Menangani tumpahan'
                ],
                'environment'
              )}

              {renderChecklist(
                'F. Nearmiss (Hampir Celaka)',
                [
                  'Hampir kena timpa benda lain',
                  'Hampir terjatuh ke dalam lubang terbuka',
                  'Hampir masuk kedalam mesin produksi'
                ],
                'nearmiss'
              )}

              {renderChecklist(
                'G. SWA (Stop Work Authority)',
                [
                  'Bekerja tidak mengunakan Prosedur',
                  'Membahayakan pekerja / mesin/Equipment',
                  'Terkena tumpahan bahan kimia'
                ],
                'swa'
              )}
            </td>

            {/* Right side: Observation Report */}
            <td style={S.rightCol}>
              <div style={S.reportTitle}>Observation Report</div>
              <div style={S.reportBox}>
                <div style={S.reportRow}>
                  <span style={S.reportLabel}>Tanggal</span>
                  <span style={S.reportVal}>: {data.tanggal ? new Date(data.tanggal).toLocaleDateString('id-ID') : '-'}</span>
                </div>
                <div style={S.reportRow}>
                  <span style={S.reportLabel}>Waktu</span>
                  <span style={S.reportVal}>: {data.waktu || '-'}</span>
                </div>
                <div style={S.reportRow}>
                  <span style={S.reportLabel}>Lokasi</span>
                  <span style={S.reportVal}>: {data.lokasi}</span>
                </div>

                {od.kategori_perilaku && (
                  <div style={{ ...S.reportRow, marginTop: '5px' }}>
                    <span style={S.reportLabel}>Kategori Perilaku</span>
                    <span style={S.reportVal}>: 
                      <span style={{
                        ...S.kategoriBadge,
                        ...(od.kategori_perilaku === 'safe' ? S.badgeSafe : S.badgeRisk)
                      }}>
                        {od.kategori_perilaku === 'safe' ? 'Safe' : 'At-Risk'}
                      </span>
                    </span>
                  </div>
                )}

                {od.aktivitas && (
                  <>
                    <div style={{ fontWeight: 700, fontSize: '7.5px', marginTop: '5px' }}>Aktivitas yang Dilakukan:</div>
                    <div style={S.reportTextArea}>{od.aktivitas}</div>
                  </>
                )}

                {od.observasi_perilaku && (
                  <>
                    <div style={{ fontWeight: 700, fontSize: '7.5px', marginTop: '5px' }}>Observasi Perilaku:</div>
                    <div style={S.reportTextArea}>{od.observasi_perilaku}</div>
                  </>
                )}

                {od.alasan_beresiko && (
                  <>
                    <div style={{ fontWeight: 700, fontSize: '7.5px', marginTop: '5px' }}>Alasan Perilaku Beresiko:</div>
                    <div style={S.reportTextArea}>{od.alasan_beresiko}</div>
                  </>
                )}

                <div style={{ ...S.reportRow, marginTop: '6px' }}>
                  <span style={S.reportLabel} style={{ width: '140px' }}>Butuh Tindakan Perbaikan?</span>
                  <span style={S.reportVal}>: <strong>{od.perlu_tindakan ? 'YA' : 'TIDAK'}</strong></span>
                </div>

                {od.perlu_tindakan && (
                  <>
                    <div style={{ fontWeight: 700, fontSize: '7.5px', marginTop: '4px' }}>Tindakan Perbaikan:</div>
                    <div style={S.reportTextArea}>{data.tindakan_perbaikan || '-'}</div>
                    <div style={{ ...S.reportRow, marginTop: '4px' }}>
                      <span style={S.reportLabel}>Due Date</span>
                      <span style={S.reportVal}>: {data.due_date ? new Date(data.due_date).toLocaleDateString('id-ID') : '-'}</span>
                    </div>
                  </>
                )}
              </div>

              {/* Signatures Table */}
              <table style={S.signTbl}>
                <thead>
                  <tr>
                    <td style={S.signHeader}>Observer</td>
                    <td style={S.signHeader}>Auditee</td>
                    <td style={S.signHeader}>Kasubag Sistem & IT</td>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={S.signTd}>
                      <div style={S.signSpace}></div>
                      <div style={S.signName}>{data.observer || '______________'}</div>
                    </td>
                    <td style={S.signTd}>
                      <div style={S.signSpace}></div>
                      <div style={S.signName}>{data.auditee || '______________'}</div>
                    </td>
                    <td style={S.signTd}>
                      <div style={S.signSpace}></div>
                      <div style={S.signName}>{data.kasubag || '______________'}</div>
                    </td>
                  </tr>
                </tbody>
              </table>

              <div style={{ fontSize: '6.5px', color: '#000', marginTop: '8px', textAlign: 'center', fontWeight: 'bold' }}>
                "Jadikan Budaya Safety Sebagai Jiwa Dalam Bekerja"
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      {/* Footer Note */}
      <div style={S.footerNote}>
        Note: - Putih; HSSE, - Kuning: Observer &bull; Dicetak otomatis oleh Sistem HSSE - PT. Industri Nabati Lestari &bull; Waktu Cetak: {new Date().toLocaleString('id-ID')}
      </div>
    </div>
  );
}
