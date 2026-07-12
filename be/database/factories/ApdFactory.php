<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class ApdFactory extends Factory
{
    public function definition()
    {
        return [
            'nama' => $this->faker->randomElement([
                'Helm Safety', 'Safety Shoes', 'Safety Goggle', 'Ear Plug', 'Glove',
                'Safety Vest', 'Respirator', 'Face Shield', 'Body Harness', 'Welding Mask',
            ]),
            'kode' => 'APD-' . strtoupper($this->faker->bothify('??##')),
            'stok' => $this->faker->numberBetween(0, 100),
            'satuan' => $this->faker->randomElement(['Pcs', 'Pasang', 'Box']),
            'tanggal_kadaluarsa' => $this->faker->optional(0.3)->dateTimeBetween('-1 month', '+6 months'),
            'status' => $this->faker->randomElement(['aktif', 'kadaluarsa', 'habis']),
        ];
    }
}
