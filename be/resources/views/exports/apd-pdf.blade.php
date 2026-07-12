<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Laporan APD</title>
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

        <div class="title">LAPORAN ALAT PELINDUNG DIRI (APD)</div>

        <table class="info-table">
            <tr>
                <td class="left">
                    <strong>No. Dokumen:</strong> FM-BSHS-19/APD &nbsp;|&nbsp; <strong>No. Revisi:</strong> 00
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
                    <th style="width:12%">Kode</th>
                    <th style="width:18%">Nama APD</th>
                    <th style="width:10%">Stok</th>
                    <th style="width:10%">Satuan</th>
                    <th style="width:14%">Kadaluarsa</th>
                    <th style="width:10%">Status</th>
                    <th style="width:22%">Keterangan</th>
                </tr>
            </thead>
            <tbody>
                @forelse($data as $item)
                <tr @if($loop->even) class="genap" @endif>
                    <td class="text-center">{{ $loop->iteration }}</td>
                    <td>{{ $item->kode }}</td>
                    <td>{{ $item->nama }}</td>
                    <td class="text-center">{{ $item->stok }}</td>
                    <td class="text-center">{{ $item->satuan }}</td>
                    <td class="text-center">{{ $item->tanggal_kadaluarsa ? \Carbon\Carbon::parse($item->tanggal_kadaluarsa)->format('d/m/Y') : '-' }}</td>
                    <td class="text-center">
                        @if($item->status == 'aktif')
                            <span style="background:#d1fae5; color:#065f46; padding:1px 6px; border-radius:3px; font-weight:bold; font-size:7px;">Aktif</span>
                        @elseif($item->status == 'nonaktif')
                            <span style="background:#e5e7eb; color:#374151; padding:1px 6px; border-radius:3px; font-weight:bold; font-size:7px;">Nonaktif</span>
                        @elseif($item->status == 'kadaluarsa')
                            <span style="background:#fee2e2; color:#991b1b; padding:1px 6px; border-radius:3px; font-weight:bold; font-size:7px;">Kadaluarsa</span>
                        @else
                            <span style="background:#f3f4f6; color:#666; padding:1px 6px; border-radius:3px; font-weight:bold; font-size:7px;">{{ ucfirst($item->status) }}</span>
                        @endif
                    </td>
                    <td style="font-size:7px; color:#888;">
                        @if($item->status == 'kadaluarsa' || ($item->tanggal_kadaluarsa && \Carbon\Carbon::parse($item->tanggal_kadaluarsa)->isPast()))
                            Perlu pengadaan baru
                        @elseif($item->stok <= 0)
                            Stok habis
                        @elseif($item->stok <= 5)
                            Stok menipis
                        @else
                            Stok tersedia
                        @endif
                    </td>
                </tr>
                @empty
                <tr>
                    <td colspan="8" class="text-center" style="padding:15px; color:#888;">Tidak ada data APD</td>
                </tr>
                @endforelse
            </tbody>
        </table>

        <div class="footer-text">
            Total: {{ count($data) }} data APD | Dicetak otomatis oleh Sistem HSE - PT. Industri Nabati Lestari
        </div>
    </div>
</body>
</html>
