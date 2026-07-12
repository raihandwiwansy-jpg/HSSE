<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MasterRisiko extends Model
{
    protected $table = 'master_risiko';
    
    protected $fillable = ['nama', 'tingkat', 'deskripsi', 'is_active'];
    
    protected $casts = ['is_active' => 'boolean'];
}
