<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LwpPermit extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'tanggal',
        'lokasi',
        'pekerjaan',
        'beban_total',
        'kapasitas_crane',
        'status',
        'catatan',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
