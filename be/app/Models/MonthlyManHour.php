<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MonthlyManHour extends Model
{
    protected $table = 'monthly_man_hours';

    protected $fillable = [
        'tahun',
        'bulan',
        'manpower_inl',
        'manpower_kontraktor',
        'manpower_outsourcing',
        'normal_jam_inl',
        'normal_jam_kontraktor',
        'normal_jam_outsourcing',
        'overtime_inl',
        'overtime_kontraktor',
        'overtime_outsourcing',
        'cuti_sakit',
        'created_by',
    ];

    protected $casts = [
        'manpower_inl' => 'integer',
        'manpower_kontraktor' => 'integer',
        'manpower_outsourcing' => 'integer',
        'normal_jam_inl' => 'float',
        'normal_jam_kontraktor' => 'float',
        'normal_jam_outsourcing' => 'float',
        'overtime_inl' => 'float',
        'overtime_kontraktor' => 'float',
        'overtime_outsourcing' => 'float',
        'cuti_sakit' => 'float',
    ];

    protected $appends = [
        'total_manpower',
        'total_normal_jam',
        'total_overtime',
        'total_jam_kerja',
        'jam_kerja_aman'
    ];

    public function getTotalManpowerAttribute()
    {
        return $this->manpower_inl + $this->manpower_kontraktor + $this->manpower_outsourcing;
    }

    public function getTotalNormalJamAttribute()
    {
        return $this->normal_jam_inl + $this->normal_jam_kontraktor + $this->normal_jam_outsourcing;
    }

    public function getTotalOvertimeAttribute()
    {
        return $this->overtime_inl + $this->overtime_kontraktor + $this->overtime_outsourcing;
    }

    public function getTotalJamKerjaAttribute()
    {
        return $this->total_normal_jam + $this->total_overtime;
    }

    public function getJamKerjaAmanAttribute()
    {
        return $this->total_jam_kerja - $this->cuti_sakit;
    }

    /**
     * Get the user who created this record.
     */
    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
