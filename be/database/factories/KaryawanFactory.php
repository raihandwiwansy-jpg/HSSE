<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class KaryawanFactory extends Factory
{
    public function definition()
    {
        return [
            'nama' => $this->faker->name(),
            'nik' => 'NIK-' . $this->faker->unique()->numerify('######'),
            'jabatan' => $this->faker->randomElement(['Operator', 'Technician', 'Supervisor', 'Engineer', 'Staff', 'Manager', 'Foreman']),
            'departemen' => $this->faker->randomElement(['HSE', 'Produksi', 'Maintenance', 'HRD', 'Engineering', 'Warehouse', 'Finance']),
            'no_hp' => $this->faker->phoneNumber(),
        ];
    }
}
