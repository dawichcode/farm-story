<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreFarmerRequest;
use App\Models\Farmer;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class FarmerController extends Controller
{
    /**
     * Register a new farmer.
     */
    public function store(StoreFarmerRequest $request): JsonResponse
    {
        $farmer = DB::transaction(function () use ($request): Farmer {
            return Farmer::create([
                'farmer_id'          => Farmer::generateFarmerId(),
                'full_name'          => $request->full_name,
                'mobile_number'      => $request->mobile_number,
                'email'              => $request->email,
                'county'             => $request->county,
                'preferred_language' => $request->preferred_language,
            ]);
        });

        return $this->success($farmer, 'Farmer registered successfully.', 201);
    }

    /**
     * List all farmers with cursor-based pagination.
     */
    public function index(): JsonResponse
    {
        $paginator = Farmer::orderBy('id')->cursorPaginate(20);

        return $this->paginatedSuccess($paginator);
    }

    /**
     * Show a single farmer by primary key or farmer_id string.
     */
    public function show(string $farmer): JsonResponse
    {
        $record = is_numeric($farmer)
            ? Farmer::find((int) $farmer)
            : Farmer::where('farmer_id', $farmer)->first();

        if (! $record) {
            return $this->error('Farmer not found.', [], 404);
        }

        return $this->success($record);
    }
}
