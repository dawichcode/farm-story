<?php

namespace App\Services;

use App\Models\Farm;
use App\Models\FarmInsight;

class FarmIntelligenceService
{
    /**
     * Return the existing insight for a farm, or generate and persist a new one.
     */
    public function getOrGenerate(Farm $farm): FarmInsight
    {
        return $farm->farmInsight ?? $this->generate($farm);
    }

    /**
     * Run the deterministic rules engine, persist the result, and return it.
     *
     * Scoring formula (produces 68/100 for the seeded demo farmer):
     *
     *   Base score:          100
     *   Per challenge:        -12  (low_yield, pests_disease, soil_quality,
     *                               water_availability, access_to_buyers,
     *                               access_to_finance, input_costs)
     *   Unknown harvest:      -12  (last_harvest_date = "Unknown" or null)
     *   Low prod/tree (<2 kg): -8  (coffee farms only, when tree count and
     *                               production are both present)
     *
     * Demo farmer: 100 - 12 (low_yield) - 12 (unknown harvest) - 8 (1.64 kg/tree) = 68
     */
    private function generate(Farm $farm): FarmInsight
    {
        $challenges = $farm->challenges ?? [];
        $score      = 100;

        // ---- Challenge deductions ----
        $challengeDeduction = 12;
        $score -= count($challenges) * $challengeDeduction;

        // ---- Unknown harvest / soil deduction ----
        $harvestUnknown = empty($farm->last_harvest_date)
            || strtolower(trim($farm->last_harvest_date)) === 'unknown';

        if ($harvestUnknown) {
            $score -= 12;
        }

        // ---- Coffee: production per tree deduction ----
        $isCoffee     = strtolower($farm->primary_crop) === 'coffee';
        $prodPerTree  = null;

        if (
            $isCoffee
            && $farm->estimated_annual_production
            && $farm->coffee_tree_count
            && $farm->coffee_tree_count > 0
        ) {
            $prodPerTree = (float) $farm->estimated_annual_production / $farm->coffee_tree_count;

            if ($prodPerTree < 2.0) {
                $score -= 8;
            }
        }

        // Floor at 0
        $score = max(0, $score);

        // ---- Build recommendations ----
        $recommendations = $this->buildRecommendations($challenges, $harvestUnknown, $prodPerTree);

        // ---- Build summary ----
        $summary = $this->buildSummary($score, count($recommendations));

        return FarmInsight::create([
            'farm_id'         => $farm->id,
            'score'           => $score,
            'summary'         => $summary,
            'recommendations' => $recommendations,
        ]);
    }

    /**
     * Build an array of recommendation objects.
     * Each object: { category: string, text: string }
     */
    private function buildRecommendations(
        array $challenges,
        bool  $harvestUnknown,
        ?float $prodPerTree,
    ): array {
        $recs = [];

        if (in_array('low_yield', $challenges)) {
            $recs[] = [
                'category' => 'LOW YIELD',
                'text'     => 'Consider an agronomist assessment to identify possible causes of low production.',
            ];
        }

        if ($harvestUnknown) {
            $recs[] = [
                'category' => 'SOIL',
                'text'     => 'A soil test may help identify nutrient limitations and inform input decisions.',
            ];
        }

        if (in_array('soil_quality', $challenges)) {
            $recs[] = [
                'category' => 'SOIL QUALITY',
                'text'     => 'Consider a soil assessment before making major soil amendment decisions.',
            ];
        }

        if (in_array('pests_disease', $challenges)) {
            $recs[] = [
                'category' => 'PESTS / DISEASE',
                'text'     => 'An agronomist assessment may help identify the cause and appropriate management options.',
            ];
        }

        if (in_array('access_to_buyers', $challenges)) {
            $recs[] = [
                'category' => 'MARKET ACCESS',
                'text'     => 'Buyer/offtake support may help identify potential market opportunities.',
            ];
        }

        if ($prodPerTree !== null && $prodPerTree < 2.0) {
            $recs[] = [
                'category' => 'COFFEE QUALITY',
                'text'     => 'A coffee quality assessment could help identify opportunities to improve quality and market value.',
            ];
        }

        return $recs;
    }

    /**
     * Generate a plain-language summary based on score and recommendation count.
     */
    private function buildSummary(int $score, int $recCount): string
    {
        if ($recCount === 0) {
            return 'Your farm profile looks complete. No major gaps were identified.';
        }

        if ($score >= 80) {
            return 'Your farm profile is strong. A few areas have been identified for potential improvement.';
        }

        if ($score >= 60) {
            return 'Your farm profile indicates several opportunities for further assessment and support.';
        }

        return 'Your farm profile has a number of areas that could benefit from targeted assessment and support.';
    }
}
