@extends('exports.layout')
@section('content')
<table>
    <thead>
        <tr>
            <th style="width:5%;">No</th>
            <th style="width:10%;">Tanggal</th>
            <th style="width:8%;">Waktu</th>
            <th style="width:18%;">Lokasi</th>
            <th style="width:12%;">Observer</th>
            <th style="width:12%;">Auditee</th>
            <th style="width:12%;">Leader</th>
            <th style="width:18%;">Tindakan Perbaikan</th>
            <th style="width:10%;">Status</th>
        </tr>
    </thead>
    <tbody>
        @forelse($data as $i => $d)
        <tr>
            <td style="text-align:center;">{{ $i + 1 }}</td>
            <td>{{ \Carbon\Carbon::parse($d->tanggal)->format('d/m/Y') }}</td>
            <td>{{ $d->waktu ?? '-' }}</td>
            <td>{{ $d->lokasi }}</td>
            <td>{{ $d->observer ?? '-' }}</td>
            <td>{{ $d->auditee ?? '-' }}</td>
            <td>{{ $d->leader ?? '-' }}</td>
            <td>{{ \Illuminate\Support\Str::limit($d->tindakan_perbaikan, 50) ?? '-' }}</td>
            <td style="text-align:center;">
                <span class="badge badge-{{ $d->status === 'reviewed' ? 'approved' : ($d->status === 'submitted' ? 'pending' : 'gray') }}">
                    {{ ucfirst($d->status) }}
                </span>
            </td>
        </tr>
        @empty
        <tr><td colspan="9" style="text-align:center;padding:20px;color:#999;">Tidak ada data Safety Patrol</td></tr>
        @endforelse
    </tbody>
</table>
@endsection
