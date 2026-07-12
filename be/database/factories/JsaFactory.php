<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class JsaFactory extends Factory
{
    public function definition()
    {
        return [
            'user_id' => 1, // Will be overridden by seeder
            'departemen' => $this->faker->randomElement(['HSE', 'Produksi', 'Maintenance', 'Engineering']),
            'tanggal' => $this->faker->dateTimeBetween('-3 months', 'now'),
            'kegiatan' => $this->faker->sentence(3),
            'lokasi' => $this->faker->randomElement(['Area Produksi Gudang A', 'Workshop Maintenance', 'Lapangan Eksternal', 'Loading Dock']),
            'tahapan' => [
                [
                    'tahapan' => 'Persiapan Kerja',
                    'bahaya' => 'Jatuh',
                    'identifikasi' => 'Risiko terpeleset di area basah',
                    'peluang' => 'B',
                    'akibat' => '2',
                    'tingkat_risiko' => 3,
                    'pengendalian' => 'Gunakan sepatu safety',
                    'pic' => 'K3',
                    'supervisi' => 'Supervisor',
                ],
            ],
        ];
    }
}
