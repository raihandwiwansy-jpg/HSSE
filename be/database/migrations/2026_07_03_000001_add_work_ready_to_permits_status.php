<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;

return new class extends Migration
{
    public function up()
    {
        DB::statement("ALTER TABLE permits MODIFY COLUMN status ENUM('draft','submitted','supervisor_approved','supervisor_rejected','hse_approved','hse_rejected','work_ready','completed') NOT NULL DEFAULT 'draft'");

        if (!Schema::hasColumn('permits', 'work_ready_at')) {
            Schema::table('permits', function (Blueprint $table) {
                $table->timestamp('work_ready_at')->nullable()->after('hse_rejected_at');
            });
        }
    }

    public function down()
    {
        DB::statement("ALTER TABLE permits MODIFY COLUMN status ENUM('draft','submitted','supervisor_approved','supervisor_rejected','hse_approved','hse_rejected','completed') NOT NULL DEFAULT 'draft'");

        if (Schema::hasColumn('permits', 'work_ready_at')) {
            Schema::table('permits', function (Blueprint $table) {
                $table->dropColumn('work_ready_at');
            });
        }
    }
};
