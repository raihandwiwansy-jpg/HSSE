<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMasterPersonilTable extends Migration
{
    public function up()
    {
        Schema::create('master_personil', function (Blueprint $table) {
            $table->id();
            $table->string('nama');
            $table->string('jabatan')->nullable();
            $table->unsignedBigInteger('departemen_id')->nullable();
            $table->unsignedBigInteger('perusahaan_id')->nullable();
            $table->string('telepon')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            
            $table->foreign('departemen_id')->references('id')->on('master_departemen')->onDelete('set null');
            $table->foreign('perusahaan_id')->references('id')->on('master_perusahaan')->onDelete('set null');
        });
    }

    public function down()
    {
        Schema::dropIfExists('master_personil');
    }
}
