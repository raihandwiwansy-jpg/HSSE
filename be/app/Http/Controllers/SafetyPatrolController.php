<?php

namespace App\Http\Controllers;

use App\Models\SafetyPatrol;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class SafetyPatrolController extends Controller
{
    use ApiResponse;

    public function index(Request $request)
    {
        $query = SafetyPatrol::with('user');

        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('lokasi', 'like', "%{$request->search}%")
                  ->orWhere('observer', 'like', "%{$request->search}%")
                  ->orWhere('auditee', 'like', "%{$request->search}%");
            });
        }

        if ($request->status) {
            $query->where('status', $request->status);
        }

        if ($request->date_from) {
            $query->where('tanggal', '>=', $request->date_from);
        }

        if ($request->date_to) {
            $query->where('tanggal', '<=', $request->date_to);
        }

        if ($request->user()->role === 'user') {
            $query->where('user_id', $request->user()->id);
        }

        $patrols = $query->latest()->paginate($request->per_page ?? 15);

        return $this->paginated($patrols, 'Data safety patrol berhasil diambil');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'tanggal' => 'required|date',
            'waktu' => 'nullable',
            'lokasi' => 'required|string|max:255',
            'observer' => 'nullable|string|max:255',
            'auditee' => 'nullable|string|max:255',
            'leader' => 'nullable|string|max:255',
            'observation_data' => 'nullable|string',
            'tindakan_perbaikan' => 'nullable|string',
            'due_date' => 'nullable|date',
            'catatan' => 'nullable|string',
            'foto' => 'nullable|array',
            'foto.*' => 'image|max:5120',
        ]);

        $observationData = $validated['observation_data']
            ? json_decode($validated['observation_data'], true)
            : null;

        $data = [
            'user_id' => $request->user()->id,
            'tanggal' => $validated['tanggal'],
            'waktu' => $validated['waktu'] ?? null,
            'lokasi' => $validated['lokasi'],
            'observer' => $validated['observer'] ?? null,
            'auditee' => $validated['auditee'] ?? null,
            'leader' => $validated['leader'] ?? null,
            'observation_data' => $observationData,
            'tindakan_perbaikan' => $validated['tindakan_perbaikan'] ?? null,
            'due_date' => $validated['due_date'] ?? null,
            'catatan' => $validated['catatan'] ?? null,
            'status' => SafetyPatrol::STATUS_MENUNGGU,
            'submitted_at' => now(),
        ];

        if ($request->hasFile('foto')) {
            $paths = [];
            foreach ($request->file('foto') as $file) {
                $paths[] = $file->store('safety-patrol', 'public');
            }
            $data['foto'] = $paths;
        }

        $patrol = SafetyPatrol::create($data);

        return $this->success(
            $patrol->load('user'),
            'Safety patrol berhasil dibuat',
            201
        );
    }

    public function show($id)
    {
        $patrol = SafetyPatrol::with('user')->find($id);

        if (!$patrol) {
            return $this->error('Safety patrol tidak ditemukan', 404);
        }

        return $this->success($patrol, 'Detail safety patrol berhasil diambil');
    }

    public function update(Request $request, $id)
    {
        $patrol = SafetyPatrol::find($id);

        if (!$patrol) {
            return $this->error('Safety patrol tidak ditemukan', 404);
        }

        if ($request->user()->role !== 'admin' && !$patrol->isMenunggu()) {
            return $this->error('Hanya safety patrol dengan status menunggu yang bisa diupdate', 422);
        }

        $validated = $request->validate([
            'tanggal' => 'sometimes|date',
            'waktu' => 'nullable',
            'lokasi' => 'sometimes|string|max:255',
            'observer' => 'nullable|string|max:255',
            'auditee' => 'nullable|string|max:255',
            'leader' => 'nullable|string|max:255',
            'observation_data' => 'nullable|string',
            'tindakan_perbaikan' => 'nullable|string',
            'due_date' => 'nullable|date',
            'catatan' => 'nullable|string',
            'foto' => 'nullable|array',
            'foto.*' => 'image|max:5120',
        ]);

        if ($validated['observation_data']) {
            $validated['observation_data'] = json_decode($validated['observation_data'], true);
        }

        $updateData = collect($validated)->except('foto')->toArray();

        if ($request->hasFile('foto')) {
            if ($patrol->foto) {
                foreach ($patrol->foto as $oldFoto) {
                    Storage::disk('public')->delete($oldFoto);
                }
            }
            $paths = [];
            foreach ($request->file('foto') as $file) {
                $paths[] = $file->store('safety-patrol', 'public');
            }
            $updateData['foto'] = $paths;
        }

        $patrol->update($updateData);

        return $this->success(
            $patrol->load('user'),
            'Safety patrol berhasil diupdate'
        );
    }

    public function destroy(Request $request, $id)
    {
        $patrol = SafetyPatrol::find($id);

        if (!$patrol) {
            return $this->error('Safety patrol tidak ditemukan', 404);
        }

        if ($request->user()->role !== 'admin' && $patrol->user_id !== $request->user()->id) {
            return $this->error('Unauthorized', 403);
        }

        if ($request->user()->role !== 'admin' && !$patrol->isMenunggu()) {
            return $this->error('Hanya safety patrol dengan status menunggu yang bisa dihapus', 422);
        }

        if ($patrol->foto) {
            foreach ($patrol->foto as $foto) {
                Storage::disk('public')->delete($foto);
            }
        }

        $patrol->delete();

        return $this->success(null, 'Safety patrol berhasil dihapus');
    }

    public function submit($id)
    {
        $patrol = SafetyPatrol::find($id);

        if (!$patrol) {
            return $this->error('Safety patrol tidak ditemukan', 404);
        }

        if (!$patrol->isMenunggu()) {
            return $this->error('Safety patrol ini sudah dikonfirmasi', 422);
        }

        return $this->success(
            $patrol->load('user'),
            'Safety patrol sudah dalam status menunggu konfirmasi admin'
        );
    }

    public function review(Request $request, $id)
    {
        $patrol = SafetyPatrol::find($id);

        if (!$patrol) {
            return $this->error('Safety patrol tidak ditemukan', 404);
        }

        if (!$patrol->canBeConfirmed()) {
            return $this->error('Safety patrol ini tidak bisa dikonfirmasi', 422);
        }

        $validated = $request->validate([
            'catatan' => 'nullable|string',
            'action' => 'required|in:approve,reject',
        ]);

        $statusToSet = $validated['action'] === 'approve' ? 'approved' : 'rejected';
        
        if ($request->user()->role === 'admin' || $request->user()->role === 'kasubag') {
            $patrol->admin_status = $statusToSet;
        } elseif ($request->user()->role === 'audit') {
            $patrol->audit_status = $statusToSet;
        }

        if ($validated['catatan']) {
            $patrol->catatan = $validated['catatan'];
        }

        if ($patrol->admin_status === 'approved' && $patrol->audit_status === 'approved') {
            $patrol->status = SafetyPatrol::STATUS_SELESAI;
            $patrol->reviewed_at = now();
        } else {
            $patrol->status = SafetyPatrol::STATUS_MENUNGGU; // Keep pending if rejected or incomplete
        }

        $patrol->save();

        return $this->success(
            $patrol->load('user'),
            'Safety patrol berhasil direview'
        );
    }

    public function statusCounts(Request $request)
    {
        $query = SafetyPatrol::query();

        if ($request->user()->role === 'user') {
            $query->where('user_id', $request->user()->id);
        }

        $counts = [
            'total' => (clone $query)->count(),
            'menunggu' => (clone $query)->where('status', SafetyPatrol::STATUS_MENUNGGU)->count(),
            'selesai' => (clone $query)->where('status', SafetyPatrol::STATUS_SELESAI)->count(),
        ];

        return $this->success($counts, 'Status counts berhasil diambil');
    }
}
