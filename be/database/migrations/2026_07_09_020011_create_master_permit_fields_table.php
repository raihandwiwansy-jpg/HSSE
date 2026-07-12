<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMasterPermitFieldsTable extends Migration
{
    public function up()
    {
        Schema::create('master_permit_fields', function (Blueprint $table) {
            $table->id();
            $table->string('permit_type'); // gwp, hwp, cse, elp, ewp, lwp, rwp, whp, safety_patrol, safety_behavior
            $table->string('field_name');
            $table->string('field_label');
            $table->enum('field_type', ['text', 'dropdown', 'checkbox', 'date', 'textarea', 'number', 'radio'])->default('text');
            $table->string('source_master')->nullable(); // nama tabel master untuk dropdown
            $table->boolean('is_required')->default(false);
            $table->boolean('is_locked')->default(false);
            $table->integer('urutan')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            
            $table->unique(['permit_type', 'field_name']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('master_permit_fields');
    }
}
