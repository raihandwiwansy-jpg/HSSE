<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MasterPersonil extends Model
{
    protected $table = 'master_personil';
    
    protected $fillable = ['nama', 'jabatan', 'departemen_id', 'perusahaan_id', 'telepon', 'is_active'];
    
    protected $casts = ['is_active' => 'boolean'];
    
    public function departemen()
    {
        return $this->belongsTo(MasterDepartemen::class, 'departemen_id');
    }
    
    public function perusahaan()
    {
        return $this->belongsTo(MasterPerusahaan::class, 'perusahaan_id');
    }
}
