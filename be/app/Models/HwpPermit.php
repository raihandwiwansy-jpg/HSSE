<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HwpPermit extends Model
{
    use HasFactory;

    const STATUS_DRAFT = 'draft';
    const STATUS_SUBMITTED = 'submitted';
    const STATUS_APPROVED = 'approved';
    const STATUS_REJECTED = 'rejected';
    const STATUS_COMPLETED = 'completed';

    const STATUS_MAP = [
        self::STATUS_DRAFT => 'Draft',
        self::STATUS_SUBMITTED => 'Submitted',
        self::STATUS_APPROVED => 'Approved',
        self::STATUS_REJECTED => 'Rejected',
        self::STATUS_COMPLETED => 'Completed',
    ];

    protected $fillable = [
        'user_id',
        'gwp_permit_id',
        'tanggal',
        'shift',
        'lokasi',
        'deskripsi',
        'jam_mulai',
        'jam_selesai',
        'bahaya_terkait',
        'pencegahan',
        'apd_digunakan',
        'status',
        'catatan',
        'catatan_reject',
        'submitted_at',
        'approved_at',
        'completed_at',
    ];

    protected $casts = [
        'submitted_at' => 'datetime',
        'approved_at' => 'datetime',
        'completed_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function gwpPermit()
    {
        return $this->belongsTo(GwpPermit::class);
    }

    public function approvals()
    {
        return $this->hasMany(HwpApproval::class);
    }

    public function canBeSubmitted(): bool
    {
        return $this->status === self::STATUS_DRAFT;
    }

    public function canBeApprovedOrRejected(): bool
    {
        return $this->status === self::STATUS_SUBMITTED;
    }

    public function canBeCompleted(): bool
    {
        return $this->status === self::STATUS_APPROVED;
    }
}
