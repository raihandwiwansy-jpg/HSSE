<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use PhpOffice\PhpSpreadsheet\IOFactory;

class UserManagementController extends Controller
{
    public function index(Request $request)
    {
        $query = User::query();

        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', "%{$request->search}%")
                  ->orWhere('email', 'like', "%{$request->search}%")
                  ->orWhere('username', 'like', "%{$request->search}%")
                  ->orWhere('departemen', 'like', "%{$request->search}%");
            });
        }

        if ($request->role) {
            $query->where('role', $request->role);
        }

        $users = $query->latest()->paginate($request->per_page ?? 10);

        return response()->json([
            'success' => true,
            'data' => $users,
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'username' => 'required|string|max:50|unique:users,username',
            'email' => 'required|string|email|max:255|unique:users,email',
            'password' => 'required|string|min:6',
            'name' => 'required|string|max:255',
            'tempat_lahir' => 'nullable|string|max:255',
            'tanggal_lahir' => 'nullable|date',
            'role' => 'required|in:user,supervisor,admin',
            'no_hp' => 'nullable|string|max:20',
            'departemen' => 'nullable|string|max:100',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validasi gagal',
                'errors' => $validator->errors(),
            ], 422);
        }

        $user = User::create([
            'username' => $request->username,
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'tempat_lahir' => $request->tempat_lahir,
            'tanggal_lahir' => $request->tanggal_lahir,
            'role' => $request->role,
            'no_hp' => $request->no_hp,
            'departemen' => $request->departemen,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'User berhasil ditambahkan',
            'data' => $user,
        ], 201);
    }

    public function show($id)
    {
        $user = User::findOrFail($id);
        return response()->json([
            'success' => true,
            'data' => $user,
        ]);
    }

    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'username' => 'required|string|max:50|unique:users,username,' . $id,
            'email' => 'required|string|email|max:255|unique:users,email,' . $id,
            'password' => 'nullable|string|min:6',
            'name' => 'required|string|max:255',
            'tempat_lahir' => 'nullable|string|max:255',
            'tanggal_lahir' => 'nullable|date',
            'role' => 'required|in:user,supervisor,admin',
            'no_hp' => 'nullable|string|max:20',
            'departemen' => 'nullable|string|max:100',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validasi gagal',
                'errors' => $validator->errors(),
            ], 422);
        }

        $data = $request->except('password');
        if ($request->filled('password')) {
            $data['password'] = Hash::make($request->password);
        }

        $user->update($data);

        return response()->json([
            'success' => true,
            'message' => 'User berhasil diperbarui',
            'data' => $user,
        ]);
    }

    public function destroy($id)
    {
        $user = User::findOrFail($id);

        if ($user->id === request()->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Tidak dapat menghapus akun sendiri',
            ], 400);
        }

        $user->tokens()->delete();
        $user->delete();

        return response()->json([
            'success' => true,
            'message' => 'User berhasil dihapus',
        ]);
    }

    public function roles()
    {
        return response()->json([
            'success' => true,
            'data' => [
                ['value' => 'user', 'label' => 'User'],
                ['value' => 'supervisor', 'label' => 'Supervisor'],
                ['value' => 'admin', 'label' => 'Admin'],
            ],
        ]);
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
                return response()->json([
                    'success' => false,
                    'message' => 'File Excel kosong atau tidak memiliki data.',
                ], 400);
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
                $username = $data['username'] ?? $data['namapengguna'] ?? null;
                $name = $data['name'] ?? $data['nama'] ?? $data['namalengkap'] ?? null;
                $email = $data['email'] ?? null;
                $password = $data['password'] ?? $data['sandi'] ?? null;
                $role = $data['role'] ?? $data['peran'] ?? 'user';
                $tempat_lahir = $data['tempatlahir'] ?? $data['tempat_lahir'] ?? null;
                $tanggal_lahir = $data['tanggallahir'] ?? $data['tanggal_lahir'] ?? null;
                $no_hp = $data['nohp'] ?? $data['no_hp'] ?? $data['telepon'] ?? $data['phone'] ?? null;
                $departemen = $data['departemen'] ?? $data['department'] ?? $data['divisi'] ?? null;
                
                if (!$username || !$name || !$email) {
                    $errors[] = "Baris " . ($i + 1) . ": Username, Nama, dan Email wajib diisi.";
                    continue;
                }
                
                // Format role
                $role = strtolower(trim($role));
                if (!in_array($role, ['user', 'supervisor', 'admin'])) {
                    $role = 'user';
                }
                
                // Format date
                if ($tanggal_lahir) {
                    try {
                        if (is_numeric($tanggal_lahir)) {
                            $tanggal_lahir = \PhpOffice\PhpSpreadsheet\Shared\Date::excelToDateTimeObject($tanggal_lahir)->format('Y-m-d');
                        } else {
                            $tanggal_lahir = date('Y-m-d', strtotime($tanggal_lahir));
                        }
                    } catch (\Exception $e) {
                        $tanggal_lahir = null;
                    }
                }
                
                $existingUser = User::where('username', $username)
                                    ->orWhere('email', $email)
                                    ->first();
                                    
                if ($existingUser) {
                    $updateData = [
                        'name' => $name,
                        'role' => $role,
                        'tempat_lahir' => $tempat_lahir,
                        'tanggal_lahir' => $tanggal_lahir,
                        'no_hp' => $no_hp,
                        'departemen' => $departemen,
                    ];
                    if ($password) {
                        $updateData['password'] = Hash::make($password);
                    }
                    $existingUser->update($updateData);
                } else {
                    User::create([
                        'username' => $username,
                        'name' => $name,
                        'email' => $email,
                        'password' => Hash::make($password ?: 'password123'),
                        'role' => $role,
                        'tempat_lahir' => $tempat_lahir,
                        'tanggal_lahir' => $tanggal_lahir,
                        'no_hp' => $no_hp,
                        'departemen' => $departemen,
                    ]);
                }
                $importedCount++;
            }

            DB::commit();
            
            return response()->json([
                'success' => true,
                'message' => "Berhasil mengimpor {$importedCount} user.",
                'errors' => $errors,
            ]);
            
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Gagal memproses file Excel: ' . $e->getMessage(),
            ], 500);
        }
    }
}
