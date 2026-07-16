<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('hwp_permits', function (Blueprint $table) {
            $table->foreignId('gwp_permit_id')->nullable()->after('user_id')->constrained()->nullOnDelete();
            $table->text('apd_digunakan')->nullable()->after('pencegahan');
            $table->text('catatan_reject')->nullable()->after('catatan');
            $table->timestamp('submitted_at')->nullable()->after('status');
            $table->timestamp('approved_at')->nullable()->after('submitted_at');
            $table->timestamp('completed_at')->nullable()->after('approved_at');
        });
    }

    public function down(): void
    {
        Schema::table('hwp_permits', function (Blueprint $table) {
            $table->dropColumn([
                'gwp_permit_id',
                'apd_digunakan',
                'catatan_reject',
                'submitted_at',
                'approved_at',
                'completed_at',
            ]);
        });
    }
};
