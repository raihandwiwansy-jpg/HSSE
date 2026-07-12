<?php

namespace App\Http\Controllers;

use App\Models\GwpPermit;
use App\Models\GwpApproval;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class GwpController extends Controller
{
    use ApiResponse;

    public function index(Request $request)
    {
        $query = GwpPermit::with(['user', 'approvals']);

        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('deskripsi_pekerjaan', 'like', "%{$request->search}%")
                  ->orWhere('lokasi', 'like', "%{$request->search}%")
                  ->orWhere('departemen', 'like', "%{$request->search}%");
            });
        }

        if ($request->status) {
            $query->where('status', $request->status);
        }

        if ($request->kategori_risiko) {
            $query->where('kategori_risiko', $request->kategori_risiko);
        }

        if ($request->kategori_pekerjaan) {
            $query->where('kategori_pekerjaan', $request->kategori_pekerjaan);
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

        return $this->paginated($permits, 'Data GWP permit berhasil diambil');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'tanggal' => 'required|date',
            'pukul_mulai' => 'required|date_format:H:i',
            'pukul_selesai' => 'required|date_format:H:i|after:pukul_mulai',
            'departemen' => 'required|string|max:100',
            'lokasi' => 'required|string|max:255',
            'deskripsi_pekerjaan' => 'required|string',
            'peralatan' => 'required|string',
            'kategori_risiko' => 'required|string|in:rendah,sedang,tinggi',
            'berdasarkan_jsa' => 'nullable|string|max:255',
            'kategori_pekerjaan' => 'sometimes|string|in:cold_work,hot_work',
            'daftar_keselamatan_pemohon' => 'nullable|array',
            'daftar_keselamatan_hse' => 'nullable|array',
            'ppe_checklist' => 'nullable|array',
            'validasi_shift' => 'nullable|array',
            'catatan_hse' => 'nullable|string',
        ]);

        $data = array_merge($validated, [
            'user_id' => $request->user()->id,
            'status' => GwpPermit::STATUS_DRAFT,
            'kategori_pekerjaan' => $validated['kategori_pekerjaan'] ?? GwpPermit::KATEGORI_COLD_WORK,
        ]);

        $permit = GwpPermit::create($data);

        $approvalTypes = [
            ['tipe' => GwpApproval::TIPE_PEMOHON, 'nama' => $request->user()->name, 'jabatan' => $request->user()->departemen ?? '', 'status' => 'pending'],
            ['tipe' => GwpApproval::TIPE_SUPERVISOR, 'nama' => '', 'jabatan' => '', 'status' => 'pending'],
            ['tipe' => GwpApproval::TIPE_HSE, 'nama' => '', 'jabatan' => '', 'status' => 'pending'],
        ];

        foreach ($approvalTypes as $approval) {
            $permit->approvals()->create($approval);
        }

        return $this->success($permit->load(['user', 'approvals']), 'GWP permit berhasil dibuat', 201);
    }

    public function show($id)
    {
        $permit = GwpPermit::with(['user', 'approvals'])->find($id);

        if (!$permit) {
            return $this->error('GWP permit tidak ditemukan', 404);
        }

        return $this->success($permit, 'Detail GWP permit berhasil diambil');
    }

    public function update(Request $request, $id)
    {
        $permit = GwpPermit::find($id);

        if (!$permit) {
            return $this->error('GWP permit tidak ditemukan', 404);
        }

        $validated = $request->validate([
            'tanggal' => 'sometimes|date',
            'pukul_mulai' => 'sometimes|date_format:H:i',
            'pukul_selesai' => 'sometimes|date_format:H:i',
            'departemen' => 'sometimes|string|max:100',
            'lokasi' => 'sometimes|string|max:255',
            'deskripsi_pekerjaan' => 'sometimes|string',
            'peralatan' => 'sometimes|string',
            'kategori_risiko' => 'sometimes|string|in:rendah,sedang,tinggi',
            'berdasarkan_jsa' => 'nullable|string|max:255',
            'kategori_pekerjaan' => 'sometimes|string|in:cold_work,hot_work',
            'daftar_keselamatan_pemohon' => 'nullable|array',
            'daftar_keselamatan_hse' => 'nullable|array',
            'ppe_checklist' => 'nullable|array',
            'validasi_shift' => 'nullable|array',
            'catatan_hse' => 'nullable|string',
        ]);

        $permit->update($validated);

        return $this->success($permit->load(['user', 'approvals']), 'GWP permit berhasil diupdate');
    }

    public function updateStatus(Request $request, $id)
    {
        $permit = GwpPermit::find($id);

        if (!$permit) {
            return $this->error('GWP permit tidak ditemukan', 404);
        }

        $validated = $request->validate([
            'status' => 'required|string|in:' . implode(',', array_keys(GwpPermit::STATUS_MAP)),
        ]);

        $permit->update(['status' => $validated['status']]);

        return $this->success($permit->load(['user', 'approvals']), 'Status GWP berhasil diupdate');
    }

    public function submit($id)
    {
        $permit = GwpPermit::find($id);

        if (!$permit) {
            return $this->error('GWP permit tidak ditemukan', 404);
        }

        if (!$permit->canBeSubmitted()) {
            return $this->error('Hanya GWP dengan status draft yang bisa disubmit', 422);
        }

        $permit->update([
            'status' => GwpPermit::STATUS_SUBMITTED,
            'submitted_at' => now(),
        ]);

        $permit->approvals()
            ->where('tipe', GwpApproval::TIPE_PEMOHON)
            ->update([
                'status' => 'approved',
                'tanggal' => now(),
            ]);

        return $this->success($permit->load(['user', 'approvals']), 'GWP permit berhasil disubmit ke HSE');
    }

    public function approve(Request $request, $id)
    {
        $permit = GwpPermit::find($id);

        if (!$permit) {
            return $this->error('GWP permit tidak ditemukan', 404);
        }

        if (!$permit->canBeApprovedOrRejected()) {
            return $this->error('Hanya GWP dengan status submitted yang bisa di-approve', 422);
        }

        $validated = $request->validate([
            'catatan_hse' => 'nullable|string',
        ]);

        $permit->update([
            'status' => GwpPermit::STATUS_APPROVED,
            'approved_at' => now(),
            'catatan_hse' => $validated['catatan_hse'] ?? $permit->catatan_hse,
        ]);

        $permit->approvals()
            ->where('tipe', GwpApproval::TIPE_HSE)
            ->update([
                'status' => 'approved',
                'tanggal' => now(),
                'catatan' => $validated['catatan_hse'] ?? null,
            ]);

        return $this->success($permit->load(['user', 'approvals']), 'GWP permit berhasil di-approve oleh HSE');
    }

    public function reject(Request $request, $id)
    {
        $permit = GwpPermit::find($id);

        if (!$permit) {
            return $this->error('GWP permit tidak ditemukan', 404);
        }

        if (!$permit->canBeApprovedOrRejected()) {
            return $this->error('Hanya GWP dengan status submitted yang bisa direject', 422);
        }

        $validated = $request->validate([
            'catatan_hse' => 'nullable|string',
        ]);

        $permit->update([
            'status' => GwpPermit::STATUS_REJECTED,
            'catatan_reject' => $validated['catatan_hse'] ?? null,
            'submitted_at' => null,
        ]);

        $permit->approvals()
            ->where('tipe', GwpApproval::TIPE_HSE)
            ->update([
                'status' => 'rejected',
                'tanggal' => now(),
                'catatan' => $validated['catatan_hse'] ?? null,
            ]);

        return $this->success($permit->load(['user', 'approvals']), 'GWP permit berhasil direject');
    }

    public function complete(Request $request, $id)
    {
        // Hanya Supervisor yang bisa complete
        if ($request->user()->role !== 'supervisor') {
            return $this->error('Hanya Supervisor yang dapat menyelesaikan GWP', 403);
        }

        $permit = GwpPermit::find($id);

        if (!$permit) {
            return $this->error('GWP permit tidak ditemukan', 404);
        }

        // Hanya GWP dengan status APPROVED yang bisa di-complete
        if ($permit->status !== GwpPermit::STATUS_APPROVED) {
            return $this->error('GWP harus berstatus APPROVED terlebih dahulu', 400);
        }

        $permit->update([
            'status' => GwpPermit::STATUS_COMPLETED,
            'completed_at' => now(),
        ]);

        $permit->approvals()
            ->where('tipe', GwpApproval::TIPE_SUPERVISOR)
            ->update([
                'status' => 'approved',
                'tanggal' => now(),
            ]);

        return $this->success($permit->load(['user', 'approvals']), 'GWP permit berhasil diselesaikan oleh Supervisor');
    }

    public function destroy($id)
    {
        $permit = GwpPermit::find($id);

        if (!$permit) {
            return $this->error('GWP permit tidak ditemukan', 404);
        }

        $permit->approvals()->delete();
        $permit->delete();

        return $this->success(null, 'GWP permit berhasil dihapus');
    }

    public function updateApproval(Request $request, $permitId, $approvalId)
    {
        $permit = GwpPermit::find($permitId);

        if (!$permit) {
            return $this->error('GWP permit tidak ditemukan', 404);
        }

        $approval = GwpApproval::where('gwp_permit_id', $permitId)->find($approvalId);

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

        return $this->success($permit->load(['user', 'approvals']), 'Approval berhasil diupdate');
    }
}
