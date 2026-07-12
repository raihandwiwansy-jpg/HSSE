<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Insiden extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'judul',
        'jenis',
        'lokasi',
        'tanggal_kejadian',
        'deskripsi',
        'foto',
        'status',
    ];

    // Relations
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
