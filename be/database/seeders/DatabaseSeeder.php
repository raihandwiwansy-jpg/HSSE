<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run()
    {
        $this->call([
            UserSeeder::class,
            // InsidenSeeder::class,
            // GwpPermitSeeder::class,
            // JsaSeeder::class,
            // ApdSeeder::class,
            // KaryawanSeeder::class,
        ]);
    }
}
