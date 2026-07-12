<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MasterChecklist extends Model
{
    protected $table = 'master_checklist';
    
    protected $fillable = ['permit_type', 'kategori', 'item', 'is_active'];
    
    protected $casts = ['is_active' => 'boolean'];
}
