<?php

namespace App\Http\Controllers;

use App\Models\Farm;
use App\Services\FarmIntelligenceService;
use Illuminate\Http\JsonResponse;

class InsightController extends Controller
{
    public function __construct(
        private readonly FarmIntelligenceService $intelligenceService,
    ) {}

    /**
     * Return (or generate) the farm insight for a given farm.
     */
    public function show(Farm $farm): JsonResponse
    {
        $insight = $this->intelligenceService->getOrGenerate($farm);

        return $this->success($insight);
    }
}
