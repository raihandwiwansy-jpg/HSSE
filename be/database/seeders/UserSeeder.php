<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run()
    {
        User::firstOrCreate(
            ['email' => 'admin@hse.com'],
            [
                'username' => 'admin',
                'name' => 'Admin HSE',
                'password' => Hash::make('password'),
                'role' => 'admin',
                'no_hp' => '081234567890',
                'departemen' => 'HSE',
            ]
        );

        User::firstOrCreate(
            ['email' => 'user@hse.com'],
            [
                'username' => 'user',
                'name' => 'User Biasa',
                'password' => Hash::make('password'),
                'role' => 'user',
                'no_hp' => '081234567891',
                'departemen' => 'Produksi',
            ]
        );

        User::firstOrCreate(
            ['email' => 'supervisor@hse.com'],
            [
                'username' => 'supervisor',
                'name' => 'Supervisor',
                'password' => Hash::make('password'),
                'role' => 'supervisor',
                'no_hp' => '081234567892',
                'departemen' => 'Produksi',
            ]
        );

        User::firstOrCreate(
            ['email' => 'audit@hse.com'],
            [
                'username' => 'audit',
                'name' => 'Auditor HSE',
                'password' => Hash::make('password'),
                'role' => 'audit',
                'no_hp' => '081234567893',
                'departemen' => 'Audit',
            ]
        );

    }
}
