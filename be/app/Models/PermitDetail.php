<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PermitDetail extends Model
{
    use HasFactory;

    protected $fillable = [
        'permit_id',
        'detail_data',
    ];

    protected $casts = [
        'detail_data' => 'array',
    ];

    public function permit()
    {
        return $this->belongsTo(Permit::class);
    }
}
