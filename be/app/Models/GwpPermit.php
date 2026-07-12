<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GwpPermit extends Model
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

    const KATEGORI_COLD_WORK = 'cold_work';
    const KATEGORI_HOT_WORK = 'hot_work';

    const KATEGORI_MAP = [
        self::KATEGORI_COLD_WORK => 'Kerja Dingin (Cold Work)',
        self::KATEGORI_HOT_WORK => 'Kerja Panas (Hot Work)',
    ];

    protected $fillable = [
        'user_id',
        'tanggal',
        'pukul_mulai',
        'pukul_selesai',
        'departemen',
        'lokasi',
        'deskripsi_pekerjaan',
        'peralatan',
        'kategori_risiko',
        'berdasarkan_jsa',
        'kategori_pekerjaan',
        'daftar_keselamatan_pemohon',
        'daftar_keselamatan_hse',
        'ppe_checklist',
        'validasi_shift',
        'status',
        'catatan_hse',
        'catatan_reject',
        'submitted_at',
        'approved_at',
        'completed_at',
    ];

    protected $casts = [
        'submitted_at' => 'datetime',
        'approved_at' => 'datetime',
        'completed_at' => 'datetime',
        'daftar_keselamatan_pemohon' => 'array',
        'daftar_keselamatan_hse' => 'array',
        'ppe_checklist' => 'array',
        'validasi_shift' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function approvals()
    {
        return $this->hasMany(GwpApproval::class);
    }

    public function isDraft(): bool
    {
        return $this->status === self::STATUS_DRAFT;
    }

    public function isSubmitted(): bool
    {
        return $this->status === self::STATUS_SUBMITTED;
    }

    public function isApproved(): bool
    {
        return $this->status === self::STATUS_APPROVED;
    }

    public function isRejected(): bool
    {
        return $this->status === self::STATUS_REJECTED;
    }

    public function isCompleted(): bool
    {
        return $this->status === self::STATUS_COMPLETED;
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

    public function isHotWork(): bool
    {
        return $this->kategori_pekerjaan === self::KATEGORI_HOT_WORK;
    }

    public function isColdWork(): bool
    {
        return $this->kategori_pekerjaan === self::KATEGORI_COLD_WORK;
    }

    public function getKategoriLabelAttribute(): string
    {
        return self::KATEGORI_MAP[$this->kategori_pekerjaan] ?? $this->kategori_pekerjaan;
    }
}
