<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateHseKpiPerformancesTable extends Migration
{
    public function up()
    {
        Schema::create('hse_kpi_performances', function (Blueprint $table) {
            $table->id();
            $table->date('period_start');
            $table->date('period_end');
            $table->string('week_name');

            // Lagging Indicators
            $table->integer('fatality')->default(0);
            $table->integer('lti')->default(0);
            $table->integer('rwdc')->default(0);
            $table->integer('mtc')->default(0);
            $table->integer('fac')->default(0);
            $table->integer('near_miss')->default(0);
            $table->integer('environmental_incident')->default(0);
            $table->integer('property_damage')->default(0);
            $table->integer('customer_formal_complaint')->default(0);

            // Leading Indicators
            $table->integer('hse_management_visit')->default(0);
            $table->integer('hse_joint_safety_patrol')->default(0);
            $table->integer('behavior_based_safe')->default(0);
            $table->integer('emergency_drill')->default(0);
            $table->integer('equipment_inspection')->default(0);
            $table->integer('hse_toolbox_meeting')->default(0);
            $table->integer('hse_meeting')->default(0);
            $table->integer('general_safety_talk')->default(0);
            $table->integer('safety_stand_down_meeting')->default(0);
            $table->integer('installation_of_safety_banner')->default(0);
            $table->integer('reward')->default(0);
            $table->integer('punishment')->default(0);
            $table->integer('campaign_bulan_k3_nasional')->default(0);
            $table->integer('hse_induction')->default(0);
            $table->integer('hse_training')->default(0);
            $table->integer('audit_program_internal')->default(0);
            $table->integer('audit_program_eksternal')->default(0);

            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('hse_kpi_performances');
    }
}
