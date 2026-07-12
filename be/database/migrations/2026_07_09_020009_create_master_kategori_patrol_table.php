<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMasterKategoriPatrolTable extends Migration
{
    public function up()
    {
        Schema::create('master_kategori_patrol', function (Blueprint $table) {
            $table->id();
            $table->string('nama');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('master_kategori_patrol');
    }
}
