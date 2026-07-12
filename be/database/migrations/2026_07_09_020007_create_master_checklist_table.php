<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMasterChecklistTable extends Migration
{
    public function up()
    {
        Schema::create('master_checklist', function (Blueprint $table) {
            $table->id();
            $table->string('permit_type')->nullable();
            $table->string('kategori');
            $table->string('item');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('master_checklist');
    }
}
