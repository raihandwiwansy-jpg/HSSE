<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMonthlyManHoursTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('monthly_man_hours', function (Blueprint $table) {
            $table->id();
            $table->string('tahun');
            $table->string('bulan'); // e.g. 'Januari', 'Februari', etc.
            
            $table->integer('manpower_inl')->default(0);
            $table->integer('manpower_kontraktor')->default(0);
            $table->integer('manpower_outsourcing')->default(0);
            
            $table->decimal('normal_jam_inl', 10, 2)->default(0);
            $table->decimal('normal_jam_kontraktor', 10, 2)->default(0);
            $table->decimal('normal_jam_outsourcing', 10, 2)->default(0);
            
            $table->decimal('overtime_inl', 10, 2)->default(0);
            $table->decimal('overtime_kontraktor', 10, 2)->default(0);
            $table->decimal('overtime_outsourcing', 10, 2)->default(0);
            
            $table->decimal('cuti_sakit', 10, 2)->default(0); // in hours probably
            
            $table->foreignId('created_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamps();
            
            // Ensure unique year-month combination
            $table->unique(['tahun', 'bulan']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('monthly_man_hours');
    }
}
