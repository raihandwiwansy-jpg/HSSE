<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Laporan Insiden #{{ $data->id }}</title>
    <style>
        @page { margin: 25px; }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Helvetica', 'Arial', sans-serif; font-size: 10px; color: #333; line-height: 1.4; }
        .container { padding: 10px; }

        /* Corporate Header Table */
        .header-tbl { width: 100%; border-collapse: collapse; border: 1.5px solid #000; margin-bottom: 12px; }
        .header-tbl td, .header-tbl th { border: 1px solid #000; padding: 4px; vertical-align: middle; text-align: center; }
        .header-logo { width: 15%; }
        .header-logo img { max-height: 40px; display: block; margin: 0 auto; }
        .header-title-area { width: 50%; text-align: center; }
        .header-title-main { font-size: 12px; font-weight: bold; text-transform: uppercase; }
        .header-title-sub { font-size: 8px; font-weight: bold; text-transform: uppercase; margin-top: 1px; }
        .header-address { font-size: 6.5px; margin-top: 1px; line-height: 1.2; }
        .header-meta-label { width: 17.5%; font-weight: bold; font-size: 8px; text-transform: uppercase; }
        .header-meta-val { width: 17.5%; font-size: 8px; font-weight: 600; }
        .header-doc-title { font-size: 9px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.3px; }

        /* Section Layout */
        .section { margin-bottom: 12px; }
        .section-title { font-size: 10px; font-weight: bold; background-color: #f2f2f2; border: 1px solid #000; padding: 4px 6px; text-transform: uppercase; margin-bottom: 6px; }
        
        /* Form Table Style */
        .info-table { width: 100%; border-collapse: collapse; margin-bottom: 10px; }
        .info-table td { border: 1px solid #ddd; padding: 6px 8px; vertical-align: top; font-size: 9px; }
        .info-table td.label-cell { font-weight: bold; background-color: #fafafa; width: 25%; }
        .info-table td.value-cell { width: 75%; }

        .badge { display: inline-block; padding: 2px 8px; border-radius: 3px; font-weight: bold; font-size: 8px; text-transform: uppercase; }
        .badge-pending { background-color: #fef3c7; color: #92400e; border: 1px solid #fcd34d; }
        .badge-investigation { background-color: #dbeafe; color: #1e40af; border: 1px solid #bfdbfe; }
        .badge-resolved { background-color: #d1fae5; color: #065f46; border: 1px solid #a7f3d0; }
        .badge-closed { background-color: #f3f4f6; color: #374151; border: 1px solid #e5e7eb; }

        .badge-kecelakaan { background-color: #fee2e2; color: #991b1b; border: 1px solid #fca5a5; }
        .badge-near_miss { background-color: #fef3c7; color: #92400e; border: 1px solid #fcd34d; }
        .badge-unsafe_condition { background-color: #e0f2fe; color: #0369a1; border: 1px solid #bae6fd; }

        /* Photo Area */
        .photo-container { text-align: center; margin: 10px 0; border: 1px solid #ddd; padding: 8px; background-color: #fafafa; border-radius: 4px; }
        .photo-img { max-width: 280px; max-height: 200px; border: 1px solid #bbb; }

        /* Signatures */
        .sig-table { width: 100%; border-collapse: collapse; margin-top: 30px; }
        .sig-table td { width: 50%; text-align: center; vertical-align: top; padding: 5px; border: none; }
        .sig-title { font-weight: bold; font-size: 9px; margin-bottom: 50px; text-transform: uppercase; }
        .sig-name { font-weight: bold; font-size: 9px; text-decoration: underline; }
        .sig-dept { font-size: 8px; color: #666; margin-top: 2px; }

        .footer-note { font-size: 7px; color: #777; text-align: center; margin-top: 20px; border-top: 0.5px solid #ccc; padding-top: 4px; }
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
                    <td style="padding: 10px; line-height: 1.6; font-size: 9.5px; white-space: pre-wrap;">{{ $data->deskripsi }}</td>
                </tr>
            </table>
        </div>

        <!-- Section: Lampiran Foto Bukti -->
        @if($data->foto)
            @php
                $photoPath = public_path('storage/' . $data->foto);
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
        <table class="sig-table" style="page-break-inside: avoid;">
            <tr>
                <td>
                    <div class="sig-title">Pelapor Kejadian</div>
                    <div class="sig-name">{{ $data->user->name ?? '-' }}</div>
                    <div class="sig-dept">Karyawan Bersangkutan</div>
                </td>
                <td>
                    <div class="sig-title">HSE Officer / Admin Dept</div>
                    <div class="sig-name">...........................................</div>
                    <div class="sig-dept">Health, Safety, & Environment</div>
                </td>
            </tr>
        </table>

        <!-- Footer -->
        <div class="footer-note">
            Dokumen ini dicetak secara resmi melalui Portal Sistem Informasi Keselamatan Kerja PT. Industri Nabati Lestari.
        </div>
    </div>
</body>
</html>
