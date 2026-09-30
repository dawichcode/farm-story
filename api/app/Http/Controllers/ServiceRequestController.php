<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreServiceRequestRequest;
use App\Models\ServiceRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ServiceRequestController extends Controller
{
    /**
     * Submit a new service request.
     */
    public function store(StoreServiceRequestRequest $request): JsonResponse
    {
        $serviceRequest = DB::transaction(function () use ($request): ServiceRequest {
            return ServiceRequest::create([
                'reference'  => ServiceRequest::generateReference(),
                'farmer_id'  => $request->farmer_id,
                'farm_id'    => $request->farm_id,
                'type'       => $request->type,
                'notes'      => $request->notes,
            ]);
        });

        return $this->success(
            $serviceRequest->load(['farmer', 'farm']),
            'Service request submitted successfully.',
            201,
        );
    }

    /**
     * List service requests with optional farmer_id filter and cursor pagination.
     */
    public function index(Request $request): JsonResponse
    {
        $query = ServiceRequest::with(['farmer', 'farm'])
            ->orderByDesc('created_at');

        if ($request->filled('farmer_id')) {
            $query->where('farmer_id', (int) $request->input('farmer_id'));
        }

        if ($request->filled('farm_id')) {
            $query->where('farm_id', (int) $request->input('farm_id'));
        }

        return $this->paginatedSuccess($query->cursorPaginate(20));
    }
}
