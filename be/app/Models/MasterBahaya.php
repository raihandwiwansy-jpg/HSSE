<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MasterBahaya extends Model
{
    protected $table = 'master_bahaya';
    
    protected $fillable = ['nama', 'kategori', 'deskripsi', 'is_active'];
    
    protected $casts = ['is_active' => 'boolean'];
}
