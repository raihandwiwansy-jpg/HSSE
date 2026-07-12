<?php

namespace App\Http\Controllers;

use App\Models\CsePermit;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class CseController extends Controller
{
    use ApiResponse;

    public function index(Request $request)
    {
        $query = CsePermit::with('user');

        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('supervisor', 'like', "%{$request->search}%")
                  ->orWhere('fasilitas', 'like', "%{$request->search}%")
                  ->orWhere('lokasi', 'like', "%{$request->search}%")
                  ->orWhere('alasan', 'like', "%{$request->search}%");
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

        return $this->paginated($permits, 'Data CSE permit berhasil diambil');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'tanggal' => 'required|date',
            'supervisor' => 'required|string|max:255',
            'fasilitas' => 'required|string|max:255',
            'lokasi' => 'required|string|max:255',
            'alasan' => 'required|string',
            'jumlah_pekerja' => 'required|integer|min:1',
            'hasil_gas' => 'nullable|array',
            'status' => 'sometimes|string|in:draft,pending,approved,rejected,closed',
            'catatan' => 'nullable|string',
        ]);

        $data = array_merge($validated, [
            'user_id' => $request->user()->id,
            'status' => $validated['status'] ?? 'draft',
        ]);

        $permit = CsePermit::create($data);

        return $this->success($permit->load('user'), 'CSE permit berhasil dibuat', 201);
    }

    public function show($id)
    {
        $permit = CsePermit::with('user')->find($id);

        if (!$permit) {
            return $this->error('CSE permit tidak ditemukan', 404);
        }

        return $this->success($permit, 'Detail CSE permit berhasil diambil');
    }

    public function update(Request $request, $id)
    {
        $permit = CsePermit::find($id);

        if (!$permit) {
            return $this->error('CSE permit tidak ditemukan', 404);
        }

        $validated = $request->validate([
            'tanggal' => 'sometimes|date',
            'supervisor' => 'sometimes|string|max:255',
            'fasilitas' => 'sometimes|string|max:255',
            'lokasi' => 'sometimes|string|max:255',
            'alasan' => 'sometimes|string',
            'jumlah_pekerja' => 'sometimes|integer|min:1',
            'hasil_gas' => 'nullable|array',
            'status' => 'sometimes|string|in:draft,pending,approved,rejected,closed',
            'catatan' => 'nullable|string',
        ]);

        $permit->update($validated);

        return $this->success($permit->load('user'), 'CSE permit berhasil diupdate');
    }

    public function destroy($id)
    {
        $permit = CsePermit::find($id);

        if (!$permit) {
            return $this->error('CSE permit tidak ditemukan', 404);
        }

        $permit->delete();

        return $this->success(null, 'CSE permit berhasil dihapus');
    }

    public function updateStatus(Request $request, $id)
    {
        $permit = CsePermit::find($id);

        if (!$permit) {
            return $this->error('CSE permit tidak ditemukan', 404);
        }

        $validated = $request->validate([
            'status' => 'required|string|in:draft,pending,submitted,approved,rejected,completed',
        ]);

        $permit->update(['status' => $validated['status']]);

        return $this->success($permit->load('user'), 'Status CSE berhasil diupdate');
    }
}
