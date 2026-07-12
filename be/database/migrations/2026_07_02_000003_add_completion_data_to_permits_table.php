<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('permits', function (Blueprint $table) {
            $table->json('completion_data')->nullable()->after('completed_at');
        });
    }

    public function down()
    {
        Schema::table('permits', function (Blueprint $table) {
            $table->dropColumn('completion_data');
        });
    }
};
