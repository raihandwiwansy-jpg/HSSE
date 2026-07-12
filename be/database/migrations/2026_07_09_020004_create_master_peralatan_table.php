<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMasterPeralatanTable extends Migration
{
    public function up()
    {
        Schema::create('master_peralatan', function (Blueprint $table) {
            $table->id();
            $table->string('nama');
            $table->string('tipe')->nullable();
            $table->string('spesifikasi')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('master_peralatan');
    }
}
