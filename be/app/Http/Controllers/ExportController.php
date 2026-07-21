<?php

namespace App\Http\Controllers;

use App\Exports\InsidenExport;
use App\Exports\GwpPermitExport;
use App\Exports\JsaExport;
use App\Exports\ApdExport;
use App\Exports\CseExport;
use App\Exports\HwpExport;
use App\Exports\WhpExport;
use App\Exports\ElpExport;
use App\Exports\EwpExport;
use App\Exports\LwpExport;
use App\Exports\RwpExport;
use App\Models\Insiden;
use App\Models\GwpPermit;
use App\Models\Jsa;
use App\Models\Apd;
use App\Models\Karyawan;
use App\Models\CsePermit;
use App\Models\HwpPermit;
use App\Models\WhpPermit;
use App\Models\ElpPermit;
use App\Models\EwpPermit;
use App\Models\LwpPermit;
use App\Models\RwpPermit;
use App\Models\Permit;
use App\Models\SafetyPatrol;
use App\Models\SafetyBehavior;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;
use Barryvdh\DomPDF\Facade\Pdf;

class ExportController extends Controller
{
    use ApiResponse;

    // ==================== EXCEL EXPORTS ====================

    /**
     * Export insiden ke Excel
     */
    public function insidenExcel(Request $request)
    {
        $filename = 'insiden-' . now()->format('Y-m-d') . '.xlsx';
        return Excel::download(new InsidenExport($request->status, $request->date_from, $request->date_to), $filename);
    }

    /**
     * Export GWP ke Excel
     */
    public function gwpExcel(Request $request)
    {
        $filename = 'gwp-permit-' . now()->format('Y-m-d') . '.xlsx';
        return Excel::download(new GwpPermitExport($request->status, $request->date_from, $request->date_to), $filename);
    }

    /**
     * Export JSA ke Excel
     */
    public function jsaExcel(Request $request)
    {
        $filename = 'jsa-' . now()->format('Y-m-d') . '.xlsx';
        return Excel::download(new JsaExport($request->departemen, $request->date_from, $request->date_to), $filename);
    }

    /**
     * Export APD ke Excel
     */
    public function apdExcel(Request $request)
    {
        $filename = 'apd-' . now()->format('Y-m-d') . '.xlsx';
        return Excel::download(new ApdExport($request->status), $filename);
    }

    // ==================== PDF EXPORTS ====================

    /**
     * Export insiden ke PDF
     */
    public function insidenPdf(Request $request)
    {
        $query = Insiden::with('user');
        if ($request->status) $query->where('status', $request->status);
        if ($request->date_from) $query->where('tanggal_kejadian', '>=', $request->date_from);
        if ($request->date_to) $query->where('tanggal_kejadian', '<=', $request->date_to);
        $data = $query->orderBy('tanggal_kejadian', 'desc')->get();

        $pdf = Pdf::loadView('exports.insiden-pdf', ['data' => $data]);
        $pdf->setPaper('a4', 'landscape');
        return $pdf->download('insiden-' . now()->format('Y-m-d') . '.pdf');
    }

    /**
     * Export GWP ke PDF
     */
    public function gwpPdf(Request $request)
    {
        $query = GwpPermit::with(['user', 'approvals']);
        if ($request->status) $query->where('status', $request->status);
        if ($request->date_from) $query->where('tanggal', '>=', $request->date_from);
        if ($request->date_to) $query->where('tanggal', '<=', $request->date_to);
        $data = $query->orderBy('tanggal', 'desc')->get();

        $pdf = Pdf::loadView('exports.gwp-pdf', ['data' => $data]);
        $pdf->setPaper('a4', 'landscape');
        return $pdf->download('gwp-permit-' . now()->format('Y-m-d') . '.pdf');
    }

    /**
     * Export JSA ke PDF
     */
    public function jsaPdf(Request $request)
    {
        $query = Jsa::with('user');
        if ($request->departemen) $query->where('departemen', $request->departemen);
        if ($request->date_from) $query->where('tanggal', '>=', $request->date_from);
        if ($request->date_to) $query->where('tanggal', '<=', $request->date_to);
        $data = $query->orderBy('tanggal', 'desc')->get();

        $pdf = Pdf::loadView('exports.jsa-pdf', ['data' => $data]);
        $pdf->setPaper('a4', 'landscape');
        return $pdf->download('jsa-' . now()->format('Y-m-d') . '.pdf');
    }

    /**
     * Export APD ke PDF
     */
    public function apdPdf(Request $request)
    {
        $query = Apd::query();
        if ($request->status) $query->where('status', $request->status);
        $data = $query->orderBy('nama')->get();

        $pdf = Pdf::loadView('exports.apd-pdf', ['data' => $data]);
        $pdf->setPaper('a4', 'landscape');
        return $pdf->download('apd-' . now()->format('Y-m-d') . '.pdf');
    }

    // ==================== EXPORT ALIAS METHODS (for new route names) ====================

    public function exportInsidenExcel(Request $request) { return $this->insidenExcel($request); }
    public function exportInsidenPdf(Request $request) { return $this->insidenPdf($request); }
    public function exportGwpExcel(Request $request) { return $this->gwpExcel($request); }
    public function exportGwpPdf(Request $request) { return $this->gwpPdf($request); }
    public function exportJsaExcel(Request $request) { return $this->jsaExcel($request); }
    public function exportJsaPdf(Request $request) { return $this->jsaPdf($request); }
    public function exportApdExcel(Request $request) { return $this->apdExcel($request); }
    public function exportApdPdf(Request $request) { return $this->apdPdf($request); }

    public function karyawanPdf(Request $request)
    {
        $query = Karyawan::query();
        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('nama', 'like', "%{$request->search}%")
                  ->orWhere('nik', 'like', "%{$request->search}%");
            });
        }
        $data = $query->orderBy('nama')->get();

        $pdf = Pdf::loadView('exports.karyawan-pdf', ['data' => $data]);
        $pdf->setPaper('a4', 'landscape');
        return $pdf->download('karyawan-' . now()->format('Y-m-d') . '.pdf');
    }

    public function karyawanExcel(Request $request)
    {
        $filename = 'karyawan-' . now()->format('Y-m-d') . '.xlsx';
        return Excel::download(new \App\Exports\KaryawanExport($request->search), $filename);
    }

    // ==================== NEW EXPORT METHODS (CSE, HWP, WHP, ELP, EWP, LWP, RWP) ====================

    /**
     * Export CSE ke PDF
     */
    public function csePdf(Request $request)
    {
        $query = CsePermit::with('user');
        if ($request->status) $query->where('status', $request->status);
        if ($request->date_from) $query->where('tanggal', '>=', $request->date_from);
        if ($request->date_to) $query->where('tanggal', '<=', $request->date_to);
        $data = $query->orderBy('tanggal', 'desc')->get();

        $pdf = Pdf::loadView('exports.cse-pdf', ['data' => $data]);
        $pdf->setPaper('a4', 'landscape');
        return $pdf->download('cse-' . now()->format('Y-m-d') . '.pdf');
    }

    /**
     * Export CSE ke Excel
     */
    public function cseExcel(Request $request)
    {
        $filename = 'cse-' . now()->format('Y-m-d') . '.xlsx';
        return Excel::download(new CseExport($request->status, $request->date_from, $request->date_to), $filename);
    }

    /**
     * Export HWP ke PDF
     */
    public function hwpPdf(Request $request)
    {
        $query = HwpPermit::with(['user', 'approvals']);
        if ($request->status) $query->where('status', $request->status);
        if ($request->date_from) $query->where('tanggal', '>=', $request->date_from);
        if ($request->date_to) $query->where('tanggal', '<=', $request->date_to);
        $data = $query->orderBy('tanggal', 'desc')->get();

        $pdf = Pdf::loadView('exports.hwp-pdf', ['data' => $data]);
        $pdf->setPaper('a4', 'landscape');
        return $pdf->download('hwp-' . now()->format('Y-m-d') . '.pdf');
    }

    /**
     * Export HWP ke Excel
     */
    public function hwpExcel(Request $request)
    {
        $filename = 'hwp-' . now()->format('Y-m-d') . '.xlsx';
        return Excel::download(new HwpExport($request->status, $request->date_from, $request->date_to), $filename);
    }

    /**
     * Export WHP ke PDF
     */
    public function whpPdf(Request $request)
    {
        $query = WhpPermit::with('user');
        if ($request->status) $query->where('status', $request->status);
        if ($request->date_from) $query->where('tanggal', '>=', $request->date_from);
        if ($request->date_to) $query->where('tanggal', '<=', $request->date_to);
        $data = $query->orderBy('tanggal', 'desc')->get();

        $pdf = Pdf::loadView('exports.whp-pdf', ['data' => $data]);
        $pdf->setPaper('a4', 'landscape');
        return $pdf->download('whp-' . now()->format('Y-m-d') . '.pdf');
    }

    /**
     * Export WHP ke Excel
     */
    public function whpExcel(Request $request)
    {
        $filename = 'whp-' . now()->format('Y-m-d') . '.xlsx';
        return Excel::download(new WhpExport($request->status, $request->date_from, $request->date_to), $filename);
    }

    /**
     * Export ELP ke PDF
     */
    public function elpPdf(Request $request)
    {
        $query = ElpPermit::with('user');
        if ($request->status) $query->where('status', $request->status);
        if ($request->date_from) $query->where('tanggal', '>=', $request->date_from);
        if ($request->date_to) $query->where('tanggal', '<=', $request->date_to);
        $data = $query->orderBy('tanggal', 'desc')->get();

        $pdf = Pdf::loadView('exports.elp-pdf', ['data' => $data]);
        $pdf->setPaper('a4', 'landscape');
        return $pdf->download('elp-' . now()->format('Y-m-d') . '.pdf');
    }

    /**
     * Export ELP ke Excel
     */
    public function elpExcel(Request $request)
    {
        $filename = 'elp-' . now()->format('Y-m-d') . '.xlsx';
        return Excel::download(new ElpExport($request->status, $request->date_from, $request->date_to), $filename);
    }

    /**
     * Export EWP ke PDF
     */
    public function ewpPdf(Request $request)
    {
        $query = EwpPermit::with('user');
        if ($request->status) $query->where('status', $request->status);
        if ($request->date_from) $query->where('tanggal', '>=', $request->date_from);
        if ($request->date_to) $query->where('tanggal', '<=', $request->date_to);
        $data = $query->orderBy('tanggal', 'desc')->get();

        $pdf = Pdf::loadView('exports.ewp-pdf', ['data' => $data]);
        $pdf->setPaper('a4', 'landscape');
        return $pdf->download('ewp-' . now()->format('Y-m-d') . '.pdf');
    }

    /**
     * Export EWP ke Excel
     */
    public function ewpExcel(Request $request)
    {
        $filename = 'ewp-' . now()->format('Y-m-d') . '.xlsx';
        return Excel::download(new EwpExport($request->status, $request->date_from, $request->date_to), $filename);
    }

    /**
     * Export LWP ke PDF
     */
    public function lwpPdf(Request $request)
    {
        $query = LwpPermit::with('user');
        if ($request->status) $query->where('status', $request->status);
        if ($request->date_from) $query->where('tanggal', '>=', $request->date_from);
        if ($request->date_to) $query->where('tanggal', '<=', $request->date_to);
        $data = $query->orderBy('tanggal', 'desc')->get();

        $pdf = Pdf::loadView('exports.lwp-pdf', ['data' => $data]);
        $pdf->setPaper('a4', 'landscape');
        return $pdf->download('lwp-' . now()->format('Y-m-d') . '.pdf');
    }

    /**
     * Export LWP ke Excel
     */
    public function lwpExcel(Request $request)
    {
        $filename = 'lwp-' . now()->format('Y-m-d') . '.xlsx';
        return Excel::download(new LwpExport($request->status, $request->date_from, $request->date_to), $filename);
    }

    /**
     * Export RWP ke PDF
     */
    public function rwpPdf(Request $request)
    {
        $query = RwpPermit::with('user');
        if ($request->status) $query->where('status', $request->status);
        if ($request->date_from) $query->where('tanggal', '>=', $request->date_from);
        if ($request->date_to) $query->where('tanggal', '<=', $request->date_to);
        $data = $query->orderBy('tanggal', 'desc')->get();

        $pdf = Pdf::loadView('exports.rwp-pdf', ['data' => $data]);
        $pdf->setPaper('a4', 'landscape');
        return $pdf->download('rwp-' . now()->format('Y-m-d') . '.pdf');
    }

    /**
     * Export RWP ke Excel
     */
    public function rwpExcel(Request $request)
    {
        $filename = 'rwp-' . now()->format('Y-m-d') . '.xlsx';
        return Excel::download(new RwpExport($request->status, $request->date_from, $request->date_to), $filename);
    }

    // Alias for new exports
    public function exportCseExcel(Request $request) { return $this->cseExcel($request); }
    public function exportCsePdf(Request $request) { return $this->csePdf($request); }
    public function exportHwpExcel(Request $request) { return $this->hwpExcel($request); }
    public function exportHwpPdf(Request $request) { return $this->hwpPdf($request); }
    public function exportWhpExcel(Request $request) { return $this->whpExcel($request); }
    public function exportWhpPdf(Request $request) { return $this->whpPdf($request); }
    public function exportElpExcel(Request $request) { return $this->elpExcel($request); }
    public function exportElpPdf(Request $request) { return $this->elpPdf($request); }
    public function exportEwpExcel(Request $request) { return $this->ewpExcel($request); }
    public function exportEwpPdf(Request $request) { return $this->ewpPdf($request); }
    public function exportLwpExcel(Request $request) { return $this->lwpExcel($request); }
    public function exportLwpPdf(Request $request) { return $this->lwpPdf($request); }
    public function exportRwpExcel(Request $request) { return $this->rwpExcel($request); }
    public function exportRwpPdf(Request $request) { return $this->rwpPdf($request); }

    public function exportManHoursExcel(Request $request)
    {
        $year = $request->query('tahun', date('Y'));
        
        $spreadsheet = new \PhpOffice\PhpSpreadsheet\Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();
        $sheet->setTitle('Rekap Man Hours');

        // Headers
        $headers = [
            'A1' => 'Tahun', 'B1' => 'Bulan', 
            'C1' => 'Manpower INL', 'D1' => 'Manpower Kontraktor', 'E1' => 'Manpower Outsourcing', 'F1' => 'Total Manpower',
            'G1' => 'Jam Normal INL', 'H1' => 'Overtime INL', 'I1' => 'Jam Kontraktor (Total)', 'J1' => 'Jam Outsourcing (Total)', 'K1' => 'Total Jam',
            'L1' => 'Cuti/Izin/Sakit', 'M1' => 'Total Jam Kerja Bersih'
        ];
        foreach ($headers as $cell => $val) {
            $sheet->setCellValue($cell, $val);
        }
        $sheet->getStyle('A1:M1')->getFont()->setBold(true);

        $records = \App\Models\MonthlyManHour::orderBy('tahun')->orderBy('bulan')->get();

        $row = 2;
        $recapTotal = 0;

        foreach ($records as $record) {
            if ($record->tahun === '2018-2025') {
                $recapTotal = ($record->normal_jam_inl + $record->normal_jam_kontraktor + $record->normal_jam_outsourcing 
                             + $record->overtime_inl + $record->overtime_kontraktor + $record->overtime_outsourcing) - $record->cuti_sakit;
                continue;
            }

            $sheet->setCellValue("A{$row}", $record->tahun);
            $sheet->setCellValue("B{$row}", $record->bulan);
            $sheet->setCellValue("C{$row}", $record->manpower_inl);
            $sheet->setCellValue("D{$row}", $record->manpower_kontraktor);
            $sheet->setCellValue("E{$row}", $record->manpower_outsourcing);
            $sheet->setCellValue("F{$row}", "=SUM(C{$row}:E{$row})");
            
            $sheet->setCellValue("G{$row}", $record->normal_jam_inl);
            $sheet->setCellValue("H{$row}", $record->overtime_inl);
            $jamK = $record->normal_jam_kontraktor + $record->overtime_kontraktor;
            $sheet->setCellValue("I{$row}", $jamK);
            $jamO = $record->normal_jam_outsourcing + $record->overtime_outsourcing;
            $sheet->setCellValue("J{$row}", $jamO);
            
            $sheet->setCellValue("K{$row}", "=SUM(G{$row}:J{$row})");
            $sheet->setCellValue("L{$row}", $record->cuti_sakit);
            $sheet->setCellValue("M{$row}", "=K{$row}-L{$row}");
            
            $row++;
        }

        // Add Totals
        $sheet->setCellValue("A{$row}", "TOTAL");
        $sheet->setCellValue("G{$row}", "=SUM(G2:G" . ($row - 1) . ")");
        $sheet->setCellValue("J{$row}", "=SUM(I2:J" . ($row - 1) . ")");
        $sheet->setCellValue("M{$row}", "=SUM(M2:M" . ($row - 1) . ")");
        $sheet->getStyle("A{$row}:M{$row}")->getFont()->setBold(true);
        $totalRow = $row;
        
        $row += 2;
        $sheet->setCellValue("A{$row}", "Akumulasi Historis (2018-2025)");
        $sheet->setCellValue("M{$row}", $recapTotal);
        
        $row++;
        $sheet->setCellValue("A{$row}", "TOTAL AKUMULASI KESELURUHAN");
        $sheet->setCellValue("M{$row}", "=M{$totalRow}+M" . ($row - 1));
        $sheet->getStyle("A{$row}:M{$row}")->getFont()->setBold(true);

        foreach (range('A', 'M') as $col) {
            $sheet->getColumnDimension($col)->setAutoSize(true);
        }

        return response()->streamDownload(function() use ($spreadsheet) {
            $writer = \PhpOffice\PhpSpreadsheet\IOFactory::createWriter($spreadsheet, 'Xlsx');
            $writer->save('php://output');
        }, "Rekap_Man_Hours_{$year}.xlsx", [
            'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        ]);
    }

    // ==================== SINGLE PDF EXPORTS ====================

    public function insidenSinglePdf($id)
    {
        $data = Insiden::with('user')->findOrFail($id);
        $pdf = Pdf::loadView('exports.insiden-single-pdf', ['data' => $data]);
        $pdf->setPaper('a4', 'portrait');
        return $pdf->download('insiden-' . $id . '.pdf');
    }

    public function gwpSinglePdf($id)
    {
        $data = GwpPermit::with(['user', 'approvals'])->findOrFail($id);
        $pdf = Pdf::loadView('exports.gwp-single-pdf', ['data' => $data]);
        $pdf->setPaper('a4', 'portrait');
        return $pdf->download('gwp-' . $id . '.pdf');
    }

    public function hwpSinglePdf($id)
    {
        $data = HwpPermit::with(['user', 'gwpPermit', 'approvals'])->findOrFail($id);
        $pdf = Pdf::loadView('exports.hwp-single-pdf', ['data' => $data]);
        $pdf->setPaper('a4', 'portrait');
        return $pdf->download('hwp-' . $id . '.pdf');
    }

    public function cseSinglePdf($id)
    {
        $data = CsePermit::with('user')->findOrFail($id);
        $pdf = Pdf::loadView('exports.cse-single-pdf', ['data' => $data]);
        $pdf->setPaper('a4', 'portrait');
        return $pdf->download('cse-' . $id . '.pdf');
    }

    public function jsaSinglePdf($id)
    {
        $data = Jsa::with('user')->findOrFail($id);
        $pdf = Pdf::loadView('exports.jsa-single-pdf', ['data' => $data]);
        $pdf->setPaper('a4', 'portrait');
        return $pdf->download('jsa-' . $id . '.pdf');
    }

    public function apdSinglePdf($id)
    {
        $data = Apd::findOrFail($id);
        $pdf = Pdf::loadView('exports.apd-single-pdf', ['data' => $data]);
        $pdf->setPaper('a4', 'portrait');
        return $pdf->download('apd-' . $id . '.pdf');
    }

    public function karyawanSinglePdf($id)
    {
        $data = Karyawan::findOrFail($id);
        $pdf = Pdf::loadView('exports.karyawan-single-pdf', ['data' => $data]);
        $pdf->setPaper('a4', 'portrait');
        return $pdf->download('karyawan-' . $id . '.pdf');
    }

    // ==================== UPLOAD HANDLING ====================

    /**
     * Upload foto insiden
     */
    public function uploadInsidenFoto(Request $request, $id)
    {
        $insiden = Insiden::find($id);
        if (!$insiden) {
            return $this->error('Insiden tidak ditemukan', 404);
        }

        $request->validate([
            'foto' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        // Hapus foto lama jika ada
        if ($insiden->foto && \Storage::disk('public')->exists($insiden->foto)) {
            \Storage::disk('public')->delete($insiden->foto);
        }

        $path = $request->file('foto')->store('insiden', 'public');
        $insiden->update(['foto' => $path]);

        return $this->success([
            'foto' => $path,
            'url' => \Storage::disk('public')->url($path),
        ], 'Foto berhasil diupload');
    }

    /**
     * Upload foto profile
     */
    public function uploadProfileFoto(Request $request)
    {
        $request->validate([
            'foto' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $user = $request->user();
        $path = $request->file('foto')->store('profiles', 'public');

        $user->update(['avatar' => $path]);

        return $this->success([
            'avatar' => $path,
            'url' => \Storage::disk('public')->url($path),
        ], 'Foto profile berhasil diupload');
    }

    /**
     * Export single permit PDF (accessible by admin or permit owner when completed)
     */
    public function permitSinglePdf($id)
    {
        $permit = Permit::with(['user', 'jsa', 'detail'])->findOrFail($id);
        $user = \Auth::user();

        // Admin bisa akses semua, user hanya bisa akses permit sendiri yang sudah completed
        if ($user->role !== 'admin' && $permit->user_id !== $user->id) {
            return $this->error('Unauthorized', 403);
        }
        if ($user->role !== 'admin' && $permit->status !== Permit::STATUS_COMPLETED) {
            return $this->error('Hanya permit selesai yang bisa dicetak', 403);
        }

        $jenis = $permit->jenis;
        $viewMap = [
            'gwp' => 'exports.gwp-single-pdf',
            'hwp' => 'exports.hwp-single-pdf',
            'cse' => 'exports.cse-single-pdf',
        ];

        $view = $viewMap[$jenis] ?? 'exports.gwp-single-pdf';
        $pdf = Pdf::loadView($view, ['data' => $permit]);
        $pdf->setPaper('a4', 'portrait');
        return $pdf->download($permit->permit_number . '.pdf');
    }

    // ==================== SAFETY PATROL EXPORTS ====================

    public function safetyPatrolPdf(Request $request)
    {
        $query = SafetyPatrol::with('user');
        if ($request->status) $query->where('status', $request->status);
        if ($request->date_from) $query->where('tanggal', '>=', $request->date_from);
        if ($request->date_to) $query->where('tanggal', '<=', $request->date_to);
        $data = $query->orderBy('tanggal', 'desc')->get();

        $pdf = Pdf::loadView('exports.safety-patrol-pdf', ['data' => $data]);
        $pdf->setPaper('a4', 'landscape');
        return $pdf->download('safety-patrol-' . now()->format('Y-m-d') . '.pdf');
    }

    public function safetyPatrolSinglePdf($id)
    {
        $data = SafetyPatrol::with('user')->findOrFail($id);
        $pdf = Pdf::loadView('exports.safety-patrol-single-pdf', ['data' => $data]);
        $pdf->setPaper('a4', 'portrait');
        return $pdf->download('safety-patrol-' . $id . '.pdf');
    }

    // ==================== SAFETY BEHAVIOR EXPORTS ====================

    public function safetyBehaviorPdf(Request $request)
    {
        $query = SafetyBehavior::with('user');
        if ($request->status) $query->where('status', $request->status);
        if ($request->date_from) $query->where('tanggal', '>=', $request->date_from);
        if ($request->date_to) $query->where('tanggal', '<=', $request->date_to);
        $data = $query->orderBy('tanggal', 'desc')->get();

        $pdf = Pdf::loadView('exports.safety-behavior-pdf', ['data' => $data]);
        $pdf->setPaper('a4', 'landscape');
        return $pdf->download('safety-behavior-' . now()->format('Y-m-d') . '.pdf');
    }

    public function safetyBehaviorSinglePdf($id)
    {
        $data = SafetyBehavior::with('user')->findOrFail($id);
        $pdf = Pdf::loadView('exports.safety-behavior-single-pdf', ['data' => $data]);
        $pdf->setPaper('a4', 'portrait');
        return $pdf->download('safety-behavior-' . $id . '.pdf');
    }
}
