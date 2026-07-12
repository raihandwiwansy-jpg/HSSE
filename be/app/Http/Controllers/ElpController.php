<?php

namespace App\Http\Controllers;

use App\Models\ElpPermit;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class ElpController extends Controller
{
    use ApiResponse;

    public function index(Request $request)
    {
        $query = ElpPermit::with('user');

        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('alat_diisolasi', 'like', "%{$request->search}%")
                  ->orWhere('tag_no', 'like', "%{$request->search}%")
                  ->orWhere('tipe_isolasi', 'like', "%{$request->search}%");
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

        return $this->paginated($permits, 'Data ELP permit berhasil diambil');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'tanggal' => 'required|date',
            'shift' => 'required|string|max:50',
            'alat_diisolasi' => 'required|string',
            'tag_no' => 'required|string|max:100',
            'tipe_isolasi' => 'required|string|max:100',
            'status' => 'sometimes|string|in:draft,pending,approved,rejected,closed',
            'catatan' => 'nullable|string',
        ]);

        $data = array_merge($validated, [
            'user_id' => $request->user()->id,
            'status' => $validated['status'] ?? 'draft',
        ]);

        $permit = ElpPermit::create($data);

        return $this->success($permit->load('user'), 'ELP permit berhasil dibuat', 201);
    }

    public function show($id)
    {
        $permit = ElpPermit::with('user')->find($id);

        if (!$permit) {
            return $this->error('ELP permit tidak ditemukan', 404);
        }

        return $this->success($permit, 'Detail ELP permit berhasil diambil');
    }

    public function update(Request $request, $id)
    {
        $permit = ElpPermit::find($id);

        if (!$permit) {
            return $this->error('ELP permit tidak ditemukan', 404);
        }

        $validated = $request->validate([
            'tanggal' => 'sometimes|date',
            'shift' => 'sometimes|string|max:50',
            'alat_diisolasi' => 'sometimes|string',
            'tag_no' => 'sometimes|string|max:100',
            'tipe_isolasi' => 'sometimes|string|max:100',
            'status' => 'sometimes|string|in:draft,pending,approved,rejected,closed',
            'catatan' => 'nullable|string',
        ]);

        $permit->update($validated);

        return $this->success($permit->load('user'), 'ELP permit berhasil diupdate');
    }

    public function destroy($id)
    {
        $permit = ElpPermit::find($id);

        if (!$permit) {
            return $this->error('ELP permit tidak ditemukan', 404);
        }

        $permit->delete();

        return $this->success(null, 'ELP permit berhasil dihapus');
    }

    public function updateStatus(Request $request, $id)
    {
        $permit = ElpPermit::find($id);

        if (!$permit) {
            return $this->error('ELP permit tidak ditemukan', 404);
        }

        $validated = $request->validate([
            'status' => 'required|string|in:draft,pending,submitted,approved,rejected,completed',
        ]);

        $permit->update(['status' => $validated['status']]);

        return $this->success($permit->load('user'), 'Status ELP berhasil diupdate');
    }
}
