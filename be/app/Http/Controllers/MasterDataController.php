<?php

namespace App\Http\Controllers;

use App\Models\MasterDepartemen;
use App\Models\MasterPerusahaan;
use App\Models\MasterPersonil;
use App\Models\MasterPeralatan;
use App\Models\MasterBahaya;
use App\Models\MasterRisiko;
use App\Models\MasterChecklist;
use App\Models\MasterShift;
use App\Models\MasterKategoriPatrol;
use App\Models\MasterKategoriPerilaku;
use App\Models\MasterPermitField;
use App\Models\Location;
use App\Models\Apd;
use App\Models\Jabatan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class MasterDataController extends Controller
{
    private function getModel($type)
    {
        $models = [
            'departemen' => MasterDepartemen::class,
            'perusahaan' => MasterPerusahaan::class,
            'personil' => MasterPersonil::class,
            'peralatan' => MasterPeralatan::class,
            'bahaya' => MasterBahaya::class,
            'risiko' => MasterRisiko::class,
            'checklist' => MasterChecklist::class,
            'shift' => MasterShift::class,
            'kategori-patrol' => MasterKategoriPatrol::class,
            'kategori-perilaku' => MasterKategoriPerilaku::class,
            'lokasi' => Location::class,
            'apd' => Apd::class,
            'jabatan' => Jabatan::class,
        ];
        return $models[$type] ?? null;
    }

    private function getValidationRules($type)
    {
        $rules = [
            'departemen' => ['nama' => 'required|string|max:255|unique:master_departemen,nama'],
            'perusahaan' => ['nama' => 'required|string|max:255'],
            'personil' => ['nama' => 'required|string|max:255'],
            'peralatan' => ['nama' => 'required|string|max:255'],
            'bahaya' => ['nama' => 'required|string|max:255'],
            'risiko' => ['nama' => 'required|string|max:255'],
            'checklist' => ['kategori' => 'required|string|max:255', 'item' => 'required|string|max:255'],
            'shift' => ['nama' => 'required|string|max:255'],
            'kategori-patrol' => ['nama' => 'required|string|max:255'],
            'kategori-perilaku' => ['nama' => 'required|string|max:255', 'tipe' => 'required|in:safe,at_risk'],
            'lokasi' => ['name' => 'required|string|max:255|unique:locations,name'],
            'apd' => ['nama' => 'required|string|max:255'],
            'jabatan' => ['nama' => 'required|string|max:255|unique:jabatans,nama'],
        ];
        return $rules[$type] ?? ['nama' => 'required|string|max:255'];
    }

    private function getUpdateRules($type, $id)
    {
        $rules = $this->getValidationRules($type);
        // Remove unique constraint for update
        foreach ($rules as $key => $rule) {
            if (is_string($rule) && str_contains($rule, 'unique:')) {
                $parts = explode('|', $rule);
                $parts = array_filter($parts, fn($p) => !str_starts_with($p, 'unique:'));
                $rules[$key] = implode('|', $parts);
            }
        }
        return $rules;
    }

    // ===================== CRUD =====================

    public function index($type)
    {
        $model = $this->getModel($type);
        if (!$model) return response()->json(['success' => false, 'message' => 'Tipe master data tidak ditemukan'], 404);

        $query = $model::query();
        if (in_array($type, ['lokasi', 'apd'])) {
            // Use existing field name
        } elseif ($type === 'personil') {
            $query->with(['departemen', 'perusahaan']);
        }

        $data = $query->orderBy('id', 'desc')->get();
        return response()->json(['success' => true, 'data' => $data]);
    }

    public function store(Request $request, $type)
    {
        $model = $this->getModel($type);
        if (!$model) return response()->json(['success' => false, 'message' => 'Tipe master data tidak ditemukan'], 404);

        $rules = $this->getValidationRules($type);
        $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'message' => 'Validasi gagal', 'errors' => $validator->errors()], 422);
        }

        $data = $model::create($request->all());
        return response()->json(['success' => true, 'message' => 'Data berhasil ditambahkan', 'data' => $data], 201);
    }

    public function show($type, $id)
    {
        $model = $this->getModel($type);
        if (!$model) return response()->json(['success' => false, 'message' => 'Tipe master data tidak ditemukan'], 404);

        $data = $model::findOrFail($id);
        if ($type === 'personil') {
            $data->load(['departemen', 'perusahaan']);
        }
        return response()->json(['success' => true, 'data' => $data]);
    }

    public function update(Request $request, $type, $id)
    {
        $model = $this->getModel($type);
        if (!$model) return response()->json(['success' => false, 'message' => 'Tipe master data tidak ditemukan'], 404);

        $record = $model::findOrFail($id);
        $rules = $this->getUpdateRules($type, $id);
        $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'message' => 'Validasi gagal', 'errors' => $validator->errors()], 422);
        }

        $record->update($request->all());
        return response()->json(['success' => true, 'message' => 'Data berhasil diupdate', 'data' => $record]);
    }

    public function destroy($type, $id)
    {
        $model = $this->getModel($type);
        if (!$model) return response()->json(['success' => false, 'message' => 'Tipe master data tidak ditemukan'], 404);

        $record = $model::findOrFail($id);
        $record->delete();
        return response()->json(['success' => true, 'message' => 'Data berhasil dihapus']);
    }

    // ===================== MASTER PERMIT FIELDS =====================

    public function indexFields(Request $request)
    {
        $query = MasterPermitField::query()->orderBy('permit_type')->orderBy('urutan');
        if ($request->has('permit_type')) {
            $query->where('permit_type', $request->permit_type);
        }
        $data = $query->get();
        return response()->json(['success' => true, 'data' => $data]);
    }

    public function storeField(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'permit_type' => 'required|string|max:50',
            'field_name' => 'required|string|max:100',
            'field_label' => 'required|string|max:255',
            'field_type' => 'required|in:text,dropdown,checkbox,date,textarea,number,radio',
            'source_master' => 'nullable|string|max:100',
            'is_required' => 'boolean',
            'is_locked' => 'boolean',
            'urutan' => 'integer|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'message' => 'Validasi gagal', 'errors' => $validator->errors()], 422);
        }

        $field = MasterPermitField::create($request->all());
        return response()->json(['success' => true, 'message' => 'Field berhasil ditambahkan', 'data' => $field], 201);
    }

    public function updateField(Request $request, $id)
    {
        $field = MasterPermitField::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'permit_type' => 'string|max:50',
            'field_name' => 'string|max:100',
            'field_label' => 'string|max:255',
            'field_type' => 'in:text,dropdown,checkbox,date,textarea,number,radio',
            'source_master' => 'nullable|string|max:100',
            'is_required' => 'boolean',
            'is_locked' => 'boolean',
            'urutan' => 'integer|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'message' => 'Validasi gagal', 'errors' => $validator->errors()], 422);
        }

        $field->update($request->all());
        return response()->json(['success' => true, 'message' => 'Field berhasil diupdate', 'data' => $field]);
    }

    public function destroyField($id)
    {
        $field = MasterPermitField::findOrFail($id);
        $field->delete();
        return response()->json(['success' => true, 'message' => 'Field berhasil dihapus']);
    }

    // ===================== SEED DEFAULTS =====================

    public function seedDefaults()
    {
        $defaults = [
            'departemen' => [
                ['nama' => 'Produksi'], ['nama' => 'Maintenance'], ['nama' => 'HSE'],
                ['nama' => 'Engineering'], ['nama' => 'Logistik'], ['nama' => 'Quality Control'],
            ],
            'shift' => [
                ['nama' => 'Shift 1', 'jam_mulai' => '07:00', 'jam_selesai' => '15:00'],
                ['nama' => 'Shift 2', 'jam_mulai' => '15:00', 'jam_selesai' => '23:00'],
                ['nama' => 'Shift 3', 'jam_mulai' => '23:00', 'jam_selesai' => '07:00'],
            ],
            'kategori-perilaku' => [
                ['nama' => 'Menggunakan APD Lengkap', 'tipe' => 'safe'],
                ['nama' => 'Mematuhi Prosedur Kerja', 'tipe' => 'safe'],
                ['nama' => 'Tidak Menggunakan APD', 'tipe' => 'at_risk'],
                ['nama' => 'Melanggar Prosedur', 'tipe' => 'at_risk'],
            ],
        ];

        $results = [];
        foreach ($defaults as $type => $items) {
            $model = $this->getModel($type);
            if ($model) {
                $count = 0;
                foreach ($items as $item) {
                    $model::firstOrCreate($item);
                    $count++;
                }
                $results[$type] = "$count data berhasil ditambahkan";
            }
        }

        return response()->json(['success' => true, 'message' => 'Default data seeded', 'data' => $results]);
    }
}
