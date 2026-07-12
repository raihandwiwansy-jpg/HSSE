<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WhpPermit extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'tanggal',
        'lokasi',
        'deskripsi_pekerjaan',
        'waktu_mulai',
        'waktu_selesai',
        'peralatan',
        'status',
        'catatan',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
