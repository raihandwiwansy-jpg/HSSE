<?php

namespace App\Http\Controllers;

use App\Models\Karyawan;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use PhpOffice\PhpSpreadsheet\IOFactory;

class KaryawanController extends Controller
{
    use ApiResponse;

    /**
     * List semua karyawan (dengan filter & search)
     */
    public function index(Request $request)
    {
        $query = Karyawan::query();

        // Search
        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('nama', 'like', "%{$request->search}%")
                  ->orWhere('nik', 'like', "%{$request->search}%")
                  ->orWhere('jabatan', 'like', "%{$request->search}%")
                  ->orWhere('departemen', 'like', "%{$request->search}%");
            });
        }

        // Filter by departemen
        if ($request->departemen) {
            $query->where('departemen', $request->departemen);
        }

        // Filter by jabatan
        if ($request->jabatan) {
            $query->where('jabatan', $request->jabatan);
        }

        $karyawans = $query->latest()->paginate($request->per_page ?? 15);

        return $this->paginated($karyawans, 'Data karyawan berhasil diambil');
    }

    /**
     * Store karyawan baru
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'nik' => 'required|string|max:50|unique:karyawans,nik',
            'jabatan' => 'required|string|max:100',
            'departemen' => 'required|string|max:100',
            'no_hp' => 'nullable|string|max:20',
        ]);

        $karyawan = Karyawan::create($validated);

        return $this->success($karyawan, 'Karyawan berhasil dibuat', 201);
    }

    /**
     * Show detail karyawan
     */
    public function show($id)
    {
        $karyawan = Karyawan::find($id);

        if (!$karyawan) {
            return $this->error('Karyawan tidak ditemukan', 404);
        }

        return $this->success($karyawan, 'Detail karyawan berhasil diambil');
    }

    /**
     * Update karyawan
     */
    public function update(Request $request, $id)
    {
        $karyawan = Karyawan::find($id);

        if (!$karyawan) {
            return $this->error('Karyawan tidak ditemukan', 404);
        }

        $validated = $request->validate([
            'nama' => 'sometimes|string|max:255',
            'nik' => 'sometimes|string|max:50|unique:karyawans,nik,' . $id,
            'jabatan' => 'sometimes|string|max:100',
            'departemen' => 'sometimes|string|max:100',
            'no_hp' => 'nullable|string|max:20',
        ]);

        $karyawan->update($validated);

        return $this->success($karyawan, 'Karyawan berhasil diupdate');
    }

    /**
     * Delete karyawan
     */
    public function destroy($id)
    {
        $karyawan = Karyawan::find($id);

        if (!$karyawan) {
            return $this->error('Karyawan tidak ditemukan', 404);
        }

        $karyawan->delete();

        return $this->success(null, 'Karyawan berhasil dihapus');
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
                $nik = $data['nik'] ?? $data['nomorinduk'] ?? null;
                $nama = $data['nama'] ?? $data['name'] ?? $data['namalengkap'] ?? null;
                $jabatan = $data['jabatan'] ?? $data['position'] ?? $data['role'] ?? null;
                $departemen = $data['departemen'] ?? $data['department'] ?? $data['divisi'] ?? null;
                $no_hp = $data['nohp'] ?? $data['no_hp'] ?? $data['telepon'] ?? null;
                
                if (!$nik || !$nama || !$jabatan || !$departemen) {
                    $errors[] = "Baris " . ($i + 1) . ": NIK, Nama, Jabatan, dan Departemen wajib diisi.";
                    continue;
                }
                
                $existing = Karyawan::where('nik', $nik)->first();
                if ($existing) {
                    $existing->update([
                        'nama' => $nama,
                        'jabatan' => $jabatan,
                        'departemen' => $departemen,
                        'no_hp' => $no_hp,
                    ]);
                } else {
                    Karyawan::create([
                        'nik' => $nik,
                        'nama' => $nama,
                        'jabatan' => $jabatan,
                        'departemen' => $departemen,
                        'no_hp' => $no_hp,
                    ]);
                }
                $importedCount++;
            }

            DB::commit();
            
            return response()->json([
                'success' => true,
                'message' => "Berhasil mengimpor {$importedCount} karyawan.",
                'errors' => $errors,
            ]);
            
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->error('Gagal memproses file Excel: ' . $e->getMessage(), 500);
        }
    }
}
