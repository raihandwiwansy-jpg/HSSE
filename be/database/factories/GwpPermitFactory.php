<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class GwpPermitFactory extends Factory
{
    public function definition()
    {
        return [
            'user_id' => 1, // Will be overridden by seeder
            'tanggal' => $this->faker->dateTimeBetween('-3 months', '+1 month'),
            'pukul_mulai' => $this->faker->time('H:i:s', '08:00'),
            'pukul_selesai' => $this->faker->time('H:i:s', '17:00'),
            'departemen' => $this->faker->randomElement(['HSE', 'Produksi', 'Maintenance', 'Engineering', 'Warehouse']),
            'lokasi' => $this->faker->randomElement(['Area Produksi Gudang A', 'Workshop Maintenance', 'Lapangan Eksternal', 'Loading Dock', 'Control Room']),
            'deskripsi_pekerjaan' => $this->faker->sentence(6),
            'peralatan' => $this->faker->words(3, true),
            'kategori_risiko' => $this->faker->randomElement(['rendah', 'sedang', 'tinggi']),
            'status' => $this->faker->randomElement(['draft', 'submitted', 'approved', 'rejected', 'completed']),
            'catatan_hse' => $this->faker->optional()->sentence(5),
        ];
    }
}
