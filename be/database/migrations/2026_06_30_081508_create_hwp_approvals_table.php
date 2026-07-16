<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('hwp_approvals', function (Blueprint $table) {
            $table->id();
            $table->foreignId('hwp_permit_id')->constrained()->onDelete('cascade');
            $table->string('tipe');
            $table->string('nama');
            $table->string('jabatan')->nullable();
            $table->timestamp('tanggal')->nullable();
            $table->string('paraf')->nullable();
            $table->string('status')->default('pending');
            $table->text('catatan')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('hwp_approvals');
    }
};
