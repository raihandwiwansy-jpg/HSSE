<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MasterKategoriPerilaku extends Model
{
    protected $table = 'master_kategori_perilaku';
    
    protected $fillable = ['nama', 'tipe', 'is_active'];
    
    protected $casts = ['is_active' => 'boolean'];
}
