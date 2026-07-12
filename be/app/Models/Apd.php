<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Apd extends Model
{
    use HasFactory;

    protected $fillable = [
        'nama',
        'kode',
        'stok',
        'satuan',
        'tanggal_kadaluarsa',
        'status',
    ];
}
