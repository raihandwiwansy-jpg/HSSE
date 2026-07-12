<?php

namespace App\Http\Controllers;

use App\Models\WhpPermit;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class WhpController extends Controller
{
    use ApiResponse;

    public function index(Request $request)
    {
        $query = WhpPermit::with('user');

        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('lokasi', 'like', "%{$request->search}%")
                  ->orWhere('deskripsi_pekerjaan', 'like', "%{$request->search}%")
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

        return $this->paginated($permits, 'Data WHP permit berhasil diambil');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'tanggal' => 'required|date',
            'lokasi' => 'required|string|max:255',
            'deskripsi_pekerjaan' => 'required|string',
            'waktu_mulai' => 'required|date_format:H:i',
            'waktu_selesai' => 'required|date_format:H:i|after:waktu_mulai',
            'peralatan' => 'required|string',
            'status' => 'sometimes|string|in:draft,pending,approved,rejected,closed',
            'catatan' => 'nullable|string',
        ]);

        $data = array_merge($validated, [
            'user_id' => $request->user()->id,
            'status' => $validated['status'] ?? 'draft',
        ]);

        $permit = WhpPermit::create($data);

        return $this->success($permit->load('user'), 'WHP permit berhasil dibuat', 201);
    }

    public function show($id)
    {
        $permit = WhpPermit::with('user')->find($id);

        if (!$permit) {
            return $this->error('WHP permit tidak ditemukan', 404);
        }

        return $this->success($permit, 'Detail WHP permit berhasil diambil');
    }

    public function update(Request $request, $id)
    {
        $permit = WhpPermit::find($id);

        if (!$permit) {
            return $this->error('WHP permit tidak ditemukan', 404);
        }

        $validated = $request->validate([
            'tanggal' => 'sometimes|date',
            'lokasi' => 'sometimes|string|max:255',
            'deskripsi_pekerjaan' => 'sometimes|string',
            'waktu_mulai' => 'sometimes|date_format:H:i',
            'waktu_selesai' => 'sometimes|date_format:H:i',
            'peralatan' => 'sometimes|string',
            'status' => 'sometimes|string|in:draft,pending,approved,rejected,closed',
            'catatan' => 'nullable|string',
        ]);

        $permit->update($validated);

        return $this->success($permit->load('user'), 'WHP permit berhasil diupdate');
    }

    public function destroy($id)
    {
        $permit = WhpPermit::find($id);

        if (!$permit) {
            return $this->error('WHP permit tidak ditemukan', 404);
        }

        $permit->delete();

        return $this->success(null, 'WHP permit berhasil dihapus');
    }

    public function updateStatus(Request $request, $id)
    {
        $permit = WhpPermit::find($id);

        if (!$permit) {
            return $this->error('WHP permit tidak ditemukan', 404);
        }

        $validated = $request->validate([
            'status' => 'required|string|in:draft,pending,submitted,approved,rejected,completed',
        ]);

        $permit->update(['status' => $validated['status']]);

        return $this->success($permit->load('user'), 'Status WHP berhasil diupdate');
    }
}
