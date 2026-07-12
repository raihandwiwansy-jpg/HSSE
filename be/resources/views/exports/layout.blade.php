<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>{{ $title ?? 'Laporan HSE' }}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Helvetica', 'Arial', sans-serif; font-size: 11px; color: #333; padding: 30px; }
        .header { text-align: center; margin-bottom: 25px; border-bottom: 3px solid #2E7D32; padding-bottom: 15px; }
        .header h1 { font-size: 18px; color: #2E7D32; margin-bottom: 5px; }
        .header h2 { font-size: 14px; color: #555; font-weight: normal; }
        .header .date { font-size: 10px; color: #888; margin-top: 5px; }
        table { width: 100%; border-collapse: collapse; margin-top: 15px; }
        th { background-color: #2E7D32; color: white; padding: 8px 6px; text-align: left; font-size: 10px; }
        td { padding: 6px; border-bottom: 1px solid #ddd; font-size: 10px; vertical-align: top; }
        tr:nth-child(even) { background-color: #f8f9fa; }
        tr:hover { background-color: #eef2ff; }
        .footer { margin-top: 20px; text-align: center; font-size: 9px; color: #888; border-top: 1px solid #ddd; padding-top: 10px; }
        .badge { display: inline-block; padding: 2px 8px; border-radius: 10px; font-size: 9px; font-weight: bold; }
        .badge-pending { background: #fef3c7; color: #92400e; }
        .badge-investigation { background: #dbeafe; color: #1e40af; }
        .badge-resolved { background: #d1fae5; color: #065f46; }
        .badge-closed { background: #e5e7eb; color: #374151; }
        .badge-approved { background: #d1fae5; color: #065f46; }
        .badge-rejected { background: #fee2e2; color: #991b1b; }
        .badge-rendah { background: #d1fae5; color: #065f46; }
        .badge-sedang { background: #fef3c7; color: #92400e; }
        .badge-tinggi { background: #fee2e2; color: #991b1b; }
    </style>
</head>
<body>
    <div class="header">
        <h1>PT. INDUSTRI NABATI LESTARI</h1>
        <h2>{{ $title ?? 'Laporan HSE' }}</h2>
        <div class="date">Dicetak pada: {{ now()->format('d/m/Y H:i') }}</div>
    </div>

    @yield('content')

    <div class="footer">
        <p>Halaman ini dicetak secara otomatis oleh Sistem HSE - PT. INDUSTRI NABATI LESTARI</p>
    </div>
</body>
</html>
