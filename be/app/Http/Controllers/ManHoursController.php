<?php

namespace App\Http\Controllers;

use App\Models\ManHour;
use App\Models\User;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class ManHoursController extends Controller
{
    use ApiResponse;

    /**
     * List all man hours tasks (with search & filters)
     */
    public function index(Request $request)
    {
        $user = $request->user();

        // Block Supervisor
        if ($user->role === 'supervisor') {
            return $this->error('Supervisor tidak memiliki akses ke modul ini', 403);
        }

        $query = ManHour::with(['admin', 'user']);

        // Search by employee name, judul, or lokasi
        if ($request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('judul_pekerjaan', 'like', "%{$search}%")
                  ->orWhere('lokasi', 'like', "%{$search}%")
                  ->orWhereHas('user', function ($uq) use ($search) {
                      $uq->where('name', 'like', "%{$search}%");
                  });
            });
        }

        // Filter by date range
        if ($request->date_from) {
            $query->where('tanggal', '>=', $request->date_from);
        }
        if ($request->date_to) {
            $query->where('tanggal', '<=', $request->date_to);
        }

        // Filter by status
        if ($request->status) {
            $query->where('status', $request->status);
        }

        // Standard user can only see their own tasks
        if ($user->role === 'user') {
            $query->where('user_id', $user->id);
        }

        $tasks = $query->latest('tanggal')->latest('id')->paginate($request->per_page ?? 15);

        return $this->paginated($tasks, 'Data man hours berhasil diambil');
    }

    /**
     * Store new man hours task (Admin Only)
     */
    public function store(Request $request)
    {
        $admin = $request->user();
        if ($admin->role !== 'admin') {
            return $this->error('Hanya Admin yang dapat membuat penugasan kerja', 403);
        }

        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'judul_pekerjaan' => 'required|string|max:255',
            'lokasi' => 'required|string|max:255',
            'tanggal' => 'required|date',
            'durasi_jam' => 'required|numeric|min:0|max:24',
            'deskripsi' => 'nullable|string',
        ]);

        // Verify the assigned user is actually a standard user (employee)
        $assignedUser = User::find($validated['user_id']);
        if ($assignedUser->role !== 'user') {
            return $this->error('Tugas hanya dapat diberikan kepada karyawan (user)', 422);
        }

        $task = ManHour::create([
            'admin_id' => $admin->id,
            'user_id' => $validated['user_id'],
            'judul_pekerjaan' => $validated['judul_pekerjaan'],
            'lokasi' => $validated['lokasi'],
            'tanggal' => $validated['tanggal'],
            'durasi_jam' => $validated['durasi_jam'],
            'deskripsi' => $validated['deskripsi'] ?? null,
            'status' => 'pending',
        ]);

        return $this->success($task->load(['admin', 'user']), 'Penugasan kerja berhasil dibuat', 201);
    }

    /**
     * Show detail man hours task
     */
    public function show(Request $request, $id)
    {
        $user = $request->user();
        if ($user->role === 'supervisor') {
            return $this->error('Supervisor tidak memiliki akses ke modul ini', 403);
        }

        $task = ManHour::with(['admin', 'user'])->find($id);

        if (!$task) {
            return $this->error('Data penugasan tidak ditemukan', 404);
        }

        // Standard user can only see their own tasks
        if ($user->role === 'user' && $task->user_id !== $user->id) {
            return $this->error('Anda tidak memiliki akses untuk melihat data ini', 403);
        }

        return $this->success($task, 'Detail penugasan berhasil diambil');
    }

    /**
     * Update man hours task (Admin Only)
     */
    public function update(Request $request, $id)
    {
        $admin = $request->user();
        if ($admin->role !== 'admin') {
            return $this->error('Hanya Admin yang dapat memperbarui detail penugasan', 403);
        }

        $task = ManHour::find($id);
        if (!$task) {
            return $this->error('Data penugasan tidak ditemukan', 404);
        }

        $validated = $request->validate([
            'user_id' => 'sometimes|required|exists:users,id',
            'judul_pekerjaan' => 'sometimes|required|string|max:255',
            'lokasi' => 'sometimes|required|string|max:255',
            'tanggal' => 'sometimes|required|date',
            'durasi_jam' => 'sometimes|required|numeric|min:0|max:24',
            'deskripsi' => 'nullable|string',
            'status' => 'sometimes|required|in:pending,in_progress,completed',
        ]);

        if (isset($validated['user_id'])) {
            $assignedUser = User::find($validated['user_id']);
            if ($assignedUser->role !== 'user') {
                return $this->error('Tugas hanya dapat diberikan kepada karyawan (user)', 422);
            }
        }

        $task->update($validated);

        return $this->success($task->load(['admin', 'user']), 'Penugasan kerja berhasil diperbarui');
    }

    /**
     * Update task status (User Only)
     */
    public function updateStatus(Request $request, $id)
    {
        $user = $request->user();
        if ($user->role !== 'user') {
            return $this->error('Hanya Karyawan (user) yang dapat memperbarui status penugasan', 403);
        }

        $task = ManHour::find($id);
        if (!$task) {
            return $this->error('Data penugasan tidak ditemukan', 404);
        }

        if ($task->user_id !== $user->id) {
            return $this->error('Anda tidak memiliki akses untuk mengubah status penugasan ini', 403);
        }

        $validated = $request->validate([
            'status' => 'required|in:pending,in_progress,completed',
        ]);

        $task->update([
            'status' => $validated['status'],
        ]);

        return $this->success($task->load(['admin', 'user']), 'Status penugasan berhasil diperbarui');
    }

    /**
     * Delete man hours task (Admin Only)
     */
    public function destroy(Request $request, $id)
    {
        $admin = $request->user();
        if ($admin->role !== 'admin') {
            return $this->error('Hanya Admin yang dapat menghapus penugasan', 403);
        }

        $task = ManHour::find($id);

        if (!$task) {
            return $this->error('Data penugasan tidak ditemukan', 404);
        }

        $task->delete();

        return $this->success(null, 'Penugasan kerja berhasil dihapus');
    }
}
