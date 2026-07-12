<?php

namespace App\Http\Controllers;

use App\Models\Insiden;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class InsidenController extends Controller
{
    use ApiResponse;

    /**
     * List semua insiden (dengan filter & search)
     */
    public function index(Request $request)
    {
        $query = Insiden::with('user');

        // Search by judul or lokasi
        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('judul', 'like', "%{$request->search}%")
                  ->orWhere('lokasi', 'like', "%{$request->search}%");
            });
        }

        // Filter by status
        if ($request->status) {
            $query->where('status', $request->status);
        }

        // Filter by jenis
        if ($request->jenis) {
            $query->where('jenis', $request->jenis);
        }

        // Filter by date range
        if ($request->date_from) {
            $query->where('tanggal_kejadian', '>=', $request->date_from);
        }
        if ($request->date_to) {
            $query->where('tanggal_kejadian', '<=', $request->date_to);
        }

        // User biasa hanya bisa lihat insiden sendiri
        if ($request->user()->role === 'user') {
            $query->where('user_id', $request->user()->id);
        }

        $insidens = $query->latest()->paginate($request->per_page ?? 15);

        return $this->paginated($insidens, 'Data insiden berhasil diambil');
    }

    /**
     * Store insiden baru
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'judul' => 'required|string|max:255',
            'jenis' => 'required|string|in:kecelakaan,near_miss,unsafe_condition',
            'lokasi' => 'required|string|max:255',
            'tanggal_kejadian' => 'required|date',
            'deskripsi' => 'required|string',
            'foto' => 'nullable|image|max:2048',
            'status' => 'sometimes|string|in:pending,investigation,resolved,closed',
        ]);

        $data = [
            'user_id' => $request->user()->id,
            'judul' => $validated['judul'],
            'jenis' => $validated['jenis'],
            'lokasi' => $validated['lokasi'],
            'tanggal_kejadian' => $validated['tanggal_kejadian'],
            'deskripsi' => $validated['deskripsi'],
            'status' => $validated['status'] ?? 'pending',
        ];

        // Handle upload foto
        if ($request->hasFile('foto')) {
            $data['foto'] = $request->file('foto')->store('insiden', 'public');
        }

        $insiden = Insiden::create($data);

        return $this->success($insiden->load('user'), 'Insiden berhasil dibuat', 201);
    }

    /**
     * Show detail insiden
     */
    public function show($id)
    {
        $insiden = Insiden::with('user')->find($id);

        if (!$insiden) {
            return $this->error('Insiden tidak ditemukan', 404);
        }

        return $this->success($insiden, 'Detail insiden berhasil diambil');
    }

    /**
     * Update insiden
     */
    public function update(Request $request, $id)
    {
        $insiden = Insiden::find($id);

        if (!$insiden) {
            return $this->error('Insiden tidak ditemukan', 404);
        }

        $validated = $request->validate([
            'judul' => 'sometimes|string|max:255',
            'jenis' => 'sometimes|string|in:kecelakaan,near_miss,unsafe_condition',
            'lokasi' => 'sometimes|string|max:255',
            'tanggal_kejadian' => 'sometimes|date',
            'deskripsi' => 'sometimes|string',
            'foto' => 'nullable|image|max:2048',
            'status' => 'sometimes|string|in:pending,investigation,resolved,closed',
        ]);

        // Handle update foto
        if ($request->hasFile('foto')) {
            // Hapus foto lama
            if ($insiden->foto) {
                Storage::disk('public')->delete($insiden->foto);
            }
            $validated['foto'] = $request->file('foto')->store('insiden', 'public');
        }

        $insiden->update($validated);

        return $this->success($insiden->load('user'), 'Insiden berhasil diupdate');
    }

    /**
     * Update status insiden
     */
    public function updateStatus(Request $request, $id)
    {
        $insiden = Insiden::find($id);

        if (!$insiden) {
            return $this->error('Insiden tidak ditemukan', 404);
        }

        $validated = $request->validate([
            'status' => 'required|string|in:pending,investigation,resolved,closed',
        ]);

        $insiden->update(['status' => $validated['status']]);

        return $this->success($insiden->load('user'), 'Status insiden berhasil diupdate');
    }

    /**
     * Delete insiden (soft delete)
     */
    public function destroy($id)
    {
        $insiden = Insiden::find($id);

        if (!$insiden) {
            return $this->error('Insiden tidak ditemukan', 404);
        }

        // Hapus foto jika ada
        if ($insiden->foto) {
            Storage::disk('public')->delete($insiden->foto);
        }

        $insiden->delete();

        return $this->success(null, 'Insiden berhasil dihapus');
    }
}
