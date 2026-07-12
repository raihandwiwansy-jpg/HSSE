<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ElpPermit extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'tanggal',
        'shift',
        'alat_diisolasi',
        'tag_no',
        'tipe_isolasi',
        'status',
        'catatan',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
