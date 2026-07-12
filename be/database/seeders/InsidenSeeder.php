<?php

namespace Database\Seeders;

use App\Models\Insiden;
use App\Models\User;
use Illuminate\Database\Seeder;

class InsidenSeeder extends Seeder
{
    public function run()
    {
        $users = User::all();

        Insiden::factory(30)->make()->each(function ($insiden) use ($users) {
            $insiden->user_id = $users->random()->id;
            $insiden->save();
        });
    }
}
