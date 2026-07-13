<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ManHour extends Model
{
    protected $table = 'man_hours';

    protected $fillable = [
        'admin_id',
        'user_id',
        'judul_pekerjaan',
        'lokasi',
        'tanggal',
        'durasi_jam',
        'deskripsi',
        'status',
    ];

    protected $casts = [
        'durasi_jam' => 'float',
    ];

    /**
     * Get the admin who assigned the task.
     */
    public function admin()
    {
        return $this->belongsTo(User::class, 'admin_id');
    }

    /**
     * Get the user assigned to the task.
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
