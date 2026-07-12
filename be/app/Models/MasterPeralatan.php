<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MasterPeralatan extends Model
{
    protected $table = 'master_peralatan';
    
    protected $fillable = ['nama', 'tipe', 'spesifikasi', 'is_active'];
    
    protected $casts = ['is_active' => 'boolean'];
}
