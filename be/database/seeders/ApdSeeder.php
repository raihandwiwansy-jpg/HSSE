<?php

namespace Database\Seeders;

use App\Models\Apd;
use Illuminate\Database\Seeder;

class ApdSeeder extends Seeder
{
    public function run()
    {
        Apd::factory(15)->create();
    }
}
