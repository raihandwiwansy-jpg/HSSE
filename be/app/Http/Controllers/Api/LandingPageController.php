<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Insiden;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;

class LandingPageController extends Controller
{
    public function getStats(): JsonResponse
    {
        // 1. Last Accident (Kecelakaan Kerja)
        $lastAccident = Insiden::where('status', '!=', 'rejected')
            ->where('jenis', 'kecelakaan')
            ->orderBy('tanggal_kejadian', 'desc')
            ->first();
            
        $lastAccidentDate = $lastAccident ? Carbon::parse($lastAccident->tanggal_kejadian) : null;
        
        // 2. Base Date for baseline calculation if no accidents
        $baseDate = Carbon::create(2025, 1, 1);
        
        // Date difference
        $today = Carbon::today();
        $referenceDate = $lastAccidentDate ? $lastAccidentDate : $baseDate;
        
        // Safe Days (Days since last accident)
        $safeDays = $referenceDate->diffInDays($today);
        
        // 3. Working Days Calculation (Days since start of year)
        $startOfYear = Carbon::now()->startOfYear();
        $endOfLastMonth = Carbon::now()->subMonth()->endOfMonth();
        $workingDaysLastMonth = max(0, $startOfYear->diffInDays($endOfLastMonth));
        $workingDaysThisMonth = max(0, $startOfYear->diffInDays($today));
        
        // 4. Safe Manhours Calculation
        $lastMonthYear = Carbon::now()->subMonth()->year;
        $lastMonthNum = Carbon::now()->subMonth()->month;
        
        $safeManHoursLastMonth = (int) \App\Models\MonthlyManHour::where(function($q) use ($lastMonthYear, $lastMonthNum) {
            $q->where('tahun', '<', $lastMonthYear)
              ->orWhere('tahun', '2018-2025')
              ->orWhere(function($q2) use ($lastMonthYear, $lastMonthNum) {
                  $q2->where('tahun', $lastMonthYear)->where('bulan', '<=', $lastMonthNum);
              });
        })->sum(\Illuminate\Support\Facades\DB::raw('(normal_jam_inl + normal_jam_kontraktor + normal_jam_outsourcing + overtime_inl + overtime_kontraktor + overtime_outsourcing) - cuti_sakit'));
        
        $safeManHoursThisMonth = (int) \App\Models\MonthlyManHour::sum(\Illuminate\Support\Facades\DB::raw('(normal_jam_inl + normal_jam_kontraktor + normal_jam_outsourcing + overtime_inl + overtime_kontraktor + overtime_outsourcing) - cuti_sakit'));
        
        // 5. 2018-2025 Specific Recap
        $safeManHoursRecap = (int) \App\Models\MonthlyManHour::where('tahun', '2018-2025')
            ->sum(\Illuminate\Support\Facades\DB::raw('(normal_jam_inl + normal_jam_kontraktor + normal_jam_outsourcing + overtime_inl + overtime_kontraktor + overtime_outsourcing) - cuti_sakit'));

        // Month / Year strings for board
        $monthStr = strtoupper($today->translatedFormat('M'));
        $yearStr = $today->format('Y');

        return response()->json([
            'success' => true,
            'data' => [
                'board_month' => $monthStr,
                'board_year' => $yearStr,
                'working_days' => [
                    'last_month' => number_format($workingDaysLastMonth),
                    'this_month' => number_format($workingDaysThisMonth),
                ],
                'safe_manhours' => [
                    'last_month' => number_format($safeManHoursLastMonth),
                    'this_month' => number_format($safeManHoursThisMonth),
                ],
                'safe_manhours_recap' => number_format($safeManHoursRecap),
                'last_accident' => $lastAccidentDate ? $lastAccidentDate->format('Y-m-d') : '-',
                'current_datetime' => [
                    'day' => $today->format('d'),
                    'hours' => Carbon::now()->format('H:i'),
                    'date' => $today->format('d M Y'),
                ]
            ]
        ]);
    }
}
