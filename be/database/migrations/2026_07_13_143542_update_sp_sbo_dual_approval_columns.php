<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('safety_patrols', function (Blueprint $table) {
            $table->enum('admin_status', ['pending', 'approved', 'rejected'])->default('pending');
            $table->enum('audit_status', ['pending', 'approved', 'rejected'])->default('pending');
        });

        Schema::table('safety_behavior', function (Blueprint $table) {
            $table->enum('admin_status', ['pending', 'approved', 'rejected'])->default('pending');
            $table->enum('audit_status', ['pending', 'approved', 'rejected'])->default('pending');
        });

        // Let's change the status column to reflect the overall state
        // It's currently 'menunggu' or 'selesai'. We can keep using those but map it logic-wise.
        // Actually, if we just keep status as 'menunggu' (pending) and 'selesai' (completed), we can just update it when both admin_status and audit_status are 'approved'.
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('safety_patrols', function (Blueprint $table) {
            $table->dropColumn(['admin_status', 'audit_status']);
        });

        Schema::table('safety_behavior', function (Blueprint $table) {
            $table->dropColumn(['admin_status', 'audit_status']);
        });
    }
};
