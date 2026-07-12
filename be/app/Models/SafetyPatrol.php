<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SafetyPatrol extends Model
{
    use HasFactory;

    const STATUS_MENUNGGU = 'menunggu';
    const STATUS_SELESAI = 'selesai';

    const STATUS_MAP = [
        self::STATUS_MENUNGGU => 'Menunggu Konfirmasi Admin',
        self::STATUS_SELESAI => 'Selesai',
    ];

    const STATUS_COLOR = [
        self::STATUS_MENUNGGU => 'yellow',
        self::STATUS_SELESAI => 'green',
    ];

    protected $fillable = [
        'user_id',
        'tanggal',
        'waktu',
        'lokasi',
        'observer',
        'auditee',
        'leader',
        'observation_data',
        'tindakan_perbaikan',
        'due_date',
        'foto',
        'catatan',
        'status',
        'submitted_at',
        'reviewed_at',
    ];

    protected $casts = [
        'tanggal' => 'date',
        'waktu' => 'string',
        'due_date' => 'date',
        'observation_data' => 'array',
        'foto' => 'array',
        'submitted_at' => 'datetime',
        'reviewed_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function getStatusLabelAttribute(): string
    {
        return self::STATUS_MAP[$this->status] ?? $this->status;
    }

    public function isMenunggu(): bool
    {
        return $this->status === self::STATUS_MENUNGGU;
    }

    public function isSelesai(): bool
    {
        return $this->status === self::STATUS_SELESAI;
    }

    public function canBeConfirmed(): bool
    {
        return $this->status === self::STATUS_MENUNGGU;
    }
}
