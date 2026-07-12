<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Detail CSE Permit #{{ $data->id }}</title>
    <style>
        @page { margin: 15mm; }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Helvetica', 'Arial', sans-serif; font-size: 10px; color: #333; line-height: 1.4; }

        .header { text-align: center; margin-bottom: 8px; border-bottom: 3px solid #2E7D32; padding-bottom: 8px; }
        .header h1 { font-size: 16px; font-weight: bold; color: #2E7D32; letter-spacing: 0.5px; }
        .header h2 { font-size: 11px; font-weight: 600; color: #555; margin: 2px 0; }
        .header p { font-size: 8px; color: #888; line-height: 1.3; }

        .doc-title { text-align: center; font-size: 14px; font-weight: bold; color: #1B5E20; margin: 10px 0 8px; padding: 6px; background: #E8F5E9; border-radius: 4px; }

        .doc-info { display: flex; justify-content: space-between; font-size: 8px; color: #666; margin-bottom: 10px; padding: 4px 8px; background: #f9f9f9; border-radius: 3px; }

        .section { margin: 10px 0; }
        .section-header { display: flex; align-items: center; gap: 6px; margin-bottom: 6px; }
        .section-number { width: 18px; height: 18px; background: #2E7D32; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 9px; font-weight: bold; }
        .section-title { font-size: 10px; font-weight: bold; color: #2E7D32; text-transform: uppercase; letter-spacing: 0.5px; }

        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4px 12px; font-size: 9px; }
        .info-item { display: flex; padding: 3px 0; border-bottom: 1px dotted #e0e0e0; }
        .info-label { width: 130px; font-weight: 600; color: #555; }
        .info-value { flex: 1; color: #333; }

        .flowchart { display: flex; justify-content: space-between; align-items: flex-start; margin: 10px 0; padding: 8px; background: #f8f9fa; border-radius: 6px; border: 1px solid #e9ecef; }
        .flow-step { display: flex; flex-direction: column; align-items: center; flex: 1; position: relative; }
        .flow-circle { width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 8px; font-weight: bold; color: white; margin-bottom: 4px; border: 2px solid; }
        .flow-circle.completed { background: #22c55e; border-color: #22c55e; }
        .flow-circle.current { background: #3b82f6; border-color: #3b82f6; }
        .flow-circle.rejected { background: #ef4444; border-color: #ef4444; }
        .flow-circle.upcoming { background: #e5e7eb; border-color: #d1d5db; color: #9ca3af; }
        .flow-label { font-size: 8px; font-weight: 600; text-align: center; }
        .flow-label.completed { color: #16a34a; }
        .flow-label.current { color: #2563eb; }
        .flow-label.rejected { color: #dc2626; }
        .flow-label.upcoming { color: #9ca3af; }
        .flow-sublabel { font-size: 7px; color: #888; text-align: center; }
        .flow-connector { position: absolute; top: 14px; left: 50%; width: 100%; height: 2px; z-index: 0; }
        .flow-connector.completed { background: #22c55e; }
        .flow-connector.upcoming { background: #d1d5db; }

        .reject-box { background: #fef2f2; border: 1px solid #fecaca; border-radius: 4px; padding: 6px 10px; margin: 8px 0; }
        .reject-title { font-weight: bold; color: #991b1b; font-size: 9px; margin-bottom: 2px; }
        .reject-text { color: #dc2626; font-size: 9px; }

        .badge { display: inline-block; padding: 2px 8px; border-radius: 3px; font-weight: 600; font-size: 8px; }
        .badge-green { background: #dcfce7; color: #166534; }
        .badge-yellow { background: #fef9c3; color: #854d0e; }
        .badge-red { background: #fee2e2; color: #991b1b; }
        .badge-blue { background: #dbeafe; color: #1e40af; }
        .badge-gray { background: #f3f4f6; color: #374151; }
        .badge-emerald { background: #d1fae5; color: #065f46; }

        .gas-list { margin-top: 4px; }
        .gas-item { padding: 3px 8px; background: #f0f9ff; border: 1px solid #bae6fd; border-radius: 4px; font-size: 8px; margin-bottom: 2px; color: #0369a1; }

        .signature-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; margin-top: 15px; }
        .signature-box { text-align: center; }
        .signature-line { border-top: 1px solid #333; margin-top: 30px; padding-top: 4px; font-size: 8px; color: #555; }

        .footer { margin-top: 15px; padding-top: 8px; border-top: 2px solid #2E7D32; text-align: center; font-size: 7px; color: #999; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>PT. INDUSTRI NABATI LESTARI</h1>
            <h2>CONFINED SPACE ENTRY PERMIT (CSE)</h2>
            <p>Kantor Pusat: Komp. KEK Sei Mangkei, Kav.2-3, Kec. Bosar Maligas, Kab. Simalungun, Sumatera Utara</p>
        </div>

        <div class="doc-info">
            <span><strong>No. Dokumen:</strong> FM-BSHS-19/CSE-D | <strong>Revisi:</strong> 01</span>
            <span><strong>CSE #:</strong> {{ str_pad($data->id, 3, '0', STR_PAD_LEFT) }} | <strong>Tanggal:</strong> {{ \Carbon\Carbon::now()->format('d/m/Y') }}</span>
        </div>

        <div class="doc-title">ALUR FLOWCHART CONFINED SPACE ENTRY</div>

        @php
            $steps = ['draft', 'submitted', 'approved', 'completed'];
            $stepLabels = ['Draft', 'Submitted', 'Approved', 'Completed'];
            $stepSublabels = ['Pemohon Isi', 'Menunggu Review', 'Disetujui HSE', 'Selesai'];
            $currentIndex = array_search($data->status, $steps);
            $isRejected = $data->status === 'rejected';
        @endphp

        <div class="flowchart">
            @foreach($steps as $index => $step)
                @php
                    if ($isRejected && $index === $currentIndex) $state = 'rejected';
                    elseif ($index < $currentIndex) $state = 'completed';
                    elseif ($index === $currentIndex) $state = 'current';
                    else $state = 'upcoming';
                @endphp
                <div class="flow-step">
                    @if(!$loop->last)
                        <div class="flow-connector {{ $state }}"></div>
                    @endif
                    <div class="flow-circle {{ $state }}">
                        @if($state === 'completed') &#10003;
                        @elseif($state === 'current' && !$isRejected) &#9654;
                        @elseif($state === 'rejected') &#10007;
                        @else {{ $index + 1 }}
                        @endif
                    </div>
                    <div class="flow-label {{ $state }}">{{ $stepLabels[$index] }}</div>
                    <div class="flow-sublabel">{{ $stepSublabels[$index] }}</div>
                </div>
            @endforeach
        </div>

        @if($isRejected && $data->catatan)
            <div class="reject-box">
                <div class="reject-title">Alasan Reject:</div>
                <div class="reject-text">{{ $data->catatan }}</div>
            </div>
        @endif

        <div class="section">
            <div class="section-header">
                <div class="section-number">A</div>
                <div class="section-title">Identitas Izin Kerja</div>
            </div>
            <div class="info-grid">
                <div class="info-item">
                    <div class="info-label">Nomor CSE</div>
                    <div class="info-value">: {{ $data->permit_number ?? 'CSE-'.str_pad($data->id, 3, '0', STR_PAD_LEFT) }}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Tanggal</div>
                    <div class="info-value">: {{ \Carbon\Carbon::parse($data->tanggal)->format('d/m/Y') }}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Supervisor</div>
                    <div class="info-value">: {{ $data->supervisor }}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Fasilitas</div>
                    <div class="info-value">: {{ $data->fasilitas }}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Lokasi</div>
                    <div class="info-value">: {{ $data->lokasi }}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Jumlah Pekerja</div>
                    <div class="info-value">: {{ $data->jumlah_pekerja }} orang</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Pemohon</div>
                    <div class="info-value">: {{ $data->user->name ?? '-' }}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Status</div>
                    <div class="info-value">:
                        @if($data->status == 'approved')
                            <span class="badge badge-green">Approved</span>
                        @elseif($data->status == 'rejected')
                            <span class="badge badge-red">Rejected</span>
                        @elseif($data->status == 'submitted')
                            <span class="badge badge-blue">Submitted</span>
                        @elseif($data->status == 'completed')
                            <span class="badge badge-emerald">Completed</span>
                        @else
                            <span class="badge badge-gray">{{ ucfirst($data->status) }}</span>
                        @endif
                    </div>
                </div>
            </div>
        </div>

        <div class="section">
            <div class="section-header">
                <div class="section-number">B</div>
                <div class="section-title">Alasan & Detail Pekerjaan</div>
            </div>
            <div class="info-grid">
                <div class="info-item" style="grid-column: span 2;">
                    <div class="info-label">Alasan Masuk</div>
                    <div class="info-value">: {{ $data->alasan }}</div>
                </div>
                @if($data->catatan)
                <div class="info-item" style="grid-column: span 2;">
                    <div class="info-label">Catatan</div>
                    <div class="info-value">: {{ $data->catatan }}</div>
                </div>
                @endif
            </div>
        </div>

        @if($data->hasil_gas && count($data->hasil_gas) > 0)
        <div class="section">
            <div class="section-header">
                <div class="section-number">C</div>
                <div class="section-title">Hasil Uji Gas</div>
            </div>
            <div class="gas-list">
                @foreach($data->hasil_gas as $gas)
                    <div class="gas-item">{{ $gas }}</div>
                @endforeach
            </div>
        </div>
        @endif

        <div class="signature-grid">
            <div class="signature-box">
                <div class="signature-line">Pemohon Izin</div>
            </div>
            <div class="signature-box">
                <div class="signature-line">HSE (Pemberi Izin)</div>
            </div>
            <div class="signature-box">
                <div class="signature-line">Supervisor</div>
            </div>
        </div>

        <div class="footer">
            <p>Dicetak pada: {{ \Carbon\Carbon::now()->format('d/m/Y H:i:s') }} | Sistem HSE - PT. Industri Nabati Lestari</p>
            <p style="margin-top: 2px;">Dokumen ini merupakan cetakan otomatis dari Sistem Manajemen HSE</p>
        </div>
    </div>
</body>
</html>
