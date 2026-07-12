<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Detail HWP Permit #{{ $data->id }}</title>
    <style>
        @page { margin: 15mm; }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Helvetica', 'Arial', sans-serif; font-size: 10px; color: #333; line-height: 1.4; }
        .container { padding: 0; }

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

        .actor-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; margin: 8px 0; }
        .actor-card { padding: 6px; border: 1px solid #e5e7eb; border-radius: 4px; font-size: 8px; }
        .actor-card.approved { background: #f0fdf4; border-color: #bbf7d0; }
        .actor-card.rejected { background: #fef2f2; border-color: #fecaca; }
        .actor-card.pending { background: #f9fafb; border-color: #e5e7eb; }
        .actor-title { font-weight: 600; color: #374151; margin-bottom: 2px; }
        .actor-name { color: #111827; font-size: 9px; }
        .actor-date { color: #9ca3af; font-size: 7px; margin-top: 2px; }

        .reject-box { background: #fef2f2; border: 1px solid #fecaca; border-radius: 4px; padding: 6px 10px; margin: 8px 0; }
        .reject-title { font-weight: bold; color: #991b1b; font-size: 9px; margin-bottom: 2px; }
        .reject-text { color: #dc2626; font-size: 9px; }

        table.data { width: 100%; border-collapse: collapse; font-size: 9px; margin-top: 6px; }
        table.data th { background: #2E7D32; color: white; padding: 5px 6px; text-align: left; font-weight: 600; font-size: 8px; border: 1px solid #1B5E20; }
        table.data td { padding: 5px 6px; border: 1px solid #e5e7eb; }
        table.data tr:nth-child(even) { background: #f9fafb; }

        .badge { display: inline-block; padding: 2px 8px; border-radius: 3px; font-weight: 600; font-size: 8px; }
        .badge-green { background: #dcfce7; color: #166534; }
        .badge-yellow { background: #fef9c3; color: #854d0e; }
        .badge-red { background: #fee2e2; color: #991b1b; }
        .badge-blue { background: #dbeafe; color: #1e40af; }
        .badge-gray { background: #f3f4f6; color: #374151; }
        .badge-emerald { background: #d1fae5; color: #065f46; }
        .badge-orange { background: #ffedd5; color: #9a3412; }

        .signature-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; margin-top: 15px; }
        .signature-box { text-align: center; }
        .signature-line { border-top: 1px solid #333; margin-top: 30px; padding-top: 4px; font-size: 8px; color: #555; }

        .footer { margin-top: 15px; padding-top: 8px; border-top: 2px solid #2E7D32; text-align: center; font-size: 7px; color: #999; }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <h1>PT. INDUSTRI NABATI LESTARI</h1>
            <h2>HOT WORK PERMIT (HWP)</h2>
            <p>Kantor Pusat: Komp. KEK Sei Mangkei, Kav.2-3, Kec. Bosar Maligas, Kab. Simalungun, Sumatera Utara</p>
        </div>

        <!-- Document Info -->
        <div class="doc-info">
            <span><strong>No. Dokumen:</strong> FM-BSHS-19/HWP-D | <strong>Revisi:</strong> 01</span>
            <span><strong>HWP #:</strong> {{ $data->permit_number ?? 'HWP-'.str_pad($data->id, 3, '0', STR_PAD_LEFT) }} | <strong>Tanggal:</strong> {{ \Carbon\Carbon::now()->format('d/m/Y') }}</span>
        </div>

        <div class="doc-title">ALUR FLOWCHART HOT WORK PERMIT</div>

        <!-- Status Flowchart -->
        @php
            $steps = ['draft', 'submitted', 'approved', 'completed'];
            $stepLabels = ['Draft', 'Submitted', 'Approved', 'Completed'];
            $stepSublabels = ['Pemohon Izin', 'HSE Review', 'HSE Approve', 'Supervisor Verify'];
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

        <!-- Rejected Notice -->
        @if($isRejected && $data->catatan_reject)
            <div class="reject-box">
                <div class="reject-title">Alasan Reject:</div>
                <div class="reject-text">{{ $data->catatan_reject }}</div>
            </div>
        @endif

        <!-- Actor Info -->
        @php
            $pemohon = $data->approvals->where('tipe', 'pemohon')->first();
            $hse = $data->approvals->where('tipe', 'hse')->first();
            $supervisor = $data->approvals->where('tipe', 'supervisor')->first();
        @endphp

        <div class="actor-grid">
            <div class="actor-card {{ $pemohon && $pemohon->status === 'approved' ? 'approved' : 'pending' }}">
                <div class="actor-title">1. Pemohon Izin</div>
                <div class="actor-name">{{ $pemohon->nama ?? $data->user->name ?? '-' }}</div>
                @if($pemohon && $pemohon->jabatan)
                    <div style="color:#6b7280;">{{ $pemohon->jabatan }}</div>
                @endif
                <div class="actor-date">{{ $data->submitted_at ? \Carbon\Carbon::parse($data->submitted_at)->format('d/m/Y H:i') : '-' }}</div>
            </div>
            <div class="actor-card {{ $hse && $hse->status === 'approved' ? 'approved' : ($hse && $hse->status === 'rejected' ? 'rejected' : 'pending') }}">
                <div class="actor-title">2. HSE (Pemberi Izin)</div>
                <div class="actor-name">{{ $hse->nama ?? '-' }}</div>
                @if($hse && $hse->jabatan)
                    <div style="color:#6b7280;">{{ $hse->jabatan }}</div>
                @endif
                <div class="actor-date">{{ $data->approved_at ? \Carbon\Carbon::parse($data->approved_at)->format('d/m/Y H:i') : '-' }}</div>
                @if($hse && $hse->catatan)
                    <div style="color:#6b7280; font-style:italic; margin-top:2px;">"{{ $hse->catatan }}"</div>
                @endif
            </div>
            <div class="actor-card {{ $supervisor && $supervisor->status === 'approved' ? 'approved' : 'pending' }}">
                <div class="actor-title">3. Supervisor (Pemilik Lokasi)</div>
                <div class="actor-name">{{ $supervisor->nama ?? '-' }}</div>
                @if($supervisor && $supervisor->jabatan)
                    <div style="color:#6b7280;">{{ $supervisor->jabatan }}</div>
                @endif
                <div class="actor-date">{{ $data->completed_at ? \Carbon\Carbon::parse($data->completed_at)->format('d/m/Y H:i') : '-' }}</div>
            </div>
        </div>

        <!-- Section A: Identitas Izin -->
        <div class="section">
            <div class="section-header">
                <div class="section-number">A</div>
                <div class="section-title">Identitas Izin Kerja Panas</div>
            </div>
            <div class="info-grid">
                <div class="info-item">
                    <div class="info-label">Nomor HWP</div>
                    <div class="info-value">: {{ $data->permit_number ?? 'HWP-'.str_pad($data->id, 3, '0', STR_PAD_LEFT) }}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Tanggal</div>
                    <div class="info-value">: {{ \Carbon\Carbon::parse($data->tanggal)->format('d/m/Y') }}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Shift</div>
                    <div class="info-value">: {{ $data->shift ?? '-' }}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Lokasi Pekerjaan</div>
                    <div class="info-value">: {{ $data->lokasi }}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Jam Mulai</div>
                    <div class="info-value">: {{ $data->jam_mulai ?? '-' }}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Jam Selesai</div>
                    <div class="info-value">: {{ $data->jam_selesai ?? '-' }}</div>
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
                @if($data->gwp_permit_id)
                <div class="info-item" style="grid-column: span 2;">
                    <div class="info-label">GWP Terkait</div>
                    <div class="info-value">: GWP-{{ str_pad($data->gwp_permit_id, 3, '0', STR_PAD_LEFT) }}</div>
                </div>
                @endif
            </div>
        </div>

        <!-- Section B: Identitas Pekerjaan -->
        <div class="section">
            <div class="section-header">
                <div class="section-number">B</div>
                <div class="section-title">Identitas Pekerjaan</div>
            </div>
            <div class="info-grid">
                <div class="info-item" style="grid-column: span 2;">
                    <div class="info-label">Deskripsi Pekerjaan</div>
                    <div class="info-value">: {{ $data->deskripsi }}</div>
                </div>
                <div class="info-item" style="grid-column: span 2;">
                    <div class="info-label">Bahaya Terkait</div>
                    <div class="info-value">: {{ $data->bahaya_terkait ?? '-' }}</div>
                </div>
                <div class="info-item" style="grid-column: span 2;">
                    <div class="info-label">Tindakan Pencegahan</div>
                    <div class="info-value">: {{ $data->pencegahan ?? '-' }}</div>
                </div>
                <div class="info-item" style="grid-column: span 2;">
                    <div class="info-label">APD Digunakan</div>
                    <div class="info-value">: {{ $data->apd_digunakan ?? '-' }}</div>
                </div>
                @if($data->catatan_reject && $data->status === 'rejected')
                <div class="info-item" style="grid-column: span 2;">
                    <div class="info-label">Catatan Penolakan</div>
                    <div class="info-value" style="color:#dc2626;">: {{ $data->catatan_reject }}</div>
                </div>
                @endif
            </div>
        </div>

        <!-- Approval Table -->
        @if($data->approvals && count($data->approvals) > 0)
        <div class="section">
            <div class="section-header">
                <div class="section-number">C</div>
                <div class="section-title">Approval & Tanda Tangan</div>
            </div>
            <table class="data">
                <thead>
                    <tr>
                        <th style="width:22%">Tipe</th>
                        <th style="width:25%">Nama</th>
                        <th style="width:18%">Tanggal</th>
                        <th style="width:15%">Status</th>
                        <th style="width:20%">Catatan</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($data->approvals as $approval)
                    <tr>
                        <td>
                            @if($approval->tipe == 'pemohon')
                                Pemohon Izin
                            @elseif($approval->tipe == 'hse')
                                HSE (Pemberi Izin)
                            @elseif($approval->tipe == 'supervisor')
                                Supervisor
                            @else
                                {{ ucfirst(str_replace('_', ' ', $approval->tipe)) }}
                            @endif
                        </td>
                        <td>{{ $approval->nama ?: '-' }}</td>
                        <td>{{ $approval->tanggal ? \Carbon\Carbon::parse($approval->tanggal)->format('d/m/Y H:i') : '-' }}</td>
                        <td>
                            @if($approval->status == 'approved')
                                <span class="badge badge-green">Approved</span>
                            @elseif($approval->status == 'rejected')
                                <span class="badge badge-red">Rejected</span>
                            @else
                                <span class="badge badge-gray">Pending</span>
                            @endif
                        </td>
                        <td>{{ $approval->catatan ?: '-' }}</td>
                    </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
        @endif

        <!-- Signature Grid -->
        <div class="signature-grid">
            <div class="signature-box">
                <div class="signature-line">Pemohon Izin</div>
            </div>
            <div class="signature-box">
                <div class="signature-line">HSE (Pemberi Izin)</div>
            </div>
            <div class="signature-box">
                <div class="signature-line">Supervisor (Pemilik Lokasi)</div>
            </div>
        </div>

        <!-- Footer -->
        <div class="footer">
            <p>Dicetak pada: {{ \Carbon\Carbon::now()->format('d/m/Y H:i:s') }} | Sistem HSE - PT. Industri Nabati Lestari</p>
            <p style="margin-top: 2px;">Dokumen ini merupakan cetakan otomatis dari Sistem Manajemen HSE</p>
        </div>
    </div>
</body>
</html>
