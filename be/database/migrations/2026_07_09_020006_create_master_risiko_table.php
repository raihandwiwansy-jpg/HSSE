<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMasterRisikoTable extends Migration
{
    public function up()
    {
        Schema::create('master_risiko', function (Blueprint $table) {
            $table->id();
            $table->string('nama');
            $table->string('tingkat')->nullable();
            $table->text('deskripsi')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('master_risiko');
    }
}
