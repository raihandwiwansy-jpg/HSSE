<?php

namespace App\Http\Controllers;

use App\Models\Insiden;
use App\Models\GwpPermit;
use App\Models\HwpPermit;
use App\Models\CsePermit;
use App\Models\Jsa;
use App\Models\Apd;
use App\Models\Karyawan;
use App\Models\User;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    use ApiResponse;

    /**
     * Dashboard summary — role-based overview cards
     */
    public function summary(Request $request)
    {
        $user = $request->user();
        $role = $user->role;

        // Base queries — user sees only own, admin/supervisor see all
        $isUser = $role === 'user';

        $gwpQ = GwpPermit::query();
        $hwpQ = HwpPermit::query();
        $cseQ = CsePermit::query();
        $insidenQ = Insiden::query();

        if ($isUser) {
            $gwpQ->where('user_id', $user->id);
            $hwpQ->where('user_id', $user->id);
            $cseQ->where('user_id', $user->id);
            $insidenQ->where('user_id', $user->id);
        }

        // GWP
        $gwpTotal        = (clone $gwpQ)->count();
        $gwpDraft        = (clone $gwpQ)->where('status', 'draft')->count();
        $gwpSubmitted    = (clone $gwpQ)->where('status', 'submitted')->count();
        $gwpApproved     = (clone $gwpQ)->where('status', 'approved')->count();
        $gwpRejected     = (clone $gwpQ)->where('status', 'rejected')->count();
        $gwpCompleted    = (clone $gwpQ)->where('status', 'completed')->count();

        // HWP
        $hwpTotal        = (clone $hwpQ)->count();
        $hwpDraft        = (clone $hwpQ)->where('status', 'draft')->count();
        $hwpSubmitted    = (clone $hwpQ)->where('status', 'submitted')->count();
        $hwpApproved     = (clone $hwpQ)->where('status', 'approved')->count();
        $hwpRejected     = (clone $hwpQ)->where('status', 'rejected')->count();
        $hwpCompleted    = (clone $hwpQ)->where('status', 'completed')->count();

        // CSE
        $cseTotal        = (clone $cseQ)->count();
        $cseDraft        = (clone $cseQ)->where('status', 'draft')->count();
        $cseSubmitted    = (clone $cseQ)->where('status', 'submitted')->count();
        $cseApproved     = (clone $cseQ)->where('status', 'approved')->count();
        $cseRejected     = (clone $cseQ)->where('status', 'rejected')->count();
        $cseCompleted    = (clone $cseQ)->where('status', 'completed')->count();

        // Insiden
        $insidenTotal    = (clone $insidenQ)->count();
        $insidenPending  = (clone $insidenQ)->where('status', 'pending')->count();
        $insidenKecelakaan = (clone $insidenQ)->where('jenis', 'kecelakaan')->count();
        $insidenNearMiss = (clone $insidenQ)->where('jenis', 'near_miss')->count();
        $insidenUnsafeCondition = (clone $insidenQ)->where('jenis', 'unsafe_condition')->count();

        // Role-specific "need action" counts
        $needAction = 0;
        if (in_array($role, ['admin', 'kasubag', 'audit'])) {
            // Admin approves/rejects submitted permits
            $needAction = $gwpSubmitted + $hwpSubmitted + $cseSubmitted;
        } elseif ($role === 'supervisor') {
            // Supervisor completes approved permits
            $needAction = $gwpApproved + $hwpApproved + $cseApproved;
        } else {
            // User: pending submission (drafts) + rejected (need resubmit)
            $needAction = $gwpDraft + $hwpDraft + $cseDraft + $gwpRejected + $hwpRejected + $cseRejected;
        }

        $totalManhours = \App\Models\ManHoursLog::sum('jumlah_jam');

        return $this->success([
            'role' => $role,
            'user_name' => $user->name,
            'user_email' => $user->email,

            'gwp' => [
                'total' => $gwpTotal,
                'draft' => $gwpDraft,
                'submitted' => $gwpSubmitted,
                'approved' => $gwpApproved,
                'rejected' => $gwpRejected,
                'completed' => $gwpCompleted,
            ],
            'hwp' => [
                'total' => $hwpTotal,
                'draft' => $hwpDraft,
                'submitted' => $hwpSubmitted,
                'approved' => $hwpApproved,
                'rejected' => $hwpRejected,
                'completed' => $hwpCompleted,
            ],
            'cse' => [
                'total' => $cseTotal,
                'draft' => $cseDraft,
                'submitted' => $cseSubmitted,
                'approved' => $cseApproved,
                'rejected' => $cseRejected,
                'completed' => $cseCompleted,
            ],
            'insiden' => [
                'total' => $insidenTotal,
                'pending' => $insidenPending,
                'kecelakaan' => $insidenKecelakaan,
                'near_miss' => $insidenNearMiss,
                'unsafe_condition' => $insidenUnsafeCondition,
            ],
            'need_action' => $needAction,
            'total_permits' => $gwpTotal + $hwpTotal + $cseTotal,
            'total_manhours' => (int) $totalManhours,
        ], 'Dashboard summary berhasil diambil');
    }

    /**
     * Dashboard stats (legacy)
     */
    public function stats(Request $request)
    {
        $user = $request->user();

        $insidenQuery = Insiden::query();
        $gwpQuery = GwpPermit::query();

        if ($user->role === 'user') {
            $insidenQuery->where('user_id', $user->id);
            $gwpQuery->where('user_id', $user->id);
        }

        return $this->success([
            'total_insiden' => (clone $insidenQuery)->count(),
            'insiden_pending' => (clone $insidenQuery)->where('status', 'pending')->count(),
            'total_gwp_aktif' => (clone $gwpQuery)->whereIn('status', ['approved', 'submitted'])->count(),
            'total_apd' => Apd::count(),
            'total_karyawan' => Karyawan::count(),
        ], 'Stats berhasil diambil');
    }

    /**
     * Chart data insiden per bulan
     */
    public function chart(Request $request)
    {
        $user = $request->user();

        $query = Insiden::select(
            DB::raw(DB::connection()->getDriverName() === 'pgsql' ? "TO_CHAR(tanggal_kejadian, 'YYYY-MM') as bulan" : "DATE_FORMAT(tanggal_kejadian, '%Y-%m') as bulan"),
            DB::raw('count(*) as total')
        )
        ->where('tanggal_kejadian', '>=', now()->subMonths(12));

        // user: only own data
        // admin/supervisor: all data
        if ($user->role === 'user') {
            $query->where('user_id', $user->id);
        }

        $data = $query->groupBy('bulan')
            ->orderBy('bulan')
            ->get();

        $labels = $data->pluck('bulan')->toArray();
        $values = $data->pluck('total')->toArray();

        $colors = array_fill(0, count($labels), '#2E7D32');

        return $this->success([
            'labels' => $labels,
            'datasets' => [
                [
                    'label' => 'Insiden',
                    'data' => $values,
                    'backgroundColor' => $colors,
                ],
            ],
        ], 'Chart berhasil diambil');
    }

    /**
     * HSE Performance Board
     */
    public function performanceBoard(Request $request)
    {
        $bulanIni = now()->format('m');
        $tahunIni = now()->format('Y');
        $bulanLalu = now()->subMonth()->format('m');
        $tahunLalu = now()->subMonth()->format('Y');

        $hariKerjaBulanIni = now()->day;

        $totalManhours = (int) \App\Models\ManHoursLog::sum('jumlah_jam');
        $totalKaryawan = Karyawan::count();

        $lastAccident = Insiden::where('jenis', 'kecelakaan')
            ->latest('tanggal_kejadian')
            ->first();

        $insidenBulanIni = Insiden::whereMonth('tanggal_kejadian', $bulanIni)
            ->whereYear('tanggal_kejadian', $tahunIni)
            ->count();

        $insidenBulanLalu = Insiden::whereMonth('tanggal_kejadian', $bulanLalu)
            ->whereYear('tanggal_kejadian', $tahunLalu)
            ->count();

        $totalInsidenBulanIni = $insidenBulanIni;
        $totalInsidenBulanLalu = $insidenBulanLalu;

        $bulanIniDigits = array_map('intval', str_split(str_pad($totalInsidenBulanIni, 4, '0', STR_PAD_LEFT)));
        $bulanLaluDigits = array_map('intval', str_split(str_pad($totalInsidenBulanLalu, 4, '0', STR_PAD_LEFT)));

        $todayDigits = array_map('intval', str_split(now()->format('dmY')));

        $tahunIniStr = now()->format('Y');
        $trendData = [];
        $months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agustus', 'Sep', 'Okt', 'November', 'Des'];

        for ($i = 1; $i <= 12; $i++) {
            $inspeksi = \App\Models\SafetyPatrol::whereYear('tanggal', $tahunIniStr)
                ->whereMonth('tanggal', $i)->count();
            
            $temuan = \App\Models\Insiden::whereYear('tanggal_kejadian', $tahunIniStr)
                ->whereMonth('tanggal_kejadian', $i)->count();

            $trendData[] = [
                'month' => $months[$i - 1],
                'Inspection' => $inspeksi,
                'Finding' => $temuan,
            ];
        }


        $safeDays = max(0, ($hariKerjaBulanIni * 30) - $insidenBulanIni);

        $monthAbbr = now()->format('M');

        return $this->success([
            'bulan' => $monthAbbr,
            'tahun' => $tahunIni,
            'total_hari_kerja' => $hariKerjaBulanIni,
            'total_manhours' => $totalManhours,
            'total_safe_days' => $safeDays,
            'total_karyawan' => $totalKaryawan,
            'last_accident_date' => $lastAccident?->tanggal_kejadian,
            'bulan_ini' => $bulanIniDigits,
            'bulan_lalu' => $bulanLaluDigits,
            'tanggal' => $todayDigits,
        ], 'Performance board berhasil diambil');
    }

    /**
     * Helper to compute comprehensive metrics for a given period
     * Periods supported: 'this_month', 'last_month', 'last_year', 'all_time'
     */
    private function getDashboardMetricsForPeriod($periodType)
    {
        $monthMap = [
            1 => 'Januari', 2 => 'Februari', 3 => 'Maret', 4 => 'April',
            5 => 'Mei', 6 => 'Juni', 7 => 'Juli', 8 => 'Agustus',
            9 => 'September', 10 => 'Oktober', 11 => 'November', 12 => 'Desember'
        ];

        $targetYear = null;
        $targetMonth = null;
        $label = 'Semua Periode (Kumulatif)';

        if ($periodType === 'this_month') {
            $targetYear = (int) now()->year;
            $targetMonth = (int) now()->month;
            $label = 'Bulan Ini (' . $monthMap[$targetMonth] . ' ' . $targetYear . ')';
        } elseif ($periodType === 'last_month') {
            $lastMonthDate = now()->subMonth();
            $targetYear = (int) $lastMonthDate->year;
            $targetMonth = (int) $lastMonthDate->month;
            $label = 'Bulan Kemarin (' . $monthMap[$targetMonth] . ' ' . $targetYear . ')';
        } elseif ($periodType === 'last_year') {
            $targetYear = (int) now()->subYear()->year;
            $targetMonth = null;
            $label = 'Tahun Kemarin (' . $targetYear . ')';
        } else {
            $periodType = 'all_time';
        }

        // ========== PERMITS ==========
        $permitsQuery = \App\Models\Permit::query();
        if ($targetYear && $targetMonth) {
            $permitsQuery->whereMonth('created_at', $targetMonth)->whereYear('created_at', $targetYear);
        } elseif ($targetYear) {
            $permitsQuery->whereYear('created_at', $targetYear);
        }
        $permitsTotal = (clone $permitsQuery)->count();
        $permitsByStatus = (clone $permitsQuery)->select('status', DB::raw('count(*) as total'))->groupBy('status')->pluck('total', 'status');
        $permitsCompleted = (int) ($permitsByStatus['completed'] ?? 0);

        // ========== INSIDEN ==========
        $insidenQuery = Insiden::query();
        if ($targetYear && $targetMonth) {
            $insidenQuery->whereMonth('tanggal_kejadian', $targetMonth)->whereYear('tanggal_kejadian', $targetYear);
        } elseif ($targetYear) {
            $insidenQuery->whereYear('tanggal_kejadian', $targetYear);
        }
        $insidenTotal = (clone $insidenQuery)->count();
        $insidenByJenis = (clone $insidenQuery)->select('jenis', DB::raw('count(*) as total'))->groupBy('jenis')->pluck('total', 'jenis');
        $insidenByStatus = (clone $insidenQuery)->select('status', DB::raw('count(*) as total'))->groupBy('status')->pluck('total', 'status');
        
        $lastAccident = (clone $insidenQuery)->where('jenis', 'kecelakaan')->latest('tanggal_kejadian')->first();
        if (!$lastAccident) {
            $lastAccident = Insiden::where('jenis', 'kecelakaan')->latest('tanggal_kejadian')->first();
        }

        // ========== SAFETY BEHAVIOR ==========
        $sbQuery = \App\Models\SafetyBehavior::query();
        if ($targetYear && $targetMonth) {
            $sbQuery->whereMonth('created_at', $targetMonth)->whereYear('created_at', $targetYear);
        } elseif ($targetYear) {
            $sbQuery->whereYear('created_at', $targetYear);
        }
        $sbTotal = (clone $sbQuery)->count();
        $sbByStatus = (clone $sbQuery)->select('status', DB::raw('count(*) as total'))->groupBy('status')->pluck('total', 'status');

        // ========== SAFETY PATROL ==========
        $spQuery = \App\Models\SafetyPatrol::query();
        if ($targetYear && $targetMonth) {
            $spQuery->whereMonth('created_at', $targetMonth)->whereYear('created_at', $targetYear);
        } elseif ($targetYear) {
            $spQuery->whereYear('created_at', $targetYear);
        }
        $spTotal = (clone $spQuery)->count();
        $spByStatus = (clone $spQuery)->select('status', DB::raw('count(*) as total'))->groupBy('status')->pluck('total', 'status');

        // ========== MAN HOURS & MANPOWER ==========
        $totalSafeManhours = 0;
        $totalManpower = 0;
        $karyawanTotal = Karyawan::count();

        if ($targetYear && $targetMonth) {
            $monthName = $monthMap[$targetMonth];
            $mmh = \App\Models\MonthlyManHour::where('tahun', (string) $targetYear)
                ->where('bulan', $monthName)->first();
            if ($mmh) {
                $totalSafeManhours = (float) $mmh->jam_kerja_aman;
                $totalManpower = (int) $mmh->total_manpower;
            }
        } elseif ($targetYear) {
            $mmhRecords = \App\Models\MonthlyManHour::where('tahun', (string) $targetYear)->get();
            if ($mmhRecords->count() > 0) {
                $totalSafeManhours = (float) $mmhRecords->sum(function ($r) { return $r->jam_kerja_aman; });
                $totalManpower = (int) round($mmhRecords->avg(function ($r) { return $r->total_manpower; }));
            }
        } else {
            $totalSafeManhours = (float) \App\Models\MonthlyManHour::sum(DB::raw('(normal_jam_inl + normal_jam_kontraktor + normal_jam_outsourcing + overtime_inl + overtime_kontraktor + overtime_outsourcing) - cuti_sakit'));
            $totalManpower = (int) \App\Models\MonthlyManHour::sum(DB::raw('manpower_inl + manpower_kontraktor + manpower_outsourcing'));
        }

        if ($totalManpower === 0) {
            $totalManpower = $karyawanTotal;
        }

        // ========== HSE KPI ==========
        $kpiQuery = \App\Models\HseKpiPerformance::query();
        if ($targetYear && $targetMonth) {
            $kpiQuery->whereMonth('period_start', $targetMonth)->whereYear('period_start', $targetYear);
        } elseif ($targetYear) {
            $kpiQuery->whereYear('period_start', $targetYear);
        }
        $kpiTotalEntries = (clone $kpiQuery)->count();
        $kpiTotals = [
            'fatality' => (int) (clone $kpiQuery)->sum('fatality'),
            'lti' => (int) (clone $kpiQuery)->sum('lti'),
            'rwdc' => (int) (clone $kpiQuery)->sum('rwdc'),
            'mtc' => (int) (clone $kpiQuery)->sum('mtc'),
            'fac' => (int) (clone $kpiQuery)->sum('fac'),
            'near_miss' => (int) (clone $kpiQuery)->sum('near_miss'),
            'environmental_incident' => (int) (clone $kpiQuery)->sum('environmental_incident'),
            'property_damage' => (int) (clone $kpiQuery)->sum('property_damage'),
            'customer_formal_complaint' => (int) (clone $kpiQuery)->sum('customer_formal_complaint'),
            'hse_management_visit' => (int) (clone $kpiQuery)->sum('hse_management_visit'),
            'hse_joint_safety_patrol' => (int) (clone $kpiQuery)->sum('hse_joint_safety_patrol'),
            'behavior_based_safe' => (int) (clone $kpiQuery)->sum('behavior_based_safe'),
            'emergency_drill' => (int) (clone $kpiQuery)->sum('emergency_drill'),
            'equipment_inspection' => (int) (clone $kpiQuery)->sum('equipment_inspection'),
            'hse_toolbox_meeting' => (int) (clone $kpiQuery)->sum('hse_toolbox_meeting'),
            'hse_meeting' => (int) (clone $kpiQuery)->sum('hse_meeting'),
            'general_safety_talk' => (int) (clone $kpiQuery)->sum('general_safety_talk'),
            'safety_stand_down_meeting' => (int) (clone $kpiQuery)->sum('safety_stand_down_meeting'),
            'reward' => (int) (clone $kpiQuery)->sum('reward'),
            'punishment' => (int) (clone $kpiQuery)->sum('punishment'),
            'campaign_bulan_k3_nasional' => (int) (clone $kpiQuery)->sum('campaign_bulan_k3_nasional'),
            'hse_induction' => (int) (clone $kpiQuery)->sum('hse_induction'),
            'hse_training' => (int) (clone $kpiQuery)->sum('hse_training'),
            'audit_program_internal' => (int) (clone $kpiQuery)->sum('audit_program_internal'),
            'audit_program_eksternal' => (int) (clone $kpiQuery)->sum('audit_program_eksternal'),
        ];

        return [
            'period' => $periodType,
            'label' => $label,
            'target_year' => $targetYear,
            'target_month' => $targetMonth,
            'total_safe_manhours' => $totalSafeManhours,
            'total_manpower' => $totalManpower,
            'total_permits' => $permitsTotal,
            'permits_completed' => $permitsCompleted,
            'permits_by_status' => $permitsByStatus,
            'total_insiden' => $insidenTotal,
            'insiden_by_jenis' => $insidenByJenis,
            'insiden_by_status' => $insidenByStatus,
            'last_accident_date' => $lastAccident?->tanggal_kejadian,
            'total_safety_behavior' => $sbTotal,
            'safety_behavior_by_status' => $sbByStatus,
            'total_safety_patrol' => $spTotal,
            'safety_patrol_by_status' => $spByStatus,
            'total_karyawan' => $karyawanTotal,
            'kpi_total_entries' => $kpiTotalEntries,
            'kpi_totals' => $kpiTotals,
        ];
    }

    /**
     * Admin Dashboard — comprehensive aggregated data across ALL modules and periods
     */
    public function adminDashboard(Request $request)
    {
        $requestedPeriod = $request->query('period', 'all_time');

        $periods = [
            'this_month' => $this->getDashboardMetricsForPeriod('this_month'),
            'last_month' => $this->getDashboardMetricsForPeriod('last_month'),
            'last_year' => $this->getDashboardMetricsForPeriod('last_year'),
            'all_time' => $this->getDashboardMetricsForPeriod('all_time'),
        ];

        $currentData = $periods[$requestedPeriod] ?? $periods['all_time'];

        $insidenPerBulan = Insiden::select(
            DB::raw(DB::connection()->getDriverName() === 'pgsql' ? "TO_CHAR(tanggal_kejadian, 'YYYY-MM') as bulan" : "DATE_FORMAT(tanggal_kejadian, '%Y-%m') as bulan"),
            DB::raw('count(*) as total')
        )
        ->where('tanggal_kejadian', '>=', now()->subMonths(12))
        ->groupBy('bulan')->orderBy('bulan')->get();

        // ========== USERS ==========
        $usersQuery = User::query();
        $usersTotal = (clone $usersQuery)->count();
        $usersByRole = (clone $usersQuery)->select('role', DB::raw('count(*) as total'))->groupBy('role')->pluck('total', 'role');
        $usersActive = (clone $usersQuery)->where('created_at', '>=', now()->subDays(30))->count();

        // ========== RECENT ACTIVITIES ==========
        $recentPermits = \App\Models\Permit::with('user:id,name')->latest()->take(5)->get()->map(function ($p) {
            return ['type' => 'permit', 'id' => $p->id, 'title' => $p->judul, 'status' => $p->status, 'user' => $p->user?->name, 'time' => $p->created_at];
        });
        $recentInsiden = Insiden::with('user:id,name')->latest()->take(5)->get()->map(function ($i) {
            return ['type' => 'insiden', 'id' => $i->id, 'title' => $i->judul, 'jenis' => $i->jenis, 'status' => $i->status, 'user' => $i->user?->name, 'time' => $i->created_at];
        });
        $recentSB = \App\Models\SafetyBehavior::with('user:id,name')->latest()->take(5)->get()->map(function ($s) {
            return ['type' => 'safety_behavior', 'id' => $s->id, 'title' => $s->lokasi, 'status' => $s->status, 'user' => $s->user?->name, 'time' => $s->created_at];
        });
        $recentSP = \App\Models\SafetyPatrol::with('user:id,name')->latest()->take(5)->get()->map(function ($s) {
            return ['type' => 'safety_patrol', 'id' => $s->id, 'title' => $s->lokasi, 'status' => $s->status, 'user' => $s->user?->name, 'time' => $s->created_at];
        });

        $recentActivities = collect([...$recentPermits, ...$recentInsiden, ...$recentSB, ...$recentSP])
            ->sortByDesc('time')->take(10)->values();

        $responsePayload = array_merge($currentData, [
            'periods' => $periods,
            'active_period' => $requestedPeriod,
            'insiden_this_month' => $periods['this_month']['total_insiden'],
            'permits_this_month' => $periods['this_month']['total_permits'],
            'safety_behavior_this_month' => $periods['this_month']['total_safety_behavior'],
            'safety_patrol_this_month' => $periods['this_month']['total_safety_patrol'],
            'insiden_per_bulan' => $insidenPerBulan,
            'total_users' => $usersTotal,
            'users_active_30d' => $usersActive,
            'users_by_role' => $usersByRole,
            'recent_activities' => $recentActivities,
        ]);

        return response()->json([
            'success' => true,
            'data' => $responsePayload,
        ]);
    }

    /**
     * Dashboard index (backward compat)
     */
    public function index(Request $request)
    {
        $user = $request->user();

        $insidenQuery = Insiden::query();
        $gwpQuery = GwpPermit::query();
        $jsaQuery = Jsa::query();

        // user: only own data
        // admin/supervisor: all data
        if ($user->role === 'user') {
            $insidenQuery->where('user_id', $user->id);
            $gwpQuery->where('user_id', $user->id);
            $jsaQuery->where('user_id', $user->id);
        }

        $stats = [
            'total_insiden' => (clone $insidenQuery)->count(),
            'insiden_pending' => (clone $insidenQuery)->where('status', 'pending')->count(),
            'insiden_investigation' => (clone $insidenQuery)->where('status', 'investigation')->count(),
            'insiden_resolved' => (clone $insidenQuery)->where('status', 'resolved')->count(),
            'insiden_closed' => (clone $insidenQuery)->where('status', 'closed')->count(),
            'total_gwp' => (clone $gwpQuery)->count(),
            'gwp_pending' => (clone $gwpQuery)->where('status', 'pending')->count(),
            'gwp_approved' => (clone $gwpQuery)->where('status', 'approved')->count(),
            'gwp_rejected' => (clone $gwpQuery)->where('status', 'rejected')->count(),
            'total_jsa' => (clone $jsaQuery)->count(),
            'total_apd' => Apd::count(),
            'apd_stok_habis' => Apd::where('stok', '<=', 0)->count(),
            'total_karyawan' => Karyawan::count(),
        ];

        if ($user->role === 'admin') {
            $stats['total_users'] = User::count();
            $stats['total_admin'] = User::where('role', 'admin')->count();
        }

        $insidenPerBulan = Insiden::select(
            DB::raw(DB::connection()->getDriverName() === 'pgsql' ? "TO_CHAR(tanggal_kejadian, 'YYYY-MM') as bulan" : "DATE_FORMAT(tanggal_kejadian, '%Y-%m') as bulan"),
            DB::raw('count(*) as total')
        )
        ->where('tanggal_kejadian', '>=', now()->subMonths(6))
        ->groupBy('bulan')
        ->orderBy('bulan')
        ->get();

        $insidenPerJenis = Insiden::select('jenis', DB::raw('count(*) as total'))
            ->groupBy('jenis')
            ->get();

        $gwpPerStatus = GwpPermit::select('status', DB::raw('count(*) as total'))
            ->groupBy('status')
            ->get();

        $recentInsiden = $insidenQuery->with('user')
            ->latest()
            ->take(5)
            ->get();

        return $this->success([
            'stats' => $stats,
            'insiden_per_bulan' => $insidenPerBulan,
            'insiden_per_jenis' => $insidenPerJenis,
            'gwp_per_status' => $gwpPerStatus,
            'recent_insiden' => $recentInsiden,
        ], 'Dashboard data berhasil diambil');
    }

    /**
     * Get real-time dashboard data per role
     */
    public function roleData(Request $request)
    {
        $user = $request->user();
        $role = $user->role;

        // Generate list of 12 months for the current calendar year (Y-m format)
        $year = now()->format('Y');
        $months = [];
        for ($m = 1; $m <= 12; $m++) {
            $months[] = sprintf("%s-%02d", $year, $m);
        }

        $monthNames = [
            '01' => 'Jan', '02' => 'Feb', '03' => 'Mar', '04' => 'Apr',
            '05' => 'Mei', '06' => 'Jun', '07' => 'Jul', '08' => 'Agu',
            '09' => 'Sep', '10' => 'Okt', '11' => 'Nov', '12' => 'Des'
        ];

        // 1. Initialize stats & charts
        $stats = [
            'total_manpower' => null,
            'safe_man_hours' => null,
            'total_incident' => null,
            'near_miss' => null,
        ];

        $incidentSummary = [
            ['name' => 'Kecelakaan Kerja', 'value' => 0],
            ['name' => 'Near Miss', 'value' => 0],
            ['name' => 'Unsafe Condition', 'value' => 0]
        ];

        $ptwStatus = [
            ['name' => 'Draft', 'value' => 0],
            ['name' => 'Submitted', 'value' => 0],
            ['name' => 'Approved', 'value' => 0],
            ['name' => 'Rejected', 'value' => 0],
            ['name' => 'Completed', 'value' => 0]
        ];

        $safetyInspectionTrends = [];
        $trainingSafetyBehavior = [];

        // Pre-populate charts with empty 12-month data
        foreach ($months as $m) {
            $parts = explode('-', $m);
            $monthLabel = $monthNames[$parts[1]];

            $safetyInspectionTrends[] = [
                'month' => $monthLabel,
                'inspeksi' => 0
            ];

            $trainingSafetyBehavior[] = [
                'month' => $monthLabel,
                'safety_behavior' => 0,
                'training' => 0
            ];
        }

        // EVERY ROLE GETS THE SAME COMPANY-WIDE DATA
        $stats['total_manpower'] = Karyawan::count();
        $stats['safe_man_hours'] = (float) \App\Models\MonthlyManHour::sum(DB::raw('(normal_jam_inl + normal_jam_kontraktor + normal_jam_outsourcing + overtime_inl + overtime_kontraktor + overtime_outsourcing) - cuti_sakit'));
        $stats['total_incident'] = Insiden::count();
        $stats['near_miss'] = Insiden::where('jenis', 'near_miss')->count();

        $incidentSummary = [
            ['name' => 'Kecelakaan Kerja', 'value' => Insiden::where('jenis', 'kecelakaan')->count()],
            ['name' => 'Near Miss', 'value' => $stats['near_miss']],
            ['name' => 'Unsafe Condition', 'value' => Insiden::where('jenis', 'unsafe_condition')->count()]
        ];

        $ptwQuery = \App\Models\Permit::query();
        $ptwStatus = [
            ['name' => 'Draft', 'value' => (clone $ptwQuery)->where('status', 'draft')->count()],
            ['name' => 'Submitted', 'value' => (clone $ptwQuery)->where('status', 'submitted')->count()],
            ['name' => 'Approved', 'value' => (clone $ptwQuery)->whereIn('status', ['approved', 'hse_approved', 'supervisor_approved'])->count()],
            ['name' => 'Rejected', 'value' => (clone $ptwQuery)->whereIn('status', ['rejected', 'hse_rejected', 'supervisor_rejected'])->count()],
            ['name' => 'Completed', 'value' => (clone $ptwQuery)->where('status', 'completed')->count()]
        ];

        $safetyInspectionTrends = [];
        foreach ($months as $m) {
            $parts = explode('-', $m);
            $monthLabel = $monthNames[$parts[1]];
            $count = \App\Models\SafetyPatrol::where(DB::raw(DB::connection()->getDriverName() === 'pgsql' ? "TO_CHAR(tanggal, 'YYYY-MM')" : "DATE_FORMAT(tanggal, '%Y-%m')"), $m)->count();
            $safetyInspectionTrends[] = [
                'month' => $monthLabel,
                'inspeksi' => $count
            ];
        }

        $trainingSafetyBehavior = [];
        foreach ($months as $m) {
            $parts = explode('-', $m);
            $monthLabel = $monthNames[$parts[1]];
            $sbCount = \App\Models\SafetyBehavior::where(DB::raw(DB::connection()->getDriverName() === 'pgsql' ? "TO_CHAR(tanggal, 'YYYY-MM')" : "DATE_FORMAT(tanggal, '%Y-%m')"), $m)->count();
            $kpiCount = \App\Models\HseKpiPerformance::where(DB::raw(DB::connection()->getDriverName() === 'pgsql' ? "TO_CHAR(period_start, 'YYYY-MM')" : "DATE_FORMAT(period_start, '%Y-%m')"), $m)->sum('hse_training');
            $trainingSafetyBehavior[] = [
                'month' => $monthLabel,
                'safety_behavior' => $sbCount,
                'training' => (int) $kpiCount
            ];
        }

        return $this->success([
            'role' => $role,
            'stats' => $stats,
            'charts' => [
                'incident_summary' => $incidentSummary,
                'ptw_status' => $ptwStatus,
                'safety_inspection_trends' => $safetyInspectionTrends,
                'training_safety_behavior' => $trainingSafetyBehavior,
            ]
        ], 'Dashboard data berhasil diambil');
    }
}

