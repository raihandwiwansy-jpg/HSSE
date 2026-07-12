<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CsePermit extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'tanggal',
        'supervisor',
        'fasilitas',
        'lokasi',
        'alasan',
        'jumlah_pekerja',
        'hasil_gas',
        'status',
        'catatan',
    ];

    protected $casts = [
        'hasil_gas' => 'array',
        'tanggal' => 'date',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
