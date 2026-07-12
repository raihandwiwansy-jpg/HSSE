<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMasterDepartemenTable extends Migration
{
    public function up()
    {
        Schema::create('master_departemen', function (Blueprint $table) {
            $table->id();
            $table->string('nama')->unique();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('master_departemen');
    }
}
