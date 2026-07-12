<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MasterShift extends Model
{
    protected $table = 'master_shift';
    
    protected $fillable = ['nama', 'jam_mulai', 'jam_selesai', 'is_active'];
    
    protected $casts = ['is_active' => 'boolean'];
}
