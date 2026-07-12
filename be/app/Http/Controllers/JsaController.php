<?php

namespace App\Http\Controllers;

use App\Models\Jsa;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class JsaController extends Controller
{
    use ApiResponse;

    /**
     * List semua JSA (dengan filter & search)
     */
    public function index(Request $request)
    {
        $query = Jsa::with('user');

        // Search
        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('kegiatan', 'like', "%{$request->search}%")
                  ->orWhere('lokasi', 'like', "%{$request->search}%")
                  ->orWhere('departemen', 'like', "%{$request->search}%");
            });
        }

        // Filter by departemen
        if ($request->departemen) {
            $query->where('departemen', $request->departemen);
        }

        // Filter by date range
        if ($request->date_from) {
            $query->where('tanggal', '>=', $request->date_from);
        }
        if ($request->date_to) {
            $query->where('tanggal', '<=', $request->date_to);
        }

        // User biasa hanya bisa lihat JSA sendiri
        if ($request->user()->role === 'user') {
            $query->where('user_id', $request->user()->id);
        }

        $jsa = $query->latest()->paginate($request->per_page ?? 15);

        return $this->paginated($jsa, 'Data JSA berhasil diambil');
    }

    /**
     * Store JSA baru
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'departemen' => 'required|string|max:100',
            'tanggal' => 'required|date',
            'kegiatan' => 'required|string|max:255',
            'lokasi' => 'required|string|max:255',
            'tahapan' => 'required|array|min:1',
            'tahapan.*.nama' => 'required|string',
            'tahapan.*.bahaya' => 'required|string',
            'tahapan.*.risiko' => 'required|string',
            'tahapan.*.kontrol' => 'required|string',
        ]);

        $data = array_merge($validated, [
            'user_id' => $request->user()->id,
        ]);

        $jsa = Jsa::create($data);

        return $this->success($jsa->load('user'), 'JSA berhasil dibuat', 201);
    }

    /**
     * Show detail JSA
     */
    public function show($id)
    {
        $jsa = Jsa::with('user')->find($id);

        if (!$jsa) {
            return $this->error('JSA tidak ditemukan', 404);
        }

        return $this->success($jsa, 'Detail JSA berhasil diambil');
    }

    /**
     * Update JSA
     */
    public function update(Request $request, $id)
    {
        $jsa = Jsa::find($id);

        if (!$jsa) {
            return $this->error('JSA tidak ditemukan', 404);
        }

        $validated = $request->validate([
            'departemen' => 'sometimes|string|max:100',
            'tanggal' => 'sometimes|date',
            'kegiatan' => 'sometimes|string|max:255',
            'lokasi' => 'sometimes|string|max:255',
            'tahapan' => 'sometimes|array|min:1',
            'tahapan.*.nama' => 'required|string',
            'tahapan.*.bahaya' => 'required|string',
            'tahapan.*.risiko' => 'required|string',
            'tahapan.*.kontrol' => 'required|string',
        ]);

        $jsa->update($validated);

        return $this->success($jsa->load('user'), 'JSA berhasil diupdate');
    }

    /**
     * Delete JSA
     */
    public function destroy($id)
    {
        $jsa = Jsa::find($id);

        if (!$jsa) {
            return $this->error('JSA tidak ditemukan', 404);
        }

        $jsa->delete();

        return $this->success(null, 'JSA berhasil dihapus');
    }
}
