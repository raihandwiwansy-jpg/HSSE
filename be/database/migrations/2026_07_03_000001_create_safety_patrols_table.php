<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('safety_patrols', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->date('tanggal');
            $table->time('waktu')->nullable();
            $table->string('lokasi');
            $table->string('observer')->nullable();
            $table->string('auditee')->nullable();
            $table->string('leader')->nullable();
            $table->json('observation_data')->nullable();
            $table->text('tindakan_perbaikan')->nullable();
            $table->date('due_date')->nullable();
            $table->json('foto')->nullable();
            $table->text('catatan')->nullable();
            $table->enum('status', ['menunggu', 'selesai'])->default('menunggu');
            $table->timestamp('submitted_at')->nullable();
            $table->timestamp('reviewed_at')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('safety_patrols');
    }
};
