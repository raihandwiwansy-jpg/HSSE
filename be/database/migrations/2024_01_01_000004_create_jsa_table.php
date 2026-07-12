<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateJsaTable extends Migration
{
    public function up()
    {
        Schema::create('jsa', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('departemen');
            $table->date('tanggal');
            $table->string('kegiatan');
            $table->string('lokasi');
            $table->json('tahapan');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('jsa');
    }
}
