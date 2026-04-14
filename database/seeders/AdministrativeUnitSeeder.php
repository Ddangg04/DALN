<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\DB;

class AdministrativeUnitSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $url = 'https://provinces.open-api.vn/api/?depth=3';
        
        $this->command->info("Fetching administrative data from {$url}...");
        
        try {
            $response = Http::timeout(120)->withoutVerifying()->get($url);
            
            if (!$response->successful()) {
                $this->command->error("Failed to fetch data from API.");
                return;
            }

            $data = $response->json();
            
            DB::beginTransaction();

            foreach ($data as $p) {
                DB::table('provinces')->updateOrInsert(
                    ['id' => $p['code']],
                    [
                        'name' => $p['name'],
                        'type' => $p['division_type'],
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]
                );

                foreach ($p['districts'] as $d) {
                    DB::table('districts')->updateOrInsert(
                        ['id' => $d['code']],
                        [
                            'name' => $d['name'],
                            'type' => $d['division_type'],
                            'province_id' => $p['code'],
                            'created_at' => now(),
                            'updated_at' => now(),
                        ]
                    );

                    $wards = [];
                    foreach ($d['wards'] as $w) {
                        $wards[] = [
                            'id' => $w['code'],
                            'name' => $w['name'],
                            'type' => $w['division_type'],
                            'district_id' => $d['code'],
                            'created_at' => now(),
                            'updated_at' => now(),
                        ];
                    }
                    
                    if (!empty($wards)) {
                        DB::table('wards')->upsert($wards, ['id'], ['name', 'type', 'district_id', 'updated_at']);
                    }
                }
            }

            DB::commit();
            $this->command->info("Administrative units seeded successfully!");

        } catch (\Exception $e) {
            DB::rollBack();
            $this->command->error("An error occurred: " . $e->getMessage());
        }
    }
}
