<?php

namespace App\Http\Controllers;

use App\Models\SafetyBehavior;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class SafetyBehaviorController extends Controller
{
    use ApiResponse;

    public function index(Request $request)
    {
        $query = SafetyBehavior::with('user');

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

        $behaviors = $query->latest()->paginate($request->per_page ?? 15);

        return $this->paginated($behaviors, 'Data safety behavior berhasil diambil');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'tanggal' => 'required|date',
            'waktu' => 'nullable',
            'lokasi' => 'required|string|max:255',
            'observer' => 'nullable|string|max:255',
            'auditee' => 'nullable|string|max:255',
            'kasubag' => 'nullable|string|max:255',
            'observation_data' => 'nullable|string',
            'tindakan_perbaikan' => 'nullable|string',
            'due_date' => 'nullable|date',
            'catatan' => 'nullable|string',
            'foto' => 'nullable|array',
            'foto.*' => 'image|max:10240',
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
            'kasubag' => $validated['kasubag'] ?? null,
            'observation_data' => $observationData,
            'tindakan_perbaikan' => $validated['tindakan_perbaikan'] ?? null,
            'due_date' => $validated['due_date'] ?? null,
            'catatan' => $validated['catatan'] ?? null,
            'status' => SafetyBehavior::STATUS_MENUNGGU,
            'submitted_at' => now(),
        ];

        if ($request->hasFile('foto')) {
            $paths = [];
            foreach ($request->file('foto') as $file) {
                $paths[] = $file->store('safety-behavior', 'public');
            }
            $data['foto'] = $paths;
        }

        $behavior = SafetyBehavior::create($data);

        return $this->success(
            $behavior->load('user'),
            'Safety behavior berhasil dibuat',
            201
        );
    }

    public function show($id)
    {
        $behavior = SafetyBehavior::with('user')->find($id);

        if (!$behavior) {
            return $this->error('Safety behavior tidak ditemukan', 404);
        }

        return $this->success($behavior, 'Detail safety behavior berhasil diambil');
    }

    public function update(Request $request, $id)
    {
        $behavior = SafetyBehavior::find($id);

        if (!$behavior) {
            return $this->error('Safety behavior tidak ditemukan', 404);
        }

        if ($request->user()->role !== 'admin' && !$behavior->isMenunggu()) {
            return $this->error('Hanya safety behavior dengan status menunggu yang bisa diupdate', 422);
        }

        $validated = $request->validate([
            'tanggal' => 'sometimes|date',
            'waktu' => 'nullable',
            'lokasi' => 'sometimes|string|max:255',
            'observer' => 'nullable|string|max:255',
            'auditee' => 'nullable|string|max:255',
            'kasubag' => 'nullable|string|max:255',
            'observation_data' => 'nullable|string',
            'tindakan_perbaikan' => 'nullable|string',
            'due_date' => 'nullable|date',
            'catatan' => 'nullable|string',
            'foto' => 'nullable|array',
            'foto.*' => 'image|max:10240',
        ]);

        if ($validated['observation_data']) {
            $validated['observation_data'] = json_decode($validated['observation_data'], true);
        }

        $updateData = collect($validated)->except('foto')->toArray();

        if ($request->hasFile('foto')) {
            if ($behavior->foto) {
                foreach ($behavior->foto as $oldFoto) {
                    Storage::disk('public')->delete($oldFoto);
                }
            }
            $paths = [];
            foreach ($request->file('foto') as $file) {
                $paths[] = $file->store('safety-behavior', 'public');
            }
            $updateData['foto'] = $paths;
        }

        $behavior->update($updateData);

        return $this->success(
            $behavior->load('user'),
            'Safety behavior berhasil diupdate'
        );
    }

    public function destroy(Request $request, $id)
    {
        $behavior = SafetyBehavior::find($id);

        if (!$behavior) {
            return $this->error('Safety behavior tidak ditemukan', 404);
        }

        if ($request->user()->role !== 'admin' && $behavior->user_id !== $request->user()->id) {
            return $this->error('Unauthorized', 403);
        }

        if ($request->user()->role !== 'admin' && !$behavior->isMenunggu()) {
            return $this->error('Hanya safety behavior dengan status menunggu yang bisa dihapus', 422);
        }

        if ($behavior->foto) {
            foreach ($behavior->foto as $foto) {
                Storage::disk('public')->delete($foto);
            }
        }

        $behavior->delete();

        return $this->success(null, 'Safety behavior berhasil dihapus');
    }

    public function submit($id)
    {
        $behavior = SafetyBehavior::find($id);

        if (!$behavior) {
            return $this->error('Safety behavior tidak ditemukan', 404);
        }

        if (!$behavior->isMenunggu()) {
            return $this->error('Safety behavior ini sudah dikonfirmasi', 422);
        }

        return $this->success(
            $behavior->load('user'),
            'Safety behavior sudah dalam status menunggu konfirmasi admin'
        );
    }

    public function review(Request $request, $id)
    {
        $behavior = SafetyBehavior::find($id);

        if (!$behavior) {
            return $this->error('Safety behavior tidak ditemukan', 404);
        }

        if (!$behavior->canBeConfirmed()) {
            return $this->error('Safety behavior ini tidak bisa dikonfirmasi', 422);
        }

        $validated = $request->validate([
            'catatan' => 'nullable|string',
            'action' => 'required|in:approve,reject',
        ]);

        $statusToSet = $validated['action'] === 'approve' ? 'approved' : 'rejected';
        
        if ($request->user()->role === 'admin' || $request->user()->role === 'kasubag') {
            $behavior->admin_status = $statusToSet;
        } elseif ($request->user()->role === 'audit') {
            $behavior->audit_status = $statusToSet;
        }

        if ($validated['catatan']) {
            $behavior->catatan = $validated['catatan'];
        }

        if ($behavior->admin_status === 'approved' && $behavior->audit_status === 'approved') {
            $behavior->status = SafetyBehavior::STATUS_SELESAI;
            $behavior->reviewed_at = now();
        } else {
            $behavior->status = SafetyBehavior::STATUS_MENUNGGU; // Keep pending if rejected or incomplete
        }

        $behavior->save();

        return $this->success(
            $behavior->load('user'),
            'Safety behavior berhasil direview'
        );
    }

    public function statusCounts(Request $request)
    {
        $query = SafetyBehavior::query();

        if ($request->user()->role === 'user') {
            $query->where('user_id', $request->user()->id);
        }

        $counts = [
            'total' => (clone $query)->count(),
            'menunggu' => (clone $query)->where('status', SafetyBehavior::STATUS_MENUNGGU)->count(),
            'selesai' => (clone $query)->where('status', SafetyBehavior::STATUS_SELESAI)->count(),
        ];

        return $this->success($counts, 'Status counts berhasil diambil');
    }
}
