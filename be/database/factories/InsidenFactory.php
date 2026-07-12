<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class InsidenFactory extends Factory
{
    public function definition()
    {
        return [
            'user_id' => 1, // Will be overridden by seeder
            'judul' => $this->faker->sentence(3),
            'jenis' => $this->faker->randomElement(['kecelakaan', 'near_miss', 'unsafe_condition']),
            'lokasi' => $this->faker->randomElement(['Area Produksi Gudang A', 'Workshop Maintenance', 'Lapangan Eksternal', 'Office Building', 'Loading Dock', 'Control Room', 'Storage Area', 'Parking Lot']),
            'tanggal_kejadian' => $this->faker->dateTimeBetween('-6 months', 'now'),
            'deskripsi' => $this->faker->paragraph(3),
            'foto' => null,
            'status' => $this->faker->randomElement(['pending', 'investigation', 'resolved', 'closed']),
        ];
    }
}
