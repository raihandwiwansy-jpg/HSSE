<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('gwp_permits', function (Blueprint $table) {
            $table->enum('kategori_pekerjaan', ['cold_work', 'hot_work'])->default('cold_work')->after('kategori_risiko');
            $table->timestamp('submitted_at')->nullable()->after('status');
            $table->timestamp('approved_at')->nullable()->after('submitted_at');
            $table->timestamp('completed_at')->nullable()->after('approved_at');
            $table->text('catatan_reject')->nullable()->after('catatan_hse');
        });
    }

    public function down(): void
    {
        Schema::table('gwp_permits', function (Blueprint $table) {
            $table->dropColumn([
                'kategori_pekerjaan',
                'submitted_at',
                'approved_at',
                'completed_at',
                'catatan_reject',
            ]);
        });
    }
};
