<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateApdsTable extends Migration
{
    public function up()
    {
        Schema::create('apds', function (Blueprint $table) {
            $table->id();
            $table->string('nama');
            $table->string('kode')->unique();
            $table->integer('stok')->default(0);
            $table->string('satuan');
            $table->date('tanggal_kadaluarsa')->nullable();
            $table->string('status')->default('aktif');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('apds');
    }
}
