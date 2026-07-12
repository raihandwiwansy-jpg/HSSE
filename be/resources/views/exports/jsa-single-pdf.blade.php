<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>JOB SAFETY ANALYSIS (JSA) DAN RISK ASSESSMENT</title>
    <style>
        @page { margin: 15px; }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Helvetica', 'Arial', sans-serif; font-size: 8px; color: #000; line-height: 1.2; }
        .container { padding: 5px; }

        /* Corporate Header Table */
        .header-tbl { width: 100%; border-collapse: collapse; border: 1.5px solid #000; margin-bottom: 6px; }
        .header-tbl td, .header-tbl th { border: 1px solid #000; padding: 3px; vertical-align: middle; text-align: center; }
        .header-logo { width: 15%; }
        .header-logo img { max-height: 38px; display: block; margin: 0 auto; }
        .header-title-area { width: 50%; text-align: center; }
        .header-title-main { font-size: 10px; font-weight: bold; text-transform: uppercase; }
        .header-title-sub { font-size: 7px; font-weight: bold; text-transform: uppercase; margin-top: 1px; }
        .header-address { font-size: 5.5px; margin-top: 1px; line-height: 1.1; }
        .header-meta-label { width: 17.5%; font-weight: bold; font-size: 7px; text-transform: uppercase; }
        .header-meta-val { width: 17.5%; font-size: 7px; font-weight: 600; }
        .header-doc-title { font-size: 8px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.3px; }

        /* Meta Table */
        .meta-tbl { width: 100%; border-collapse: collapse; margin-bottom: 5px; }
        .meta-tbl td { border: 1px solid #000; padding: 2px 4px; vertical-align: top; }
        .meta-label { font-weight: bold; background-color: #f2f2f2; width: 14%; font-size: 7px; }
        .meta-val { width: 23%; font-size: 7px; }
        .meta-sig-header { font-weight: bold; background-color: #f2f2f2; text-align: center; font-size: 6.5px; vertical-align: middle; }
        .meta-sig-val { text-align: center; vertical-align: bottom; font-size: 6.5px; height: 32px; font-weight: 600; }

        /* JSA Data Table */
        .data-tbl { width: 100%; border-collapse: collapse; margin-bottom: 5px; }
        .data-tbl th { background-color: #f2f2f2; color: #000; font-weight: bold; text-align: center; vertical-align: middle; border: 1px solid #000; padding: 2px 1px; font-size: 6px; }
        .data-tbl td { border: 1px solid #000; padding: 2px; vertical-align: top; font-size: 6.5px; }

        /* Legends */
        .legend { font-size: 6px; line-height: 1.3; margin-top: 3px; border-top: 0.5px solid #000; padding-top: 2px; }
        .legend-row { margin-bottom: 1px; }

        /* Footer Notes */
        .footer-note { font-size: 5.5px; color: #555; text-align: center; margin-top: 4px; border-top: 0.5px solid #ccc; padding-top: 2px; }
    </style>
</head>
<body>
    <div class="container">
        <!-- Official Kop Surat Header -->
        <table class="header-tbl">
            <tr>
                <td class="header-logo" rowspan="4">
                    <img src="{{ public_path('logo-inl.png') }}" alt="Logo INL" />
                </td>
                <td class="header-title-area" rowspan="3">
                    <div class="header-title-main">PT. Industri Nabati Lestari</div>
                    <div class="header-title-sub">Pabrik Minyak Goreng</div>
                    <div class="header-address">Komp. KEK Sei Mangkei, Kav. 2-3, Kec. Bosar Maligas, Kab. Simalungun, Sumatera Utara, 21184</div>
                </td>
                <th class="header-meta-label">No. Dokumen</th>
                <th class="header-meta-label">Tgl. Berlaku</th>
            </tr>
            <tr>
                <td class="header-meta-val">INLHO/OPP-HSE/F-006</td>
                <td class="header-meta-val">1-Aug-24</td>
            </tr>
            <tr>
                <th class="header-meta-label">No. Revisi</th>
                <th class="header-meta-label">Halaman</th>
            </tr>
            <tr>
                <th class="header-doc-title">JOB SAFETY ANALYSIS (JSA) DAN RISK ASSESSMENT</th>
                <td class="header-meta-val">02</td>
                <td class="header-meta-val">1 dari 1</td>
            </tr>
        </table>

        <!-- Meta Table -->
        <table class="meta-tbl">
            <tr>
                <td class="meta-label">Depart/Bagian/CV</td>
                <td class="meta-val">: {{ $data->departemen ?? '-' }}</td>
                <td class="meta-sig-header" style="width: 16%;" rowspan="3">Disusun dan dikaji<br/>bersama Oleh:</td>
                <td class="meta-sig-val" style="width: 16%; border-bottom: 0.5px solid #888;">Head Dept</td>
                <td class="meta-sig-val" style="width: 16%; border-bottom: 0.5px solid #888;">HSSE</td>
                <td class="meta-sig-val" style="width: 15%; border-bottom: 0.5px solid #888;">GM Produksi</td>
            </tr>
            <tr>
                <td class="meta-label">Tanggal</td>
                <td class="meta-val">: {{ $data->tanggal ? \Carbon\Carbon::parse($data->tanggal)->format('d/m/Y') : '-' }}</td>
                <td class="meta-sig-val"></td>
                <td class="meta-sig-val"></td>
                <td class="meta-sig-val"></td>
            </tr>
            <tr>
                <td class="meta-label">Kegiatan</td>
                <td class="meta-val">: {{ $data->kegiatan ?? $data->judul ?? '-' }}</td>
                <td class="meta-sig-header" style="font-size: 5.5px;" rowspan="2">Diketahui Oleh:</td>
                <td class="meta-sig-val"></td>
                <td class="meta-sig-val"></td>
                <td class="meta-sig-val"></td>
            </tr>
            <tr>
                <td class="meta-label">Area / Lokasi</td>
                <td class="meta-val">: {{ $data->lokasi ?? '-' }}</td>
                <td class="meta-sig-val"></td>
                <td class="meta-sig-val"></td>
                <td class="meta-sig-val"></td>
            </tr>
        </table>

        <!-- JSA Data Table -->
        <table class="data-tbl">
            <thead>
                <tr>
                    <th style="width: 12%">Proses/Pekerjaan<br/>Mesin/Alat/Material</th>
                    <th style="width: 4%">Rutin</th>
                    <th style="width: 4%">Non<br/>Rutin</th>
                    <th style="width: 13%">Tahapan Kegiatan /<br/>Deskripsi</th>
                    <th style="width: 11%">Deskripsi Bahaya</th>
                    <th style="width: 10%">Identifikasi<br/>Bahaya</th>
                    <th style="width: 4%">Peluang<br/>(A)</th>
                    <th style="width: 4%">Akibat<br/>(B)</th>
                    <th style="width: 5%">Tingkat<br/>Risiko<br/>(AxB)</th>
                    <th style="width: 17%">Tindakan<br/>Pengendalian</th>
                    <th style="width: 8%">PIC</th>
                    <th style="width: 8%">Supervisi</th>
                </tr>
            </thead>
            <tbody>
                @php $tahapan = $data->tahapan ?? []; @endphp
                @if(count($tahapan) === 0)
                    <tr>
                        <td colspan="12" style="text-align: center; color: #999; padding: 10px;">Tidak ada data JSA</td>
                    </tr>
                @else
                    @foreach($tahapan as $t)
                        @php
                            $proses = $t['proses'] ?? $t['proses_kerja'] ?? '-';
                            $sifat = strtolower($t['sifat'] ?? $t['sifat_kerja'] ?? '');
                            $isRutin = ($sifat === 'rutin' || $sifat === 'v' || $sifat === '1' || ($sifat === '' && isset($t['rutin']) && $t['rutin']));
                            $isNonRutin = ($sifat === 'non-rutin' || $sifat === 'non_rutin' || $sifat === 'x' || ($sifat === '' && isset($t['non_rutin']) && $t['non_rutin']));
                            
                            $peluangVal = $t['peluang'] ?? 0;
                            $akibatVal = $t['akibat'] ?? 0;
                            
                            // Handle letter grades for Peluang (like A, B, C, D, E)
                            $pNum = 0;
                            if (is_numeric($peluangVal)) {
                                $pNum = intval($peluangVal);
                            } else {
                                $pMap = ['a' => 1, 'b' => 2, 'c' => 3, 'd' => 4, 'e' => 5];
                                $pNum = $pMap[strtolower(strval($peluangVal))] ?? 0;
                            }
                            
                            $aNum = intval($akibatVal);
                            $score = $pNum * $aNum;

                            $rcBg = '#ffffff';
                            $rcFg = '#000000';
                            if ($score > 0) {
                                if ($score <= 4) { $rcBg = '#dcfce7'; $rcFg = '#166534'; }
                                elseif ($score <= 9) { $rcBg = '#fef9c3'; $rcFg = '#854d0e'; }
                                elseif ($score <= 16) { $rcBg = '#ffedd5'; $rcFg = '#9a3412'; }
                                else { $rcBg = '#fee2e2'; $rcFg = '#991b1b'; }
                            }
                        @endphp
                        <tr>
                            <td>{{ $proses }}</td>
                            <td style="text-align: center;">{{ $isRutin ? '✓' : '' }}</td>
                            <td style="text-align: center;">{{ $isNonRutin ? '✓' : '' }}</td>
                            <td>{{ $t['tahapan'] ?? $t['nama'] ?? '-' }}</td>
                            <td>{{ $t['deskripsi_bahaya'] ?? $t['bahaya'] ?? '-' }}</td>
                            <td>{{ $t['identifikasi_bahaya'] ?? $t['identifikasi'] ?? '-' }}</td>
                            <td style="text-align: center;">{{ $peluangVal }}</td>
                            <td style="text-align: center;">{{ $akibatVal }}</td>
                            <td style="text-align: center; font-weight: bold; background-color: {{ $rcBg }}; color: {{ $rcFg }};">{{ $score > 0 ? $score : '-' }}</td>
                            <td>{{ $t['tindakan_pengendalian'] ?? $t['pengendalian'] ?? $t['kontrol'] ?? '-' }}</td>
                            <td>{{ $t['pic'] ?? '-' }}</td>
                            <td>{{ $t['supervisi'] ?? '-' }}</td>
                        </tr>
                    @endforeach
                @endif
            </tbody>
        </table>

        <!-- Risk Legend -->
        <div class="legend">
            <div class="legend-row">
                <strong>Peluang (A):</strong> 1/A=Sangat Jarang, 2/B=Jarang, 3/C=Mungkin, 4/D=Hampir Pasti, 5/E=Pasti &nbsp;|&nbsp;
                <strong>Akibat (B):</strong> 1=Tidak Ada, 2=Kecil, 3=Sedang, 4=Besar, 5=Fatal
            </div>
            <div class="legend-row">
                <span style="color: #166534; font-weight: bold;">Rendah (1-4)</span> &nbsp;&bull;&nbsp;
                <span style="color: #854d0e; font-weight: bold;">Sedang (5-9)</span> &nbsp;&bull;&nbsp;
                <span style="color: #9a3412; font-weight: bold;">Tinggi (10-16)</span> &nbsp;&bull;&nbsp;
                <span style="color: #991b1b; font-weight: bold;">Ekstrim (17-25)</span>
            </div>
        </div>

        <!-- Footer Note -->
        <div class="footer-note">
            Note: - Putih; HSE, - Merah Muda: Pemohon Izin, - Hijau Muda: Pemilik Lokasi &nbsp;|&nbsp; Dicetak otomatis oleh Sistem HSE - PT. Industri Nabati Lestari
        </div>
    </div>
</body>
</html>
