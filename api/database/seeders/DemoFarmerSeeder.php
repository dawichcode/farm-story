<?php

namespace Database\Seeders;

use App\Models\Farm;
use App\Models\FarmInsight;
use App\Models\Farmer;
use App\Models\ServiceRequest;
use App\Services\FarmIntelligenceService;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DemoFarmerSeeder extends Seeder
{
    public function __construct(
        private readonly FarmIntelligenceService $intelligenceService,
    ) {}

    public function run(): void
    {
        // Truncate all tables in dependency order so foreign keys are satisfied
        DB::statement('PRAGMA foreign_keys = OFF');
        ServiceRequest::truncate();
        FarmInsight::truncate();
        Farm::truncate();
        Farmer::truncate();
        DB::statement('PRAGMA foreign_keys = ON');

        // ---- John Mwangi ----
        $farmer = Farmer::create([
            'farmer_id'          => 'FS-KEN-000001',
            'full_name'          => 'John Mwangi',
            'mobile_number'      => '+254712345678',
            'email'              => 'john.mwangi@example.com',
            'county'             => 'Nyeri',
            'preferred_language' => 'English',
        ]);

        // ---- John's Coffee Farm ----
        $farm = Farm::create([
            'farmer_id'                   => $farmer->id,
            'farm_name'                   => "John's Coffee Farm",
            'location'                    => 'Nyeri County, Kenya',
            'latitude'                    => -0.416700,
            'longitude'                   => 36.950000,
            'size_acres'                  => 2.5,
            'primary_crop'                => 'Coffee',
            'coffee_varieties'            => 'SL28, Ruiru 11',
            'coffee_tree_count'           => 1100,
            'estimated_annual_production' => 1800.00,
            'last_harvest_date'           => 'Unknown',
            'challenges'                  => ['low_yield'],
        ]);

        // ---- Generate intelligence (score must be 68/100) ----
        $insight = $this->intelligenceService->getOrGenerate($farm);

        $this->command->info("Seeded farmer:  {$farmer->full_name} ({$farmer->farmer_id})");
        $this->command->info("Seeded farm:    {$farm->farm_name}");
        $this->command->info("Intelligence:   {$insight->score}/100 | " . count($insight->recommendations) . ' recommendations');

        if ($insight->score !== 68) {
            $this->command->warn("WARNING: expected score 68, got {$insight->score}");
        }
    }
}
