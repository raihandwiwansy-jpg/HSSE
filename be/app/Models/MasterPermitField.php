<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MasterPermitField extends Model
{
    protected $table = 'master_permit_fields';
    
    protected $fillable = [
        'permit_type', 'field_name', 'field_label', 'field_type',
        'source_master', 'is_required', 'is_locked', 'urutan', 'is_active'
    ];
    
    protected $casts = [
        'is_required' => 'boolean',
        'is_locked' => 'boolean',
        'is_active' => 'boolean',
        'urutan' => 'integer',
    ];
}
