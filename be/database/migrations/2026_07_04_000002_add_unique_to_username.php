<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

class AddUniqueToUsername extends Migration
{
    public function up()
    {
        // Set default username from email for existing users that have null/empty username
        DB::statement("UPDATE users SET username = SUBSTRING_INDEX(email, '@', 1) WHERE username IS NULL OR username = ''");

        // Add unique constraint directly
        DB::statement("ALTER TABLE users ADD UNIQUE INDEX users_username_unique (username)");
    }

    public function down()
    {
        DB::statement("ALTER TABLE users DROP INDEX users_username_unique");
    }
}
