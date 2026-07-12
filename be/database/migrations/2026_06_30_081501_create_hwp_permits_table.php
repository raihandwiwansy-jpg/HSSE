<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('hwp_permits', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->date('tanggal');
            $table->string('shift');
            $table->string('lokasi');
            $table->text('deskripsi');
            $table->time('jam_mulai');
            $table->time('jam_selesai');
            $table->text('bahaya_terkait');
            $table->text('pencegahan');
            $table->string('status')->default('draft');
            $table->text('catatan')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('hwp_permits');
    }
};
