<?php

namespace App\Http\Controllers;

use App\Models\LwpPermit;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class LwpController extends Controller
{
    use ApiResponse;

    public function index(Request $request)
    {
        $query = LwpPermit::with('user');

        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('lokasi', 'like', "%{$request->search}%")
                  ->orWhere('pekerjaan', 'like', "%{$request->search}%");
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

        return $this->paginated($permits, 'Data LWP permit berhasil diambil');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'tanggal' => 'required|date',
            'lokasi' => 'required|string|max:255',
            'pekerjaan' => 'required|string',
            'beban_total' => 'required|numeric|min:0',
            'kapasitas_crane' => 'required|numeric|min:0',
            'status' => 'sometimes|string|in:draft,pending,approved,rejected,closed',
            'catatan' => 'nullable|string',
        ]);

        $data = array_merge($validated, [
            'user_id' => $request->user()->id,
            'status' => $validated['status'] ?? 'draft',
        ]);

        $permit = LwpPermit::create($data);

        return $this->success($permit->load('user'), 'LWP permit berhasil dibuat', 201);
    }

    public function show($id)
    {
        $permit = LwpPermit::with('user')->find($id);

        if (!$permit) {
            return $this->error('LWP permit tidak ditemukan', 404);
        }

        return $this->success($permit, 'Detail LWP permit berhasil diambil');
    }

    public function update(Request $request, $id)
    {
        $permit = LwpPermit::find($id);

        if (!$permit) {
            return $this->error('LWP permit tidak ditemukan', 404);
        }

        $validated = $request->validate([
            'tanggal' => 'sometimes|date',
            'lokasi' => 'sometimes|string|max:255',
            'pekerjaan' => 'sometimes|string',
            'beban_total' => 'sometimes|numeric|min:0',
            'kapasitas_crane' => 'sometimes|numeric|min:0',
            'status' => 'sometimes|string|in:draft,pending,approved,rejected,closed',
            'catatan' => 'nullable|string',
        ]);

        $permit->update($validated);

        return $this->success($permit->load('user'), 'LWP permit berhasil diupdate');
    }

    public function destroy($id)
    {
        $permit = LwpPermit::find($id);

        if (!$permit) {
            return $this->error('LWP permit tidak ditemukan', 404);
        }

        $permit->delete();

        return $this->success(null, 'LWP permit berhasil dihapus');
    }

    public function updateStatus(Request $request, $id)
    {
        $permit = LwpPermit::find($id);

        if (!$permit) {
            return $this->error('LWP permit tidak ditemukan', 404);
        }

        $validated = $request->validate([
            'status' => 'required|string|in:draft,pending,submitted,approved,rejected,completed',
        ]);

        $permit->update(['status' => $validated['status']]);

        return $this->success($permit->load('user'), 'Status LWP berhasil diupdate');
    }
}
