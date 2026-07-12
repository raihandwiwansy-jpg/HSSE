<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MasterPerusahaan extends Model
{
    protected $table = 'master_perusahaan';
    
    protected $fillable = ['nama', 'alamat', 'telepon', 'is_active'];
    
    protected $casts = ['is_active' => 'boolean'];
}
