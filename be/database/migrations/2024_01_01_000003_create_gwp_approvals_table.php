<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateGwpApprovalsTable extends Migration
{
    public function up()
    {
        Schema::create('gwp_approvals', function (Blueprint $table) {
            $table->id();
            $table->foreignId('gwp_permit_id')->constrained()->onDelete('cascade');
            $table->string('tipe');
            $table->string('nama');
            $table->date('tanggal')->nullable();
            $table->string('paraf')->nullable();
            $table->string('status')->default('pending');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('gwp_approvals');
    }
}
