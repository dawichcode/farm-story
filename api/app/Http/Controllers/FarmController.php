<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreFarmRequest;
use App\Models\Farm;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FarmController extends Controller
{
    /**
     * List farms, optionally filtered by farmer_id.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Farm::orderBy('id');

        if ($request->filled('farmer_id')) {
            $query->where('farmer_id', (int) $request->input('farmer_id'));
        }

        return $this->paginatedSuccess($query->cursorPaginate(20));
    }

    /**
     * Create a new farm for a farmer.
     */
    public function store(StoreFarmRequest $request): JsonResponse
    {
        $farm = Farm::create([
            'farmer_id'                   => $request->farmer_id,
            'farm_name'                   => $request->farm_name,
            'location'                    => $request->location,
            'latitude'                    => $request->latitude,
            'longitude'                   => $request->longitude,
            'size_acres'                  => $request->size_acres,
            'primary_crop'                => $request->primary_crop,
            'coffee_varieties'            => $request->coffee_varieties,
            'coffee_tree_count'           => $request->coffee_tree_count,
            'estimated_annual_production' => $request->estimated_annual_production,
            'last_harvest_date'           => $request->last_harvest_date,
            'challenges'                  => $request->challenges ?? [],
        ]);

        return $this->success($farm->load('farmer'), 'Farm created successfully.', 201);
    }

    /**
     * Show a single farm with its farmer loaded.
     */
    public function show(Farm $farm): JsonResponse
    {
        return $this->success($farm->load('farmer'));
    }
}
