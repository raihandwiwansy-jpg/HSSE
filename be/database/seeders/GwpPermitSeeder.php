<?php

namespace Database\Seeders;

use App\Models\GwpPermit;
use App\Models\GwpApproval;
use App\Models\User;
use Illuminate\Database\Seeder;

class GwpPermitSeeder extends Seeder
{
    public function run()
    {
        $users = User::all();

        GwpPermit::factory(20)->make()->each(function ($permit) use ($users) {
            $permit->user_id = $users->random()->id;
            $permit->save();

            // Buat 4 approval otomatis untuk setiap permit
            $approvalTypes = ['pemohon', 'pemilik_lokasi', 'pemberi_izin', 'mengetahui'];
            foreach ($approvalTypes as $type) {
                GwpApproval::create([
                    'gwp_permit_id' => $permit->id,
                    'tipe' => $type,
                    'nama' => $users->random()->name,
                    'tanggal' => $permit->status === 'approved' ? $permit->created_at->format('Y-m-d') : null,
                    'paraf' => $permit->status === 'approved' ? strtoupper(substr($users->random()->name, 0, 1)) : null,
                    'status' => $permit->status === 'approved' ? 'approved' : 'pending',
                ]);
            }
        });
    }
}
