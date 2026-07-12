<?php

namespace App\Http\Controllers;

use App\Models\HwpPermit;
use App\Models\HwpApproval;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class HwpController extends Controller
{
    use ApiResponse;

    public function index(Request $request)
    {
        $query = HwpPermit::with(['user', 'gwpPermit', 'approvals']);

        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('lokasi', 'like', "%{$request->search}%")
                  ->orWhere('deskripsi', 'like', "%{$request->search}%");
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

        $permits = $query->latest()->paginate($request->per_page ?? 15);

        return $this->paginated($permits, 'Data HWP permit berhasil diambil');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'gwp_permit_id' => 'nullable|exists:gwp_permits,id',
            'tanggal' => 'required|date',
            'shift' => 'required|string|max:50',
            'lokasi' => 'required|string|max:255',
            'deskripsi' => 'required|string',
            'jam_mulai' => 'required|date_format:H:i',
            'jam_selesai' => 'required|date_format:H:i|after:jam_mulai',
            'bahaya_terkait' => 'required|string',
            'pencegahan' => 'required|string',
            'apd_digunakan' => 'nullable|string',
            'catatan' => 'nullable|string',
        ]);

        $data = array_merge($validated, [
            'user_id' => $request->user()->id,
            'status' => HwpPermit::STATUS_DRAFT,
        ]);

        $permit = HwpPermit::create($data);

        $approvalTypes = [
            ['tipe' => HwpApproval::TIPE_PEMOHON, 'nama' => $request->user()->name, 'jabatan' => $request->user()->departemen ?? '', 'status' => 'pending'],
            ['tipe' => HwpApproval::TIPE_SUPERVISOR, 'nama' => '', 'jabatan' => '', 'status' => 'pending'],
            ['tipe' => HwpApproval::TIPE_HSE, 'nama' => '', 'jabatan' => '', 'status' => 'pending'],
        ];

        foreach ($approvalTypes as $approval) {
            $permit->approvals()->create($approval);
        }

        return $this->success($permit->load(['user', 'gwpPermit', 'approvals']), 'HWP permit berhasil dibuat', 201);
    }

    public function show($id)
    {
        $permit = HwpPermit::with(['user', 'gwpPermit', 'approvals'])->find($id);

        if (!$permit) {
            return $this->error('HWP permit tidak ditemukan', 404);
        }

        return $this->success($permit, 'Detail HWP permit berhasil diambil');
    }

    public function update(Request $request, $id)
    {
        $permit = HwpPermit::find($id);

        if (!$permit) {
            return $this->error('HWP permit tidak ditemukan', 404);
        }

        $validated = $request->validate([
            'tanggal' => 'sometimes|date',
            'shift' => 'sometimes|string|max:50',
            'lokasi' => 'sometimes|string|max:255',
            'deskripsi' => 'sometimes|string',
            'jam_mulai' => 'sometimes|date_format:H:i',
            'jam_selesai' => 'sometimes|date_format:H:i',
            'bahaya_terkait' => 'sometimes|string',
            'pencegahan' => 'sometimes|string',
            'apd_digunakan' => 'nullable|string',
            'catatan' => 'nullable|string',
        ]);

        $permit->update($validated);

        return $this->success($permit->load(['user', 'gwpPermit', 'approvals']), 'HWP permit berhasil diupdate');
    }

    public function updateStatus(Request $request, $id)
    {
        $permit = HwpPermit::find($id);

        if (!$permit) {
            return $this->error('HWP permit tidak ditemukan', 404);
        }

        $validated = $request->validate([
            'status' => 'required|string|in:' . implode(',', array_keys(HwpPermit::STATUS_MAP)),
        ]);

        $permit->update(['status' => $validated['status']]);

        return $this->success($permit->load(['user', 'gwpPermit', 'approvals']), 'Status HWP berhasil diupdate');
    }

    public function submit($id)
    {
        $permit = HwpPermit::find($id);

        if (!$permit) {
            return $this->error('HWP permit tidak ditemukan', 404);
        }

        if (!$permit->canBeSubmitted()) {
            return $this->error('Hanya HWP dengan status draft yang bisa disubmit', 422);
        }

        $permit->update([
            'status' => HwpPermit::STATUS_SUBMITTED,
            'submitted_at' => now(),
        ]);

        $permit->approvals()
            ->where('tipe', HwpApproval::TIPE_PEMOHON)
            ->update(['status' => 'approved', 'tanggal' => now()]);

        return $this->success($permit->load(['user', 'gwpPermit', 'approvals']), 'HWP permit berhasil disubmit ke HSE');
    }

    public function approve(Request $request, $id)
    {
        $permit = HwpPermit::find($id);

        if (!$permit) {
            return $this->error('HWP permit tidak ditemukan', 404);
        }

        if (!$permit->canBeApprovedOrRejected()) {
            return $this->error('Hanya HWP dengan status submitted yang bisa di-approve', 422);
        }

        $validated = $request->validate([
            'catatan' => 'nullable|string',
        ]);

        $permit->update([
            'status' => HwpPermit::STATUS_APPROVED,
            'approved_at' => now(),
            'catatan' => $validated['catatan'] ?? $permit->catatan,
        ]);

        $permit->approvals()
            ->where('tipe', HwpApproval::TIPE_HSE)
            ->update([
                'status' => 'approved',
                'tanggal' => now(),
                'catatan' => $validated['catatan'] ?? null,
            ]);

        return $this->success($permit->load(['user', 'gwpPermit', 'approvals']), 'HWP permit berhasil di-approve oleh HSE');
    }

    public function reject(Request $request, $id)
    {
        $permit = HwpPermit::find($id);

        if (!$permit) {
            return $this->error('HWP permit tidak ditemukan', 404);
        }

        if (!$permit->canBeApprovedOrRejected()) {
            return $this->error('Hanya HWP dengan status submitted yang bisa direject', 422);
        }

        $validated = $request->validate([
            'catatan' => 'nullable|string',
        ]);

        $permit->update([
            'status' => HwpPermit::STATUS_REJECTED,
            'catatan_reject' => $validated['catatan'] ?? null,
            'submitted_at' => null,
        ]);

        $permit->approvals()
            ->where('tipe', HwpApproval::TIPE_HSE)
            ->update([
                'status' => 'rejected',
                'tanggal' => now(),
                'catatan' => $validated['catatan'] ?? null,
            ]);

        return $this->success($permit->load(['user', 'gwpPermit', 'approvals']), 'HWP permit berhasil direject');
    }

    public function complete($id)
    {
        $permit = HwpPermit::find($id);

        if (!$permit) {
            return $this->error('HWP permit tidak ditemukan', 404);
        }

        if (!$permit->canBeCompleted()) {
            return $this->error('Hanya HWP dengan status approved yang bisa diselesaikan', 422);
        }

        $permit->update([
            'status' => HwpPermit::STATUS_COMPLETED,
            'completed_at' => now(),
        ]);

        $permit->approvals()
            ->where('tipe', HwpApproval::TIPE_SUPERVISOR)
            ->update(['status' => 'approved', 'tanggal' => now()]);

        return $this->success($permit->load(['user', 'gwpPermit', 'approvals']), 'HWP permit berhasil diselesaikan oleh Supervisor');
    }

    public function destroy($id)
    {
        $permit = HwpPermit::find($id);

        if (!$permit) {
            return $this->error('HWP permit tidak ditemukan', 404);
        }

        $permit->approvals()->delete();
        $permit->delete();

        return $this->success(null, 'HWP permit berhasil dihapus');
    }

    public function updateApproval(Request $request, $permitId, $approvalId)
    {
        $permit = HwpPermit::find($permitId);

        if (!$permit) {
            return $this->error('HWP permit tidak ditemukan', 404);
        }

        $approval = HwpApproval::where('hwp_permit_id', $permitId)->find($approvalId);

        if (!$approval) {
            return $this->error('Approval tidak ditemukan', 404);
        }

        $validated = $request->validate([
            'nama' => 'sometimes|string|max:255',
            'jabatan' => 'nullable|string|max:255',
            'tanggal' => 'nullable|date',
            'paraf' => 'nullable|string|max:255',
            'status' => 'required|string|in:pending,approved,rejected',
            'catatan' => 'nullable|string',
        ]);

        $approval->update($validated);

        return $this->success($permit->load(['user', 'gwpPermit', 'approvals']), 'Approval berhasil diupdate');
    }
}
