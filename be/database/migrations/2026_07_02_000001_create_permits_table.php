<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('permits', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('permit_number')->unique();
            $table->enum('jenis', ['gwp', 'hwp', 'cse', 'elp', 'ewp', 'lwp', 'rwp', 'whp']);
            $table->string('judul');
            $table->string('lokasi');
            $table->text('deskripsi')->nullable();
            $table->date('tanggal');
            $table->time('pukul_mulai')->nullable();
            $table->time('pukul_selesai')->nullable();
            $table->string('departemen')->nullable();
            $table->enum('status', [
                'draft',
                'submitted',
                'supervisor_approved',
                'supervisor_rejected',
                'hse_approved',
                'hse_rejected',
                'work_ready',
                'completed',
            ])->default('draft');
            $table->foreignId('jsa_id')->nullable()->constrained('jsa')->nullOnDelete();
            $table->text('catatan')->nullable();
            $table->text('catatan_reject')->nullable();
            $table->timestamp('submitted_at')->nullable();
            $table->timestamp('supervisor_approved_at')->nullable();
            $table->timestamp('supervisor_rejected_at')->nullable();
            $table->timestamp('hse_approved_at')->nullable();
            $table->timestamp('hse_rejected_at')->nullable();
            $table->timestamp('work_ready_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('permits');
    }
};
