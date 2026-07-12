<?php

namespace Database\Factories;

use App\Models\GwpPermit;
use Illuminate\Database\Eloquent\Factories\Factory;

class GwpApprovalFactory extends Factory
{
    public function definition()
    {
        return [
            'gwp_permit_id' => GwpPermit::factory(),
            'tipe' => $this->faker->randomElement(['pemohon', 'pemilik_lokasi', 'pemberi_izin', 'mengetahui']),
            'nama' => $this->faker->name(),
            'tanggal' => $this->faker->optional()->date('Y-m-d'),
            'paraf' => $this->faker->optional()->firstName(),
            'status' => $this->faker->randomElement(['pending', 'approved']),
        ];
    }
}
