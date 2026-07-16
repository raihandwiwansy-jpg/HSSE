<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Seeding user Oka Aritonang
        User::updateOrCreate(
            ['email' => 'oka@inl.co.id'],
            [
                'name' => 'Oka Aritonang',
                'username' => 'oka',
                'password' => Hash::make('password'),
                'role' => 'kasubag',
                'departemen' => 'Sistem & IT'
            ]
        );
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        User::where('email', 'oka@inl.co.id')->delete();
    }
};
