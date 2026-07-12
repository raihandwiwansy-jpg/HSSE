<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HseKpiPerformance extends Model
{
    protected $fillable = [
        'period_start',
        'period_end',
        'week_name',
        'fatality',
        'lti',
        'rwdc',
        'mtc',
        'fac',
        'near_miss',
        'environmental_incident',
        'property_damage',
        'customer_formal_complaint',
        'hse_management_visit',
        'hse_joint_safety_patrol',
        'behavior_based_safe',
        'emergency_drill',
        'equipment_inspection',
        'hse_toolbox_meeting',
        'hse_meeting',
        'general_safety_talk',
        'safety_stand_down_meeting',
        'installation_of_safety_banner',
        'reward',
        'punishment',
        'campaign_bulan_k3_nasional',
        'hse_induction',
        'hse_training',
        'audit_program_internal',
        'audit_program_eksternal',
        'user_id',
    ];

    protected $casts = [
        'period_start' => 'date',
        'period_end' => 'date',
        'fatality' => 'integer',
        'lti' => 'integer',
        'rwdc' => 'integer',
        'mtc' => 'integer',
        'fac' => 'integer',
        'near_miss' => 'integer',
        'environmental_incident' => 'integer',
        'property_damage' => 'integer',
        'customer_formal_complaint' => 'integer',
        'hse_management_visit' => 'integer',
        'hse_joint_safety_patrol' => 'integer',
        'behavior_based_safe' => 'integer',
        'emergency_drill' => 'integer',
        'equipment_inspection' => 'integer',
        'hse_toolbox_meeting' => 'integer',
        'hse_meeting' => 'integer',
        'general_safety_talk' => 'integer',
        'safety_stand_down_meeting' => 'integer',
        'installation_of_safety_banner' => 'integer',
        'reward' => 'integer',
        'punishment' => 'integer',
        'campaign_bulan_k3_nasional' => 'integer',
        'hse_induction' => 'integer',
        'hse_training' => 'integer',
        'audit_program_internal' => 'integer',
        'audit_program_eksternal' => 'integer',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
