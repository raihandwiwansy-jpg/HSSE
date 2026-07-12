<?php

namespace App\Http\Controllers;

use App\Models\RwpPermit;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class RwpController extends Controller
{
    use ApiResponse;

    public function index(Request $request)
    {
        $query = RwpPermit::with('user');

        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('lokasi', 'like', "%{$request->search}%")
                  ->orWhere('peralatan', 'like', "%{$request->search}%")
                  ->orWhere('area', 'like', "%{$request->search}%");
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

        return $this->paginated($permits, 'Data RWP permit berhasil diambil');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'tanggal' => 'required|date',
            'lokasi' => 'required|string|max:255',
            'peralatan' => 'required|string',
            'area' => 'required|string|max:255',
            'tipe_sumber' => 'required|string|max:100',
            'status' => 'sometimes|string|in:draft,pending,approved,rejected,closed',
            'catatan' => 'nullable|string',
        ]);

        $data = array_merge($validated, [
            'user_id' => $request->user()->id,
            'status' => $validated['status'] ?? 'draft',
        ]);

        $permit = RwpPermit::create($data);

        return $this->success($permit->load('user'), 'RWP permit berhasil dibuat', 201);
    }

    public function show($id)
    {
        $permit = RwpPermit::with('user')->find($id);

        if (!$permit) {
            return $this->error('RWP permit tidak ditemukan', 404);
        }

        return $this->success($permit, 'Detail RWP permit berhasil diambil');
    }

    public function update(Request $request, $id)
    {
        $permit = RwpPermit::find($id);

        if (!$permit) {
            return $this->error('RWP permit tidak ditemukan', 404);
        }

        $validated = $request->validate([
            'tanggal' => 'sometimes|date',
            'lokasi' => 'sometimes|string|max:255',
            'peralatan' => 'sometimes|string',
            'area' => 'sometimes|string|max:255',
            'tipe_sumber' => 'sometimes|string|max:100',
            'status' => 'sometimes|string|in:draft,pending,approved,rejected,closed',
            'catatan' => 'nullable|string',
        ]);

        $permit->update($validated);

        return $this->success($permit->load('user'), 'RWP permit berhasil diupdate');
    }

    public function destroy($id)
    {
        $permit = RwpPermit::find($id);

        if (!$permit) {
            return $this->error('RWP permit tidak ditemukan', 404);
        }

        $permit->delete();

        return $this->success(null, 'RWP permit berhasil dihapus');
    }

    public function updateStatus(Request $request, $id)
    {
        $permit = RwpPermit::find($id);

        if (!$permit) {
            return $this->error('RWP permit tidak ditemukan', 404);
        }

        $validated = $request->validate([
            'status' => 'required|string|in:draft,pending,submitted,approved,rejected,completed',
        ]);

        $permit->update(['status' => $validated['status']]);

        return $this->success($permit->load('user'), 'Status RWP berhasil diupdate');
    }
}
