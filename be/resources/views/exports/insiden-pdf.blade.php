<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Laporan Insiden</title>
    <style>
        @page { margin: 15px; }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Times New Roman', Times, serif; font-size: 11px; color: #333; }
        .container { padding: 10px 15px; }
        .header { text-align: center; margin-bottom: 8px; }
        .header h1 { font-size: 18px; font-weight: bold; color: #2E7D32; margin: 0; padding: 0; }
        .header h2 { font-size: 14px; font-weight: bold; color: #444; margin: 2px 0; padding: 0; }
        .header p { font-size: 9px; color: #666; margin: 1px 0; padding: 0; line-height: 1.4; }
        hr { border: none; border-top: 2px solid #2E7D32; margin: 6px 0; }
        .title { text-align: center; font-size: 14px; font-weight: bold; color: #1B5E20; margin: 8px 0; }
        .info-table { width: 100%; border-collapse: collapse; font-size: 9px; margin: 5px 0; }
        .info-table td { padding: 2px 5px; }
        .info-table td.left { text-align: left; width: 50%; }
        .info-table td.right { text-align: right; width: 50%; }
        .print-date { text-align: center; font-size: 9px; color: #888; margin: 5px 0; font-style: italic; }
        table.data { width: 100%; border-collapse: collapse; font-size: 9px; margin-top: 5px; }
        table.data th {
            background-color: #2E7D32; color: white; padding: 5px 3px;
            text-align: center; font-weight: bold; font-size: 8px;
            border: 1px solid #1B5E20;
        }
        table.data td {
            padding: 3px; border: 1px solid #ccc; font-size: 8px; vertical-align: top;
        }
        table.data tr.genap { background-color: #f5faf5; }
        .text-center { text-align: center; }
        .badge { font-size: 7px; font-weight: bold; padding: 1px 5px; }
        .footer-text { text-align: center; font-size: 8px; color: #999; margin-top: 8px; border-top: 1px solid #ddd; padding-top: 5px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>PT. INDUSTRI NABATI LESTARI</h1>
            <h2>PABRIK MINYAK GORENG</h2>
            <p>Kantor Pusat: Komp. KEK Sei Mangkei, Kav.2-3, Kec. Bosar Maligas</p>
            <p>Kab. Simalungun, Sumatera Utara, 21183</p>
        </div>

        <hr>

        <div class="title">LAPORAN INSIDEN</div>

        <table class="info-table">
            <tr>
                <td class="left">
                    <strong>No. Dokumen:</strong> FM-BSHS-19/INS &nbsp;|&nbsp; <strong>No. Revisi:</strong> 00
                </td>
                <td class="right">
                    <strong>Halaman:</strong> 1 dari 1 &nbsp;|&nbsp; <strong>Tgl. Berlaku:</strong> {{ \Carbon\Carbon::now()->format('d/m/Y') }}
                </td>
            </tr>
        </table>

        <div class="print-date">Dicetak pada: {{ \Carbon\Carbon::now()->format('d/m/Y H:i') }}</div>

        <table class="data" cellspacing="0" cellpadding="0">
            <thead>
                <tr>
                    <th style="width:4%">No</th>
                    <th style="width:10%">Tanggal</th>
                    <th style="width:18%">Judul</th>
                    <th style="width:10%">Jenis</th>
                    <th style="width:14%">Lokasi</th>
                    <th style="width:20%">Deskripsi</th>
                    <th style="width:12%">Pelapor</th>
                    <th style="width:8%">Status</th>
                </tr>
            </thead>
            <tbody>
                @forelse($data as $item)
                <tr @if($loop->even) class="genap" @endif>
                    <td class="text-center">{{ $loop->iteration }}</td>
                    <td class="text-center">{{ \Carbon\Carbon::parse($item->tanggal_kejadian)->format('d/m/Y') }}</td>
                    <td>{{ $item->judul }}</td>
                    <td class="text-center">{{ ucfirst($item->jenis) }}</td>
                    <td>{{ $item->lokasi }}</td>
                    <td>{{ $item->deskripsi }}</td>
                    <td>{{ $item->user->name ?? '-' }}</td>
                    <td class="text-center">
                        @if($item->status == 'resolved')
                            <span style="background:#d1fae5; color:#065f46; padding:1px 6px; border-radius:3px; font-weight:bold; font-size:7px;">Selesai</span>
                        @elseif($item->status == 'investigation')
                            <span style="background:#dbeafe; color:#1e40af; padding:1px 6px; border-radius:3px; font-weight:bold; font-size:7px;">Investigasi</span>
                        @elseif($item->status == 'pending')
                            <span style="background:#fef3c7; color:#92400e; padding:1px 6px; border-radius:3px; font-weight:bold; font-size:7px;">Pending</span>
                        @elseif($item->status == 'closed')
                            <span style="background:#e5e7eb; color:#374151; padding:1px 6px; border-radius:3px; font-weight:bold; font-size:7px;">Tutup</span>
                        @else
                            <span style="background:#f3f4f6; color:#666; padding:1px 6px; border-radius:3px; font-weight:bold; font-size:7px;">{{ ucfirst($item->status) }}</span>
                        @endif
                    </td>
                </tr>
                @empty
                <tr>
                    <td colspan="8" class="text-center" style="padding:15px; color:#888;">Tidak ada data insiden</td>
                </tr>
                @endforelse
            </tbody>
        </table>

        <div class="footer-text">
            Total: {{ count($data) }} data insiden | Dicetak otomatis oleh Sistem HSE - PT. Industri Nabati Lestari
        </div>
    </div>
</body>
</html>
