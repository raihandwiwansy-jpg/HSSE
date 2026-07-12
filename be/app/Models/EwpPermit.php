<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EwpPermit extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'tanggal',
        'lokasi',
        'panjang',
        'lebar',
        'kedalaman',
        'peralatan',
        'status',
        'catatan',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
