<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Laporan General Work Permit (GWP)</title>
    <style>
        @page { margin: 8px 10px; }
        body { font-family: 'Helvetica', 'Arial', sans-serif; font-size: 8px; color: #333; margin: 0; padding: 0; }
        table { border-collapse: collapse; width: 100%; }
        td, th { padding: 2px 3px; }
    </style>
</head>
<body>
    {{-- KOP SURAT --}}
    <table style="width:100%; border-bottom:3px solid #1A365D; margin-bottom:6px;">
        <tr>
            <td align="center" style="padding-bottom:6px;">
                <div style="font-size:14px; font-weight:bold; color:#1A365D; letter-spacing:0.5px;">PT. INDUSTRI NABATI LESTARI</div>
                <div style="font-size:11px; font-weight:600; color:#555;">GENERAL WORK PERMIT (GWP)</div>
                <div style="font-size:8px; color:#888; margin-top:2px;">Kantor Pusat: Komp. KEK Sei Mangkei, Kav.2-3, Kec. Bosar Maligas, Kab. Simalungun, Sumatera Utara</div>
            </td>
        </tr>
    </table>

    {{-- JUDUL --}}
    <table style="width:100%; margin-bottom:4px;">
        <tr>
            <td align="center">
                <span style="font-size:11px; font-weight:bold; color:#1A365D; padding:4px 12px; background:#EBF4FF; border-radius:3px;">LAPORAN GENERAL WORK PERMIT (GWP)</span>
            </td>
        </tr>
    </table>

    {{-- INFO DOKUMEN --}}
    <table style="width:100%; font-size:7px; margin-bottom:2px; padding:3px 6px; background:#f9f9f9; border-radius:3px;">
        <tr>
            <td style="width:40%;"><b>No. Dokumen:</b> FM-BSHS-19/GWP-L</td>
            <td style="width:15%;"><b>No. Revisi:</b> 01</td>
            <td style="width:20%;"><b>Total Data:</b> {{ count($data) }}</td>
            <td style="width:25%;"><b>Tgl. Cetak:</b> {{ date('d/m/Y H:i') }}</td>
        </tr>
    </table>

    {{-- TABEL DATA GWP --}}
    <table style="width:100%; border:1px solid #1A365D; font-size:7px;">
        <thead>
            <tr style="background-color:#1A365D; color:#fff;">
                <th style="border:1px solid #0f2744; padding:4px 2px; text-align:center; width:3%;">No</th>
                <th style="border:1px solid #0f2744; padding:4px 2px; text-align:center; width:6%;">Tanggal</th>
                <th style="border:1px solid #0f2744; padding:4px 2px; text-align:center; width:5%;">Mulai</th>
                <th style="border:1px solid #0f2744; padding:4px 2px; text-align:center; width:5%;">Selesai</th>
                <th style="border:1px solid #0f2744; padding:4px 2px; text-align:center; width:7%;">Departemen</th>
                <th style="border:1px solid #0f2744; padding:4px 2px; text-align:center; width:8%;">Lokasi</th>
                <th style="border:1px solid #0f2744; padding:4px 2px; text-align:center; width:12%;">Deskripsi</th>
                <th style="border:1px solid #0f2744; padding:4px 2px; text-align:center; width:7%;">Peralatan</th>
                <th style="border:1px solid #0f2744; padding:4px 2px; text-align:center; width:6%;">Kategori</th>
                <th style="border:1px solid #0f2744; padding:4px 2px; text-align:center; width:5%;">Risiko</th>
                <th style="border:1px solid #0f2744; padding:4px 2px; text-align:center; width:5%;">Status</th>
                <th style="border:1px solid #0f2744; padding:4px 2px; text-align:center; width:6%;">Pemohon</th>
                <th style="border:1px solid #0f2744; padding:4px 2px; text-align:center; width:6%;">HSE</th>
                <th style="border:1px solid #0f2744; padding:4px 2px; text-align:center; width:6%;">Supervisor</th>
            </tr>
        </thead>
        <tbody>
            @forelse($data as $item)
            @php $bg = $loop->even ? '#f8fafc' : '#fff'; @endphp
            <tr style="background-color:{{ $bg }};">
                <td style="border:1px solid #e5e7eb; text-align:center;">{{ $loop->iteration }}</td>
                <td style="border:1px solid #e5e7eb; text-align:center;">{{ \Carbon\Carbon::parse($item->tanggal)->format('d/m') }}</td>
                <td style="border:1px solid #e5e7eb; text-align:center;">{{ substr($item->pukul_mulai, 0, 5) }}</td>
                <td style="border:1px solid #e5e7eb; text-align:center;">{{ substr($item->pukul_selesai, 0, 5) }}</td>
                <td style="border:1px solid #e5e7eb;">{{ $item->departemen }}</td>
                <td style="border:1px solid #e5e7eb;">{{ $item->lokasi }}</td>
                <td style="border:1px solid #e5e7eb;">{{ \Illuminate\Support\Str::limit($item->deskripsi_pekerjaan, 35) }}</td>
                <td style="border:1px solid #e5e7eb;">{{ \Illuminate\Support\Str::limit($item->peralatan, 25) }}</td>
                <td style="border:1px solid #e5e7eb; text-align:center;">
                    @if($item->kategori_pekerjaan == 'hot_work')
                        <span style="background:#fff7ed; color:#c2410c; padding:1px 3px; font-size:6px; font-weight:bold; border-radius:2px;">&#128293; Hot</span>
                    @else
                        <span style="background:#f0f9ff; color:#0369a1; padding:1px 3px; font-size:6px; font-weight:bold; border-radius:2px;">&#10052; Cold</span>
                    @endif
                </td>
                <td style="border:1px solid #e5e7eb; text-align:center;">
                    @if($item->kategori_risiko == 'rendah')
                        <span style="color:#166534; font-weight:bold;">Rendah</span>
                    @elseif($item->kategori_risiko == 'sedang')
                        <span style="color:#854d0e; font-weight:bold;">Sedang</span>
                    @else
                        <span style="color:#991b1b; font-weight:bold;">Tinggi</span>
                    @endif
                </td>
                <td style="border:1px solid #e5e7eb; text-align:center;">
                    @if($item->status == 'approved')
                        <span style="background:#dcfce7; color:#166534; padding:1px 3px; font-size:6px; font-weight:bold; border-radius:2px;">Approved</span>
                    @elseif($item->status == 'rejected')
                        <span style="background:#fee2e2; color:#991b1b; padding:1px 3px; font-size:6px; font-weight:bold; border-radius:2px;">Rejected</span>
                    @elseif($item->status == 'submitted')
                        <span style="background:#fef9c3; color:#854d0e; padding:1px 3px; font-size:6px; font-weight:bold; border-radius:2px;">Submitted</span>
                    @elseif($item->status == 'completed')
                        <span style="background:#d1fae5; color:#065f46; padding:1px 3px; font-size:6px; font-weight:bold; border-radius:2px;">Completed</span>
                    @else
                        <span style="background:#f3f4f6; color:#374151; padding:1px 3px; font-size:6px; font-weight:bold; border-radius:2px;">{{ ucfirst($item->status) }}</span>
                    @endif
                </td>
                <td style="border:1px solid #e5e7eb; font-size:6px;">
                    {{ $item->approvals->where('tipe', 'pemohon')->first()->nama ?? '-' }}
                </td>
                <td style="border:1px solid #e5e7eb; font-size:6px;">
                    {{ $item->approvals->where('tipe', 'hse')->first()->nama ?? '-' }}
                </td>
                <td style="border:1px solid #e5e7eb; font-size:6px;">
                    {{ $item->approvals->where('tipe', 'supervisor')->first()->nama ?? '-' }}
                </td>
            </tr>
            @empty
            <tr>
                <td colspan="14" style="border:1px solid #e5e7eb; text-align:center; padding:12px; color:#9ca3af;">Tidak ada data GWP</td>
            </tr>
            @endforelse
        </tbody>
    </table>

    {{-- TANDA TANGAN 3 PIHAK --}}
    <table style="width:100%; margin-top:12px; font-size:7px;">
        <tr>
            <td style="width:33%; text-align:center; font-weight:bold; padding:4px 2px; background:#dbeafe; border:1px solid #93c5fd;">A. PEMOHON IZIN</td>
            <td style="width:34%; text-align:center; font-weight:bold; padding:4px 2px; background:#f0fdf4; border:1px solid #86efac;">B. PEMILIK LOKASI</td>
            <td style="width:33%; text-align:center; font-weight:bold; padding:4px 2px; background:#dbeafe; border:1px solid #93c5fd;">C. PEMBERI IZIN (HSE)</td>
        </tr>
        <tr>
            <td style="height:35px; border:1px solid #e5e7eb;">&nbsp;</td>
            <td style="height:35px; border:1px solid #e5e7eb;">&nbsp;</td>
            <td style="height:35px; border:1px solid #e5e7eb;">&nbsp;</td>
        </tr>
        <tr>
            <td style="text-align:center; font-size:6px; color:#666; border:1px solid #e5e7eb;">( Nama &amp; Tanda Tangan )</td>
            <td style="text-align:center; font-size:6px; color:#666; border:1px solid #e5e7eb;">( Nama &amp; Tanda Tangan )</td>
            <td style="text-align:center; font-size:6px; color:#666; border:1px solid #e5e7eb;">( Nama &amp; Tanda Tangan )</td>
        </tr>
        <tr>
            <td style="text-align:center; font-size:6px; color:#999; border:1px solid #e5e7eb;">Tanggal: ___________</td>
            <td style="text-align:center; font-size:6px; color:#999; border:1px solid #e5e7eb;">Tanggal: ___________</td>
            <td style="text-align:center; font-size:6px; color:#999; border:1px solid #e5e7eb;">Tanggal: ___________</td>
        </tr>
    </table>

    {{-- FOOTER --}}
    <table style="width:100%; margin-top:6px; border-top:2px solid #1A365D; padding-top:4px;">
        <tr>
            <td align="center" style="font-size:7px; color:#888; padding-top:4px;">
                <b>Sistem Manajemen HSE</b> - PT. Industri Nabati Lestari | Dicetak: {{ date('d/m/Y H:i:s') }}
            </td>
        </tr>
    </table>
</body>
</html>
