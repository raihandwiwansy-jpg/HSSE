<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('gwp_permits', function (Blueprint $table) {
            $table->string('berdasarkan_jsa')->nullable()->after('kategori_risiko');
            $table->json('daftar_keselamatan_pemohon')->nullable()->after('berdasarkan_jsa');
            $table->json('daftar_keselamatan_hse')->nullable()->after('daftar_keselamatan_pemohon');
            $table->json('ppe_checklist')->nullable()->after('daftar_keselamatan_hse');
            $table->json('validasi_shift')->nullable()->after('ppe_checklist');
        });
    }

    public function down(): void
    {
        Schema::table('gwp_permits', function (Blueprint $table) {
            $table->dropColumn([
                'berdasarkan_jsa',
                'daftar_keselamatan_pemohon',
                'daftar_keselamatan_hse',
                'ppe_checklist',
                'validasi_shift',
            ]);
        });
    }
};
