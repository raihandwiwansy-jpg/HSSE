<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Laporan Critical Lifting Work Permit (LWP)</title>
    <style>
        @page { margin: 8px 10px; }
        body { font-family: sans-serif; font-size: 8px; color: #333; margin: 0; padding: 0; }
        table { border-collapse: collapse; width: 100%; }
        td, th { padding: 2px 3px; }
    </style>
</head>
<body>
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

    <table style="width:100%; margin-bottom:3px;">
        <tr>
            <td align="center">
                <span style="font-size:12px; font-weight:bold; color:#1B5E20;">LAPORAN CRITICAL LIFTING WORK PERMIT (LWP)</span>
            </td>
        </tr>
    </table>

    <table style="width:100%; font-size:7px; margin-bottom:1px;">
        <tr>
            <td style="width:40%;"><b>No. Dokumen:</b> FM-BSHS-19/07</td>
            <td style="width:15%;"><b>No. Revisi:</b> 00</td>
            <td style="width:20%;"><b>Halaman:</b> 1 dari 1</td>
            <td style="width:25%;"><b>Tgl. Berlaku:</b> 2024-08-01</td>
        </tr>
    </table>

    <table style="width:100%; font-size:7px; margin-bottom:4px;">
        <tr>
            <td align="right" style="font-style:italic; color:#888;">Dicetak pada: {{ date('d/m/Y H:i') }}</td>
        </tr>
    </table>

    <table style="width:100%; border:1px solid #2E7D32; font-size:7px;">
        <thead>
            <tr style="background-color:#2E7D32; color:#fff;">
                <th style="border:1px solid #1B5E20; padding:3px 2px; text-align:center; width:3%;">No</th>
                <th style="border:1px solid #1B5E20; padding:3px 2px; text-align:center; width:8%;">Tanggal</th>
                <th style="border:1px solid #1B5E20; padding:3px 2px; text-align:center; width:10%;">Lokasi</th>
                <th style="border:1px solid #1B5E20; padding:3px 2px; text-align:center; width:20%;">Pekerjaan</th>
                <th style="border:1px solid #1B5E20; padding:3px 2px; text-align:center; width:10%;">Beban Total</th>
                <th style="border:1px solid #1B5E20; padding:3px 2px; text-align:center; width:12%;">Kapasitas Crane</th>
                <th style="border:1px solid #1B5E20; padding:3px 2px; text-align:center; width:6%;">Status</th>
                <th style="border:1px solid #1B5E20; padding:3px 2px; text-align:center; width:14%;">Catatan</th>
                <th style="border:1px solid #1B5E20; padding:3px 2px; text-align:center; width:8%;">Pemohon</th>
            </tr>
        </thead>
        <tbody>
            @forelse($data as $item)
            @php $bg = $loop->even ? '#f5faf5' : '#fff'; @endphp
            <tr style="background-color:{{ $bg }};">
                <td style="border:1px solid #ccc; text-align:center;">{{ $loop->iteration }}</td>
                <td style="border:1px solid #ccc; text-align:center;">{{ \Carbon\Carbon::parse($item->tanggal ?? $item->created_at)->format('d/m/Y') }}</td>
                <td style="border:1px solid #ccc;">{{ $item->lokasi ?? '-' }}</td>
                <td style="border:1px solid #ccc;">{{ $item->pekerjaan ?? '-' }}</td>
                <td style="border:1px solid #ccc; text-align:center;">{{ $item->beban_total ?? '-' }}</td>
                <td style="border:1px solid #ccc; text-align:center;">{{ $item->kapasitas_crane ?? '-' }}</td>
                <td style="border:1px solid #ccc; text-align:center;">
                    @if(($item->status ?? '') == 'approved')
                        <span style="background:#d1fae5; color:#065f46; padding:1px 3px; font-size:6px; font-weight:bold;">Disetujui</span>
                    @elseif(($item->status ?? '') == 'rejected')
                        <span style="background:#fee2e2; color:#991b1b; padding:1px 3px; font-size:6px; font-weight:bold;">Ditolak</span>
                    @else
                        <span style="background:#fef3c7; color:#92400e; padding:1px 3px; font-size:6px; font-weight:bold;">{{ ucfirst($item->status ?? 'Draft') }}</span>
                    @endif
                </td>
                <td style="border:1px solid #ccc;">{{ $item->catatan ?? '-' }}</td>
                <td style="border:1px solid #ccc;">{{ $item->user->name ?? '-' }}</td>
            </tr>
            @empty
            <tr>
                <td colspan="9" style="border:1px solid #ccc; text-align:center; padding:10px; color:#888;">Tidak ada data LWP</td>
            </tr>
            @endforelse
        </tbody>
    </table>

    <table style="width:100%; border:1px solid #999; margin-top:10px; font-size:7px;">
        <tr>
            <td style="width:25%; text-align:center; font-weight:bold; padding:4px 2px; background-color:#FFE0E6; border:1px solid #999;">PEMOHON IZIN</td>
            <td style="width:25%; text-align:center; font-weight:bold; padding:4px 2px; background-color:#E0F5E0; border:1px solid #999;">PEMILIK LOKASI</td>
            <td style="width:25%; text-align:center; font-weight:bold; padding:4px 2px; border:1px solid #999;">PEMBERI IZIN (HSE)</td>
            <td style="width:25%; text-align:center; font-weight:bold; padding:4px 2px; border:1px solid #999;">MENGETAHUI</td>
        </tr>
        <tr>
            <td style="height:40px; border:1px solid #999;">&nbsp;</td>
            <td style="height:40px; border:1px solid #999;">&nbsp;</td>
            <td style="height:40px; border:1px solid #999;">&nbsp;</td>
            <td style="height:40px; border:1px solid #999;">&nbsp;</td>
        </tr>
        <tr>
            <td style="text-align:center; font-size:7px; color:#555; border:1px solid #999;">( Nama &amp; Tanda Tangan )</td>
            <td style="text-align:center; font-size:7px; color:#555; border:1px solid #999;">( Nama &amp; Tanda Tangan )</td>
            <td style="text-align:center; font-size:7px; color:#555; border:1px solid #999;">( Nama &amp; Tanda Tangan )</td>
            <td style="text-align:center; font-size:7px; color:#555; border:1px solid #999;">( Nama &amp; Tanda Tangan )</td>
        </tr>
        <tr>
            <td style="text-align:center; font-size:6px; color:#888; border:1px solid #999;">Tanggal: ___________</td>
            <td style="text-align:center; font-size:6px; color:#888; border:1px solid #999;">Tanggal: ___________</td>
            <td style="text-align:center; font-size:6px; color:#888; border:1px solid #999;">Tanggal: ___________</td>
            <td style="text-align:center; font-size:6px; color:#888; border:1px solid #999;">Tanggal: ___________</td>
        </tr>
    </table>

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
                Total: {{ count($data) }} data LWP | Dicetak otomatis oleh Sistem HSE - PT. Industri Nabati Lestari
            </td>
        </tr>
    </table>
</body>
</html>
