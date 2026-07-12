<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Detail APD #{{ $data->id }}</title>
    <style>
        @page { margin: 20px; }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Times New Roman', Times, serif; font-size: 12px; color: #333; }
        .container { padding: 10px 20px; }
        .header { text-align: center; margin-bottom: 10px; }
        .header h1 { font-size: 18px; font-weight: bold; color: #2E7D32; }
        .header h2 { font-size: 14px; font-weight: bold; color: #444; margin: 2px 0; }
        .header p { font-size: 9px; color: #666; line-height: 1.4; }
        hr { border: none; border-top: 2px solid #2E7D32; margin: 8px 0; }
        .title { text-align: center; font-size: 16px; font-weight: bold; color: #1B5E20; margin: 10px 0; }
        .info-row { display: flex; margin: 8px 0; font-size: 12px; }
        .info-label { width: 160px; font-weight: bold; color: #555; }
        .info-value { flex: 1; color: #333; }
        .info-table { width: 100%; border-collapse: collapse; font-size: 9px; margin: 5px 0; }
        .info-table td { padding: 2px 5px; }
        .info-table td.left { text-align: left; width: 50%; }
        .info-table td.right { text-align: right; width: 50%; }
        .badge { display: inline-block; padding: 2px 10px; border-radius: 3px; font-weight: bold; font-size: 10px; }
        .badge-green { background: #d1fae5; color: #065f46; }
        .badge-red { background: #fee2e2; color: #991b1b; }
        .badge-gray { background: #e5e7eb; color: #374151; }
        .footer-text { text-align: center; font-size: 8px; color: #999; margin-top: 20px; border-top: 1px solid #ddd; padding-top: 5px; }
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
        <div class="title">DETAIL ALAT PELINDUNG DIRI</div>
        <table class="info-table">
            <tr>
                <td class="left">
                    <strong>No. Dokumen:</strong> FM-BSHS-19/APD-D &nbsp;|&nbsp; <strong>No. Revisi:</strong> 00
                </td>
                <td class="right">
                    <strong>Halaman:</strong> 1 dari 1 &nbsp;|&nbsp; <strong>Tgl. Berlaku:</strong> {{ \Carbon\Carbon::now()->format('d/m/Y') }}
                </td>
            </tr>
        </table>

        <div style="margin-top: 15px;">
            <div class="info-row">
                <div class="info-label">Kode APD</div>
                <div class="info-value">: {{ $data->kode }}</div>
            </div>
            <div class="info-row">
                <div class="info-label">Nama APD</div>
                <div class="info-value">: {{ $data->nama }}</div>
            </div>
            <div class="info-row">
                <div class="info-label">Stok</div>
                <div class="info-value">: {{ $data->stok }} {{ $data->satuan }}</div>
            </div>
            <div class="info-row">
                <div class="info-label">Tanggal Kadaluarsa</div>
                <div class="info-value">: {{ $data->tanggal_kadaluarsa ? \Carbon\Carbon::parse($data->tanggal_kadaluarsa)->format('d/m/Y') : '-' }}</div>
            </div>
            <div class="info-row">
                <div class="info-label">Status</div>
                <div class="info-value">:
                    @if($data->status == 'aktif')
                        <span class="badge badge-green">Aktif</span>
                    @elseif($data->status == 'kadaluarsa')
                        <span class="badge badge-red">Kadaluarsa</span>
                    @else
                        <span class="badge badge-gray">{{ ucfirst($data->status) }}</span>
                    @endif
                </div>
            </div>
        </div>

        <div style="margin-top: 20px; font-size: 9px; color: #888; text-align: right;">
            Dicetak pada: {{ \Carbon\Carbon::now()->format('d/m/Y H:i') }}
        </div>

        <div class="footer-text">
            Dicetak otomatis oleh Sistem HSE - PT. Industri Nabati Lestari
        </div>
    </div>
</body>
</html>
