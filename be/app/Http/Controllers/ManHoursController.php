<?php

namespace App\Http\Controllers;

use App\Models\MonthlyManHour;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class ManHoursController extends Controller
{
    use ApiResponse;

    /**
     * Get all monthly man hours records
     */
    public function index(Request $request)
    {
        $year = $request->query('tahun', date('Y'));
        
        $records = MonthlyManHour::with('creator:id,name')
            ->where('tahun', $year)
            ->orderByRaw("
                CASE bulan
                    WHEN 'Januari' THEN 1
                    WHEN 'Februari' THEN 2
                    WHEN 'Maret' THEN 3
                    WHEN 'April' THEN 4
                    WHEN 'Mei' THEN 5
                    WHEN 'Juni' THEN 6
                    WHEN 'Juli' THEN 7
                    WHEN 'Agustus' THEN 8
                    WHEN 'September' THEN 9
                    WHEN 'Oktober' THEN 10
                    WHEN 'November' THEN 11
                    WHEN 'Desember' THEN 12
                    ELSE 13
                END
            ")
            ->get();
            
        // Calculate totals for the year
        $totals = [
            'manpower_inl' => $records->sum('manpower_inl'),
            'manpower_kontraktor' => $records->sum('manpower_kontraktor'),
            'manpower_outsourcing' => $records->sum('manpower_outsourcing'),
            'normal_jam_inl' => $records->sum('normal_jam_inl'),
            'normal_jam_kontraktor' => $records->sum('normal_jam_kontraktor'),
            'normal_jam_outsourcing' => $records->sum('normal_jam_outsourcing'),
            'overtime_inl' => $records->sum('overtime_inl'),
            'overtime_kontraktor' => $records->sum('overtime_kontraktor'),
            'overtime_outsourcing' => $records->sum('overtime_outsourcing'),
            'cuti_sakit' => $records->sum('cuti_sakit'),
        ];
        
        // Avg manpower for the year
        $count = $records->count() > 0 ? $records->count() : 1;
        $avg_manpower_inl = round($totals['manpower_inl'] / $count);
        $avg_manpower_kontraktor = round($totals['manpower_kontraktor'] / $count);
        $avg_manpower_outsourcing = round($totals['manpower_outsourcing'] / $count);

        return $this->success([
            'records' => $records,
            'totals' => $totals,
            'averages' => [
                'manpower_inl' => $avg_manpower_inl,
                'manpower_kontraktor' => $avg_manpower_kontraktor,
                'manpower_outsourcing' => $avg_manpower_outsourcing,
            ]
        ], 'Data bulanan man hours berhasil diambil');
    }

    /**
     * Store a newly created monthly record in storage.
     */
    public function store(Request $request)
    {
        $user = $request->user();
        if (!in_array($user->role, ['admin', 'kasubag'])) {
            return $this->error('Hanya Admin dan Kasubag yang dapat menambah rekap bulanan', 403);
        }

        $validator = Validator::make($request->all(), [
            'tahun' => 'required|string|max:20',
            'bulan' => [
                'required',
                'string',
                Rule::unique('monthly_man_hours')->where(function ($query) use ($request) {
                    return $query->where('tahun', $request->tahun)
                                 ->where('bulan', $request->bulan);
                }),
            ],
            'manpower_inl' => 'nullable|integer|min:0',
            'manpower_kontraktor' => 'nullable|integer|min:0',
            'manpower_outsourcing' => 'nullable|integer|min:0',
            'normal_jam_inl' => 'nullable|numeric|min:0',
            'normal_jam_kontraktor' => 'nullable|numeric|min:0',
            'normal_jam_outsourcing' => 'nullable|numeric|min:0',
            'overtime_inl' => 'nullable|numeric|min:0',
            'overtime_kontraktor' => 'nullable|numeric|min:0',
            'overtime_outsourcing' => 'nullable|numeric|min:0',
            'cuti_sakit' => 'nullable|numeric|min:0',
        ], [
            'bulan.unique' => 'Data untuk bulan ' . $request->bulan . ' tahun ' . $request->tahun . ' sudah ada.',
        ]);

        if ($validator->fails()) {
            return $this->error($validator->errors()->first(), 422);
        }

        $data = $request->only([
            'tahun', 'bulan', 
            'manpower_inl', 'manpower_kontraktor', 'manpower_outsourcing',
            'normal_jam_inl', 'normal_jam_kontraktor', 'normal_jam_outsourcing',
            'overtime_inl', 'overtime_kontraktor', 'overtime_outsourcing',
            'cuti_sakit'
        ]);
        
        $data['created_by'] = $user->id;

        // Convert nulls to 0
        foreach ($data as $key => $value) {
            if ($value === null && $key !== 'created_by') {
                $data[$key] = 0;
            }
        }

        $record = MonthlyManHour::create($data);

        return $this->success($record, 'Rekap bulanan berhasil disimpan', 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $record = MonthlyManHour::with('creator:id,name')->find($id);

        if (!$record) {
            return $this->error('Data tidak ditemukan', 404);
        }

        return $this->success($record, 'Detail data berhasil diambil');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $user = $request->user();
        if (!in_array($user->role, ['admin', 'kasubag'])) {
            return $this->error('Hanya Admin dan Kasubag yang dapat mengubah rekap bulanan', 403);
        }

        $record = MonthlyManHour::find($id);

        if (!$record) {
            return $this->error('Data tidak ditemukan', 404);
        }

        $validator = Validator::make($request->all(), [
            'tahun' => 'sometimes|required|string|max:20',
            'bulan' => [
                'sometimes',
                'required',
                'string',
                Rule::unique('monthly_man_hours')->where(function ($query) use ($request, $record) {
                    return $query->where('tahun', $request->tahun ?? $record->tahun)
                                 ->where('bulan', $request->bulan ?? $record->bulan);
                })->ignore($record->id),
            ],
            'manpower_inl' => 'nullable|integer|min:0',
            'manpower_kontraktor' => 'nullable|integer|min:0',
            'manpower_outsourcing' => 'nullable|integer|min:0',
            'normal_jam_inl' => 'nullable|numeric|min:0',
            'normal_jam_kontraktor' => 'nullable|numeric|min:0',
            'normal_jam_outsourcing' => 'nullable|numeric|min:0',
            'overtime_inl' => 'nullable|numeric|min:0',
            'overtime_kontraktor' => 'nullable|numeric|min:0',
            'overtime_outsourcing' => 'nullable|numeric|min:0',
            'cuti_sakit' => 'nullable|numeric|min:0',
        ], [
            'bulan.unique' => 'Data untuk bulan tersebut sudah ada di tahun yang sama.',
        ]);

        if ($validator->fails()) {
            return $this->error($validator->errors()->first(), 422);
        }

        $data = $request->only([
            'tahun', 'bulan', 
            'manpower_inl', 'manpower_kontraktor', 'manpower_outsourcing',
            'normal_jam_inl', 'normal_jam_kontraktor', 'normal_jam_outsourcing',
            'overtime_inl', 'overtime_kontraktor', 'overtime_outsourcing',
            'cuti_sakit'
        ]);

        // Convert nulls to 0
        foreach ($data as $key => $value) {
            if ($value === null) {
                $data[$key] = 0;
            }
        }

        $record->update($data);

        return $this->success($record, 'Rekap bulanan berhasil diperbarui');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, $id)
    {
        $user = $request->user();
        if (!in_array($user->role, ['admin', 'kasubag'])) {
            return $this->error('Hanya Admin dan Kasubag yang dapat menghapus rekap bulanan', 403);
        }

        $record = MonthlyManHour::find($id);

        if (!$record) {
            return $this->error('Data tidak ditemukan', 404);
        }

        $record->delete();

        return $this->success(null, 'Data berhasil dihapus');
    }
}
