<?php

namespace App\Http\Controllers;

use App\Models\EwpPermit;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class EwpController extends Controller
{
    use ApiResponse;

    public function index(Request $request)
    {
        $query = EwpPermit::with('user');

        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('lokasi', 'like', "%{$request->search}%")
                  ->orWhere('peralatan', 'like', "%{$request->search}%");
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

        return $this->paginated($permits, 'Data EWP permit berhasil diambil');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'tanggal' => 'required|date',
            'lokasi' => 'required|string|max:255',
            'panjang' => 'required|numeric|min:0',
            'lebar' => 'required|numeric|min:0',
            'kedalaman' => 'required|numeric|min:0',
            'peralatan' => 'required|string',
            'status' => 'sometimes|string|in:draft,pending,approved,rejected,closed',
            'catatan' => 'nullable|string',
        ]);

        $data = array_merge($validated, [
            'user_id' => $request->user()->id,
            'status' => $validated['status'] ?? 'draft',
        ]);

        $permit = EwpPermit::create($data);

        return $this->success($permit->load('user'), 'EWP permit berhasil dibuat', 201);
    }

    public function show($id)
    {
        $permit = EwpPermit::with('user')->find($id);

        if (!$permit) {
            return $this->error('EWP permit tidak ditemukan', 404);
        }

        return $this->success($permit, 'Detail EWP permit berhasil diambil');
    }

    public function update(Request $request, $id)
    {
        $permit = EwpPermit::find($id);

        if (!$permit) {
            return $this->error('EWP permit tidak ditemukan', 404);
        }

        $validated = $request->validate([
            'tanggal' => 'sometimes|date',
            'lokasi' => 'sometimes|string|max:255',
            'panjang' => 'sometimes|numeric|min:0',
            'lebar' => 'sometimes|numeric|min:0',
            'kedalaman' => 'sometimes|numeric|min:0',
            'peralatan' => 'sometimes|string',
            'status' => 'sometimes|string|in:draft,pending,approved,rejected,closed',
            'catatan' => 'nullable|string',
        ]);

        $permit->update($validated);

        return $this->success($permit->load('user'), 'EWP permit berhasil diupdate');
    }

    public function destroy($id)
    {
        $permit = EwpPermit::find($id);

        if (!$permit) {
            return $this->error('EWP permit tidak ditemukan', 404);
        }

        $permit->delete();

        return $this->success(null, 'EWP permit berhasil dihapus');
    }

    public function updateStatus(Request $request, $id)
    {
        $permit = EwpPermit::find($id);

        if (!$permit) {
            return $this->error('EWP permit tidak ditemukan', 404);
        }

        $validated = $request->validate([
            'status' => 'required|string|in:draft,pending,submitted,approved,rejected,completed',
        ]);

        $permit->update(['status' => $validated['status']]);

        return $this->success($permit->load('user'), 'Status EWP berhasil diupdate');
    }
}
