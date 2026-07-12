<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('whp_permits', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->date('tanggal');
            $table->string('lokasi');
            $table->text('deskripsi_pekerjaan');
            $table->time('waktu_mulai');
            $table->time('waktu_selesai');
            $table->text('peralatan');
            $table->string('status')->default('draft');
            $table->text('catatan')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('whp_permits');
    }
};
