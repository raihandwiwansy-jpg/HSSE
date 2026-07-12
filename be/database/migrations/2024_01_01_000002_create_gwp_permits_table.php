<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateGwpPermitsTable extends Migration
{
    public function up()
    {
        Schema::create('gwp_permits', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->date('tanggal');
            $table->time('pukul_mulai');
            $table->time('pukul_selesai');
            $table->string('departemen');
            $table->string('lokasi');
            $table->text('deskripsi_pekerjaan');
            $table->text('peralatan');
            $table->string('kategori_risiko')->default('rendah');
            $table->string('status')->default('draft');
            $table->text('catatan_hse')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('gwp_permits');
    }
}
