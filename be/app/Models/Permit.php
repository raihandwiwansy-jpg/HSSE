<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Permit extends Model
{
    use HasFactory;

    const STATUS_DRAFT = 'draft';
    const STATUS_SUBMITTED = 'submitted';
    const STATUS_SUPERVISOR_APPROVED = 'supervisor_approved';
    const STATUS_SUPERVISOR_REJECTED = 'supervisor_rejected';
    const STATUS_HSE_APPROVED = 'hse_approved';
    const STATUS_HSE_REJECTED = 'hse_rejected';
    const STATUS_WORK_READY = 'work_ready';
    const STATUS_COMPLETED = 'completed';

    const STATUS_MAP = [
        self::STATUS_DRAFT => 'Draft',
        self::STATUS_SUBMITTED => 'Submitted',
        self::STATUS_SUPERVISOR_APPROVED => 'Disetujui Supervisor',
        self::STATUS_SUPERVISOR_REJECTED => 'Ditolak Supervisor',
        self::STATUS_HSE_APPROVED => 'Disetujui HSE',
        self::STATUS_HSE_REJECTED => 'Ditolak HSE',
        self::STATUS_WORK_READY => 'Siap Dikerjakan',
        self::STATUS_COMPLETED => 'Selesai',
    ];

    const STATUS_COLOR = [
        self::STATUS_DRAFT => 'gray',
        self::STATUS_SUBMITTED => 'yellow',
        self::STATUS_SUPERVISOR_APPROVED => 'blue',
        self::STATUS_SUPERVISOR_REJECTED => 'red',
        self::STATUS_HSE_APPROVED => 'green',
        self::STATUS_HSE_REJECTED => 'red',
        self::STATUS_WORK_READY => 'purple',
        self::STATUS_COMPLETED => 'emerald',
    ];

    const JENIS_MAP = [
        'gwp' => 'General Work Permit',
        'hwp' => 'Hot Work Permit',
        'cse' => 'Confined Space Entry',
        'elp' => 'Electrical Work Permit',
        'ewp' => 'Excavation Work Permit',
        'lwp' => 'Lifting Work Permit',
        'rwp' => 'Radiography Work Permit',
        'whp' => 'Work at Height Permit',
    ];

    const JENIS_ICONS = [
        'gwp' => '📄',
        'hwp' => '🔥',
        'cse' => '🚪',
        'elp' => '⚡',
        'ewp' => '🏗️',
        'lwp' => '🏗️',
        'rwp' => '☢️',
        'whp' => '📏',
    ];

    const JENIS_DOKUMEN = [
        'gwp' => 'FM-BSHS-19/01',
        'hwp' => 'FM-BSHS-19/03',
        'cse' => 'FM-BSHS-19/02',
        'elp' => 'FM-BSHS-19/05',
        'ewp' => 'FM-BSHS-19/06',
        'lwp' => 'FM-BSHS-19/07',
        'rwp' => 'FM-BSHS-19/08',
        'whp' => 'FM-BSHS-19/04',
    ];

    protected $fillable = [
        'user_id',
        'permit_number',
        'jenis',
        'judul',
        'lokasi',
        'deskripsi',
        'tanggal',
        'pukul_mulai',
        'pukul_selesai',
        'departemen',
        'status',
        'jsa_id',
        'catatan',
        'catatan_reject',
        'submitted_at',
        'supervisor_approved_at',
        'supervisor_rejected_at',
        'hse_approved_at',
        'hse_rejected_at',
        'work_ready_at',
        'completed_at',
        'completion_data',
    ];

    protected $casts = [
        'submitted_at' => 'datetime',
        'supervisor_approved_at' => 'datetime',
        'supervisor_rejected_at' => 'datetime',
        'hse_approved_at' => 'datetime',
        'hse_rejected_at' => 'datetime',
        'work_ready_at' => 'datetime',
        'completed_at' => 'datetime',
        'completion_data' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function jsa()
    {
        return $this->belongsTo(Jsa::class);
    }

    public function detail()
    {
        return $this->hasOne(PermitDetail::class);
    }

    public static function generatePermitNumber(string $jenis): string
    {
        $prefix = 'PT/INL/' . strtoupper($jenis);
        $lastPermit = self::where('jenis', $jenis)
            ->orderBy('id', 'desc')
            ->first();

        if ($lastPermit) {
            $parts = explode('/', $lastPermit->permit_number);
            $lastNumber = (int) end($parts);
            $newNumber = $lastNumber + 1;
        } else {
            $newNumber = 1;
        }

        $digits = max(3, strlen((string) $newNumber));
        return $prefix . '/' . str_pad($newNumber, $digits, '0', STR_PAD_LEFT);
    }

    public function isDraft(): bool
    {
        return $this->status === self::STATUS_DRAFT;
    }

    public function isSubmitted(): bool
    {
        return $this->status === self::STATUS_SUBMITTED;
    }

    public function isSupervisorApproved(): bool
    {
        return $this->status === self::STATUS_SUPERVISOR_APPROVED;
    }

    public function isSupervisorRejected(): bool
    {
        return $this->status === self::STATUS_SUPERVISOR_REJECTED;
    }

    public function isHseApproved(): bool
    {
        return $this->status === self::STATUS_HSE_APPROVED;
    }

    public function isHseRejected(): bool
    {
        return $this->status === self::STATUS_HSE_REJECTED;
    }

    public function isCompleted(): bool
    {
        return $this->status === self::STATUS_COMPLETED;
    }

    public function canBeSubmitted(): bool
    {
        return in_array($this->status, [
            self::STATUS_DRAFT,
            self::STATUS_SUPERVISOR_REJECTED,
            self::STATUS_HSE_REJECTED,
        ]);
    }

    public function canBeSupervisorAction(): bool
    {
        return $this->status === self::STATUS_SUBMITTED;
    }

    public function canBeHseAction(): bool
    {
        return $this->status === self::STATUS_SUPERVISOR_APPROVED;
    }

    public function canBeWorkReady(): bool
    {
        return $this->status === self::STATUS_HSE_APPROVED;
    }

    public function canBeCompleted(): bool
    {
        return $this->status === self::STATUS_WORK_READY;
    }

    public function getJenisLabelAttribute(): string
    {
        return self::JENIS_MAP[$this->jenis] ?? $this->jenis;
    }

    public function getJenisIconAttribute(): string
    {
        return self::JENIS_ICONS[$this->jenis] ?? '📋';
    }

    public function getStatusLabelAttribute(): string
    {
        return self::STATUS_MAP[$this->status] ?? $this->status;
    }

    public function getDetailDataAttribute()
    {
        return $this->detail?->detail_data ?? [];
    }
}
