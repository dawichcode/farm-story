<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Farm;
use App\Models\Farmer;
use App\Models\ServiceRequest;
use App\Services\FarmIntelligenceService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class AdminController extends Controller
{
    public function __construct(
        private readonly FarmIntelligenceService $intelligenceService,
    ) {}

    // -------------------------------------------------------------------------
    // T7-A :: CSV export
    // -------------------------------------------------------------------------

    public function exportCsv(): \Symfony\Component\HttpFoundation\StreamedResponse
    {
        $headers = [
            'Content-Type'        => 'text/csv; charset=UTF-8',
            'Content-Disposition' => 'attachment; filename="farmstory-farmers-' . date('Y-m-d') . '.csv"',
            'Cache-Control'       => 'no-cache, no-store, must-revalidate',
            'Pragma'              => 'no-cache',
            'Expires'             => '0',
        ];

        $columns = [
            'Farmer ID',
            'Full Name',
            'Mobile',
            'Email',
            'County',
            'Preferred Language',
            'Farm Name',
            'Acres',
            'Primary Crop',
            'Coffee Varieties',
            'Coffee Trees',
            'Annual Production (kg)',
            'Registered At',
        ];

        return response()->stream(function () use ($columns): void {
            $handle = fopen('php://output', 'w');

            // UTF-8 BOM so Excel opens it correctly
            fwrite($handle, "\xEF\xBB\xBF");

            fputcsv($handle, $columns);

            // Chunk to avoid loading all farmers into memory at once
            Farmer::with(['farms' => fn ($q) => $q->orderBy('id')->limit(1)])
                ->orderBy('id')
                ->chunk(200, function ($farmers) use ($handle): void {
                    foreach ($farmers as $farmer) {
                        $farm = $farmer->farms->first();

                        fputcsv($handle, [
                            $farmer->farmer_id,
                            $farmer->full_name,
                            $farmer->mobile_number,
                            $farmer->email ?? '',
                            $farmer->county,
                            $farmer->preferred_language,
                            $farm?->farm_name                   ?? '',
                            $farm ? number_format((float) $farm->size_acres, 2) : '',
                            $farm?->primary_crop                ?? '',
                            $farm?->coffee_varieties            ?? '',
                            $farm?->coffee_tree_count           ?? '',
                            $farm?->estimated_annual_production ?? '',
                            $farmer->created_at->toDateString(),
                        ]);
                    }
                });

            fclose($handle);
        }, 200, $headers);
    }

    // -------------------------------------------------------------------------
    // T5-A :: Dashboard metrics
    // -------------------------------------------------------------------------

    public function dashboard(): JsonResponse
    {
        // Array driver: cache is request-scoped only, avoids duplicate queries
        // within a single request if dashboard is called multiple times.
        $data = Cache::remember('admin_dashboard', 60, function () {
            $farmersCount    = Farmer::count();
            $acresTotal      = (float) Farm::sum('size_acres');
            $productionTotal = (float) Farm::sum('estimated_annual_production');
            $requestsCount   = ServiceRequest::count();

            // Top 5 counties + "Other" bucket
            $countyCounts = Farmer::select('county', DB::raw('count(*) as total'))
                ->groupBy('county')
                ->orderByDesc('total')
                ->limit(6)
                ->get();

            $top5     = $countyCounts->take(5)->values();
            $otherSum = $countyCounts->skip(5)->sum('total');

            $farmersByCounty = $top5->map(fn ($r) => [
                'county' => $r->county,
                'total'  => (int) $r->total,
            ])->toArray();

            if ($otherSum > 0) {
                $farmersByCounty[] = ['county' => 'Other', 'total' => (int) $otherSum];
            }

            return [
                'farmers_count'      => $farmersCount,
                'acres_total'        => $acresTotal,
                'production_total'   => $productionTotal,
                'requests_count'     => $requestsCount,
                'farmers_by_county'  => $farmersByCounty,
            ];
        });

        return $this->success($data);
    }

    // -------------------------------------------------------------------------
    // T5-C :: Farmer list
    // -------------------------------------------------------------------------

    public function farmers(Request $request): JsonResponse
    {
        $query = Farmer::with('farms')
            ->orderBy('id');

        if ($request->filled('search')) {
            $term = '%' . $request->input('search') . '%';
            $query->where(function ($q) use ($term): void {
                $q->where('full_name', 'like', $term)
                  ->orWhere('farmer_id', 'like', $term);
            });
        }

        return $this->paginatedSuccess($query->cursorPaginate(20));
    }

    // -------------------------------------------------------------------------
    // T5-E :: Farmer detail
    // -------------------------------------------------------------------------

    public function farmerDetail(Farmer $farmer): JsonResponse
    {
        $farmer->load([
            'farms.farmInsight',
            'farms.serviceRequests',
        ]);

        return $this->success($farmer);
    }

    // -------------------------------------------------------------------------
    // T5-G :: Service request list
    // -------------------------------------------------------------------------

    public function requests(Request $request): JsonResponse
    {
        $query = ServiceRequest::with(['farmer', 'farm'])
            ->orderByDesc('created_at');

        return $this->paginatedSuccess($query->cursorPaginate(20));
    }
}
