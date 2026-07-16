<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Laporan Insiden #{{ $data->id }}</title>
    <style>
        @page { margin: 15px; }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Helvetica', 'Arial', sans-serif; font-size: 9px; color: #000; line-height: 1.35; }
        .container { padding: 8px; }

        /* Corporate Header Table */
        .header-tbl { width: 100%; border-collapse: collapse; border: 1.5px solid #000; margin-bottom: 10px; }
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

        /* Section Layout */
        .section { margin-bottom: 10px; }
        .section-title { font-size: 8.5px; font-weight: bold; background-color: #f2f2f2; border: 1px solid #000; padding: 3px 5px; text-transform: uppercase; margin-bottom: 5px; }
        
        /* Form Table Style */
        .info-table { width: 100%; border-collapse: collapse; margin-bottom: 8px; }
        .info-table td { border: 1px solid #000; padding: 5px 7px; vertical-align: top; font-size: 8.5px; }
        .info-table td.label-cell { font-weight: bold; background-color: #fafafa; width: 25%; }
        .info-table td.value-cell { width: 75%; }

        .badge { display: inline-block; padding: 1px 6px; border-radius: 3px; font-weight: bold; font-size: 7.5px; text-transform: uppercase; border: 1px solid transparent; }
        .badge-pending { background-color: #fef3c7; color: #92400e; border-color: #fcd34d; }
        .badge-investigation { background-color: #dbeafe; color: #1e40af; border-color: #bfdbfe; }
        .badge-resolved { background-color: #d1fae5; color: #065f46; border-color: #a7f3d0; }
        .badge-closed { background-color: #f3f4f6; color: #374151; border-color: #e5e7eb; }

        .badge-kecelakaan { background-color: #fee2e2; color: #991b1b; border-color: #fca5a5; }
        .badge-near_miss { background-color: #fef3c7; color: #92400e; border-color: #fcd34d; }
        .badge-unsafe_condition { background-color: #e0f2fe; color: #0369a1; border-color: #bae6fd; }

        /* Photo Area */
        .photo-container { text-align: center; margin: 8px 0; border: 1px solid #000; padding: 8px; background-color: #fafafa; border-radius: 4px; }
        .photo-img { max-width: 480px; max-height: 320px; border: 1px solid #bbb; display: inline-block; object-fit: contain; }

        /* Signatures Grid */
        .sign-tbl { width: 100%; border-collapse: collapse; margin-top: 15px; }
        .sign-tbl td { border: 1px solid #000; padding: 5px; text-align: center; font-size: 7.5px; width: 50%; }
        .sign-header { font-weight: bold; background-color: #f2f2f2; text-transform: uppercase; }
        .sign-space { height: 35px; }
        .sign-name { font-weight: bold; border-top: 0.5px solid #000; padding-top: 1px; display: inline-block; min-width: 120px; }
        .sign-dept { font-size: 7px; color: #555; margin-top: 1px; }

        .footer-note { font-size: 6px; color: #555; text-align: center; margin-top: 15px; border-top: 0.5px solid #ccc; padding-top: 3px; }
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
                <td class="header-meta-val">INLHO/OPP-HSE/F-019</td>
                <td class="header-meta-val">{{ \Carbon\Carbon::now()->format('d-M-Y') }}</td>
            </tr>
            <tr>
                <th class="header-meta-label">No. Revisi</th>
                <th class="header-meta-label">Halaman</th>
            </tr>
            <tr>
                <th class="header-doc-title">FORMULIR LAPORAN INSIDEN KESELAMATAN & NEAR MISS</th>
                <td class="header-meta-val">01</td>
                <td class="header-meta-val">1 dari 1</td>
            </tr>
        </table>

        <!-- Section: Detail Insiden -->
        <div class="section">
            <div class="section-title">Detail Laporan Kejadian</div>
            <table class="info-table">
                <tr>
                    <td class="label-cell">Judul Insiden</td>
                    <td class="value-cell"><strong>{{ $data->judul }}</strong></td>
                </tr>
                <tr>
                    <td class="label-cell">Jenis Insiden</td>
                    <td class="value-cell">
                        @if($data->jenis == 'kecelakaan')
                            <span class="badge badge-kecelakaan">Kecelakaan Kerja</span>
                        @elseif($data->jenis == 'near_miss')
                            <span class="badge badge-near_miss">Near Miss</span>
                        @else
                            <span class="badge badge-unsafe_condition">Unsafe Condition</span>
                        @endif
                    </td>
                </tr>
                <tr>
                    <td class="label-cell">Lokasi Kejadian</td>
                    <td class="value-cell">{{ $data->lokasi }}</td>
                </tr>
                <tr>
                    <td class="label-cell">Tanggal & Waktu Kejadian</td>
                    <td class="value-cell">{{ \Carbon\Carbon::parse($data->tanggal_kejadian)->format('d-M-Y') }}</td>
                </tr>
                <tr>
                    <td class="label-cell">Pelapor (Karyawan)</td>
                    <td class="value-cell">{{ $data->user->name ?? '-' }} ({{ $data->user->email ?? '-' }})</td>
                </tr>
                <tr>
                    <td class="label-cell">Status Penyelidikan</td>
                    <td class="value-cell">
                        @if($data->status == 'pending')
                            <span class="badge badge-pending">Menunggu Penyelidikan</span>
                        @elseif($data->status == 'investigation')
                            <span class="badge badge-investigation">Dalam Proses Investigasi</span>
                        @elseif($data->status == 'resolved')
                            <span class="badge badge-resolved">Telah Diselesaikan</span>
                        @elseif($data->status == 'closed')
                            <span class="badge badge-closed">Laporan Ditutup</span>
                        @else
                            <span class="badge badge-closed">{{ ucfirst($data->status) }}</span>
                        @endif
                    </td>
                </tr>
            </table>
        </div>

        <!-- Section: Deskripsi Kejadian -->
        <div class="section">
            <div class="section-title">Deskripsi Kronologi Kejadian</div>
            <table class="info-table">
                <tr>
                    <td style="padding: 8px; line-height: 1.5; font-size: 8.5px; white-space: pre-wrap; border: 1px solid #000;">{{ $data->deskripsi }}</td>
                </tr>
            </table>
        </div>

        <!-- Section: Lampiran Foto Bukti -->
        @if($data->foto)
            @php
                $photoPath = storage_path('app/public/' . $data->foto);
                if (!file_exists($photoPath)) {
                    $photoPath = public_path('storage/' . $data->foto);
                }
                $fileExists = file_exists($photoPath);
            @endphp
            @if($fileExists)
                <div class="section" style="page-break-inside: avoid;">
                    <div class="section-title">Lampiran Foto Bukti Kejadian</div>
                    <div class="photo-container">
                        <img src="{{ $photoPath }}" class="photo-img" alt="Bukti Insiden" />
                    </div>
                </div>
            @endif
        @endif

        <!-- Section: Tanda Tangan Pengesahan -->
        <table class="sign-tbl" style="page-break-inside: avoid;">
            <tr>
                <td class="sign-header">Pelapor Kejadian</td>
                <td class="sign-header">Mengetahui (HSE Dept)</td>
            </tr>
            <tr>
                <td>
                    <div class="sign-space"></div>
                    <div class="sign-name">{{ $data->user->name ?? '________________' }}</div>
                    <div class="sign-dept">Karyawan / Staff Pelapor</div>
                </td>
                <td>
                    <div class="sign-space"></div>
                    <div class="sign-name">...........................................</div>
                    <div class="sign-dept">HSE Officer / Kasubag HSE</div>
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
