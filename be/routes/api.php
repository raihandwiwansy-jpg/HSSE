<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\InsidenController;
use App\Http\Controllers\GwpController;
use App\Http\Controllers\JsaController;
use App\Http\Controllers\ApdController;
use App\Http\Controllers\KaryawanController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ExportController;
use App\Http\Controllers\CseController;
use App\Http\Controllers\HwpController;
use App\Http\Controllers\WhpController;
use App\Http\Controllers\ElpController;
use App\Http\Controllers\EwpController;
use App\Http\Controllers\LwpController;
use App\Http\Controllers\RwpController;
use App\Http\Controllers\PermitController;
use App\Http\Controllers\SafetyPatrolController;
use App\Http\Controllers\SafetyBehaviorController;
use App\Http\Controllers\UserManagementController;
use App\Http\Controllers\HseKpiController;
use App\Http\Controllers\LocationController;
use App\Http\Controllers\SettingController;
use App\Http\Controllers\MasterDataController;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/verify-otp', [AuthController::class, 'verifyOtp']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
    Route::get('/user/profile', [AuthController::class, 'profile']);
    Route::put('/user/profile', [AuthController::class, 'updateProfile']);
    Route::post('/user/avatar', [AuthController::class, 'uploadAvatar']);
    Route::post('/change-password', [AuthController::class, 'changePassword']);
    Route::post('/change-email', [AuthController::class, 'changeEmail']);
    Route::post('/user/update-profile-photo', [AuthController::class, 'updateProfilePhoto']);
    Route::post('/toggle-otp-forgot', [AuthController::class, 'toggleOtpForgot']);

    // Dashboard
    Route::get('/dashboard/summary', [DashboardController::class, 'summary']);
    Route::get('/dashboard/stats', [DashboardController::class, 'stats']);
    Route::get('/dashboard/chart', [DashboardController::class, 'chart']);
    Route::get('/dashboard/performance-board', [DashboardController::class, 'performanceBoard']);

    // Master Data
    Route::get('/master-data/seed', [MasterDataController::class, 'seedDefaults']);
    Route::get('/master-data/{type}', [MasterDataController::class, 'index']);
    Route::get('/master-data/{type}/{id}', [MasterDataController::class, 'show']);
    Route::get('/master-fields', [MasterDataController::class, 'indexFields']);
    
    // Master Permit Fields (admin only)
    Route::middleware('role:admin')->group(function () {
        Route::post('/master-fields', [MasterDataController::class, 'storeField']);
        Route::put('/master-fields/{id}', [MasterDataController::class, 'updateField']);
        Route::delete('/master-fields/{id}', [MasterDataController::class, 'destroyField']);
        
        // Master Data CRUD (admin only)
        Route::post('/master-data/{type}', [MasterDataController::class, 'store']);
        Route::put('/master-data/{type}/{id}', [MasterDataController::class, 'update']);
        Route::delete('/master-data/{type}/{id}', [MasterDataController::class, 'destroy']);
    });
    
    // Legacy settings & locations
    Route::get('/settings', [SettingController::class, 'index']);
    Route::middleware('role:admin')->group(function () {
        Route::post('/settings', [SettingController::class, 'store']);
    });

    // User Management (admin only)
    Route::middleware('role:admin')->group(function () {
        Route::get('/users/roles', [UserManagementController::class, 'roles']);
        Route::apiResource('users', UserManagementController::class)->parameters(['users' => 'id']);
        Route::post('/users/import', [UserManagementController::class, 'import']);
        Route::post('/karyawan/import', [KaryawanController::class, 'import']);
        Route::post('/apd/import', [ApdController::class, 'import']);

        // HSE KPI Performance
        Route::get('/hse-kpi/entries', [HseKpiController::class, 'entries']);
        Route::apiResource('hse-kpi', HseKpiController::class)->parameters(['hse_kpi' => 'id']);

        // Admin Dashboard (comprehensive)
        Route::get('/admin/dashboard', [DashboardController::class, 'adminDashboard']);
    });

    // Insiden
    Route::apiResource('insiden', InsidenController::class);
    Route::patch('insiden/{id}/status', [InsidenController::class, 'updateStatus']);

    // GWP
    Route::apiResource('gwp', GwpController::class);
    Route::patch('gwp/{id}/status', [GwpController::class, 'updateStatus']);
    Route::post('gwp/{id}/submit', [GwpController::class, 'submit']);
    Route::middleware('role:admin,superadmin')->group(function () {
        Route::post('gwp/{id}/approve', [GwpController::class, 'approve']);
        Route::post('gwp/{id}/reject', [GwpController::class, 'reject']);
    });
    Route::middleware('role:supervisor')->group(function () {
        Route::post('gwp/{id}/complete', [GwpController::class, 'complete']);
    });
    Route::post('gwp/{permitId}/approvals/{approvalId}', [GwpController::class, 'updateApproval']);

    // JSA
    Route::apiResource('jsa', JsaController::class);

    // APD
    Route::apiResource('apd', ApdController::class);
    Route::get('apd-kadaluarsa', [ApdController::class, 'kadaluarsa']);

    // Karyawan
    Route::apiResource('karyawan', KaryawanController::class);

    // CSE
    Route::apiResource('cse', CseController::class);
    Route::patch('cse/{id}/status', [CseController::class, 'updateStatus']);

    // HWP
    Route::apiResource('hwp', HwpController::class);
    Route::patch('hwp/{id}/status', [HwpController::class, 'updateStatus']);
    Route::post('hwp/{id}/submit', [HwpController::class, 'submit']);
    Route::middleware('role:admin,superadmin')->group(function () {
        Route::post('hwp/{id}/approve', [HwpController::class, 'approve']);
        Route::post('hwp/{id}/reject', [HwpController::class, 'reject']);
    });
    Route::middleware('role:admin,superadmin,supervisor')->group(function () {
        Route::post('hwp/{id}/complete', [HwpController::class, 'complete']);
    });
    Route::post('hwp/{permitId}/approvals/{approvalId}', [HwpController::class, 'updateApproval']);

    // WHP
    Route::apiResource('whp', WhpController::class);
    Route::patch('whp/{id}/status', [WhpController::class, 'updateStatus']);

    // ELP
    Route::apiResource('elp', ElpController::class);
    Route::patch('elp/{id}/status', [ElpController::class, 'updateStatus']);

    // EWP
    Route::apiResource('ewp', EwpController::class);
    Route::patch('ewp/{id}/status', [EwpController::class, 'updateStatus']);

    // LWP
    Route::apiResource('lwp', LwpController::class);
    Route::patch('lwp/{id}/status', [LwpController::class, 'updateStatus']);

    // RWP
    Route::apiResource('rwp', RwpController::class);
    Route::patch('rwp/{id}/status', [RwpController::class, 'updateStatus']);

    // ========================================
    // UNIFIED PERMIT SYSTEM
    // ========================================
    Route::get('permit/status-counts', [PermitController::class, 'statusCounts']);
    Route::get('permit/next-sequence', [PermitController::class, 'nextSequence']);
    Route::apiResource('permit', PermitController::class);
    Route::post('permit/{id}/submit', [PermitController::class, 'submit']);
    Route::middleware('role:supervisor')->group(function () {
        Route::post('permit/{id}/supervisor-approve', [PermitController::class, 'supervisorApprove']);
        Route::post('permit/{id}/supervisor-reject', [PermitController::class, 'supervisorReject']);
    });
    Route::middleware('role:admin')->group(function () {
        Route::post('permit/{id}/hse-approve', [PermitController::class, 'hseApprove']);
        Route::post('permit/{id}/hse-reject', [PermitController::class, 'hseReject']);
    });
    Route::post('permit/{id}/complete', [PermitController::class, 'complete']);
    Route::middleware('role:admin')->group(function () {
        Route::post('permit/{id}/confirm-complete', [PermitController::class, 'confirmComplete']);
    });

    // ========================================
    // SAFETY PATROL
    // ========================================
    Route::get('safety-patrol/status-counts', [SafetyPatrolController::class, 'statusCounts']);
    Route::apiResource('safety-patrol', SafetyPatrolController::class);
    Route::post('safety-patrol/{id}/submit', [SafetyPatrolController::class, 'submit']);
    Route::middleware('role:admin')->group(function () {
        Route::post('safety-patrol/{id}/review', [SafetyPatrolController::class, 'review']);
    });

    // ========================================
    // SAFETY BEHAVIOR OBSERVATION
    // ========================================
    Route::get('safety-behavior/status-counts', [SafetyBehaviorController::class, 'statusCounts']);
    Route::apiResource('safety-behavior', SafetyBehaviorController::class);
    Route::post('safety-behavior/{id}/submit', [SafetyBehaviorController::class, 'submit']);
    Route::middleware('role:admin')->group(function () {
        Route::post('safety-behavior/{id}/review', [SafetyBehaviorController::class, 'review']);
    });

    // ========================================
    // SAFETY PATROL & BEHAVIOR EXPORTS (admin only)
    // ========================================
    Route::middleware('role:admin')->group(function () {
        Route::get('export/safety-patrol-pdf', [ExportController::class, 'safetyPatrolPdf']);
        Route::get('export/safety-patrol-single/{id}', [ExportController::class, 'safetyPatrolSinglePdf']);
        Route::get('export/safety-behavior-pdf', [ExportController::class, 'safetyBehaviorPdf']);
        Route::get('export/safety-behavior-single/{id}', [ExportController::class, 'safetyBehaviorSinglePdf']);
    });

    // Export (hanya admin)
    Route::middleware('role:admin')->group(function () {
        Route::get('export/insiden-pdf', [ExportController::class, 'exportInsidenPDF']);
        Route::get('export/insiden-excel', [ExportController::class, 'exportInsidenExcel']);
        Route::get('export/insiden-single/{id}', [ExportController::class, 'insidenSinglePdf']);
        Route::get('export/gwp-pdf', [ExportController::class, 'exportGwpPDF']);
        Route::get('export/gwp-excel', [ExportController::class, 'exportGwpExcel']);
        Route::get('export/gwp-single/{id}', [ExportController::class, 'gwpSinglePdf']);
        Route::get('export/jsa-pdf', [ExportController::class, 'exportJsaPDF']);
        Route::get('export/jsa-excel', [ExportController::class, 'exportJsaExcel']);
        Route::get('export/jsa-single/{id}', [ExportController::class, 'jsaSinglePdf']);
        Route::get('export/apd-pdf', [ExportController::class, 'exportApdPDF']);
        Route::get('export/apd-excel', [ExportController::class, 'exportApdExcel']);
        Route::get('export/apd-single/{id}', [ExportController::class, 'apdSinglePdf']);
        Route::get('export/karyawan-pdf', [ExportController::class, 'karyawanPdf']);
        Route::get('export/karyawan-excel', [ExportController::class, 'karyawanExcel']);
        Route::get('export/karyawan-single/{id}', [ExportController::class, 'karyawanSinglePdf']);
        Route::get('export/cse-pdf', [ExportController::class, 'exportCsePDF']);
        Route::get('export/cse-excel', [ExportController::class, 'exportCseExcel']);
        Route::get('export/cse-single/{id}', [ExportController::class, 'cseSinglePdf']);
        Route::get('export/hwp-pdf', [ExportController::class, 'exportHwpPDF']);
        Route::get('export/hwp-excel', [ExportController::class, 'exportHwpExcel']);
        Route::get('export/hwp-single/{id}', [ExportController::class, 'hwpSinglePdf']);
        Route::get('export/whp-pdf', [ExportController::class, 'exportWhpPDF']);
        Route::get('export/whp-excel', [ExportController::class, 'exportWhpExcel']);
        Route::get('export/elp-pdf', [ExportController::class, 'exportElpPDF']);
        Route::get('export/elp-excel', [ExportController::class, 'exportElpExcel']);
        Route::get('export/ewp-pdf', [ExportController::class, 'exportEwpPDF']);
        Route::get('export/ewp-excel', [ExportController::class, 'exportEwpExcel']);
        Route::get('export/lwp-pdf', [ExportController::class, 'exportLwpPDF']);
        Route::get('export/lwp-excel', [ExportController::class, 'exportLwpExcel']);
        Route::get('export/rwp-pdf', [ExportController::class, 'exportRwpPDF']);
        Route::get('export/rwp-excel', [ExportController::class, 'exportRwpExcel']);
    });

    // User export - permit yang sudah selesai milik sendiri
    Route::get('export/permit-single/{id}', [ExportController::class, 'permitSinglePdf']);
});
