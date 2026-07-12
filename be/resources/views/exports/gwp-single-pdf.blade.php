<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Detail GWP Permit #{{ $data->id }}</title>
    <style>
        @page { margin: 12mm; }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Helvetica', 'Arial', sans-serif; font-size: 9px; color: #333; line-height: 1.4; }

        .header { text-align: center; margin-bottom: 6px; border-bottom: 3px solid #1A365D; padding-bottom: 6px; }
        .header h1 { font-size: 15px; font-weight: bold; color: #1A365D; letter-spacing: 0.5px; }
        .header h2 { font-size: 11px; font-weight: 600; color: #555; margin: 2px 0; }
        .header p { font-size: 7px; color: #888; line-height: 1.3; }

        .doc-info { display: flex; justify-content: space-between; font-size: 7px; color: #666; margin-bottom: 8px; padding: 3px 6px; background: #f9f9f9; border-radius: 3px; }

        .section { margin: 8px 0; }
        .section-header { display: flex; align-items: center; gap: 5px; margin-bottom: 5px; }
        .section-number { width: 16px; height: 16px; background: #1A365D; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 8px; font-weight: bold; }
        .section-title { font-size: 9px; font-weight: bold; color: #1A365D; text-transform: uppercase; letter-spacing: 0.5px; }

        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 3px 10px; font-size: 8px; }
        .info-item { display: flex; padding: 2px 0; border-bottom: 1px dotted #e0e0e0; }
        .info-label { width: 100px; font-weight: 600; color: #555; }
        .info-value { flex: 1; color: #333; }

        .flowchart { display: flex; justify-content: space-between; align-items: flex-start; margin: 8px 0; padding: 6px; background: #f8f9fa; border-radius: 5px; border: 1px solid #e9ecef; }
        .flow-step { display: flex; flex-direction: column; align-items: center; flex: 1; position: relative; }
        .flow-circle { width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 7px; font-weight: bold; color: white; margin-bottom: 3px; border: 2px solid; }
        .flow-circle.completed { background: #1A365D; border-color: #1A365D; }
        .flow-circle.current { background: #3182CE; border-color: #3182CE; }
        .flow-circle.rejected { background: #E53E3E; border-color: #E53E3E; }
        .flow-circle.upcoming { background: #e5e7eb; border-color: #d1d5db; color: #9ca3af; }
        .flow-label { font-size: 7px; font-weight: 600; text-align: center; }
        .flow-label.completed { color: #1A365D; }
        .flow-label.current { color: #3182CE; }
        .flow-label.rejected { color: #E53E3E; }
        .flow-label.upcoming { color: #9ca3af; }
        .flow-sublabel { font-size: 6px; color: #888; text-align: center; }
        .flow-connector { position: absolute; top: 12px; left: 50%; width: 100%; height: 2px; z-index: 0; }
        .flow-connector.completed { background: #1A365D; }
        .flow-connector.upcoming { background: #d1d5db; }

        .actor-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 6px; margin: 6px 0; }
        .actor-card { padding: 5px; border: 1px solid #e5e7eb; border-radius: 4px; font-size: 7px; }
        .actor-card.approved { background: #f0fdf4; border-color: #bbf7d0; }
        .actor-card.rejected { background: #fef2f2; border-color: #fecaca; }
        .actor-card.pending { background: #f9fafb; border-color: #e5e7eb; }
        .actor-title { font-weight: 600; color: #374151; margin-bottom: 1px; }
        .actor-name { color: #111827; font-size: 8px; }
        .actor-date { color: #9ca3af; font-size: 6px; margin-top: 1px; }

        .kategori-box { padding: 5px 8px; border-radius: 4px; margin: 6px 0; font-size: 8px; }
        .kategori-box.hot_work { background: #fff7ed; border: 1px solid #fed7aa; }
        .kategori-box.cold_work { background: #f0f9ff; border: 1px solid #bae6fd; }
        .kategori-title { font-weight: bold; margin-bottom: 2px; }
        .kategori-box.hot_work .kategori-title { color: #c2410c; }
        .kategori-box.cold_work .kategori-title { color: #0369a1; }

        table.data { width: 100%; border-collapse: collapse; font-size: 8px; margin-top: 4px; }
        table.data th { background: #1A365D; color: white; padding: 4px 5px; text-align: left; font-weight: 600; font-size: 7px; border: 1px solid #0f2744; }
        table.data td { padding: 4px 5px; border: 1px solid #e5e7eb; }
        table.data tr:nth-child(even) { background: #f9fafb; }

        .badge { display: inline-block; padding: 1px 6px; border-radius: 3px; font-weight: 600; font-size: 7px; }
        .badge-green { background: #dcfce7; color: #166534; }
        .badge-yellow { background: #fef9c3; color: #854d0e; }
        .badge-red { background: #fee2e2; color: #991b1b; }
        .badge-blue { background: #dbeafe; color: #1e40af; }
        .badge-gray { background: #f3f4f6; color: #374151; }
        .badge-emerald { background: #d1fae5; color: #065f46; }

        .checklist-box { margin: 6px 0; }
        .checklist-title { font-size: 8px; font-weight: bold; color: #1A365D; margin-bottom: 3px; }
        .checklist-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4px; }
        .checklist-col-title { font-size: 7px; font-weight: 600; color: #2D3748; margin-bottom: 2px; }
        .checklist-item { font-size: 7px; color: #555; padding: 1px 0; display: flex; align-items: center; gap: 3px; }
        .check-icon { color: #38A169; font-weight: bold; }

        .ppe-grid { display: flex; flex-wrap: wrap; gap: 3px; margin: 4px 0; }
        .ppe-item { font-size: 7px; padding: 2px 5px; background: #dbeafe; color: #1e40af; border-radius: 3px; }

        .reject-box { background: #fef2f2; border: 1px solid #fecaca; border-radius: 4px; padding: 5px 8px; margin: 6px 0; }
        .reject-title { font-weight: bold; color: #991b1b; font-size: 8px; margin-bottom: 1px; }
        .reject-text { color: #dc2626; font-size: 8px; }

        .signature-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px; margin-top: 12px; }
        .signature-box { text-align: center; }
        .signature-line { border-top: 1px solid #333; margin-top: 25px; padding-top: 3px; font-size: 7px; color: #555; }

        .footer { margin-top: 12px; padding-top: 6px; border-top: 2px solid #1A365D; text-align: center; font-size: 6px; color: #999; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>PT. INDUSTRI NABATI LESTARI</h1>
            <h2>GENERAL WORK PERMIT (GWP)</h2>
            <p>Kantor Pusat: Komp. KEK Sei Mangkei, Kav.2-3, Kec. Bosar Maligas, Kab. Simalungun, Sumatera Utara</p>
        </div>

        <div class="doc-info">
            <span><strong>No. Dokumen:</strong> FM-BSHS-19/GWP-D | <strong>Revisi:</strong> 01</span>
            <span><strong>GWP #:</strong> {{ $data->permit_number ?? 'GWP-'.str_pad($data->id, 3, '0', STR_PAD_LEFT) }} | <strong>Tanggal Cetak:</strong> {{ \Carbon\Carbon::now()->format('d/m/Y') }}</span>
        </div>

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

        @if($isRejected && $data->catatan_reject)
            <div class="reject-box">
                <div class="reject-title">Alasan Reject:</div>
                <div class="reject-text">{{ $data->catatan_reject }}</div>
            </div>
        @endif

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
                    <div style="color:#6b7280; font-style:italic; margin-top:1px;">"{{ $hse->catatan }}"</div>
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

        <div class="kategori-box {{ $data->kategori_pekerjaan }}">
            <div class="kategori-title">
                @if($data->kategori_pekerjaan === 'hot_work')
                    &#128293; KERJA PANAS (Hot Work) - Memerlukan HWP
                @else
                    &#10052; KERJA DINGIN (Cold Work)
                @endif
            </div>
        </div>

        {{-- Section A: Identitas Permintaan Izin --}}
        <div class="section">
            <div class="section-header">
                <div class="section-number">A</div>
                <div class="section-title">Identitas Permintaan Izin Kerja</div>
            </div>
            <div class="info-grid">
                <div class="info-item">
                    <div class="info-label">No. Permit GWP</div>
                    <div class="info-value">: {{ $data->permit_number ?? 'GWP-'.str_pad($data->id, 3, '0', STR_PAD_LEFT) }}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Tanggal</div>
                    <div class="info-value">: {{ \Carbon\Carbon::parse($data->tanggal)->format('d/m/Y') }}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Pukul Kerja</div>
                    <div class="info-value">: {{ $data->pukul_mulai }} - {{ $data->pukul_selesai }}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Dept/Bagian/CV</div>
                    <div class="info-value">: {{ $data->departemen }}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Lokasi Area Kerja</div>
                    <div class="info-value">: {{ $data->lokasi }}</div>
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

        {{-- Section B: Identitas Pekerjaan --}}
        <div class="section">
            <div class="section-header">
                <div class="section-number">B</div>
                <div class="section-title">Identitas Pekerjaan</div>
            </div>
            <div class="info-grid">
                <div class="info-item" style="grid-column: span 2;">
                    <div class="info-label">Deskripsi Pekerjaan</div>
                    <div class="info-value">: {{ $data->deskripsi_pekerjaan }}</div>
                </div>
                <div class="info-item" style="grid-column: span 2;">
                    <div class="info-label">Peralatan</div>
                    <div class="info-value">: {{ $data->peralatan }}</div>
                </div>
            </div>
        </div>

        {{-- Section C: Kategori Risiko --}}
        <div class="section">
            <div class="section-header">
                <div class="section-number">C</div>
                <div class="section-title">Kategori Risiko Pekerjaan</div>
            </div>
            <div class="info-grid">
                <div class="info-item">
                    <div class="info-label">Kategori Risiko</div>
                    <div class="info-value">:
                        @if($data->kategori_risiko == 'rendah')
                            <span class="badge badge-green">Rendah</span>
                        @elseif($data->kategori_risiko == 'sedang')
                            <span class="badge badge-yellow">Sedang</span>
                        @else
                            <span class="badge badge-red">Tinggi</span>
                        @endif
                    </div>
                </div>
                <div class="info-item">
                    <div class="info-label">Berdasarkan JSA</div>
                    <div class="info-value">: {{ $data->berdasarkan_jsa ?? '-' }}</div>
                </div>
            </div>
        </div>

        {{-- Section D: Daftar Keselamatan --}}
        <div class="section">
            <div class="section-header">
                <div class="section-number">D</div>
                <div class="section-title">Daftar Keselamatan (Checklist)</div>
            </div>
            <div class="checklist-grid">
                <div>
                    <div class="checklist-col-title">Pemohon Izin</div>
                    @if($data->daftar_keselamatan_pemohon && count($data->daftar_keselamatan_pemohon) > 0)
                        @foreach($data->daftar_keselamatan_pemohon as $item)
                            <div class="checklist-item"><span class="check-icon">&#10003;</span> {{ $item }}</div>
                        @endforeach
                    @else
                        <div class="checklist-item" style="color:#999;">Tidak ada data</div>
                    @endif
                </div>
                <div>
                    <div class="checklist-col-title">HSE (Pemberi Izin)</div>
                    @if($data->daftar_keselamatan_hse && count($data->daftar_keselamatan_hse) > 0)
                        @foreach($data->daftar_keselamatan_hse as $item)
                            <div class="checklist-item"><span class="check-icon">&#10003;</span> {{ $item }}</div>
                        @endforeach
                    @else
                        <div class="checklist-item" style="color:#999;">Tidak ada data</div>
                    @endif
                </div>
            </div>
        </div>

        {{-- Section E: Peralatan Keamanan (PPE) --}}
        <div class="section">
            <div class="section-header">
                <div class="section-number">E</div>
                <div class="section-title">Peralatan Keamanan (PPE)</div>
            </div>
            <div class="ppe-grid">
                @if($data->ppe_checklist && count($data->ppe_checklist) > 0)
                    @foreach($data->ppe_checklist as $item)
                        <span class="ppe-item">{{ $item }}</span>
                    @endforeach
                @else
                    <span style="font-size:7px; color:#999;">Tidak ada data</span>
                @endif
            </div>
        </div>

        {{-- Section F: Persetujuan Izin --}}
        @if($data->approvals && count($data->approvals) > 0)
        <div class="section">
            <div class="section-header">
                <div class="section-number">F</div>
                <div class="section-title">Persetujuan Izin & Tanda Tangan</div>
            </div>
            <table class="data">
                <thead>
                    <tr>
                        <th style="width:20%">Pihak</th>
                        <th style="width:20%">Tipe</th>
                        <th style="width:20%">Nama</th>
                        <th style="width:15%">Tanggal</th>
                        <th style="width:10%">Status</th>
                        <th style="width:15%">Catatan</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($data->approvals as $approval)
                    <tr>
                        <td>
                            @if($approval->tipe == 'pemohon')
                                A. Pemohon Izin
                            @elseif($approval->tipe == 'hse')
                                C. Pemberi Izin (HSE)
                            @elseif($approval->tipe == 'supervisor')
                                B. Pemilik Lokasi
                            @else
                                {{ ucfirst(str_replace('_', ' ', $approval->tipe)) }}
                            @endif
                        </td>
                        <td>
                            @if($approval->tipe == 'pemohon')
                                User
                            @elseif($approval->tipe == 'hse')
                                Admin/HSE
                            @elseif($approval->tipe == 'supervisor')
                                Supervisor
                            @else
                                -
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

        {{-- Signature Grid --}}
        <div class="signature-grid">
            <div class="signature-box">
                <div class="signature-line">A. Pemohon Izin</div>
            </div>
            <div class="signature-box">
                <div class="signature-line">B. Pemilik Lokasi</div>
            </div>
            <div class="signature-box">
                <div class="signature-line">C. Pemberi Izin (HSE)</div>
            </div>
        </div>

        <div class="footer">
            <p>Dicetak pada: {{ \Carbon\Carbon::now()->format('d/m/Y H:i:s') }} | Sistem HSE - PT. Industri Nabati Lestari</p>
            <p style="margin-top: 1px;">Dokumen ini merupakan cetakan otomatis dari Sistem Manajemen HSE</p>
        </div>
    </div>
</body>
</html>
