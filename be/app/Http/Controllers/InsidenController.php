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
        $user = $request->user();

        // Supervisor tidak memiliki akses ke modul insiden sama sekali
        if ($user->role === 'supervisor') {
            return $this->error('Supervisor tidak memiliki akses ke modul ini', 403);
        }

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
        if ($user->role === 'user') {
            $query->where('user_id', $user->id);
        }

        $insidens = $query->latest()->paginate($request->per_page ?? 15);

        return $this->paginated($insidens, 'Data insiden berhasil diambil');
    }

    /**
     * Store insiden baru (Hanya User/Karyawan)
     */
    public function store(Request $request)
    {
        $user = $request->user();

        // Hanya Admin & Kasubag yang bisa lapor
        if (!in_array($user->role, ['admin', 'kasubag'])) {
            return $this->error('Hanya Admin HSE dan Kasubag yang dapat membuat laporan insiden', 403);
        }

        $validated = $request->validate([
            'judul' => 'required|string|max:255',
            'jenis' => 'required|string|in:kecelakaan,near_miss,unsafe_condition',
            'lokasi' => 'required|string|max:255',
            'tanggal_kejadian' => 'required|date',
            'deskripsi' => 'required|string',
            'foto' => 'nullable|string', // Base64 or URL
            'foto_file' => 'nullable|image|max:2048', // Uploaded file
        ]);

        $data = [
            'user_id' => $user->id,
            'judul' => $validated['judul'],
            'jenis' => $validated['jenis'],
            'lokasi' => $validated['lokasi'],
            'tanggal_kejadian' => $validated['tanggal_kejadian'],
            'deskripsi' => $validated['deskripsi'],
            'status' => 'pending',
        ];

        // Handle Base64 camera photo or standard file upload
        if ($request->foto && preg_match('/^data:image\/(\w+);base64,/', $request->foto)) {
            $imageData = substr($request->foto, strpos($request->foto, ',') + 1);
            $imageType = strtolower(explode('/', explode(';', $request->foto)[0])[1]);
            $imageName = 'insiden_' . time() . '_' . uniqid() . '.' . $imageType;
            Storage::disk('public')->put('insiden/' . $imageName, base64_decode($imageData));
            $data['foto'] = 'insiden/' . $imageName;
        } elseif ($request->hasFile('foto_file')) {
            $data['foto'] = $request->file('foto_file')->store('insiden', 'public');
        }

        $insiden = Insiden::create($data);

        return $this->success($insiden->load('user'), 'Insiden berhasil dilaporkan', 201);
    }

    /**
     * Show detail insiden
     */
    public function show(Request $request, $id)
    {
        $user = $request->user();

        // Supervisor blocked
        if ($user->role === 'supervisor') {
            return $this->error('Supervisor tidak memiliki akses ke modul ini', 403);
        }

        $insiden = Insiden::with('user')->find($id);

        if (!$insiden) {
            return $this->error('Insiden tidak ditemukan', 404);
        }

        // User biasa hanya bisa lihat detail insiden sendiri
        if ($user->role === 'user' && $insiden->user_id !== $user->id) {
            return $this->error('Anda tidak memiliki akses untuk melihat data ini', 403);
        }

        return $this->success($insiden, 'Detail insiden berhasil diambil');
    }

    /**
     * Update insiden
     */
    public function update(Request $request, $id)
    {
        $user = $request->user();

        // Supervisor blocked
        if ($user->role === 'supervisor') {
            return $this->error('Supervisor tidak memiliki akses ke modul ini', 403);
        }

        $insiden = Insiden::find($id);

        if (!$insiden) {
            return $this->error('Insiden tidak ditemukan', 404);
        }

        // Hanya pembuat (admin/kasubag) yang bisa update datanya sendiri jika masih pending
        if (in_array($user->role, ['admin', 'kasubag'])) {
            if ($insiden->user_id !== $user->id) {
                return $this->error('Anda tidak memiliki akses untuk mengubah data ini', 403);
            }
            if ($insiden->status !== 'pending') {
                return $this->error('Laporan insiden yang sedang diproses tidak dapat diubah', 400);
            }
        } else {
            return $this->error('Anda tidak memiliki akses untuk mengubah data ini', 403);
        }

        $validated = $request->validate([
            'judul' => 'sometimes|required|string|max:255',
            'jenis' => 'sometimes|required|string|in:kecelakaan,near_miss,unsafe_condition',
            'lokasi' => 'sometimes|required|string|max:255',
            'tanggal_kejadian' => 'sometimes|required|date',
            'deskripsi' => 'sometimes|required|string',
            'foto' => 'nullable|string', // Base64
            'foto_file' => 'nullable|image|max:2048',
        ]);

        $data = [];
        if (isset($validated['judul'])) $data['judul'] = $validated['judul'];
        if (isset($validated['jenis'])) $data['jenis'] = $validated['jenis'];
        if (isset($validated['lokasi'])) $data['lokasi'] = $validated['lokasi'];
        if (isset($validated['tanggal_kejadian'])) $data['tanggal_kejadian'] = $validated['tanggal_kejadian'];
        if (isset($validated['deskripsi'])) $data['deskripsi'] = $validated['deskripsi'];

        // Handle Base64 camera photo or standard file upload
        if ($request->foto && preg_match('/^data:image\/(\w+);base64,/', $request->foto)) {
            // Hapus foto lama
            if ($insiden->foto) {
                Storage::disk('public')->delete($insiden->foto);
            }
            $imageData = substr($request->foto, strpos($request->foto, ',') + 1);
            $imageType = strtolower(explode('/', explode(';', $request->foto)[0])[1]);
            $imageName = 'insiden_' . time() . '_' . uniqid() . '.' . $imageType;
            Storage::disk('public')->put('insiden/' . $imageName, base64_decode($imageData));
            $data['foto'] = 'insiden/' . $imageName;
        } elseif ($request->hasFile('foto_file')) {
            // Hapus foto lama
            if ($insiden->foto) {
                Storage::disk('public')->delete($insiden->foto);
            }
            $data['foto'] = $request->file('foto_file')->store('insiden', 'public');
        }

        $insiden->update($data);

        return $this->success($insiden->load('user'), 'Laporan insiden berhasil diperbarui');
    }

    /**
     * Update status insiden (Admin Only)
     */
    public function updateStatus(Request $request, $id)
    {
        $user = $request->user();

        if ($user->role !== 'admin') {
            return $this->error('Hanya Admin yang dapat memperbarui status laporan insiden', 403);
        }

        $insiden = Insiden::find($id);

        if (!$insiden) {
            return $this->error('Insiden tidak ditemukan', 404);
        }

        $validated = $request->validate([
            'status' => 'required|string|in:pending,investigation,resolved,closed',
        ]);

        $insiden->update(['status' => $validated['status']]);

        return $this->success($insiden->load('user'), 'Status insiden berhasil diperbarui');
    }

    /**
     * Delete insiden (Admin Only)
     */
    public function destroy(Request $request, $id)
    {
        $user = $request->user();

        if ($user->role !== 'admin') {
            return $this->error('Hanya Admin yang dapat menghapus laporan insiden', 403);
        }

        $insiden = Insiden::find($id);

        if (!$insiden) {
            return $this->error('Insiden tidak ditemukan', 404);
        }

        // Hapus foto jika ada
        if ($insiden->foto) {
            Storage::disk('public')->delete($insiden->foto);
        }

        $insiden->delete();

        return $this->success(null, 'Laporan insiden berhasil dihapus');
    }
}
