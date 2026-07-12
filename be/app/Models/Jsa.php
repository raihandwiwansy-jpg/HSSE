<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Jsa extends Model
{
    use HasFactory;

    protected $table = 'jsa';

    protected $fillable = [
        'user_id',
        'departemen',
        'tanggal',
        'kegiatan',
        'lokasi',
        'tahapan',
    ];

    protected $casts = [
        'tahapan' => 'array',
    ];

    // Relations
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
