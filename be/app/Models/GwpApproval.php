<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GwpApproval extends Model
{
    use HasFactory;

    const TIPE_PEMOHON = 'pemohon';
    const TIPE_HSE = 'hse';
    const TIPE_SUPERVISOR = 'supervisor';

    const TIPE_MAP = [
        self::TIPE_PEMOHON => 'Pemohon Izin',
        self::TIPE_HSE => 'HSE (Pemberi Izin)',
        self::TIPE_SUPERVISOR => 'Supervisor (Pemilik Lokasi)',
    ];

    protected $fillable = [
        'gwp_permit_id',
        'tipe',
        'nama',
        'jabatan',
        'tanggal',
        'paraf',
        'status',
        'catatan',
    ];

    protected $casts = [
        'tanggal' => 'datetime',
    ];

    public function gwpPermit()
    {
        return $this->belongsTo(GwpPermit::class);
    }

    public function getTipeLabelAttribute(): string
    {
        return self::TIPE_MAP[$this->tipe] ?? $this->tipe;
    }
}
