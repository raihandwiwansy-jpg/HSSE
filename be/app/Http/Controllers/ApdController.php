<?php

namespace App\Http\Controllers;

use App\Models\Apd;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use PhpOffice\PhpSpreadsheet\IOFactory;

class ApdController extends Controller
{
    use ApiResponse;

    /**
     * List semua APD (dengan filter & search)
     */
    public function index(Request $request)
    {
        $query = Apd::query();

        // Search
        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('nama', 'like', "%{$request->search}%")
                  ->orWhere('kode', 'like', "%{$request->search}%");
            });
        }

        // Filter by status
        if ($request->status) {
            $query->where('status', $request->status);
        }

        // Filter stok habis
        if ($request->stok_habis) {
            $query->where('stok', '<=', 0);
        }

        $apds = $query->latest()->paginate($request->per_page ?? 15);

        return $this->paginated($apds, 'Data APD berhasil diambil');
    }

    /**
     * Store APD baru
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'kode' => 'required|string|max:50|unique:apds,kode',
            'stok' => 'required|integer|min:0',
            'satuan' => 'required|string|max:50',
            'tanggal_kadaluarsa' => 'nullable|date',
            'status' => 'sometimes|string|in:aktif,nonaktif,kadaluarsa',
        ]);

        $data = $validated;
        $data['status'] = $validated['status'] ?? 'aktif';

        // Auto check kadaluarsa
        if (!empty($data['tanggal_kadaluarsa']) && strtotime($data['tanggal_kadaluarsa']) < now()) {
            $data['status'] = 'kadaluarsa';
        }

        $apd = Apd::create($data);

        return $this->success($apd, 'APD berhasil dibuat', 201);
    }

    /**
     * Show detail APD
     */
    public function show($id)
    {
        $apd = Apd::find($id);

        if (!$apd) {
            return $this->error('APD tidak ditemukan', 404);
        }

        return $this->success($apd, 'Detail APD berhasil diambil');
    }

    /**
     * Update APD
     */
    public function update(Request $request, $id)
    {
        $apd = Apd::find($id);

        if (!$apd) {
            return $this->error('APD tidak ditemukan', 404);
        }

        $validated = $request->validate([
            'nama' => 'sometimes|string|max:255',
            'kode' => 'sometimes|string|max:50|unique:apds,kode,' . $id,
            'stok' => 'sometimes|integer|min:0',
            'satuan' => 'sometimes|string|max:50',
            'tanggal_kadaluarsa' => 'nullable|date',
            'status' => 'sometimes|string|in:aktif,nonaktif,kadaluarsa',
        ]);

        $apd->update($validated);

        return $this->success($apd, 'APD berhasil diupdate');
    }

    /**
     * List APD kadaluarsa
     */
    public function kadaluarsa(Request $request)
    {
        $apds = Apd::where(function ($q) {
                $q->where('status', 'kadaluarsa')
                  ->orWhere(function ($q2) {
                      $q2->whereNotNull('tanggal_kadaluarsa')
                         ->where('tanggal_kadaluarsa', '<', now());
                  });
            })
            ->latest()
            ->get();

        return $this->success($apds, 'Data APD kadaluarsa berhasil diambil');
    }

    /**
     * Delete APD
     */
    public function destroy($id)
    {
        $apd = Apd::find($id);

        if (!$apd) {
            return $this->error('APD tidak ditemukan', 404);
        }

        $apd->delete();

        return $this->success(null, 'APD berhasil dihapus');
    }

    public function import(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:xlsx,xls,csv|max:5120',
        ]);

        $file = $request->file('file');
        
        try {
            $spreadsheet = IOFactory::load($file->getRealPath());
            $worksheet = $spreadsheet->getActiveSheet();
            $rows = $worksheet->toArray();
            
            if (count($rows) <= 1) {
                return $this->error('File Excel kosong atau tidak memiliki data.', 400);
            }
            
            // Clean up and lowercase headers
            $headers = array_map(function($h) {
                return strtolower(trim(str_replace([' ', '_', '-'], '', $h)));
            }, $rows[0]);
            
            DB::beginTransaction();
            $importedCount = 0;
            $errors = [];

            for ($i = 1; $i < count($rows); $i++) {
                $row = $rows[$i];
                
                if (empty(array_filter($row, function($val) { return !is_null($val) && $val !== ''; }))) {
                    continue; // Skip empty rows
                }
                
                $data = [];
                foreach ($headers as $index => $header) {
                    if ($header !== '') {
                        $data[$header] = $row[$index] ?? null;
                    }
                }
                
                // Synonym resolution
                $kode = $data['kode'] ?? $data['kodeapd'] ?? $data['code'] ?? null;
                $nama = $data['nama'] ?? $data['namaapd'] ?? $data['name'] ?? null;
                $stok = $data['stok'] ?? $data['stock'] ?? $data['jumlah'] ?? 0;
                $satuan = $data['satuan'] ?? $data['unit'] ?? 'Pcs';
                $tanggal_kadaluarsa = $data['tanggalkadaluarsa'] ?? $data['tanggal_kadaluarsa'] ?? $data['kadaluarsa'] ?? $data['expiry'] ?? null;
                $status = $data['status'] ?? 'aktif';
                
                if (!$kode || !$nama) {
                    $errors[] = "Baris " . ($i + 1) . ": Kode dan Nama APD wajib diisi.";
                    continue;
                }
                
                // Format date
                if ($tanggal_kadaluarsa) {
                    try {
                        if (is_numeric($tanggal_kadaluarsa)) {
                            $tanggal_kadaluarsa = \PhpOffice\PhpSpreadsheet\Shared\Date::excelToDateTimeObject($tanggal_kadaluarsa)->format('Y-m-d');
                        } else {
                            $tanggal_kadaluarsa = date('Y-m-d', strtotime($tanggal_kadaluarsa));
                        }
                    } catch (\Exception $e) {
                        $tanggal_kadaluarsa = null;
                    }
                }
                
                // Format status & check expiration
                $status = strtolower(trim($status));
                if (!in_array($status, ['aktif', 'nonaktif', 'kadaluarsa'])) {
                    $status = 'aktif';
                }
                if ($tanggal_kadaluarsa && strtotime($tanggal_kadaluarsa) < now()->timestamp) {
                    $status = 'kadaluarsa';
                }
                
                $existing = Apd::where('kode', $kode)->first();
                if ($existing) {
                    $existing->update([
                        'nama' => $nama,
                        'stok' => (int)$stok,
                        'satuan' => $satuan,
                        'tanggal_kadaluarsa' => $tanggal_kadaluarsa,
                        'status' => $status,
                    ]);
                } else {
                    Apd::create([
                        'kode' => $kode,
                        'nama' => $nama,
                        'stok' => (int)$stok,
                        'satuan' => $satuan,
                        'tanggal_kadaluarsa' => $tanggal_kadaluarsa,
                        'status' => $status,
                    ]);
                }
                $importedCount++;
            }

            DB::commit();
            
            return response()->json([
                'success' => true,
                'message' => "Berhasil mengimpor {$importedCount} APD.",
                'errors' => $errors,
            ]);
            
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->error('Gagal memproses file Excel: ' . $e->getMessage(), 500);
        }
    }
}
