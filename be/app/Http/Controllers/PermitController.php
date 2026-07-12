<?php

namespace App\Http\Controllers;

use App\Models\Permit;
use App\Models\PermitDetail;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PermitController extends Controller
{
    use ApiResponse;

    public function index(Request $request)
    {
        $query = Permit::with(['user', 'jsa', 'detail']);

        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('judul', 'like', "%{$request->search}%")
                  ->orWhere('lokasi', 'like', "%{$request->search}%")
                  ->orWhere('permit_number', 'like', "%{$request->search}%")
                  ->orWhere('deskripsi', 'like', "%{$request->search}%");
            });
        }

        if ($request->status) {
            if ($request->status === 'rejected') {
                $query->whereIn('status', [Permit::STATUS_SUPERVISOR_REJECTED, Permit::STATUS_HSE_REJECTED]);
            } else {
                $query->where('status', $request->status);
            }
        }

        if ($request->jenis) {
            $query->where('jenis', $request->jenis);
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

        return $this->paginated($permits, 'Data permit berhasil diambil');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'jenis' => 'required|string|in:gwp,hwp,cse,elp,ewp,lwp,rwp,whp',
            'judul' => 'required|string|max:255',
            'lokasi' => 'required|string|max:255',
            'deskripsi' => 'nullable|string',
            'tanggal' => 'required|date',
            'pukul_mulai' => 'nullable|date_format:H:i',
            'pukul_selesai' => 'nullable|date_format:H:i',
            'departemen' => 'nullable|string|max:100',
            'jsa_id' => 'nullable|exists:jsa,id',
            'detail_data' => 'nullable|array',
        ]);

        $permitNumber = Permit::generatePermitNumber($validated['jenis']);

        return DB::transaction(function () use ($validated, $request, $permitNumber) {
            $permit = Permit::create([
                'user_id' => $request->user()->id,
                'permit_number' => $permitNumber,
                'jenis' => $validated['jenis'],
                'judul' => $validated['judul'],
                'lokasi' => $validated['lokasi'],
                'deskripsi' => $validated['deskripsi'] ?? null,
                'tanggal' => $validated['tanggal'],
                'pukul_mulai' => $validated['pukul_mulai'] ?? null,
                'pukul_selesai' => $validated['pukul_selesai'] ?? null,
                'departemen' => $validated['departemen'] ?? null,
                'status' => Permit::STATUS_DRAFT,
                'jsa_id' => $validated['jsa_id'] ?? null,
            ]);

            if (!empty($validated['detail_data'])) {
                $permit->detail()->create([
                    'detail_data' => $validated['detail_data'],
                ]);
            }

            return $this->success(
                $permit->load(['user', 'jsa', 'detail']),
                'Permit berhasil dibuat',
                201
            );
        });
    }

    public function show($id)
    {
        $permit = Permit::with(['user', 'jsa', 'detail'])->find($id);

        if (!$permit) {
            return $this->error('Permit tidak ditemukan', 404);
        }

        return $this->success($permit, 'Detail permit berhasil diambil');
    }

    public function update(Request $request, $id)
    {
        $permit = Permit::find($id);

        if (!$permit) {
            return $this->error('Permit tidak ditemukan', 404);
        }

        if ($request->user()->role !== 'admin' && !$permit->isDraft()) {
            return $this->error('Hanya permit dengan status draft yang bisa diupdate', 422);
        }

        $validated = $request->validate([
            'judul' => 'sometimes|string|max:255',
            'lokasi' => 'sometimes|string|max:255',
            'deskripsi' => 'nullable|string',
            'tanggal' => 'sometimes|date',
            'pukul_mulai' => 'nullable|date_format:H:i',
            'pukul_selesai' => 'nullable|date_format:H:i',
            'departemen' => 'nullable|string|max:100',
            'jsa_id' => 'nullable|exists:jsa,id',
            'detail_data' => 'nullable|array',
        ]);

        return DB::transaction(function () use ($permit, $validated) {
            $permit->update(collect($validated)->only([
                'judul', 'lokasi', 'deskripsi', 'tanggal',
                'pukul_mulai', 'pukul_selesai', 'departemen', 'jsa_id',
            ])->toArray());

            if (isset($validated['detail_data'])) {
                $permit->detail()->updateOrCreate(
                    ['permit_id' => $permit->id],
                    ['detail_data' => $validated['detail_data']]
                );
            }

            return $this->success(
                $permit->load(['user', 'jsa', 'detail']),
                'Permit berhasil diupdate'
            );
        });
    }

    public function destroy(Request $request, $id)
    {
        $permit = Permit::find($id);

        if (!$permit) {
            return $this->error('Permit tidak ditemukan', 404);
        }

        if ($request->user()->role !== 'admin' && !$permit->isDraft() && !$permit->isCompleted()) {
            return $this->error('Hanya permit dengan status draft atau completed yang bisa dihapus', 422);
        }

        $permit->detail()->delete();
        $permit->delete();

        return $this->success(null, 'Permit berhasil dihapus');
    }

    public function submit($id)
    {
        $permit = Permit::find($id);

        if (!$permit) {
            return $this->error('Permit tidak ditemukan', 404);
        }

        if (!$permit->canBeSubmitted()) {
            return $this->error('Permit ini tidak bisa disubmit', 422);
        }

        $permit->update([
            'status' => Permit::STATUS_SUBMITTED,
            'submitted_at' => now(),
        ]);

        return $this->success(
            $permit->load(['user', 'jsa', 'detail']),
            'Permit berhasil disubmit ke Supervisor'
        );
    }

    public function supervisorApprove(Request $request, $id)
    {
        $permit = Permit::find($id);

        if (!$permit) {
            return $this->error('Permit tidak ditemukan', 404);
        }

        if (!$permit->canBeSupervisorAction()) {
            return $this->error('Permit ini tidak bisa disetujui Supervisor', 422);
        }

        if ($request->user()->role !== 'supervisor') {
            return $this->error('Hanya supervisor yang bisa menyetujui di tahap ini', 403);
        }

        $validated = $request->validate([
            'catatan' => 'nullable|string',
        ]);

        $permit->update([
            'status' => Permit::STATUS_SUPERVISOR_APPROVED,
            'supervisor_approved_at' => now(),
            'catatan' => $validated['catatan'] ?? $permit->catatan,
        ]);

        return $this->success(
            $permit->load(['user', 'jsa', 'detail']),
            'Permit berhasil disetujui Supervisor'
        );
    }

    public function supervisorReject(Request $request, $id)
    {
        $permit = Permit::find($id);

        if (!$permit) {
            return $this->error('Permit tidak ditemukan', 404);
        }

        if (!$permit->canBeSupervisorAction()) {
            return $this->error('Permit ini tidak bisa ditolak Supervisor', 422);
        }

        if ($request->user()->role !== 'supervisor') {
            return $this->error('Hanya supervisor yang bisa menolak di tahap ini', 403);
        }

        $validated = $request->validate([
            'catatan_reject' => 'nullable|string',
        ]);

        $permit->update([
            'status' => Permit::STATUS_SUPERVISOR_REJECTED,
            'supervisor_rejected_at' => now(),
            'catatan_reject' => $validated['catatan_reject'] ?? null,
            'submitted_at' => null,
        ]);

        return $this->success(
            $permit->load(['user', 'jsa', 'detail']),
            'Permit ditolak oleh Supervisor'
        );
    }

    public function hseApprove(Request $request, $id)
    {
        $permit = Permit::find($id);

        if (!$permit) {
            return $this->error('Permit tidak ditemukan', 404);
        }

        if (!$permit->canBeHseAction()) {
            return $this->error('Permit ini tidak bisa disetujui HSE', 422);
        }

        $validated = $request->validate([
            'catatan' => 'nullable|string',
            'hse_data' => 'nullable|array',
        ]);

        $existingHseData = $permit->completion_data['hse_review'] ?? [];
        $newHseData = $validated['hse_data'] ?? [];
        $mergedCompletion = $permit->completion_data ?? [];
        $mergedCompletion['hse_review'] = array_merge($existingHseData, $newHseData);

        $permit->update([
            'status' => Permit::STATUS_HSE_APPROVED,
            'hse_approved_at' => now(),
            'catatan' => $validated['catatan'] ?? $permit->catatan,
            'completion_data' => $mergedCompletion,
        ]);

        return $this->success(
            $permit->load(['user', 'jsa', 'detail']),
            'Permit berhasil disetujui Admin HSE'
        );
    }

    public function hseReject(Request $request, $id)
    {
        $permit = Permit::find($id);

        if (!$permit) {
            return $this->error('Permit tidak ditemukan', 404);
        }

        if (!$permit->canBeHseAction()) {
            return $this->error('Permit ini tidak bisa ditolak HSE', 422);
        }

        $validated = $request->validate([
            'catatan_reject' => 'nullable|string',
        ]);

        $permit->update([
            'status' => Permit::STATUS_HSE_REJECTED,
            'hse_rejected_at' => now(),
            'catatan_reject' => $validated['catatan_reject'] ?? null,
            'submitted_at' => null,
        ]);

        return $this->success(
            $permit->load(['user', 'jsa', 'detail']),
            'Permit ditolak oleh Admin HSE'
        );
    }

    public function complete(Request $request, $id)
    {
        $permit = Permit::find($id);

        if (!$permit) {
            return $this->error('Permit tidak ditemukan', 404);
        }

        if (!in_array($permit->status, [Permit::STATUS_HSE_APPROVED, Permit::STATUS_WORK_READY, Permit::STATUS_COMPLETED])) {
            return $this->error('Permit ini belum disetujui HSE atau tidak dalam status penyelesaian', 422);
        }

        $validated = $request->validate([
            'completion_data' => 'nullable|array',
        ]);

        $userRole = $request->user()->role;
        $newData = $validated['completion_data'] ?? [];
        $existingCompletion = $permit->completion_data ?? [];
        $mergedCompletion = array_merge($existingCompletion, $newData);

        if ($userRole === 'user') {
            $mergedCompletion['user_completed_at'] = now()->toDateTimeString();
        } elseif ($userRole === 'supervisor') {
            $mergedCompletion['supervisor_completed_at'] = now()->toDateTimeString();
        } elseif ($userRole === 'admin') {
            $mergedCompletion['admin_completed_at'] = now()->toDateTimeString();
        }

        $updateData = [
            'completion_data' => $mergedCompletion,
        ];

        if ($permit->status === Permit::STATUS_HSE_APPROVED) {
            $updateData['status'] = Permit::STATUS_WORK_READY;
            $updateData['work_ready_at'] = now();
        }

        $permit->update($updateData);

        return $this->success(
            $permit->load(['user', 'jsa', 'detail']),
            'Pengesahan penyelesaian pekerjaan berhasil disimpan'
        );
    }

    public function confirmComplete(Request $request, $id)
    {
        $permit = Permit::find($id);

        if (!$permit) {
            return $this->error('Permit tidak ditemukan', 404);
        }

        if (!$permit->canBeCompleted()) {
            return $this->error('Permit ini belum dalam status siap dikerjakan', 422);
        }

        if ($request->user()->role !== 'admin') {
            return $this->error('Hanya admin yang bisa mengkonfirmasi penyelesaian', 422);
        }

        $validated = $request->validate([
            'completion_data' => 'nullable|array',
        ]);

        $newData = $validated['completion_data'] ?? [];
        $existingCompletion = $permit->completion_data ?? [];
        $mergedCompletion = array_merge($existingCompletion, $newData);

        $permit->update([
            'status' => Permit::STATUS_COMPLETED,
            'completed_at' => now(),
            'completion_data' => $mergedCompletion,
        ]);

        return $this->success(
            $permit->load(['user', 'jsa', 'detail']),
            'Permit berhasil diselesaikan'
        );
    }

    public function nextSequence(Request $request)
    {
        $validated = $request->validate([
            'field' => 'required|string|in:no_izin_kerja_umum,form_no,permit_number',
        ]);

        if ($validated['field'] === 'permit_number') {
            $jenis = $request->input('jenis', '');
            if (!in_array($jenis, ['gwp','hwp','cse','elp','ewp','lwp','rwp','whp'])) {
                return $this->error('Jenis permit tidak valid', 400);
            }
            return $this->success([
                'next' => Permit::generatePermitNumber($jenis),
            ]);
        }

        $jenis = $validated['field'] === 'no_izin_kerja_umum' ? 'whp' : 'lwp';

        $last = Permit::where('jenis', $jenis)
            ->whereHas('detail', function ($q) use ($validated) {
                $q->whereNotNull('detail_data->' . $validated['field']);
            })
            ->with('detail')
            ->latest()
            ->first();

        if ($last && $last->detail && $last->detail->detail_data) {
            $lastNo = (int) ($last->detail->detail_data[$validated['field']] ?? 0);
            $nextNo = $lastNo + 1;
        } else {
            $nextNo = 1;
        }

        return $this->success([
            'next' => str_pad($nextNo, 2, '0', STR_PAD_LEFT),
        ]);
    }

    public function statusCounts(Request $request)
    {
        $query = Permit::query();

        if ($request->user()->role === 'user') {
            $query->where('user_id', $request->user()->id);
        }

        $counts = [
            'total' => (clone $query)->count(),
            'draft' => (clone $query)->where('status', Permit::STATUS_DRAFT)->count(),
            'submitted' => (clone $query)->where('status', Permit::STATUS_SUBMITTED)->count(),
            'supervisor_approved' => (clone $query)->where('status', Permit::STATUS_SUPERVISOR_APPROVED)->count(),
            'supervisor_rejected' => (clone $query)->where('status', Permit::STATUS_SUPERVISOR_REJECTED)->count(),
            'hse_approved' => (clone $query)->where('status', Permit::STATUS_HSE_APPROVED)->count(),
            'hse_rejected' => (clone $query)->where('status', Permit::STATUS_HSE_REJECTED)->count(),
            'work_ready' => (clone $query)->where('status', Permit::STATUS_WORK_READY)->count(),
            'completed' => (clone $query)->where('status', Permit::STATUS_COMPLETED)->count(),
        ];

        return $this->success($counts, 'Status counts berhasil diambil');
    }
}
