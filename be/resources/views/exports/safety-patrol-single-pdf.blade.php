<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>SAFETY OBSERVATION - {{ $data->lokasi }}</title>
    <style>
        @page { margin: 15px; }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Helvetica', 'Arial', sans-serif; font-size: 8px; color: #000; line-height: 1.25; }
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

        /* Main Form Grid */
        .main-grid { width: 100%; border-collapse: collapse; margin-top: 5px; }
        .main-grid td { vertical-align: top; }
        .left-col { width: 55%; padding-right: 5px; }
        .right-col { width: 45%; padding-left: 5px; }

        /* Left Side Checklist Boxes */
        .checklist-title { font-weight: bold; font-size: 8px; background-color: #f2f2f2; border: 1px solid #000; padding: 3px 5px; margin-bottom: 2px; text-transform: uppercase; }
        .checklist-box { border: 1px solid #000; margin-bottom: 6px; padding: 4px; }
        .checklist-item { font-size: 7.5px; padding: 1px 0; }
        .chk-box { font-size: 9px; font-weight: bold; margin-right: 3px; font-family: 'DejaVu Sans', 'Arial', sans-serif; }
        .checked { color: #d32f2f; }
        .unchecked { color: #888; }
        .cat-lainnya { font-size: 7px; color: #555; font-style: italic; margin-top: 2px; border-top: 0.5px dashed #ccc; padding-top: 2px; }

        /* Right Side Observation Report */
        .report-box { border: 1px solid #000; padding: 5px; }
        .report-title { font-weight: bold; font-size: 8px; background-color: #f2f2f2; border: 1px solid #000; padding: 3px 5px; margin-bottom: 4px; text-transform: uppercase; text-align: center; }
        .report-row { font-size: 7.5px; margin-bottom: 3px; }
        .report-label { font-weight: bold; color: #000; width: 60px; display: inline-block; }
        .report-val { color: #000; display: inline-block; }
        .report-text-area { border: 1px solid #000; padding: 4px; font-size: 7.5px; min-height: 40px; margin-top: 2px; background-color: #fff; }

        /* Signatures Grid */
        .sign-tbl { width: 100%; border-collapse: collapse; margin-top: 8px; }
        .sign-tbl td { border: 1px solid #000; padding: 4px; text-align: center; font-size: 7px; width: 33.33%; }
        .sign-header { font-weight: bold; background-color: #f2f2f2; }
        .sign-space { height: 28px; }
        .sign-name { font-weight: bold; border-top: 0.5px solid #000; padding-top: 1px; display: inline-block; min-width: 80px; }

        /* Footer Notes */
        .legend-note { font-size: 6px; color: #000; margin-top: 4px; line-height: 1.2; }
        .footer-note { font-size: 6px; color: #555; text-align: center; margin-top: 6px; border-top: 0.5px solid #ccc; padding-top: 2px; }
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
                <td class="header-meta-val">INLHO/HSE-F/003</td>
                <td class="header-meta-val">18-Jan-19</td>
            </tr>
            <tr>
                <th class="header-meta-label">No. Revisi</th>
                <th class="header-meta-label">Halaman</th>
            </tr>
            <tr>
                <th class="header-doc-title">SAFETY OBSERVATION</th>
                <td class="header-meta-val">00</td>
                <td class="header-meta-val">1 dari 1</td>
            </tr>
        </table>

        @php $od = $data->observation_data ?? []; @endphp

        <!-- Main Grid Layout -->
        <table class="main-grid">
            <tr>
                <!-- Left Column Checklist -->
                <td class="left-col">
                    <div class="checklist-title">Observation Checklist</div>

                    <!-- Reactions of People -->
                    <div class="checklist-box">
                        <div style="font-weight: bold; font-size: 7.5px; border-bottom: 0.5px solid #000; padding-bottom: 2px; margin-bottom: 3px; text-transform: uppercase;">
                            Reactions of People
                        </div>
                        @php $cat = $od['reactions_of_people'] ?? null; $items = $cat['items'] ?? []; @endphp
                        @foreach(['Disiplin safety hanya karena atasan','Melakukan pekerjaan dengan sembrono, jika tidak ada atasan','Safety tidak menjadi bagian dari rutinitas pekerjaan','Berpura-pura melakukan pekerjaan dengan aman','Menghindari observator'] as $item)
                            @php $isChecked = in_array($item, array_column($items, 'label')); @endphp
                            <div class="checklist-item">
                                <span class="chk-box {{ $isChecked ? 'checked' : 'unchecked' }}">{!! $isChecked ? '&#9746;' : '&#9744;' !!}</span>
                                <span>{{ $item }}</span>
                            </div>
                        @endforeach
                        @if($cat['lainnya'] ?? null)<div class="cat-lainnya">Lainnya: {{ $cat['lainnya'] }}</div>@endif
                    </div>

                    <!-- PPE -->
                    <div class="checklist-box">
                        <div style="font-weight: bold; font-size: 7.5px; border-bottom: 0.5px solid #000; padding-bottom: 2px; margin-bottom: 3px; text-transform: uppercase;">
                            PPE (Alat Pelindung Diri)
                        </div>
                        @php $cat = $od['ppe'] ?? null; $items = $cat['items'] ?? []; @endphp
                        @foreach(['Tidak/Menggunakan Safety Shoes','Tidak/Menggunakan Helmet','Tidak/Menggunakan Ear plug/ear muff','Tidak/Menggunakan Face Shield','Tidak/Menggunakan Safety Harness','Tidak/Menggunakan Masker Debu/Masker Gas','Tidak/Menggunakan Sarung tangan'] as $item)
                            @php $isChecked = in_array($item, array_column($items, 'label')); @endphp
                            <div class="checklist-item">
                                <span class="chk-box {{ $isChecked ? 'checked' : 'unchecked' }}">{!! $isChecked ? '&#9746;' : '&#9744;' !!}</span>
                                <span>{{ $item }}</span>
                            </div>
                        @endforeach
                        @if($cat['lainnya'] ?? null)<div class="cat-lainnya">Lainnya: {{ $cat['lainnya'] }}</div>@endif
                    </div>

                    <!-- Position of People -->
                    <div class="checklist-box">
                        <div style="font-weight: bold; font-size: 7.5px; border-bottom: 0.5px solid #000; padding-bottom: 2px; margin-bottom: 3px; text-transform: uppercase;">
                            Position of People
                        </div>
                        @php $cat = $od['position_of_people'] ?? null; $items = $cat['items'] ?? []; @endphp
                        @foreach(['Berada pada lokasi temperature/tegangan tinggi*','Terhirup/Tertelan/Terserap oleh bahan kimia/berbahaya*','Melakukan pekerjaan yg terlalu keras','Berada di antara/dalam objek yg tertutup/sumber bahaya*','Terlalu dekat dengan sumber api/bahaya'] as $item)
                            @php $isChecked = in_array($item, array_column($items, 'label')); @endphp
                            <div class="checklist-item">
                                <span class="chk-box {{ $isChecked ? 'checked' : 'unchecked' }}">{!! $isChecked ? '&#9746;' : '&#9744;' !!}</span>
                                <span>{{ $item }}</span>
                            </div>
                        @endforeach
                        @if($cat['lainnya'] ?? null)<div class="cat-lainnya">Lainnya: {{ $cat['lainnya'] }}</div>@endif
                    </div>

                    <!-- Tools and Equipment -->
                    <div class="checklist-box">
                        <div style="font-weight: bold; font-size: 7.5px; border-bottom: 0.5px solid #000; padding-bottom: 2px; margin-bottom: 3px; text-transform: uppercase;">
                            Tools and Equipment (Alat & Peralatan Kerja)
                        </div>
                        @php $cat = $od['tools_and_equipment'] ?? null; $items = $cat['items'] ?? []; @endphp
                        @foreach(['Cara penggunaan alat kerja yg salah','Menggunakan Alat/peralatan yg salah','Tidak sesuai dengan prosedur yg berlaku','Mesin/peralatan yg digunakan dalam kondisi abnormal/emergency'] as $item)
                            @php $isChecked = in_array($item, array_column($items, 'label')); @endphp
                            <div class="checklist-item">
                                <span class="chk-box {{ $isChecked ? 'checked' : 'unchecked' }}">{!! $isChecked ? '&#9746;' : '&#9744;' !!}</span>
                                <span>{{ $item }}</span>
                            </div>
                        @endforeach
                        @if($cat['lainnya'] ?? null)<div class="cat-lainnya">Lainnya: {{ $cat['lainnya'] }}</div>@endif
                    </div>

                    <!-- Procedure and Housekeeping -->
                    <div class="checklist-box">
                        <div style="font-weight: bold; font-size: 7.5px; border-bottom: 0.5px solid #000; padding-bottom: 2px; margin-bottom: 3px; text-transform: uppercase;">
                            Procedure and Housekeeping
                        </div>
                        @php $cat = $od['procedure_housekeeping'] ?? null; $items = $cat['items'] ?? []; @endphp
                        @foreach(['Tidak memiliki prosedure','Tidak mengetahui/memahami isi prosedure','Tidak melakukan sesuai dengan prosedur yg berlaku','Tidak perduli dengan kondisi housekeeping tempat kerja','Tempat kerja berantakan dan kotor'] as $item)
                            @php $isChecked = in_array($item, array_column($items, 'label')); @endphp
                            <div class="checklist-item">
                                <span class="chk-box {{ $isChecked ? 'checked' : 'unchecked' }}">{!! $isChecked ? '&#9746;' : '&#9744;' !!}</span>
                                <span>{{ $item }}</span>
                            </div>
                        @endforeach
                        @if($cat['lainnya'] ?? null)<div class="cat-lainnya">Lainnya: {{ $cat['lainnya'] }}</div>@endif
                    </div>
                </td>

                <!-- Right Column Report Details -->
                <td class="right-col">
                    <div class="report-title">Observation Report</div>
                    <div class="report-box">
                        <div class="report-row">
                            <span class="report-label">Tanggal</span>
                            <span class="report-val">: {{ \Carbon\Carbon::parse($data->tanggal)->format('d/m/Y') }}</span>
                        </div>
                        <div class="report-row">
                            <span class="report-label">Waktu</span>
                            <span class="report-val">: {{ $data->waktu ?? '-' }}</span>
                        </div>
                        <div class="report-row">
                            <span class="report-label">Lokasi</span>
                            <span class="report-val">: {{ $data->lokasi }}</span>
                        </div>

                        <div style="font-weight: bold; font-size: 7.5px; margin-top: 6px;">Deskripsi Observasi:</div>
                        <div class="report-text-area">{{ $od['observasi'] ?? '-' }}</div>

                        @php $perluTindakan = $od['perlu_tindakan'] ?? false; @endphp
                        <div class="report-row" style="margin-top: 6px;">
                            <span class="report-label" style="width: 140px;">Butuh Tindakan Perbaikan?</span>
                            <span class="report-val">: <strong>{{ $perluTindakan ? 'YA' : 'TIDAK' }}</strong></span>
                        </div>

                        @if($perluTindakan)
                            <div style="font-weight: bold; font-size: 7.5px; margin-top: 4px;">Tindakan Perbaikan:</div>
                            <div class="report-text-area" style="min-height: 35px;">{{ $data->tindakan_perbaikan ?? '-' }}</div>
                            <div class="report-row" style="margin-top: 4px;">
                                <span class="report-label">Due Date</span>
                                <span class="report-val">: {{ $data->due_date ? \Carbon\Carbon::parse($data->due_date)->format('d/m/Y') : '-' }}</span>
                            </div>
                        @endif
                    </div>

                    <!-- Signatures Block -->
                    <table class="sign-tbl">
                        <tr>
                            <td class="sign-header">Observer</td>
                            <td class="sign-header">Auditee</td>
                            <td class="sign-header">Leader</td>
                        </tr>
                        <tr>
                            <td>
                                <div class="sign-space"></div>
                                <div class="sign-name">{{ $data->observer ?? '______________' }}</div>
                            </td>
                            <td>
                                <div class="sign-space"></div>
                                <div class="sign-name">{{ $data->auditee ?? '______________' }}</div>
                            </td>
                            <td>
                                <div class="sign-space"></div>
                                <div class="sign-name">{{ $data->leader ?? '______________' }}</div>
                            </td>
                        </tr>
                    </table>

                    <div class="legend-note">
                        <strong>Note:</strong> - Putih: HSE &nbsp;&bull;&nbsp; - Kuning: Observer
                    </div>
                </td>
            </tr>
        </table>

        <!-- Footer -->
        <div class="footer-note">
            Dicetak otomatis oleh Sistem HSE - PT. Industri Nabati Lestari &bull; Waktu Cetak: {{ \Carbon\Carbon::now()->format('d/m/Y H:i') }}
        </div>
    </div>
</body>
</html>
