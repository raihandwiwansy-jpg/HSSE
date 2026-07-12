<?php

namespace Database\Seeders;

use App\Models\Jsa;
use App\Models\User;
use Illuminate\Database\Seeder;

class JsaSeeder extends Seeder
{
    public function run()
    {
        $users = User::all();

        Jsa::factory(10)->make()->each(function ($jsa) use ($users) {
            $jsa->user_id = $users->random()->id;
            $jsa->save();
        });
    }
}
