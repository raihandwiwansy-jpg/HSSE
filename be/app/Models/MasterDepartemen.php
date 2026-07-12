<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MasterDepartemen extends Model
{
    protected $table = 'master_departemen';
    
    protected $fillable = ['nama', 'is_active'];
    
    protected $casts = ['is_active' => 'boolean'];
}
