<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Laporan Job Safety Analysis (JSA)</title>
    <style>
        @page { margin: 8px 10px; }
        body { font-family: sans-serif; font-size: 8px; color: #333; margin: 0; padding: 0; }
        table { border-collapse: collapse; width: 100%; }
        td, th { padding: 2px 3px; }
    </style>
</head>
<body>
    {{-- KOP SURAT --}}
    <table style="width:100%; border-bottom:2px solid #2E7D32; margin-bottom:4px;">
        <tr>
            <td align="center" style="padding-bottom:4px;">
                <div style="font-size:14px; font-weight:bold; color:#2E7D32;">PT. INDUSTRI NABATI LESTARI</div>
                <div style="font-size:12px; font-weight:bold; color:#333;">PABRIK MINYAK GORENG</div>
                <div style="font-size:8px; color:#666; margin-top:1px;">Kantor Pusat: Komp. KEK Sei Mangkei, Kav.2-3, Kec. Bosar Maligas</div>
                <div style="font-size:8px; color:#666;">Kab. Simalungun, Sumatera Utara, 21183</div>
            </td>
        </tr>
    </table>

    {{-- JUDUL --}}
    <table style="width:100%; margin-bottom:3px;">
        <tr>
            <td align="center">
                <span style="font-size:12px; font-weight:bold; color:#1B5E20;">LAPORAN JOB SAFETY ANALYSIS (JSA)</span>
            </td>
        </tr>
    </table>

    {{-- INFO DOKUMEN --}}
    <table style="width:100%; font-size:7px; margin-bottom:1px;">
        <tr>
            <td style="width:40%;"><b>No. Dokumen:</b> INLHO/OPP-HSE/F-006</td>
            <td style="width:15%;"><b>No. Revisi:</b> 02</td>
            <td style="width:20%;"><b>Halaman:</b> 1 dari 1</td>
            <td style="width:25%;"><b>Tgl. Berlaku:</b> 2021-08-01</td>
        </tr>
    </table>

    {{-- TGL CETAK --}}
    <table style="width:100%; font-size:7px; margin-bottom:4px;">
        <tr>
            <td align="right" style="font-style:italic; color:#888;">Dicetak pada: {{ date('d/m/Y H:i') }}</td>
        </tr>
    </table>

    {{-- TABEL JSA --}}
    <table style="width:100%; border:1px solid #2E7D32; font-size:7px;">
        <thead>
            <tr style="background-color:#2E7D32; color:#fff;">
                <th style="border:1px solid #1B5E20; padding:3px 2px; text-align:center; width:12%;">Proses/Pekerjaan/Mesin/<br>Alat/Material</th>
                <th style="border:1px solid #1B5E20; padding:3px 2px; text-align:center; width:6%;">Sifat<br>(Rutin/<br>Non Rutin)</th>
                <th style="border:1px solid #1B5E20; padding:3px 2px; text-align:center; width:10%;">Tahapan Kegiatan/<br>Deskripsi</th>
                <th style="border:1px solid #1B5E20; padding:3px 2px; text-align:center; width:8%;">Deskripsi<br>Bahaya</th>
                <th style="border:1px solid #1B5E20; padding:3px 2px; text-align:center; width:8%;">Identifikasi<br>Bahaya</th>
                <th style="border:1px solid #1B5E20; padding:3px 2px; text-align:center; width:5%;">Peluang<br>(A/B/C/D)</th>
                <th style="border:1px solid #1B5E20; padding:3px 2px; text-align:center; width:5%;">Akibat<br>(1-4)</th>
                <th style="border:1px solid #1B5E20; padding:3px 2px; text-align:center; width:5%;">Tingkat<br>Risiko<br>(M/H/E)</th>
                <th style="border:1px solid #1B5E20; padding:3px 2px; text-align:center; width:14%;">Tindakan<br>Pengendalian</th>
                <th style="border:1px solid #1B5E20; padding:3px 2px; text-align:center; width:7%;">PIC</th>
                <th style="border:1px solid #1B5E20; padding:3px 2px; text-align:center; width:7%;">Supervisi</th>
                <th style="border:1px solid #1B5E20; padding:3px 2px; text-align:center; width:8%;">Keterangan</th>
            </tr>
        </thead>
        <tbody>
            @forelse($data as $item)
                @if(is_array($item->tahapan) && count($item->tahapan) > 0)
                    @foreach($item->tahapan as $idx => $tahap)
                        @php $bg = $loop->parent->even ? '#f5faf5' : '#fff'; @endphp
                        <tr style="background-color:{{ $bg }};">
                            @if($idx === 0)
                                <td style="border:1px solid #ccc; vertical-align:top; font-weight:bold;" rowspan="{{ count($item->tahapan) }}">
                                    {{ $item->kegiatan }}<br>
                                    <span style="font-weight:normal; font-size:6px; color:#666;">
                                        Dept: {{ $item->departemen }}<br>
                                        Lokasi: {{ $item->lokasi }}<br>
                                        Tgl: {{ \Carbon\Carbon::parse($item->tanggal)->format('d/m/Y') }}
                                    </span>
                                </td>
                                <td style="border:1px solid #ccc; text-align:center; vertical-align:top;" rowspan="{{ count($item->tahapan) }}">
                                    {{ $tahap['sifat'] ?? '-' }}
                                </td>
                            @endif
                            <td style="border:1px solid #ccc; vertical-align:top;">{{ $tahap['tahapan'] ?? $tahap['langkah'] ?? $tahap['kegiatan'] ?? '-' }}</td>
                            <td style="border:1px solid #ccc; vertical-align:top;">{{ $tahap['bahaya'] ?? $tahap['risiko'] ?? '-' }}</td>
                            <td style="border:1px solid #ccc; vertical-align:top;">{{ $tahap['identifikasi'] ?? '-' }}</td>
                            <td style="border:1px solid #ccc; text-align:center; vertical-align:top; font-weight:bold;">{{ $tahap['peluang'] ?? '-' }}</td>
                            <td style="border:1px solid #ccc; text-align:center; vertical-align:top; font-weight:bold;">{{ $tahap['akibat'] ?? '-' }}</td>
                            <td style="border:1px solid #ccc; text-align:center; vertical-align:top; font-weight:bold;">
                                @php
                                    $tr = $tahap['tingkat_risiko'] ?? '-';
                                    if(is_numeric($tr) && $tr >= 12) $trLabel = 'T';
                                    elseif(is_numeric($tr) && $tr >= 6) $trLabel = 'S';
                                    else $trLabel = 'R';
                                @endphp
                                {{ $trLabel }}
                            </td>
                            <td style="border:1px solid #ccc; vertical-align:top;">{{ $tahap['pengendalian'] ?? '-' }}</td>
                            <td style="border:1px solid #ccc; text-align:center; vertical-align:top;">{{ $tahap['pic'] ?? '-' }}</td>
                            <td style="border:1px solid #ccc; text-align:center; vertical-align:top;">{{ $tahap['supervisi'] ?? '-' }}</td>
                            <td style="border:1px solid #ccc; vertical-align:top;">{{ $tahap['keterangan'] ?? '-' }}</td>
                        </tr>
                    @endforeach
                @else
                    <tr style="background-color:#fff;">
                        <td style="border:1px solid #ccc; font-weight:bold;">
                            {{ $item->kegiatan }}<br>
                            <span style="font-weight:normal; font-size:6px; color:#666;">
                                Dept: {{ $item->departemen }} | Lokasi: {{ $item->lokasi }} | Tgl: {{ \Carbon\Carbon::parse($item->tanggal)->format('d/m/Y') }}
                            </span>
                        </td>
                        <td style="border:1px solid #ccc; text-align:center;">-</td>
                        <td style="border:1px solid #ccc;" colspan="2">Tidak ada tahapan</td>
                        <td style="border:1px solid #ccc;">-</td>
                        <td style="border:1px solid #ccc; text-align:center;">-</td>
                        <td style="border:1px solid #ccc; text-align:center;">-</td>
                        <td style="border:1px solid #ccc; text-align:center;">-</td>
                        <td style="border:1px solid #ccc;">-</td>
                        <td style="border:1px solid #ccc; text-align:center;">-</td>
                        <td style="border:1px solid #ccc; text-align:center;">-</td>
                        <td style="border:1px solid #ccc;">-</td>
                    </tr>
                @endif
            @empty
            <tr>
                <td colspan="12" style="border:1px solid #ccc; text-align:center; padding:10px; color:#888;">Tidak ada data JSA</td>
            </tr>
            @endforelse
        </tbody>
    </table>

    {{-- TANDA TANGAN 3 PIHAK --}}
    <table style="width:100%; border:1px solid #999; margin-top:10px; font-size:7px;">
        <tr>
            <td style="width:33%; text-align:center; font-weight:bold; padding:4px 2px; background-color:#E0F5E0; border:1px solid #999;">HEAD DEPT</td>
            <td style="width:34%; text-align:center; font-weight:bold; padding:4px 2px; background-color:#FFE0E6; border:1px solid #999;">HSSE</td>
            <td style="width:33%; text-align:center; font-weight:bold; padding:4px 2px; border:1px solid #999;">GM PRODUKSI</td>
        </tr>
        <tr>
            <td style="height:40px; border:1px solid #999;">&nbsp;</td>
            <td style="height:40px; border:1px solid #999;">&nbsp;</td>
            <td style="height:40px; border:1px solid #999;">&nbsp;</td>
        </tr>
        <tr>
            <td style="text-align:center; font-size:7px; color:#555; border:1px solid #999;">( Nama &amp; Tanda Tangan )</td>
            <td style="text-align:center; font-size:7px; color:#555; border:1px solid #999;">( Nama &amp; Tanda Tangan )</td>
            <td style="text-align:center; font-size:7px; color:#555; border:1px solid #999;">( Nama &amp; Tanda Tangan )</td>
        </tr>
        <tr>
            <td style="text-align:center; font-size:6px; color:#888; border:1px solid #999;">Tanggal: ___________</td>
            <td style="text-align:center; font-size:6px; color:#888; border:1px solid #999;">Tanggal: ___________</td>
            <td style="text-align:center; font-size:6px; color:#888; border:1px solid #999;">Tanggal: ___________</td>
        </tr>
    </table>

    {{-- FOOTER --}}
    <table style="width:100%; margin-top:4px; font-size:6px;">
        <tr>
            <td style="font-style:italic; color:#666;">
                <b>Note:</b>
                <span style="display:inline-block; width:7px; height:7px; background:white; border:1px solid #999;"></span> Putih; HSE,
                <span style="display:inline-block; width:7px; height:7px; background:#FFE0E6; border:1px solid #999;"></span> Merah Muda; Pemohon Izin,
                <span style="display:inline-block; width:7px; height:7px; background:#E0F5E0; border:1px solid #999;"></span> Hijau Muda; Pemilik Lokasi
            </td>
        </tr>
    </table>

    <table style="width:100%; margin-top:2px; border-top:1px solid #ddd;">
        <tr>
            <td align="center" style="font-size:6px; color:#999; padding-top:2px;">
                Total: {{ count($data) }} data JSA | Dicetak otomatis oleh Sistem HSE - PT. Industri Nabati Lestari
            </td>
        </tr>
    </table>
</body>
</html>
