<?php

namespace App\Http\Controllers;

use App\Models\HseKpiPerformance;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;

class HseKpiController extends Controller
{
    private $indicators = [
        'lagging' => [
            'fatality' => ['label' => 'Fatality (F)', 'target' => 0],
            'lti' => ['label' => 'Lost Time Incident (LTI)', 'target' => 0],
            'rwdc' => ['label' => 'Restricted Workday Case (RWDC)', 'target' => 0],
            'mtc' => ['label' => 'Medical Treatment Case (MTC)', 'target' => 0],
            'fac' => ['label' => 'First Aid Case (FAC)', 'target' => 0],
            'near_miss' => ['label' => 'Near Miss', 'target' => 3],
            'environmental_incident' => ['label' => 'Environmental Incident', 'target' => 0],
            'property_damage' => ['label' => 'Property Damage', 'target' => 0],
            'customer_formal_complaint' => ['label' => 'Customer Formal Complaint (HSE)', 'target' => 5],
        ],
        'leading' => [
            'hse_management_visit' => ['label' => 'HSE Management Visit', 'target_desc' => 'MoM (1 / Project)'],
            'hse_joint_safety_patrol' => ['label' => 'HSE Joint Safety Patrol', 'target_desc' => 'Inspection Program (1 / Minggu)'],
            'behavior_based_safe' => ['label' => 'Behavior Based Safe / Daily Patrol', 'target_desc' => 'Inspection Program (1 / Hari)'],
            'emergency_drill' => ['label' => 'Emergency Drill', 'target_desc' => 'Report (1 / Project)'],
            'equipment_inspection' => ['label' => 'Equipment Inspection', 'target_desc' => 'Report (Continues)'],
            'hse_toolbox_meeting' => ['label' => 'HSE Toolbox Meeting', 'target_desc' => 'Attendance List (1 / Hari)'],
            'hse_meeting' => ['label' => 'HSE Meeting', 'target_desc' => 'MoM (1 / Bulan)'],
            'general_safety_talk' => ['label' => 'General Safety Talk', 'target_desc' => 'Report (1 / Bulan)'],
            'safety_stand_down_meeting' => ['label' => 'Safety Stand Down Meeting', 'target_desc' => 'Report (If Any Incident Case)'],
            'installation_of_safety_banner' => ['label' => 'Installation of Safety Banner', 'target_desc' => 'Picture (If Needed)'],
            'reward' => ['label' => 'Reward', 'target_desc' => 'Report (1 / Bulan)'],
            'punishment' => ['label' => 'Punishment', 'target_desc' => 'Report (Per Case)'],
            'campaign_bulan_k3_nasional' => ['label' => 'Campaign Bulan K3 Nasional', 'target_desc' => 'Picture (1 / Year)'],
            'hse_induction' => ['label' => 'HSE Induction', 'target_desc' => 'Report (Seluruh Pekerja)'],
            'hse_training' => ['label' => 'HSE Training', 'target_desc' => 'Training Program (Pre TA)'],
            'audit_program_internal' => ['label' => 'Audit Program Internal', 'target_desc' => 'Audit Report'],
            'audit_program_eksternal' => ['label' => 'Audit Program Eksternal', 'target_desc' => 'Audit Report (1 / Tahun)'],
        ],
    ];

    private function getAllIndicatorKeys()
    {
        return array_merge(
            array_keys($this->indicators['lagging']),
            array_keys($this->indicators['leading'])
        );
    }

    public function index(Request $request)
    {
        $year = $request->year ?? Carbon::now()->year;

        $records = HseKpiPerformance::whereYear('period_start', $year)
            ->orderBy('period_start')
            ->get();

        $monthlyData = [];
        $months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        foreach ($months as $i => $monthName) {
            $monthNum = $i + 1;
            $monthRecords = $records->filter(function ($r) use ($monthNum) {
                return Carbon::parse($r->period_start)->month === $monthNum;
            });

            $data = ['month' => $monthName, 'month_num' => $monthNum];
            foreach ($this->getAllIndicatorKeys() as $key) {
                $data[$key] = $monthRecords->sum($key);
            }
            $monthlyData[] = $data;
        }

        // Year cumulative
        $yearCumulative = ['month' => 'YTD', 'month_num' => 0];
        foreach ($this->getAllIndicatorKeys() as $key) {
            $yearCumulative[$key] = $records->sum($key);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'indicators' => $this->indicators,
                'months' => $monthlyData,
                'year_cumulative' => $yearCumulative,
                'year' => $year,
                'total_entries' => $records->count(),
            ],
        ]);
    }

    public function entries(Request $request)
    {
        $year = $request->year ?? Carbon::now()->year;

        $entries = HseKpiPerformance::whereYear('period_start', $year)
            ->orderBy('period_start', 'desc')
            ->with('user:id,name')
            ->paginate($request->per_page ?? 20);

        return response()->json([
            'success' => true,
            'data' => $entries,
        ]);
    }

    public function store(Request $request)
    {
        $rules = [
            'period_start' => 'required|date',
            'period_end' => 'required|date|after_or_equal:period_start',
            'week_name' => 'required|string|max:50',
        ];

        foreach ($this->getAllIndicatorKeys() as $key) {
            $rules[$key] = 'nullable|integer|min:0';
        }

        $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validasi gagal',
                'errors' => $validator->errors(),
            ], 422);
        }

        $data = $request->only(array_merge(
            ['period_start', 'period_end', 'week_name'],
            $this->getAllIndicatorKeys()
        ));

        foreach ($this->getAllIndicatorKeys() as $key) {
            $data[$key] = (int) ($data[$key] ?? 0);
        }

        $data['user_id'] = $request->user()->id;

        $record = HseKpiPerformance::create($data);

        return response()->json([
            'success' => true,
            'message' => 'Data KPI berhasil disimpan',
            'data' => $record,
        ], 201);
    }

    public function show($id)
    {
        $record = HseKpiPerformance::findOrFail($id);
        return response()->json([
            'success' => true,
            'data' => $record,
        ]);
    }

    public function update(Request $request, $id)
    {
        $record = HseKpiPerformance::findOrFail($id);

        $rules = [
            'period_start' => 'required|date',
            'period_end' => 'required|date|after_or_equal:period_start',
            'week_name' => 'required|string|max:50',
        ];

        foreach ($this->getAllIndicatorKeys() as $key) {
            $rules[$key] = 'nullable|integer|min:0';
        }

        $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validasi gagal',
                'errors' => $validator->errors(),
            ], 422);
        }

        $data = $request->only(array_merge(
            ['period_start', 'period_end', 'week_name'],
            $this->getAllIndicatorKeys()
        ));

        foreach ($this->getAllIndicatorKeys() as $key) {
            $data[$key] = (int) ($data[$key] ?? 0);
        }

        $record->update($data);

        return response()->json([
            'success' => true,
            'message' => 'Data KPI berhasil diperbarui',
            'data' => $record,
        ]);
    }

    public function destroy($id)
    {
        $record = HseKpiPerformance::findOrFail($id);
        $record->delete();

        return response()->json([
            'success' => true,
            'message' => 'Data KPI berhasil dihapus',
        ]);
    }
}
