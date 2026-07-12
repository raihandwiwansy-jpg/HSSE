<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateInsidensTable extends Migration
{
    public function up()
    {
        Schema::create('insidens', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('judul');
            $table->string('jenis');
            $table->string('lokasi');
            $table->date('tanggal_kejadian');
            $table->text('deskripsi');
            $table->string('foto')->nullable();
            $table->string('status')->default('pending');
            $table->softDeletes();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('insidens');
    }
}
